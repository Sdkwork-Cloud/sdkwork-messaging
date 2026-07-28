import { messagingShellEnUs } from "./en-US/messaging/shell/navigation.ts";
import { messagingShellZhCn } from "./zh-CN/messaging/shell/navigation.ts";

export type ShellMessageKey = keyof typeof messagingShellEnUs;
export const messagingShellMessages = {
  "en-US": messagingShellEnUs,
  "zh-CN": messagingShellZhCn,
};

export { messagingShellEnUs, messagingShellZhCn };

