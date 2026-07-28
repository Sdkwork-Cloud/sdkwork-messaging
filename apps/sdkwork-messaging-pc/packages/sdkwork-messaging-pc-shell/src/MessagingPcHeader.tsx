import type { MessagingLocale } from "@sdkwork/messaging-pc-core";
import { Bell, LogIn, LogOut, MessageSquareText, Moon, Sun, UserRound } from "lucide-react";
import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useSdkworkTheme } from "@sdkwork/ui-pc-react/theme";
import type { MessagingPcShellSession } from "./messaging-pc-session.ts";
import { createShellTranslator } from "./services/shell-translator.ts";

export function MessagingPcHeader({
  locale,
  session,
}: {
  locale: MessagingLocale;
  session: MessagingPcShellSession;
}) {
  const t = useMemo(() => createShellTranslator(locale), [locale]);
  const { colorMode, setThemeSelection } = useSdkworkTheme();
  const light = colorMode === "light";
  const label = session.status === "authenticated"
    ? session.userLabel?.trim() || t("account")
    : t("guest");
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
          <div
            aria-label={session.status === "authenticated" ? t("accountAria", { user: label }) : t("guestAria")}
            className="messaging-user"
            title={session.status === "authenticated" ? t("accountAria", { user: label }) : t("guestAria")}
          >
            <span aria-hidden="true" className="messaging-user__avatar">
              {session.status === "authenticated" ? initial : <UserRound size={15} />}
            </span>
            <span className="messaging-user__label">{label}</span>
          </div>
          {session.status === "authenticated" ? (
            <button aria-label={t("signOut")} className="icon-button" onClick={session.onSignOut} title={t("signOut")} type="button">
              <LogOut aria-hidden="true" size={17} />
            </button>
          ) : (
            <a className="button button--secondary messaging-sign-in" href={session.signInHref} title={t("signIn")}>
              <LogIn aria-hidden="true" size={16} />
              <span>{t("signIn")}</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
