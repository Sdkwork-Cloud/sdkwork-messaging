import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APPBASE_ROOT = path.resolve(ROOT, "..", "sdkwork-appbase");

const requiredCurrentFiles = [
  "package.json",
  "pnpm-workspace.yaml",
  "tsconfig.base.json",
  "vitest.config.ts",
  "Cargo.toml",
  "packages/common/foundation/sdkwork-messaging-runtime-bootstrap/package.json",
  "packages/common/messaging/sdkwork-messaging-contracts/package.json",
  "packages/common/messaging/sdkwork-messaging-sdk-ports/package.json",
  "packages/common/messaging/sdkwork-messaging-service/package.json",
  "packages/common/messaging/sdkwork-messaging-runtime/package.json",
  "crates/sdkwork-messaging-delivery-service/Cargo.toml",
  "crates/sdkwork-messaging-delivery-repository-sqlx/Cargo.toml",
  "crates/sdkwork-messaging-delivery-repository-sqlx/migrations/0001_messaging_storage.sql",
  "crates/sdkwork-router-messaging-app-api/Cargo.toml",
  "crates/sdkwork-router-messaging-backend-api/Cargo.toml",
  "sdks/materialize-messaging-v3-openapi-boundaries.mjs",
  "sdks/sdkwork-messaging-app-sdk/openapi/sdkwork-messaging-app-api.openapi.yaml",
  "sdks/sdkwork-messaging-app-sdk/openapi/sdkwork-messaging-app-api.sdkgen.yaml",
  "sdks/sdkwork-messaging-backend-sdk/openapi/sdkwork-messaging-backend-api.openapi.yaml",
  "sdks/sdkwork-messaging-backend-sdk/openapi/sdkwork-messaging-backend-api.sdkgen.yaml",
];

const forbiddenCurrentPaths = [
  "packages/common/conversation",
  "packages/pc-react/communication",
  "packages/pc-react/messaging/sdkwork-messaging-admin-pc-react",
  "crates/sdkwork-router-im-open-api",
  "sdks/_route-manifests/open-api/sdkwork-routes-im-open-api.route-manifest.json",
  "sdks/sdkwork-im-sdk",
];

const forbiddenAppbaseDirs = [
  "packages/common/messaging",
  "packages/common/conversation",
  "packages/pc-react/communication",
  "packages/pc-react/messaging",
  "packages/mobile-react/communication",
  "packages/mobile-flutter/communication",
  "packages/native-rust/communication",
  "packages/native-rust/messaging",
];

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(ROOT, relativePath), "utf8"));
}

function walkFiles(root) {
  if (!existsSync(root)) {
    return [];
  }

  const files = [];
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (![".git", "node_modules", "target", "dist", "build"].includes(entry.name)) {
          stack.push(fullPath);
        }
      } else {
        files.push(fullPath);
      }
    }
  }
  return files;
}

function operations(openApi) {
  const items = [];
  for (const [routePath, pathItem] of Object.entries(openApi.paths ?? {})) {
    for (const method of ["get", "post", "put", "patch", "delete"]) {
      if (pathItem?.[method]) {
        items.push({ method, path: routePath, operation: pathItem[method] });
      }
    }
  }
  return items;
}

function assertHasIdempotencyHeader(openApi, operationId) {
  const item = operations(openApi).find((candidate) => candidate.operation.operationId === operationId);
  assert.ok(item, `missing operation ${operationId}`);
  const header = item.operation.parameters?.find(
    (parameter) => parameter?.in === "header" && parameter?.name === "Idempotency-Key",
  );
  assert.ok(header, `${operationId} must expose Idempotency-Key`);
  assert.equal(header.required, true, `${operationId} Idempotency-Key must be required`);
  assert.equal(header["x-sdkwork-idempotency-key"], true, `${operationId} must use the SDKWork idempotency header`);
}

function assertSdkFamily({ family, authority, owner, prefix, expectedOperationIds }) {
  const openApi = readJson(`sdks/${family}/openapi/${authority}.openapi.yaml`);
  const sdkgen = readJson(`sdks/${family}/openapi/${authority}.sdkgen.yaml`);
  const assembly = readJson(`sdks/${family}/.sdkwork-assembly.json`);
  const component = readJson(`sdks/${family}/specs/component.spec.json`);

  assert.equal(openApi.openapi, "3.1.2");
  assert.equal(openApi.info["x-sdkwork-api-authority"], authority);
  assert.equal(openApi.info["x-sdkwork-sdk-family"], family);
  assert.equal(sdkgen["x-sdkwork-derived-from"], `openapi/${authority}.openapi.yaml`);
  assert.equal(assembly.sdkOwner, owner);
  assert.equal(assembly.apiAuthority, authority);
  assert.equal(component.generator.package, "@sdkwork/sdk-generator");
  assert.equal(component.generator.standardProfile, "sdkwork-v3");

  const actualOperations = operations(openApi);
  const actualIds = actualOperations.map((item) => item.operation.operationId).sort();
  for (const operationId of expectedOperationIds) {
    assert.ok(actualIds.includes(operationId), `${authority} missing operation ${operationId}`);
  }

  for (const { path: routePath, operation } of actualOperations) {
    assert.ok(routePath.startsWith(prefix), `${authority} route must use ${prefix}: ${routePath}`);
    assert.equal(operation["x-sdkwork-owner"], owner);
    assert.equal(operation["x-sdkwork-api-authority"], authority);
    assert.ok(operation["x-sdkwork-domain"]);
    assert.ok(operation["x-sdkwork-resource"]);
    assert.ok(operation["x-sdkwork-permission"] || operation["x-sdkwork-public"]);
    assert.ok(operation["x-sdkwork-source-route-crate"]);
    assert.ok(operation["x-sdkwork-server-request-id"], `${operation.operationId} must use server-owned requestId`);
  }
}

