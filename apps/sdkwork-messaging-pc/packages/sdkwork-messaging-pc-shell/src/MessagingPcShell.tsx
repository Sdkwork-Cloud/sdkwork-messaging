import type { MessagingLocale } from "@sdkwork/messaging-pc-core";
import { NotificationCenter } from "@sdkwork/messaging-pc-notifications";
import { Navigate, Route, Routes } from "react-router-dom";
import { MessagingPcHeader } from "./MessagingPcHeader.tsx";
import type { MessagingPcShellSession } from "./messaging-pc-session.ts";

export function MessagingPcShell({
  locale,
  session,
}: {
  locale: MessagingLocale;
  session: MessagingPcShellSession;
}) {
  const access = session.status === "authenticated"
    ? { status: "authenticated" as const, service: session.service }
    : { status: "anonymous" as const, signInHref: session.signInHref };

  return (
    <div className="messaging-app-shell">
      <MessagingPcHeader locale={locale} session={session} />
      <main className="messaging-main">
        <Routes>
          <Route path="/notifications" element={<NotificationCenter access={access} locale={locale} />} />
          <Route path="/" element={<Navigate replace to="/notifications" />} />
          <Route path="*" element={<Navigate replace to="/notifications" />} />
        </Routes>
      </main>
    </div>
  );
}
