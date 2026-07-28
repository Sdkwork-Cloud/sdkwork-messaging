export interface MessagingAuthMessages {
  metadataConnecting: string;
  metadataUnavailable: string;
  retry: string;
  sessionChecking: string;
  sessionUnavailable: string;
  switchToDark: string;
  switchToLight: string;
}

const MESSAGES: Record<"en-US" | "zh-CN", MessagingAuthMessages> = {
  "en-US": {
    metadataConnecting: "Connecting to the identity service...",
    metadataUnavailable: "The identity service is currently unavailable.",
    retry: "Retry",
    sessionChecking: "Checking your session...",
    sessionUnavailable: "Your session could not be verified.",
    switchToDark: "Switch to dark mode",
    switchToLight: "Switch to light mode",
  },
  "zh-CN": {
    metadataConnecting: "正在连接身份服务...",
    metadataUnavailable: "身份服务暂时不可用。",
    retry: "重试",
    sessionChecking: "正在验证登录状态...",
    sessionUnavailable: "暂时无法验证登录状态。",
    switchToDark: "切换到深色模式",
    switchToLight: "切换到浅色模式",
  },
};

export function resolveMessagingAuthMessages(locale: string): MessagingAuthMessages {
  return locale.toLowerCase().startsWith("zh") ? MESSAGES["zh-CN"] : MESSAGES["en-US"];
}