for (const file of requiredCurrentFiles) {
  assert.ok(existsSync(path.join(ROOT, file)), `missing required migrated file: ${file}`);
}

for (const forbiddenPath of forbiddenCurrentPaths) {
  assert.ok(!existsSync(path.join(ROOT, forbiddenPath)), `messaging must not own IM SDK artifact: ${forbiddenPath}`);
}

const rootPackage = readJson("package.json");
assert.equal(rootPackage.name, "@sdkwork/messaging-workspace");
assert.equal(rootPackage.sdkwork?.owner, "sdkwork-messaging");
assert.deepEqual(
  rootPackage.sdkwork?.apiAuthorities,
  ["sdkwork-messaging-app-api", "sdkwork-messaging-backend-api"],
  "messaging workspace must only advertise messaging API authorities",
);
assert.ok(!rootPackage.scripts?.["sdk:generate:im"], "messaging workspace must not generate sdkwork-im-sdk");

for (const packageJsonFile of walkFiles(path.join(ROOT, "packages")).filter((file) => path.basename(file) === "package.json")) {
  const packageJson = JSON.parse(readFileSync(packageJsonFile, "utf8"));
  assert.notEqual(packageJson.sdkwork?.workspace, "sdkwork-appbase", `${packageJsonFile} still belongs to appbase`);
  if (packageJson.sdkwork?.domain) {
    assert.ok(
      ["foundation", "messaging"].includes(packageJson.sdkwork.domain),
      `${packageJsonFile} has unexpected domain ${packageJson.sdkwork.domain}`,
    );
  }
}

assertSdkFamily({
  family: "sdkwork-messaging-app-sdk",
  authority: "sdkwork-messaging-app-api",
  owner: "sdkwork-messaging",
  prefix: "/app/v3/api",
  expectedOperationIds: [
    "messaging.notifications.list",
    "messaging.notifications.markRead",
    "messaging.announcements.list",
    "messaging.announcements.acknowledge",
    "messaging.pushDevices.register",
    "messaging.pushDevices.unregister",
    "messaging.verificationCodes.create",
    "messaging.verificationCodes.verify",
  ],
});

const appOpenApi = readJson("sdks/sdkwork-messaging-app-sdk/openapi/sdkwork-messaging-app-api.openapi.yaml");
for (const operationId of [
  "messaging.notifications.markRead",
  "messaging.announcements.acknowledge",
  "messaging.pushDevices.register",
  "messaging.pushDevices.unregister",
  "messaging.verificationCodes.create",
  "messaging.verificationCodes.verify",
]) {
  assertHasIdempotencyHeader(appOpenApi, operationId);
}
assert.equal(appOpenApi.components.schemas.MessagingPushDeviceRegisterRequest.properties.token.writeOnly, true);
assert.equal(appOpenApi.components.schemas.MessagingVerificationCodeCreateRequest.properties.target.writeOnly, true);
assert.equal(appOpenApi.components.schemas.MessagingVerificationCodeVerifyRequest.properties.code.writeOnly, true);
assert.deepEqual(
  appOpenApi.components.schemas.MessagingPushDeviceRegisterRequest.properties.platform.enum,
  ["ios", "android", "web"],
);

assertSdkFamily({
  family: "sdkwork-messaging-backend-sdk",
  authority: "sdkwork-messaging-backend-api",
  owner: "sdkwork-messaging",
  prefix: "/backend/v3/api",
  expectedOperationIds: [
    "messaging.notifications.list",
    "messaging.notifications.create",
    "messaging.announcements.list",
    "messaging.announcements.publish",
    "messaging.pushMessages.list",
    "messaging.pushMessages.send",
    "messaging.outboundMessages.list",
    "messaging.outboundMessages.send",
    "messaging.verificationPolicies.list",
    "messaging.verificationPolicies.update",
  ],
});

