import { describe, expect, it } from "vitest";

import { createSdkworkMessagingCapabilityManifest } from "../src/index";

describe("SDKWork messaging runtime bootstrap", () => {
  it("creates messaging-only capability manifests", () => {
    expect(
      createSdkworkMessagingCapabilityManifest({
        description: "App notifications and outbound delivery",
        id: "messaging",
        packageNames: ["@sdkwork/messaging-runtime", "@sdkwork/messaging-runtime", " "],
        title: "Messaging",
      }),
    ).toEqual({
      description: "App notifications and outbound delivery",
      id: "messaging",
      packageNames: ["@sdkwork/messaging-runtime"],
      title: "Messaging",
    });
  });
});
