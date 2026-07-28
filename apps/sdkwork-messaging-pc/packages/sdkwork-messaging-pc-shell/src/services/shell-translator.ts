import type { MessagingLocale } from "@sdkwork/messaging-pc-core";
import { messagingShellMessages, type ShellMessageKey } from "../i18n/index.ts";

export function createShellTranslator(locale: MessagingLocale) {
  return (key: ShellMessageKey, values?: Readonly<Record<string, string>>) => {
    let message: string = messagingShellMessages[locale][key];
    for (const [name, value] of Object.entries(values ?? {})) {
      message = message.replaceAll(`{${name}}`, value);
    }
    return message;
  };
}

