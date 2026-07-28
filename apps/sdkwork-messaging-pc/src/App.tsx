import { useSdkworkAuthControllerState } from "@sdkwork/auth-pc-react";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import { lazy, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { MessagingAuthGate } from "./auth/MessagingAuthGate.tsx";
import type { BootstrappedMessagingPcRuntime } from "./bootstrap/runtime.ts";

const LazyMessagingAuthRoutes = lazy(() => import("./auth/MessagingAuthRoutes.tsx").then((module) => ({ default: module.MessagingAuthRoutes })));
const LazyMessagingPcShell = lazy(() => import("@sdkwork/messaging-pc-shell").then((module) => ({ default: module.MessagingPcShell })));

export function App({ runtime }: { runtime: BootstrappedMessagingPcRuntime }) {
  return (
    <SdkworkThemeProvider className="messaging-theme" defaultTheme="system" locale={runtime.locale} themeColor="green-tech">
      <BrowserRouter>
        <AuthenticatedMessagingApplication runtime={runtime} />
      </BrowserRouter>
    </SdkworkThemeProvider>
  );
}

function AuthenticatedMessagingApplication({ runtime }: { runtime: BootstrappedMessagingPcRuntime }) {
  const authState = useSdkworkAuthControllerState(runtime.authController);
  const userLabel = authState.user?.displayName || authState.user?.email;
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
      <Suspense fallback={<div className="bootstrap-state">SDKWork Notification Center</div>}>
        <LazyMessagingPcShell
          locale={runtime.locale}
          onSignOut={() => { void runtime.authController.signOut(); }}
          service={runtime.notificationService}
          userLabel={userLabel}
        />
      </Suspense>
    </MessagingAuthGate>
  );
}
