import { notificationCenterEnUs } from "./en-US/messaging/notifications/center.ts";
import { notificationCenterZhCn } from "./zh-CN/messaging/notifications/center.ts";

export type NotificationMessageKey = keyof typeof notificationCenterEnUs;
export type NotificationTranslator = (
  key: NotificationMessageKey,
  values?: Readonly<Record<string, string | number>>,
) => string;

export const notificationCenterMessages = {
  "en-US": notificationCenterEnUs,
  "zh-CN": notificationCenterZhCn,
};

export { notificationCenterEnUs, notificationCenterZhCn };

