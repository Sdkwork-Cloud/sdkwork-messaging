import type { NotificationCenterService } from "@sdkwork/messaging-pc-core";

export type MessagingPcShellSession =
  | { status: "anonymous"; signInHref: string }
  | {
      status: "authenticated";
      onSignOut: () => void;
      service: NotificationCenterService;
      userLabel?: string;
    };
