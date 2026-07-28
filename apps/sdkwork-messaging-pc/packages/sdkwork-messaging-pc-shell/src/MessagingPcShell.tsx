import type { MessagingLocale, NotificationCenterService } from "@sdkwork/messaging-pc-core";
import { NotificationCenter } from "@sdkwork/messaging-pc-notifications";
import { Navigate, Route, Routes } from "react-router-dom";
import { MessagingPcHeader } from "./MessagingPcHeader.tsx";

export function MessagingPcShell({
  locale,
  onSignOut,
  service,
  userLabel,
}: {
  locale: MessagingLocale;
  onSignOut: () => void;
  service: NotificationCenterService;
  userLabel?: string;
}) {
  return (
    <div className="messaging-app-shell">
      <MessagingPcHeader locale={locale} onSignOut={onSignOut} userLabel={userLabel} />
      <main className="messaging-main">
        <Routes>
          <Route path="/notifications" element={<NotificationCenter locale={locale} service={service} />} />
          <Route path="/" element={<Navigate replace to="/notifications" />} />
          <Route path="*" element={<Navigate replace to="/notifications" />} />
        </Routes>
      </main>
    </div>
  );
}

