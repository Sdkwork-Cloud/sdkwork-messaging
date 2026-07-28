import type { SdkworkAuthRuntimeConfig } from "@sdkwork/auth-pc-react";
import {
  resolveSdkworkAuthRuntimeConfigFromMetadata,
  type SdkworkAuthVerificationPolicyConfig,
  type SdkworkCanonicalAuthMetadataLike,
} from "@sdkwork/iam-contracts";

type JsonRecord = Record<string, unknown>;

export interface MessagingAuthRuntimeMetadataClient {
  system: {
    iam: {
      runtime: { retrieve(): Promise<unknown> };
      verificationPolicy: { retrieve(): Promise<unknown> };
    };
  };
}

export function createMessagingAuthRuntimeConfigLoader(
  client: MessagingAuthRuntimeMetadataClient,
): () => Promise<SdkworkAuthRuntimeConfig> {
  let activeRequest: Promise<SdkworkAuthRuntimeConfig> | undefined;
  return () => {
    if (!activeRequest) {
      const request = Promise.all([
        client.system.iam.runtime.retrieve(),
        client.system.iam.verificationPolicy.retrieve(),
      ]).then(([runtime, policy]) => resolveMessagingAuthRuntimeConfig(runtime, policy));
      activeRequest = request;
      void request.catch(() => {
        if (activeRequest === request) activeRequest = undefined;
      });
    }
    return activeRequest;
  };
}

export function resolveMessagingAuthRuntimeConfig(
  runtimeValue: unknown,
  policyValue: unknown,
): SdkworkAuthRuntimeConfig {
  const runtime = unwrapSdkData(runtimeValue, "IAM runtime");
  const auth = readRecord(runtime, "auth");
  const policy = unwrapSdkData(policyValue, "IAM verification policy");
  const verificationPolicy: SdkworkAuthVerificationPolicyConfig = {
    emailCodeLoginEnabled: readRequiredBoolean(policy, "emailCodeLoginEnabled"),
    emailRegistrationVerificationRequired: readRequiredBoolean(policy, "emailRegistrationVerificationRequired", "emailRegisterVerificationRequired"),
    oauthLoginEnabled: readRequiredBoolean(auth, "oauthLoginEnabled"),
    phoneCodeLoginEnabled: readRequiredBoolean(policy, "phoneCodeLoginEnabled"),
    phoneRegistrationVerificationRequired: readRequiredBoolean(policy, "phoneRegistrationVerificationRequired", "phoneRegisterVerificationRequired"),
  };
  const registrationEnabled = readRequiredBoolean(policy, "registrationEnabled");
  const qrLoginEnabled = readRequiredBoolean(policy, "qrLoginEnabled");
  const contactMethods = resolveContactMethods(runtime, policy);
  const metadata: SdkworkCanonicalAuthMetadataLike = {
    loginMethods: readStringArray(auth, "loginMethods"),
    oauthLoginEnabled: verificationPolicy.oauthLoginEnabled,
    oauthProviders: readStringArray(auth, "oauthProviders"),
    qrLoginEnabled,
    recoveryMethods: readStringArray(auth, "recoveryMethods").length > 0
      ? readStringArray(auth, "recoveryMethods")
      : contactMethods,
    registerMethods: registrationEnabled
      ? (readStringArray(auth, "registerMethods").length > 0 ? readStringArray(auth, "registerMethods") : contactMethods)
      : [],
    verificationPolicy,
  };
  const region = readString(auth, "oauthProviderRegion")?.toLowerCase();
  if (region === "mainland" || region === "overseas") metadata.oauthProviderRegion = region;
  for (const key of ["sdkworkOAuthProviderEnabled", "supportsLocalCredentials", "supportsSessionExchange"] as const) {
    const value = readBoolean(auth, key);
    if (value !== undefined) metadata[key] = value;
  }
  return {
    ...resolveSdkworkAuthRuntimeConfigFromMetadata(metadata),
    leftRailMode: qrLoginEnabled ? "qr-only" : "highlights-only",
    qrLoginEnabled,
    verificationPolicy,
  };
}

function resolveContactMethods(runtime: JsonRecord, policy: JsonRecord): string[] {
  const runtimeContact = readRecord(readRecord(runtime, "accountBinding"), "contactBinding");
  const policyContact = readRecord(readRecord(policy, "accountBinding"), "contactBinding");
  return [
    ...(readBoolean(policyContact, "emailEnabled") ?? readBoolean(runtimeContact, "emailEnabled") ? ["email"] : []),
    ...(readBoolean(policyContact, "phoneEnabled") ?? readBoolean(runtimeContact, "phoneEnabled") ? ["phone"] : []),
  ];
}

function unwrapSdkData(value: unknown, source: string): JsonRecord {
  if (!isRecord(value)) throw new Error(`${source} metadata is unavailable`);
  if ("code" in value) {
    if (value.code !== 0 || !isRecord(value.data)) throw new Error(`${source} metadata is invalid`);
    return value.data;
  }
  return value;
}

function readRecord(record: JsonRecord, key: string): JsonRecord {
  return isRecord(record[key]) ? record[key] : {};
}

function readString(record: JsonRecord, key: string): string | undefined {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readStringArray(record: JsonRecord, key: string): string[] {
  const value = record[key];
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => typeof item === "string" ? item.trim() : "").filter(Boolean))];
}

function readBoolean(record: JsonRecord, key: string): boolean | undefined {
  return typeof record[key] === "boolean" ? record[key] : undefined;
}

function readRequiredBoolean(record: JsonRecord, ...keys: string[]): boolean {
  for (const key of keys) {
    const value = readBoolean(record, key);
    if (value !== undefined) return value;
  }
  throw new Error(`IAM ${keys[0]} is required`);
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

