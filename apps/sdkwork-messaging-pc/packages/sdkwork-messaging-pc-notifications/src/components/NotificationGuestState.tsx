import type { MessagingLocale } from "@sdkwork/messaging-pc-core";
import { BellRing, CheckCircle2, LockKeyhole, LogIn, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { createNotificationTranslator } from "../services/notification-translator.ts";

export function NotificationGuestState({
  locale,
  signInHref,
}: {
  locale: MessagingLocale;
  signInHref: string;
}) {
  const t = useMemo(() => createNotificationTranslator(locale), [locale]);

  return (
    <div className="notification-center notification-center--guest">
      <aside className="notification-center__sidebar">
        <div className="notification-center__intro">
          <h1>{t("title")}</h1>
          <p>{t("guestSubtitle")}</p>
        </div>
        <div className="notification-guest-scope">
          <span className="notification-guest-scope__badge">
            <CheckCircle2 aria-hidden="true" size={15} />
            {t("guestBadge")}
          </span>
          <p>{t("guestPrivacyBody")}</p>
        </div>
      </aside>

      <section className="notification-center__workspace">
        <header className="notification-toolbar">
          <div className="notification-toolbar__summary">
            <strong>{t("guestToolbarTitle")}</strong>
            <span>{t("guestToolbarStatus")}</span>
          </div>
        </header>

        <div className="notification-guest-state">
          <div aria-hidden="true" className="notification-guest-state__icon">
            <BellRing size={27} strokeWidth={1.8} />
          </div>
          <span className="notification-guest-state__eyebrow">
            <ShieldCheck aria-hidden="true" size={15} />
            {t("guestBadge")}
          </span>
          <h2>{t("guestTitle")}</h2>
          <p>{t("guestBody")}</p>
          <a className="button button--primary notification-guest-state__action" href={signInHref}>
            <LogIn aria-hidden="true" size={16} />
            <span>{t("guestSignIn")}</span>
          </a>

          <dl className="notification-guest-state__assurance">
            <div>
              <dt>{t("guestAccessLabel")}</dt>
              <dd>{t("guestAccessValue")}</dd>
            </div>
            <div>
              <dt>{t("guestPrivacyLabel")}</dt>
              <dd><LockKeyhole aria-hidden="true" size={14} />{t("guestPrivacyValue")}</dd>
            </div>
            <div>
              <dt>{t("guestSyncLabel")}</dt>
              <dd>{t("guestSyncValue")}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
