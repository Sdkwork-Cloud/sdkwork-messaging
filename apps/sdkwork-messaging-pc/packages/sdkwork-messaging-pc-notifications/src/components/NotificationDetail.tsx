import type { MessagingLocale, MessagingNotification } from "@sdkwork/messaging-pc-core";
import { ArrowUpRight, Check, Clock3, LoaderCircle, Tag } from "lucide-react";
import type { NotificationTranslator } from "../i18n/index.ts";

export function NotificationDetail({
  locale,
  marking,
  notification,
  onMarkRead,
  t,
}: {
  locale: MessagingLocale;
  marking: boolean;
  notification?: MessagingNotification;
  onMarkRead: (notificationId: string) => void;
  t: NotificationTranslator;
}) {
  if (!notification) {
    return (
      <div className="notification-detail notification-detail--empty">
        <span className="notification-detail__empty-icon" aria-hidden="true"><Tag size={21} /></span>
        <h2>{t("selectTitle")}</h2>
        <p>{t("selectBody")}</p>
      </div>
    );
  }

  const actionUrl = resolveSafeActionUrl(notification.actionUrl);
  const metadata = Object.entries(notification.metadata ?? {}).slice(0, 8);
  const unread = notification.status === "unread";

  return (
    <article className="notification-detail">
      <div className="notification-detail__heading">
        <div>
          <span className={`priority priority--${notification.priority}`}>{t(notification.priority)}</span>
          <h2>{notification.title}</h2>
        </div>
        {unread ? (
          <button
            className="button button--secondary"
            disabled={marking}
            onClick={() => onMarkRead(notification.id)}
            type="button"
          >
            {marking ? <LoaderCircle aria-hidden="true" className="spin" size={16} /> : <Check aria-hidden="true" size={16} />}
            <span>{marking ? t("markingRead") : t("markRead")}</span>
          </button>
        ) : <span className="notification-detail__read"><Check aria-hidden="true" size={15} />{t("read")}</span>}
      </div>

      <dl className="notification-detail__facts">
        <div><dt>{t("category")}</dt><dd>{notification.category?.trim() || t("uncategorized")}</dd></div>
        <div><dt>{t("received")}</dt><dd><Clock3 aria-hidden="true" size={14} />{formatDate(notification.createdAt, locale)}</dd></div>
        {notification.readAt ? <div><dt>{t("readAt")}</dt><dd>{formatDate(notification.readAt, locale)}</dd></div> : null}
      </dl>

      <div className="notification-detail__body">{notification.body}</div>

      {metadata.length > 0 ? (
        <section className="notification-detail__metadata" aria-labelledby="notification-metadata-title">
          <h3 id="notification-metadata-title">{t("metadata")}</h3>
          <dl>
            {metadata.map(([key, value]) => (
              <div key={key}><dt>{key}</dt><dd>{formatMetadataValue(value)}</dd></div>
            ))}
          </dl>
        </section>
      ) : null}

      {actionUrl ? (
        <a className="button button--primary notification-detail__action" href={actionUrl} rel="noreferrer">
          <span>{t("openAction")}</span>
          <ArrowUpRight aria-hidden="true" size={16} />
        </a>
      ) : null}
    </article>
  );
}

function resolveSafeActionUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value, globalThis.location?.origin ?? "https://sdkwork.com");
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function formatDate(value: string, locale: MessagingLocale): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function formatMetadataValue(value: unknown): string {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return "-";
  }
}

