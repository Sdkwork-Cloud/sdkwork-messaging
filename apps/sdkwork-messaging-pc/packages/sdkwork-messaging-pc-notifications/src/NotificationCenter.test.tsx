import type {
  MessagingNotification,
  MessagingNotificationListResponse,
  NotificationCenterService,
} from "@sdkwork/messaging-pc-core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NotificationCenter } from "./NotificationCenter.tsx";

const notifications: MessagingNotification[] = [
  {
    id: "deployment-ready",
    title: "Production deployment completed",
    body: "Application portal-api is healthy in all regions.",
    category: "deployment",
    priority: "high",
    status: "unread",
    actionUrl: "/console/deployments/portal-api",
    metadata: { application: "portal-api", region: "cn-east-1" },
    createdAt: "2026-07-28T08:00:00.000Z",
  },
  {
    id: "security-review",
    title: "Security review completed",
    body: "No high-risk findings were detected.",
    category: "security",
    priority: "normal",
    status: "read",
    createdAt: "2026-07-27T08:00:00.000Z",
    readAt: "2026-07-27T09:00:00.000Z",
  },
];

describe("NotificationCenter", () => {
  it("loads one server page and marks the selected notification as read", async () => {
    const service = createService(pageResponse(notifications));
    render(<NotificationCenter locale="en-US" service={service} />);

    expect(screen.getByText("Loading notifications...")).toBeInTheDocument();
    expect(await screen.findByText("Production deployment completed")).toBeInTheDocument();
    expect(service.listNotifications).toHaveBeenCalledWith({ page: 1, pageSize: 20 });

    fireEvent.click(await screen.findByRole("button", { name: "Mark as read" }));
    await waitFor(() => expect(service.markRead).toHaveBeenCalledWith("deployment-ready"));
    expect(await screen.findByText("0 unread on this page")).toBeInTheDocument();
  });

  it("filters only the current server page without constructing local pagination", async () => {
    const service = createService(pageResponse(notifications));
    render(<NotificationCenter locale="en-US" service={service} />);
    await screen.findByText("Production deployment completed");

    fireEvent.click(screen.getByRole("button", { name: "Security" }));
    expect(screen.queryByText("Production deployment completed")).not.toBeInTheDocument();
    expect(screen.getAllByText("Security review completed")).toHaveLength(2);

    fireEvent.change(screen.getByRole("searchbox", { name: "Search notifications on the current page" }), {
      target: { value: "no-match" },
    });
    expect(screen.getByText("No matching notifications")).toBeInTheDocument();
  });

  it("uses server page metadata for next-page navigation", async () => {
    const listNotifications = vi.fn()
      .mockResolvedValueOnce(pageResponse(notifications, { page: 1, totalPages: 2, totalItems: 21 }))
      .mockResolvedValueOnce(pageResponse([], { page: 2, totalPages: 2, totalItems: 21 }));
    const service = createService(pageResponse(notifications), listNotifications);
    render(<NotificationCenter locale="en-US" service={service} />);
    await screen.findByText("Page 1 of 2");

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    await waitFor(() => expect(listNotifications).toHaveBeenLastCalledWith({ page: 2, pageSize: 20 }));
  });

  it.each([
    [{ status: 403 }, "Notification access is restricted"],
    [new TypeError("network unavailable"), "Notification service is unavailable"],
    [new Error("unknown"), "Notifications could not be loaded"],
  ])("renders commercial error recovery for %s", async (error, expectedTitle) => {
    const service = createService(pageResponse([]), vi.fn().mockRejectedValue(error));
    render(<NotificationCenter locale="en-US" service={service} />);
    expect(await screen.findByText(expectedTitle)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});

function createService(
  response: MessagingNotificationListResponse,
  listNotifications = vi.fn().mockResolvedValue(response),
): NotificationCenterService {
  return {
    listNotifications,
    markRead: vi.fn().mockResolvedValue({ notificationId: "deployment-ready", status: "read", readAt: "2026-07-28T08:01:00.000Z" }),
  };
}

function pageResponse(
  items: MessagingNotification[],
  pageInfo: Partial<MessagingNotificationListResponse["pageInfo"]> = {},
): MessagingNotificationListResponse {
  return {
    items,
    pageInfo: { page: 1, pageSize: 20, totalItems: items.length, totalPages: 1, ...pageInfo },
    requestId: "request-1",
  };
}
