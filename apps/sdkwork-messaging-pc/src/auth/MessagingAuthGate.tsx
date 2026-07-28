import {
  resolveAuthRedirectTarget,
  useSdkworkAuthControllerState,
  type SdkworkAuthController,
} from "@sdkwork/auth-pc-react";
import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { resolveMessagingAuthMessages } from "./messages.ts";
import { MessagingAuthStatus } from "./MessagingAuthStatus.tsx";

type BootstrapStatus = "loading" | "ready" | "unavailable";

export function MessagingAuthGate({
  authRoutes,
  children,
  controller,
  locale,
}: {
  authRoutes: ReactNode;
  children: ReactNode;
  controller: SdkworkAuthController;
  locale: string;
}) {
  const location = useLocation();
  const state = useSdkworkAuthControllerState(controller);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<BootstrapStatus>(state.isBootstrapped ? "ready" : "loading");
  const messages = resolveMessagingAuthMessages(locale);
  const onAuthRoute = location.pathname === "/auth" || location.pathname.startsWith("/auth/");

  useEffect(() => {
    if (state.isBootstrapped) {
      setStatus("ready");
      return undefined;
    }
    let active = true;
    setStatus("loading");
    void controller.bootstrap()
      .then(() => { if (active) setStatus("ready"); })
      .catch((error: unknown) => {
        console.error("Failed to bootstrap the IAM session.", error);
        if (active) setStatus("unavailable");
      });
    return () => { active = false; };
  }, [attempt, controller, state.isBootstrapped]);

  if (status === "loading") return <MessagingAuthStatus message={messages.sessionChecking} />;
  if (status === "unavailable") {
    return <MessagingAuthStatus message={messages.sessionUnavailable} onRetry={() => setAttempt((value) => value + 1)} retryLabel={messages.retry} />;
  }
  if (onAuthRoute && state.isAuthenticated) {
    return <Navigate replace to={resolveAuthRedirectTarget(new URLSearchParams(location.search).get("redirect"), "/notifications", "/auth")} />;
  }
  if (onAuthRoute) return <>{authRoutes}</>;
  if (!state.isAuthenticated) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate replace to={`/auth/login?redirect=${redirect}`} />;
  }
  return <>{children}</>;
}

