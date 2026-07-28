import type { MessagingLocale } from "@sdkwork/messaging-pc-core";
import { Bell, LogOut, MessageSquareText, Moon, Sun } from "lucide-react";
import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useSdkworkTheme } from "@sdkwork/ui-pc-react/theme";
import { createShellTranslator } from "./services/shell-translator.ts";

export function MessagingPcHeader({
  locale,
  onSignOut,
  userLabel,
}: {
  locale: MessagingLocale;
  onSignOut: () => void;
  userLabel?: string;
}) {
  const t = useMemo(() => createShellTranslator(locale), [locale]);
  const { colorMode, setThemeSelection } = useSdkworkTheme();
  const light = colorMode === "light";
  const label = userLabel?.trim() || t("account");
  const initial = Array.from(label)[0]?.toLocaleUpperCase() ?? "U";

  return (
    <header className="messaging-header">
      <div className="messaging-header__inner">
        <a aria-label={`${t("brand")} ${t("product")}`} className="messaging-brand" href="/notifications">
          <span className="messaging-brand__mark" aria-hidden="true"><MessageSquareText size={19} strokeWidth={2} /></span>
          <span className="messaging-brand__name"><strong>{t("brand")}</strong><span>{t("product")}</span></span>
        </a>

        <nav aria-label={t("navigation")} className="messaging-header__nav">
          <NavLink className={({ isActive }) => `messaging-header__nav-item${isActive ? " is-active" : ""}`} to="/notifications">
            <Bell aria-hidden="true" size={16} />
            <span>{t("notifications")}</span>
          </NavLink>
        </nav>

        <div className="messaging-header__account">
          <button
            aria-label={light ? t("switchToDark") : t("switchToLight")}
            className="icon-button"
            onClick={() => setThemeSelection(light ? "dark" : "light")}
            title={light ? t("switchToDark") : t("switchToLight")}
            type="button"
          >
            {light ? <Moon aria-hidden="true" size={17} /> : <Sun aria-hidden="true" size={17} />}
          </button>
          <span aria-hidden="true" className="messaging-header__divider" />
          <div aria-label={t("accountAria", { user: label })} className="messaging-user" title={t("accountAria", { user: label })}>
            <span aria-hidden="true" className="messaging-user__avatar">{initial}</span>
            <span className="messaging-user__label">{label}</span>
          </div>
          <button aria-label={t("signOut")} className="icon-button" onClick={onSignOut} title={t("signOut")} type="button">
            <LogOut aria-hidden="true" size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
