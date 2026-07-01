# sdkwork-messaging
repository-kind: application

`sdkwork-messaging` owns the SDKWork messaging system for app-facing notifications, announcements, app push, SMS/email outbound delivery, and verification-code delivery.

The workspace contains the TypeScript contracts, SDK ports, service/runtime facade, Rust domain/storage implementation, route manifests, OpenAPI authorities, and generated SDK inputs for those capabilities.

Create, send, acknowledgement, device registration, verification, and policy update commands use the standard `Idempotency-Key` header. Sensitive inputs such as push tokens, SMS/email targets, and verification codes are write-only in the OpenAPI contract; storage keeps hashes, masks, encrypted tokens, payload hashes, and verification lifecycle state instead of reusable cleartext secrets.

Messaging does not own IM, chat sessions, contacts, social/community surfaces, RTC, or generic communication UI modules. `sdkwork-appbase` may inject generated messaging SDK clients where auth or notification flows need them, but it must not carry local messaging storage, routes, OpenAPI inputs, generated SDKs, or communication implementations.

## SDKWork Documentation Contract

Domain: communication
Capability: messaging-workspace
Package type: rust-crate
Status: standard

### Public API

Public exports are declared in `specs/component.spec.json` under `contracts.publicExports`.

### Required SDK Surface

- None declared in `specs/component.spec.json`.

### Configuration

Configuration keys and runtime entrypoints are declared in `specs/component.spec.json`.

### SaaS/Private/Local Behavior

This module follows the canonical standards linked from `specs/component.spec.json`, including deployment and runtime configuration rules where applicable.

### Security

Do not add secrets, live tokens, manual auth headers, or app-local credential handling to this module.

### Extension Points

Extension points are limited to declared public exports, runtime entrypoints, SDK clients, events, and config keys.

### Verification

- `pnpm typecheck`

### Owner And Status

Owner and lifecycle status are tracked in `specs/component.spec.json`.

## Documentation Canon

- [docs/README.md](docs/README.md)
- [docs/product/prd/PRD.md](docs/product/prd/PRD.md)
- [docs/architecture/tech/TECH_ARCHITECTURE.md](docs/architecture/tech/TECH_ARCHITECTURE.md)

## Application Roots

- [apps directory index](apps/README.md)
