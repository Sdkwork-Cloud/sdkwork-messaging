# @sdkwork/messaging-runtime-bootstrap

Shared messaging-local runtime bootstrap types used after migration out of `sdkwork-appbase`.

This package only describes messaging capability manifests. It does not expose media, file, object-storage, IM, conversation, social, RTC, or generic communication contracts.

## SDKWork Documentation Contract

Domain: communication
Capability: messaging-runtime-bootstrap
Package type: node-package
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
