import { describe, expect, it } from "vitest";

import {
  SDKWORK_MESSAGING_DIRECT_CHANNELS,
  type MessagingOutboundMessageContract,
  SDKWORK_MESSAGING_APP_PUSH_PLATFORMS,
  SDKWORK_MESSAGING_APP_PUSH_PROVIDERS,
  SDKWORK_MESSAGING_DELIVERY_STATUSES,
  SDKWORK_MESSAGING_STANDARD,
  SDKWORK_MESSAGING_TABLES,
  SDKWORK_MESSAGING_VERIFICATION_CHALLENGE_STATUSES,
} from "../src/index";

describe("SDKWork messaging standard contracts", () => {
  it("keeps app notifications, announcements, app push, SMS, email, and verification under the messaging domain", () => {
    expect(SDKWORK_MESSAGING_STANDARD.domain).toBe("messaging");
    expect(SDKWORK_MESSAGING_STANDARD.databasePrefix).toBe("messaging");
    expect(SDKWORK_MESSAGING_STANDARD.supportedChannels).toEqual(["in_app", "announcement", "app_push", "sms", "email"]);
    expect(Object.values(SDKWORK_MESSAGING_TABLES)).toEqual(
      [
        "messaging_notification",
        "messaging_notification_recipient",
        "messaging_announcement",
        "messaging_announcement_audience",
        "messaging_announcement_receipt",
        "messaging_push_device",
        "messaging_push_message",
        "messaging_push_delivery",
        "messaging_outbound_message",
        "messaging_outbound_delivery",
        "messaging_verification_policy",
        "messaging_verification_challenge",
        "messaging_verification_attempt",
      ],
    );
    for (const table of Object.values(SDKWORK_MESSAGING_TABLES)) {
      expect(table.startsWith("messaging_")).toBe(true);
    }
  });

  it("does not expose legacy realtime chat or delivery-routing administration tables", () => {
    const contractText = JSON.stringify({ SDKWORK_MESSAGING_STANDARD, SDKWORK_MESSAGING_TABLES });
    expect(contractText).not.toMatch(/providerAccount|senderIdentity|template|routeRule|suppression|rateLimit|dialogueThread|realtime/iu);
  });

  it("declares the delivery status vocabulary used by push, SMS, and email diagnostics", () => {
    expect(SDKWORK_MESSAGING_DELIVERY_STATUSES).toEqual([
      "accepted",
      "queued",
      "sent",
      "delivered",
      "failed",
      "opened",
      "cancelled",
      "expired",
    ]);
  });

  it("declares direct outbound channels and app push provider vocabulary without desktop host leakage", () => {
    expect(SDKWORK_MESSAGING_DIRECT_CHANNELS).toEqual(["sms", "email"]);
    expect(SDKWORK_MESSAGING_APP_PUSH_PLATFORMS).toEqual(["ios", "android", "web"]);
    expect(SDKWORK_MESSAGING_APP_PUSH_PROVIDERS).toEqual(["apns", "fcm", "web_push", "vendor"]);
  });

  it("declares verification challenge lifecycle without introducing auth or rate-limit ownership", () => {
    expect(SDKWORK_MESSAGING_VERIFICATION_CHALLENGE_STATUSES).toEqual([
      "pending",
      "verified",
      "failed",
      "locked",
      "expired",
    ]);
  });

  it("keeps API idempotency outside JSON body payload contracts", () => {
    const outbound: MessagingOutboundMessageContract = {
      body: "Your verification code is 123456",
      channel: "sms",
      target: "+15550000000",
    };

    expect("idempotencyKey" in outbound).toBe(false);
  });
});
