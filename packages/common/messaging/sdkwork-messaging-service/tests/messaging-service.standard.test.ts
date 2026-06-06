import { describe, expect, it } from "vitest";

import { createSdkworkMessagingService } from "../src/index";

describe("SDKWork messaging service", () => {
  it("composes generated SDK clients through ports", async () => {
    const service = createSdkworkMessagingService({
      appClient: {
        messaging: {
          notifications: { list: async () => ({ data: { items: [] } }), markRead: async () => ({ data: { read: true } }) },
          announcements: { list: async () => ({ data: { items: [] } }), acknowledge: async () => ({ data: { acknowledged: true } }) },
          pushDevices: { register: async () => ({ data: { deviceId: "dev_1" } }), unregister: async () => ({ data: { removed: true } }) },
          verificationCodes: { create: async () => ({ data: { codeId: "code_1" } }), verify: async () => ({ data: { verified: true } }) },
        },
      },
      backendClient: {
        messaging: {
          notifications: { list: async () => ({ data: { items: [] } }), create: async () => ({ data: { id: "notification_1" } }) },
          announcements: { list: async () => ({ data: { items: [] } }), publish: async () => ({ data: { id: "announcement_1" } }) },
          pushMessages: { list: async () => ({ data: { items: [] } }), send: async () => ({ data: { id: "push_1" } }) },
          outboundMessages: { list: async () => ({ data: { items: [] } }), send: async () => ({ data: { id: "outbound_1" } }) },
          verificationPolicies: { list: async () => ({ data: { items: [] } }), update: async () => ({ data: { id: "policy_1" } }) },
        } as any,
      },
    });

    await expect(service.notifications.list()).resolves.toEqual({ data: { items: [] } });
    await expect(service.announcements.acknowledge({})).resolves.toEqual({ data: { acknowledged: true } });
    await expect(service.pushDevices.register({})).resolves.toEqual({ data: { deviceId: "dev_1" } });
    await expect(service.verificationCodes.create({})).resolves.toEqual({ data: { codeId: "code_1" } });
    await expect(service.admin.notifications.create({})).resolves.toEqual({ data: { id: "notification_1" } });
    await expect(service.admin.announcements.publish({})).resolves.toEqual({ data: { id: "announcement_1" } });
    await expect(service.admin.pushMessages.send({})).resolves.toEqual({ data: { id: "push_1" } });
    await expect(service.admin.outboundMessages.send({})).resolves.toEqual({ data: { id: "outbound_1" } });
    await expect(service.admin.verificationPolicies.update({})).resolves.toEqual({ data: { id: "policy_1" } });
  });
});
