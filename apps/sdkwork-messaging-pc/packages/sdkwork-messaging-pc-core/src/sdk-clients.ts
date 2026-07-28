import { createClient as createMessagingAppClient, type SdkworkAppClient } from "@sdkwork/messaging-app-sdk";
import type { AuthTokenManager } from "@sdkwork/sdk-common";

export interface MessagingPcSdkClients {
  messaging: SdkworkAppClient;
}

export function createMessagingPcSdkClients(
  appApiBaseUrl: string,
  tokenManager: AuthTokenManager,
): MessagingPcSdkClients {
  const messaging = createMessagingAppClient({
    baseUrl: appApiBaseUrl,
    tokenManager,
  });
  messaging.setTokenManager(tokenManager);
  return { messaging };
}

