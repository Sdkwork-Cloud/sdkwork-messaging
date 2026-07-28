import { useSdkworkAuthControllerState } from "@sdkwork/auth-pc-react";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MessagingAuthGate } from "./auth/MessagingAuthGate.tsx";
import type { BootstrappedMessagingPcRuntime } from "./bootstrap/runtime.ts";

const LazyMessagingAuthRoutes = lazy(() => import("./auth/MessagingAuthRoutes.tsx").then((module) => ({ default: module.MessagingAuthRoutes })));
const LazyMessagingPcShell = lazy(() => import("@sdkwork/messaging-pc-shell").then((module) => ({ default: module.MessagingPcShell })));

export function App({ runtime }: { runtime: BootstrappedMessagingPcRuntime }) {
  return (
    <SdkworkThemeProvider className="messaging-theme" defaultTheme="system" locale={runtime.locale} themeColor="green-tech">
      <BrowserRouter>
        <Routes>
          <Route path="/auth/*" element={<MessagingAuthenticationApplication runtime={runtime} />} />
          <Route path="/*" element={<PublicMessagingApplication runtime={runtime} />} />
        </Routes>
      </BrowserRouter>
    </SdkworkThemeProvider>
  );
}

function PublicMessagingApplication({ runtime }: { runtime: BootstrappedMessagingPcRuntime }) {
  const authState = useSdkworkAuthControllerState(runtime.authController);
  const userLabel = authState.user?.displayName || authState.user?.email;

  useEffect(() => {
    if (authState.isBootstrapped) return;
    void runtime.authController.bootstrap().catch(() => undefined);
  }, [authState.isBootstrapped, runtime.authController]);

  const session = authState.isAuthenticated
    ? {
        status: "authenticated" as const,
        onSignOut: () => { void runtime.authController.signOut(); },
        service: runtime.notificationService,
        userLabel,
      }
    : {
        status: "anonymous" as const,
        signInHref: "/auth/login?redirect=%2Fnotifications",
      };

  return (
    <Suspense fallback={<div className="bootstrap-state">SDKWork Notification Center</div>}>
      <LazyMessagingPcShell locale={runtime.locale} session={session} />
    </Suspense>
  );
}

function MessagingAuthenticationApplication({ runtime }: { runtime: BootstrappedMessagingPcRuntime }) {
  return (
    <MessagingAuthGate
      authRoutes={
        <Suspense fallback={<div className="bootstrap-state">SDKWork Notification Center</div>}>
          <LazyMessagingAuthRoutes controller={runtime.authController} loadRuntimeConfig={runtime.loadAuthRuntimeConfig} locale={runtime.locale} />
        </Suspense>
      }
      controller={runtime.authController}
      locale={runtime.locale}
    >
      <Navigate replace to="/notifications" />
    </MessagingAuthGate>
  );
}