const backendOpenApi = readJson("sdks/sdkwork-messaging-backend-sdk/openapi/sdkwork-messaging-backend-api.openapi.yaml");
for (const operationId of [
  "messaging.notifications.create",
  "messaging.announcements.publish",
  "messaging.pushMessages.send",
  "messaging.outboundMessages.send",
  "messaging.verificationPolicies.update",
]) {
  assertHasIdempotencyHeader(backendOpenApi, operationId);
}
assert.equal(backendOpenApi.components.schemas.MessagingOutboundMessageSendRequest.properties.target.writeOnly, true);
assert.deepEqual(
  backendOpenApi.components.schemas.MessagingOutboundMessageSendRequest.properties.channel.enum,
  ["sms", "email"],
);
assert.deepEqual(
  backendOpenApi.components.schemas.MessagingVerificationPolicy.properties.channel.enum,
  ["sms", "email"],
);
assert.ok(
  !JSON.stringify({ appOpenApi, backendOpenApi }).includes("/im/v3/api"),
  "messaging SDK APIs must not expose IM routes",
);

const migrationSql = readFileSync(
  path.join(ROOT, "crates/sdkwork-messaging-delivery-repository-sqlx/migrations/0001_messaging_storage.sql"),
  "utf8",
);
for (const expectedConstraint of [
  "ck_messaging_push_device_platform CHECK (platform IN ('ios', 'android', 'web'))",
  "ck_messaging_outbound_message_channel CHECK (channel IN ('sms', 'email'))",
  "ck_messaging_verification_policy_channel CHECK (channel IN ('sms', 'email'))",
  "ck_messaging_verification_challenge_channel CHECK (channel IN ('sms', 'email'))",
  "uk_messaging_notification_idempotency UNIQUE (tenant_id, organization_id, idempotency_key)",
  "uk_messaging_announcement_idempotency UNIQUE (tenant_id, organization_id, idempotency_key)",
  "uk_messaging_push_message_idempotency UNIQUE (tenant_id, organization_id, idempotency_key)",
  "uk_messaging_outbound_message_idempotency UNIQUE (tenant_id, organization_id, idempotency_key)",
  "uk_messaging_verification_challenge_idempotency UNIQUE (tenant_id, organization_id, idempotency_key)",
  "uk_messaging_verification_attempt_idempotency UNIQUE (tenant_id, organization_id, challenge_id, idempotency_key)",
  "fk_messaging_notification_recipient_notification FOREIGN KEY (notification_id) REFERENCES messaging_notification(id)",
  "fk_messaging_announcement_audience_announcement FOREIGN KEY (announcement_id) REFERENCES messaging_announcement(id)",
  "fk_messaging_announcement_receipt_announcement FOREIGN KEY (announcement_id) REFERENCES messaging_announcement(id)",
  "fk_messaging_push_delivery_message FOREIGN KEY (push_message_id) REFERENCES messaging_push_message(id)",
  "fk_messaging_push_delivery_device FOREIGN KEY (push_device_id) REFERENCES messaging_push_device(id)",
  "fk_messaging_outbound_delivery_message FOREIGN KEY (outbound_message_id) REFERENCES messaging_outbound_message(id)",
  "fk_messaging_verification_challenge_policy FOREIGN KEY (tenant_id, organization_id, scene_code, channel) REFERENCES messaging_verification_policy(tenant_id, organization_id, scene_code, channel)",
  "fk_messaging_verification_challenge_outbound_message FOREIGN KEY (outbound_message_id) REFERENCES messaging_outbound_message(id)",
  "fk_messaging_verification_attempt_challenge FOREIGN KEY (challenge_id) REFERENCES messaging_verification_challenge(id)",
]) {
  assert.ok(migrationSql.includes(expectedConstraint), `migration missing ${expectedConstraint}`);
}

if (existsSync(APPBASE_ROOT)) {
  for (const relativeDir of forbiddenAppbaseDirs) {
    const fullPath = path.join(APPBASE_ROOT, relativeDir);
    assert.ok(
      !existsSync(fullPath) || !statSync(fullPath).isDirectory(),
      `sdkwork-appbase still owns migrated messaging directory: ${fullPath}`,
    );
  }

  const workspace = readFileSync(path.join(APPBASE_ROOT, "pnpm-workspace.yaml"), "utf8");
  assert.doesNotMatch(workspace, /sdkwork-space[\\/]sdkwork-messaging/u);
  const tsconfig = readFileSync(path.join(APPBASE_ROOT, "tsconfig.base.json"), "utf8");
  assert.doesNotMatch(tsconfig, /sdkwork-space[\\/]sdkwork-messaging/u);
  assert.doesNotMatch(tsconfig, /"@sdkwork\/(?:conversation|im-pc-react|messaging-[\w-]+|channel-pc-react|contacts-pc-react|social-pc-react)"/u);

  const lockfile = readFileSync(path.join(APPBASE_ROOT, "pnpm-lock.yaml"), "utf8");
  assert.doesNotMatch(lockfile, /packages\/(?:pc-react|mobile-react|mobile-flutter)\/communication/u);
  assert.doesNotMatch(lockfile, /@sdkwork\/(?:channel|contacts|social|im|rtc|comments|community)-(?:pc|mobile)-react/u);
}

console.log("sdkwork-messaging migration contract checks passed.");
