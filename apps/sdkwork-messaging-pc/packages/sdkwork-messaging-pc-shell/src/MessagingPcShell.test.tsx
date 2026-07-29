import type { NotificationCenterService } from "@sdkwork/messaging-pc-core";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { MessagingPcShell } from "./MessagingPcShell.tsx";

describe("MessagingPcShell", () => {
  it("keeps brand, navigation, and authenticated account controls in the shell", async () => {
    const service: NotificationCenterService = {
      listNotifications: vi.fn().mockResolvedValue({
        items: [],
        pageInfo: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 },
        requestId: "request-1",
      }),
      markRead: vi.fn(),
    };
    render(
      <SdkworkThemeProvider defaultTheme="light" locale="en-US">
        <MemoryRouter initialEntries={["/notifications"]}>
          <MessagingPcShell
            locale="en-US"
            session={{ status: "authenticated", onSignOut: vi.fn(), service, userLabel: "Ada Lovelace" }}
          />
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(screen.getByLabelText("SDKWork Business Notification Center")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Business message navigation" })).toBeInTheDocument();
    expect(screen.getByLabelText("Signed in as Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
    expect(await screen.findByText("No messages need action")).toBeInTheDocument();
  });

  it("keeps the notification route public and presents a guest session", () => {
    render(
      <SdkworkThemeProvider defaultTheme="light" locale="en-US">
        <MemoryRouter initialEntries={["/notifications"]}>
          <MessagingPcShell
            locale="en-US"
            session={{ status: "anonymous", signInHref: "/auth/login?redirect=%2Fnotifications" }}
          />
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(screen.getByLabelText("Accessing through the public workspace")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/auth/login?redirect=%2Fnotifications");
    expect(screen.queryByRole("button", { name: "Sign out" })).not.toBeInTheDocument();
    expect(screen.getByText("Connect your business notifications")).toBeInTheDocument();
  });
});
