import type { MessagingLocale } from "@sdkwork/messaging-pc-core";
import { notificationCenterMessages, type NotificationTranslator } from "../i18n/index.ts";

export function createNotificationTranslator(locale: MessagingLocale): NotificationTranslator {
  return (key, values) => {
    let message: string = notificationCenterMessages[locale][key];
    for (const [name, value] of Object.entries(values ?? {})) {
      message = message.replaceAll(`{${name}}`, String(value));
    }
    return message;
  };
}

