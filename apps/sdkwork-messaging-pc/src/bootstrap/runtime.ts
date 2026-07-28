import { createSdkworkIamRuntimeAuthController, type SdkworkIamRuntimeAuthRuntimeLike } from "@sdkwork/auth-pc-react";
import { createSdkworkAppbasePcAuthRuntime } from "@sdkwork/auth-runtime-pc-react";
import { createClient as createIamAppClient } from "@sdkwork/iam-app-sdk";
import { createPersistentIamTokenStore } from "@sdkwork/iam-runtime";
import {
  createMessagingPcSdkClients,
  createNotificationCenterService,
  loadMessagingPcRuntimeConfig,
  resolveMessagingLocale,
} from "@sdkwork/messaging-pc-core";
import { createTokenManager } from "@sdkwork/sdk-common";
import { createMessagingAuthRuntimeConfigLoader } from "../auth/auth-runtime-config.ts";

const MESSAGING_PC_APP_ID = "sdkwork-messaging-pc";

export async function bootstrapMessagingPcRuntime() {
  const config = await loadMessagingPcRuntimeConfig();
  const locale = resolveMessagingLocale(config, navigator.languages);
  const tokenManager = createTokenManager();
  const tokenStore = createPersistentIamTokenStore({ appId: MESSAGING_PC_APP_ID, storage: window.localStorage });
  const sdkClients = createMessagingPcSdkClients(config.appApiBaseUrl, tokenManager);
  const auth = createSdkworkAppbasePcAuthRuntime({
    app: {
      appId: MESSAGING_PC_APP_ID,
      deploymentMode: config.deploymentProfile === "cloud" ? "saas" : "local",
      environment: config.environment === "development" ? "dev" : config.environment === "test" ? "test" : "prod",
      platform: "pc",
    },
    baseUrls: { appbaseAppApiBaseUrl: config.appbaseAppApiBaseUrl },
    createAppbaseAppClient: (clientConfig) => createIamAppClient({ ...clientConfig, timeout: config.environment === "production" || config.environment === "staging" ? 10_000 : 5_000 }),
    localeProvider: () => locale,
    sdkClients: [sdkClients.messaging],
    sessionAuth: true,
    tokenManager,
    tokenStore,
  });
  await auth.runtime.hydrateTokenManager();
  const authController = createSdkworkIamRuntimeAuthController({
    getRuntime: () => auth.getRuntime() as unknown as SdkworkIamRuntimeAuthRuntimeLike,
  });
  return {
    auth,
    authController,
    config,
    loadAuthRuntimeConfig: createMessagingAuthRuntimeConfigLoader(auth.appbaseApp),
    locale,
    notificationService: createNotificationCenterService(sdkClients.messaging),
    sdkClients,
    tokenManager,
  } as const;
}

export type BootstrappedMessagingPcRuntime = Awaited<ReturnType<typeof bootstrapMessagingPcRuntime>>;

