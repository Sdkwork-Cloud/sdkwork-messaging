export const SDKWORK_MESSAGING_CHANNELS = ["in_app", "announcement", "app_push", "sms", "email"] as const;
export type MessagingChannel = (typeof SDKWORK_MESSAGING_CHANNELS)[number];

export const SDKWORK_MESSAGING_DIRECT_CHANNELS = ["sms", "email"] as const;
export type MessagingDirectChannel = (typeof SDKWORK_MESSAGING_DIRECT_CHANNELS)[number];

export const SDKWORK_MESSAGING_APP_PUSH_PLATFORMS = ["ios", "android", "web"] as const;
export type MessagingAppPushPlatform = (typeof SDKWORK_MESSAGING_APP_PUSH_PLATFORMS)[number];

export const SDKWORK_MESSAGING_APP_PUSH_PROVIDERS = ["apns", "fcm", "web_push", "vendor"] as const;
export type MessagingAppPushProvider = (typeof SDKWORK_MESSAGING_APP_PUSH_PROVIDERS)[number];

export type MessagingCapability = "notifications" | "announcements" | "appPush" | "sms" | "email" | "verificationCodes";
export type MessagingAudienceKind = "all_users" | "tenant" | "organization" | "role" | "user_segment" | "explicit_users";
export type MessagingNotificationPriority = "low" | "normal" | "high" | "urgent";
export type MessagingNotificationStatus = "unread" | "read" | "archived";
export type MessagingAnnouncementStatus = "draft" | "scheduled" | "published" | "expired" | "cancelled";

export const SDKWORK_MESSAGING_DELIVERY_STATUSES = [
  "accepted",
  "queued",
  "sent",
  "delivered",
  "failed",
  "opened",
  "cancelled",
  "expired",
] as const;

export type MessagingDeliveryStatus = (typeof SDKWORK_MESSAGING_DELIVERY_STATUSES)[number];

export const SDKWORK_MESSAGING_VERIFICATION_CHALLENGE_STATUSES = [
  "pending",
  "verified",
  "failed",
  "locked",
  "expired",
] as const;

export type MessagingVerificationChallengeStatus =
  (typeof SDKWORK_MESSAGING_VERIFICATION_CHALLENGE_STATUSES)[number];

export const SDKWORK_MESSAGING_TABLES = {
  notification: "messaging_notification",
  notificationRecipient: "messaging_notification_recipient",
  announcement: "messaging_announcement",
  announcementAudience: "messaging_announcement_audience",
  announcementReceipt: "messaging_announcement_receipt",
  pushDevice: "messaging_push_device",
  pushMessage: "messaging_push_message",
  pushDelivery: "messaging_push_delivery",
  outboundMessage: "messaging_outbound_message",
  outboundDelivery: "messaging_outbound_delivery",
  verificationPolicy: "messaging_verification_policy",
  verificationChallenge: "messaging_verification_challenge",
  verificationAttempt: "messaging_verification_attempt",
} as const;

export type MessagingDomainModelName = keyof typeof SDKWORK_MESSAGING_TABLES;

export interface MessagingOperationContract {
  apiSurface: "app" | "backend" | "worker";
  method: "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
  operationId: string;
  path: string;
  sdkDomain: "messaging";
  security: "dualToken" | "system";
}

export interface MessagingNotificationContract {
  audienceKind: MessagingAudienceKind;
  body: string;
  priority: MessagingNotificationPriority;
  title: string;
}

export interface MessagingAnnouncementContract {
  audienceKind: MessagingAudienceKind;
  body: string;
  publishAt?: string;
  title: string;
}

export interface MessagingPushContract {
  badge?: number;
  body: string;
  collapseKey?: string;
  data?: Readonly<Record<string, string>>;
  title: string;
}

export interface MessagingPushDeliveryResult {
  deliveryStatus: MessagingDeliveryStatus;
  deviceId: string;
  providerMessageId?: string;
  requestId: string;
}

export interface MessagingOutboundMessageContract {
  body: string;
  channel: MessagingDirectChannel;
  subject?: string;
  target: string;
}

export interface MessagingVerificationCodeContract {
  channel: MessagingDirectChannel;
  sceneCode: string;
  target: string;
}

export interface MessagingVerificationChallengeContract {
  attemptCount: number;
  channel: MessagingDirectChannel;
  expiresAt: string;
  lockedAt?: string;
  sceneCode: string;
  status: MessagingVerificationChallengeStatus;
  targetMasked: string;
  verifiedAt?: string;
}

export const SDKWORK_MESSAGING_STANDARD = {
  api: {
    appPrefix: "/app/v3/api",
    backendPrefix: "/backend/v3/api",
    openapi: "3.1.2",
  },
  databasePrefix: "messaging",
  domain: "messaging",
  sdkDomain: "messaging",
  supportedChannels: SDKWORK_MESSAGING_CHANNELS,
  supportedDirectChannels: SDKWORK_MESSAGING_DIRECT_CHANNELS,
  supportedAppPushPlatforms: SDKWORK_MESSAGING_APP_PUSH_PLATFORMS,
  supportedAppPushProviders: SDKWORK_MESSAGING_APP_PUSH_PROVIDERS,
  supportedCapabilities: ["notifications", "announcements", "appPush", "sms", "email", "verificationCodes"] as const,
} as const;
