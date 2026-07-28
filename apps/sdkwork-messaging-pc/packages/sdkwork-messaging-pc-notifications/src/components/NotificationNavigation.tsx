import { Bell, Boxes, CreditCard, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import type { NotificationTranslator } from "../i18n/index.ts";
import type { NotificationView } from "../notification-types.ts";

const VIEWS = [
  { id: "all", icon: Bell, label: "all" },
  { id: "unread", icon: Sparkles, label: "unread" },
  { id: "deployment", icon: Rocket, label: "deployment" },
  { id: "security", icon: ShieldCheck, label: "security" },
  { id: "billing", icon: CreditCard, label: "billing" },
  { id: "system", icon: Boxes, label: "system" },
] as const;

export function NotificationNavigation({
  activeView,
  onViewChange,
  t,
}: {
  activeView: NotificationView;
  onViewChange: (view: NotificationView) => void;
  t: NotificationTranslator;
}) {
  return (
    <nav aria-label={t("filters")} className="notification-nav">
      {VIEWS.map(({ id, icon: Icon, label }) => (
        <button
          aria-current={activeView === id ? "page" : undefined}
          className="notification-nav__item"
          key={id}
          onClick={() => onViewChange(id)}
          type="button"
        >
          <Icon aria-hidden="true" size={17} strokeWidth={1.9} />
          <span>{t(label)}</span>
        </button>
      ))}
    </nav>
  );
}

