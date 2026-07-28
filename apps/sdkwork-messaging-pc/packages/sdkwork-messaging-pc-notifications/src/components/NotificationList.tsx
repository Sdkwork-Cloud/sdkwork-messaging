import type { MessagingLocale, MessagingNotification } from "@sdkwork/messaging-pc-core";
import { AlertTriangle, Bell, CheckCircle2, ChevronRight, Circle } from "lucide-react";
import type { NotificationTranslator } from "../i18n/index.ts";

export function NotificationList({
  items,
  locale,
  onSelect,
  selectedId,
  t,
}: {
  items: readonly MessagingNotification[];
  locale: MessagingLocale;
  onSelect: (notification: MessagingNotification) => void;
  selectedId?: string;
  t: NotificationTranslator;
}) {
  return (
    <div aria-label={t("results")} className="notification-list" role="list">
      {items.map((notification) => {
        const unread = notification.status === "unread";
        const urgent = notification.priority === "urgent" || notification.priority === "high";
        return (
          <button
            aria-current={selectedId === notification.id ? "true" : undefined}
            className="notification-list__item"
            key={notification.id}
            onClick={() => onSelect(notification)}
            role="listitem"
            type="button"
          >
            <span className={`notification-list__marker${unread ? " is-unread" : ""}`} aria-hidden="true">
              {urgent
                ? <AlertTriangle size={17} />
                : unread ? <Circle fill="currentColor" size={9} /> : <CheckCircle2 size={17} />}
            </span>
            <span className="notification-list__content">
              <span className="notification-list__topline">
                <strong>{notification.title}</strong>
                <time dateTime={notification.createdAt}>{formatDate(notification.createdAt, locale)}</time>
              </span>
              <span className="notification-list__body">{notification.body}</span>
              <span className="notification-list__meta">
                <span>{notification.category?.trim() || t("uncategorized")}</span>
                <span className={`priority priority--${notification.priority}`}>{t(notification.priority)}</span>
                <span>{unread ? t("unreadStatus") : t("read")}</span>
              </span>
            </span>
            <ChevronRight aria-hidden="true" className="notification-list__chevron" size={17} />
          </button>
        );
      })}
    </div>
  );
}

function formatDate(value: string, locale: MessagingLocale): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

