import { describe, expect, it, vi } from "vitest";
import {
  loadMessagingPcRuntimeConfig,
  parseMessagingPcRuntimeConfig,
  resolveMessagingLocale,
} from "@sdkwork/messaging-pc-core";

const standaloneConfig = {
  environment: "development",
  deploymentProfile: "standalone",
  profileId: "standalone.development",
  runtimeTarget: "browser",
  browserOriginMode: "same-origin",
  defaultLocale: "zh-CN",
  fallbackLocale: "en-US",
  supportedLocales: ["zh-CN", "en-US"],
  activeLocales: ["zh-CN", "en-US"],
  appApiBaseUrl: "/",
  appbaseAppApiBaseUrl: "/",
};

describe("Messaging PC runtime config", () => {
  it("resolves standalone SDK roots to the browser origin", () => {
    const config = parseMessagingPcRuntimeConfig(standaloneConfig, "http://127.0.0.1:5184");
    expect(config.appApiBaseUrl).toBe("http://127.0.0.1:5184");
    expect(config.appbaseAppApiBaseUrl).toBe("http://127.0.0.1:5184");
    expect(resolveMessagingLocale(config, ["zh-Hans-CN", "en-US"])).toBe("zh-CN");
  });

  it("requires explicit cloud origins and rejects production loopback", () => {
    expect(() => parseMessagingPcRuntimeConfig({
      ...standaloneConfig,
      deploymentProfile: "cloud",
      environment: "production",
      profileId: "cloud.production",
      browserOriginMode: "cross-origin",
      appApiBaseUrl: "http://127.0.0.1:5217",
      appbaseAppApiBaseUrl: "https://api.sdkwork.com",
    })).toThrow(/cannot use a loopback host/);
  });

  it("loads the tracked public runtime file without browser caching", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => standaloneConfig });
    await expect(loadMessagingPcRuntimeConfig(fetcher, "http://127.0.0.1:5184")).resolves.toMatchObject({
      profileId: "standalone.development",
    });
    expect(fetcher).toHaveBeenCalledWith("/runtime-env.json", { cache: "no-store", credentials: "same-origin" });
  });
});

