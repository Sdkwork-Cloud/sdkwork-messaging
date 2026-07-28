import {
  SDKWORK_AUTH_I18N_CATALOG,
  SdkworkAuthOAuthCallbackPage,
  SdkworkAuthPage,
  mergeSdkworkAuthClassNames,
  type SdkworkAuthAppearanceConfig,
  type SdkworkAuthController,
  type SdkworkAuthHeaderSlotProps,
  type SdkworkAuthRuntimeConfig,
} from "@sdkwork/auth-pc-react";
import { SdkworkI18nProvider } from "@sdkwork/i18n-pc-react";
import { useSdkworkTheme } from "@sdkwork/ui-pc-react/theme";
import { MessageSquareText, Moon, Sun } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { resolveMessagingAuthMessages, type MessagingAuthMessages } from "./messages.ts";
import { MessagingAuthStatus } from "./MessagingAuthStatus.tsx";

type ConfigState = { status: "loading" } | { status: "ready"; value: SdkworkAuthRuntimeConfig } | { status: "unavailable" };
const MessagesContext = createContext<MessagingAuthMessages | null>(null);

const APPEARANCE: SdkworkAuthAppearanceConfig = {
  pageClassName: "messaging-auth-page",
  shellClassName: "messaging-auth-shell",
  contentContainerClassName: "messaging-auth-content",
  asidePanelClassName: "messaging-auth-aside",
  slots: { Background: EmptyBackground, Header },
  theme: {
    pageBackgroundColor: "var(--messaging-auth-page)",
    shellBackgroundColor: "var(--messaging-auth-surface)",
    shellBorderColor: "var(--messaging-border)",
    contentBackgroundColor: "var(--messaging-auth-surface)",
    contentBorderColor: "var(--messaging-border)",
    contentTextColor: "var(--messaging-text)",
    titleColor: "var(--messaging-text)",
    descriptionColor: "var(--messaging-muted)",
    fieldBackgroundColor: "var(--messaging-auth-field)",
    fieldBorderColor: "var(--messaging-border-strong)",
    fieldTextColor: "var(--messaging-text)",
    fieldPlaceholderColor: "var(--messaging-muted)",
    labelColor: "var(--messaging-text)",
    dividerColor: "var(--messaging-border)",
    tabBackgroundColor: "transparent",
    tabActiveBackgroundColor: "var(--messaging-active)",
    tabActiveTextColor: "var(--messaging-text)",
    tabInactiveTextColor: "var(--messaging-muted)",
    validationMessageColor: "#dc2626",
  },
};

export function MessagingAuthRoutes({ controller, loadRuntimeConfig, locale }: {
  controller: SdkworkAuthController;
  loadRuntimeConfig: () => Promise<SdkworkAuthRuntimeConfig>;
  locale: string;
}) {
  const location = useLocation();
  const messages = resolveMessagingAuthMessages(locale);
  const [attempt, setAttempt] = useState(0);
  const [config, setConfig] = useState<ConfigState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    setConfig({ status: "loading" });
    void loadRuntimeConfig()
      .then((value) => { if (active) setConfig({ status: "ready", value }); })
      .catch((error: unknown) => {
        console.error("Failed to load IAM authentication metadata.", error);
        if (active) setConfig({ status: "unavailable" });
      });
    return () => { active = false; };
  }, [attempt, loadRuntimeConfig]);

  if (config.status === "loading") return <MessagingAuthStatus message={messages.metadataConnecting} />;
  if (config.status === "unavailable") {
    return <MessagingAuthStatus message={messages.metadataUnavailable} onRetry={() => setAttempt((value) => value + 1)} retryLabel={messages.retry} />;
  }

  const props = { appearance: APPEARANCE, basePath: "/auth", controller, homePath: "/notifications", runtimeConfig: config.value };
  const oauthCallback = location.pathname === "/auth/oauth/callback" || location.pathname.startsWith("/auth/oauth/callback/");
  return (
    <MessagesContext.Provider value={messages}>
      <SdkworkI18nProvider catalogs={[SDKWORK_AUTH_I18N_CATALOG]} locale={locale}>
        {oauthCallback ? <SdkworkAuthOAuthCallbackPage {...props} /> : <SdkworkAuthPage {...props} />}
      </SdkworkI18nProvider>
    </MessagesContext.Provider>
  );
}

function Header({ badge, className, description, style, title }: SdkworkAuthHeaderSlotProps) {
  return (
    <header className={mergeSdkworkAuthClassNames("messaging-auth-header", className)} style={style}>
      <div className="messaging-auth-header__brand">
        <span aria-hidden="true"><MessageSquareText size={18} /></span>
        <strong>SDKWork Notification Center</strong>
        <ThemeToggle />
      </div>
      {badge}{title}{description}
    </header>
  );
}

function ThemeToggle() {
  const messages = useContext(MessagesContext);
  const { colorMode, setThemeSelection } = useSdkworkTheme();
  const light = colorMode === "light";
  const label = light ? messages?.switchToDark ?? "Switch to dark mode" : messages?.switchToLight ?? "Switch to light mode";
  return <button aria-label={label} className="icon-button" onClick={() => setThemeSelection(light ? "dark" : "light")} title={label} type="button">{light ? <Moon aria-hidden="true" size={17} /> : <Sun aria-hidden="true" size={17} />}</button>;
}

function EmptyBackground() { return null; }

