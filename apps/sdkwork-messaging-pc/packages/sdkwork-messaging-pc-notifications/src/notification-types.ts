import type { MessagingNotification, NotificationCenterService } from "@sdkwork/messaging-pc-core";

export type NotificationView = "all" | "unread" | "system" | "deployment" | "security" | "billing";
export type NotificationCenterErrorKind = "permission" | "unavailable" | "unknown";
export type NotificationCenterAccess =
  | { status: "anonymous"; signInHref: string }
  | { status: "authenticated"; service: NotificationCenterService };

export function notificationMatchesView(
  notification: MessagingNotification,
  view: NotificationView,
): boolean {
  if (view === "all") return true;
  if (view === "unread") return notification.status === "unread";
  const category = notification.category?.trim().toLowerCase() ?? "";
  if (view === "deployment") return ["deployment", "deploy", "release"].includes(category);
  if (view === "security") return ["security", "iam", "risk"].includes(category);
  if (view === "billing") return ["billing", "payment", "invoice"].includes(category);
  return ["system", "platform", "service"].includes(category);
}

export function notificationMatchesSearch(notification: MessagingNotification, query: string): boolean {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return true;
  return [notification.title, notification.body, notification.category]
    .some((value) => value?.toLocaleLowerCase().includes(normalized));
}

export function resolveNotificationCenterError(error: unknown): NotificationCenterErrorKind {
  const record = isRecord(error) ? error : {};
  const response = isRecord(record.response) ? record.response : {};
  const status = readNumber(record.status) ?? readNumber(record.statusCode) ?? readNumber(response.status);
  const code = readNumber(record.code) ?? readNumber(response.code);
  if (status === 401 || status === 403 || code === 40101 || code === 40301) return "permission";
  if (typeof status === "number" && status >= 500) return "unavailable";
  if (error instanceof TypeError) return "unavailable";
  return "unknown";
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
