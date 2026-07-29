import { createSdkworkAuthController } from "@sdkwork/auth-pc-react";
import type { NotificationCenterService } from "@sdkwork/messaging-pc-core";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/App.tsx";
import type { BootstrappedMessagingPcRuntime } from "../src/bootstrap/runtime.ts";

describe("public notification center access", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/notifications");
  });

  it("renders for an anonymous visitor without loading IAM metadata or personal notifications", async () => {
    const getCurrentSession = vi.fn().mockResolvedValue(null);
    const loadAuthRuntimeConfig = vi.fn().mockRejectedValue(new Error("IAM metadata unavailable"));
    const listNotifications = vi.fn();

    render(
      <App runtime={createRuntime({ getCurrentSession, listNotifications, loadAuthRuntimeConfig })} />,
    );

    expect(await screen.findByText("连接你的业务通知")).toBeInTheDocument();
    await waitFor(() => expect(getCurrentSession).toHaveBeenCalledOnce());
    expect(screen.getAllByText("公开工作台可用")).toHaveLength(2);
    expect(screen.queryByText("身份服务暂时不可用。")).not.toBeInTheDocument();
    expect(loadAuthRuntimeConfig).not.toHaveBeenCalled();
    expect(listNotifications).not.toHaveBeenCalled();
  });

  it("keeps the public workspace available when session recovery fails", async () => {
    const getCurrentSession = vi.fn().mockRejectedValue(new Error("session service offline"));
    const loadAuthRuntimeConfig = vi.fn();
    const listNotifications = vi.fn();

    render(
      <App runtime={createRuntime({ getCurrentSession, listNotifications, loadAuthRuntimeConfig })} />,
    );

    expect(await screen.findByText("连接你的业务通知")).toBeInTheDocument();
    await waitFor(() => expect(getCurrentSession).toHaveBeenCalledOnce());
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(loadAuthRuntimeConfig).not.toHaveBeenCalled();
    expect(listNotifications).not.toHaveBeenCalled();
  });
});

function createRuntime({
  getCurrentSession,
  listNotifications,
  loadAuthRuntimeConfig,
}: {
  getCurrentSession: () => Promise<null>;
  listNotifications: NotificationCenterService["listNotifications"];
  loadAuthRuntimeConfig: BootstrappedMessagingPcRuntime["loadAuthRuntimeConfig"];
}): BootstrappedMessagingPcRuntime {
  const notificationService: NotificationCenterService = {
    listNotifications,
    markRead: vi.fn(),
  };
  return {
    authController: createSdkworkAuthController({ service: { getCurrentSession } }),
    loadAuthRuntimeConfig,
    locale: "zh-CN",
    notificationService,
  } as unknown as BootstrappedMessagingPcRuntime;
}
