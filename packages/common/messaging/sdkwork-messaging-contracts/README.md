# SDKWork Messaging Contracts

Reusable contracts for SDKWork messaging capabilities: in-app notifications, announcements, app push, SMS/email outbound messages, and verification-code delivery.

This package defines the domain vocabulary, delivery statuses, and database table contracts consumed by messaging services, Rust storage, route manifests, OpenAPI generation, and generated SDK ports.

Command idempotency is a transport concern carried by the standard `Idempotency-Key` header. JSON body payload contracts do not duplicate the retry key, and sensitive delivery inputs remain write-only at the OpenAPI boundary.

## SDKWork Documentation Contract

Domain: communication
Capability: messaging-contracts
Package type: node-package
Status: standardizing

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

- `pnpm --filter @sdkwork/messaging-contracts typecheck`

### Owner And Status

Owner and lifecycle status are tracked in `specs/component.spec.json`.
