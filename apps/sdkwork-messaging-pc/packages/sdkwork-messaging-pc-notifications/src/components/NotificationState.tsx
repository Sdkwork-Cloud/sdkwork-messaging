import { BellOff, LoaderCircle, RefreshCw, ShieldAlert, TriangleAlert, WifiOff } from "lucide-react";
import type { NotificationTranslator } from "../i18n/index.ts";
import type { NotificationCenterErrorKind } from "../notification-types.ts";

export function NotificationLoading({ t }: { t: NotificationTranslator }) {
  return (
    <div aria-live="polite" className="notification-state" role="status">
      <LoaderCircle aria-hidden="true" className="spin" size={24} />
      <p>{t("loading")}</p>
    </div>
  );
}

export function NotificationEmpty({ filtered, t }: { filtered: boolean; t: NotificationTranslator }) {
  return (
    <div className="notification-state">
      <BellOff aria-hidden="true" size={24} />
      <h2>{t(filtered ? "noMatchTitle" : "emptyTitle")}</h2>
      <p>{t(filtered ? "noMatchBody" : "emptyBody")}</p>
    </div>
  );
}

export function NotificationError({
  kind,
  onRetry,
  t,
}: {
  kind: NotificationCenterErrorKind;
  onRetry: () => void;
  t: NotificationTranslator;
}) {
  const Icon = kind === "permission" ? ShieldAlert : kind === "unavailable" ? WifiOff : TriangleAlert;
  const title = kind === "permission" ? "permissionTitle" : kind === "unavailable" ? "unavailableTitle" : "unknownTitle";
  const body = kind === "permission" ? "permissionBody" : kind === "unavailable" ? "unavailableBody" : "unknownBody";
  return (
    <div className="notification-state" role="alert">
      <Icon aria-hidden="true" size={24} />
      <h2>{t(title)}</h2>
      <p>{t(body)}</p>
      <button className="button button--secondary" onClick={onRetry} type="button">
        <RefreshCw aria-hidden="true" size={16} />
        <span>{t("retry")}</span>
      </button>
    </div>
  );
}

