# Repository Guidelines

## SDKWORK Soul

Read `../../../sdkwork-specs/SOUL.md` before executing tasks in this application root. Root SDKWork specifications remain authoritative.

## Application Identity

Read `sdkwork.app.config.json` for application identity and SDK inventory. Concrete browser runtime values are owned by `etc/` and materialized to `public/runtime-env.json`.

## Local Structure

- `src/`: thin browser bootstrap, IAM composition, providers, and route assembly.
- `packages/sdkwork-messaging-pc-core`: runtime configuration, SDK composition, and notification service port.
- `packages/sdkwork-messaging-pc-shell`: application shell, navigation, and route composition.
- `packages/sdkwork-messaging-pc-notifications`: notification center UI, state, services, and package-local i18n.
- `specs/`: application composition contract.
- `etc/`: deployable browser runtime source profiles.
- `.sdkwork/`: application-local AI workspace dictionary.

## Boundaries

Bootstrap creates one global TokenManager and constructs the composed `@sdkwork/messaging-app-sdk` client. Feature UI receives the `NotificationCenterService` port through explicit injection. Do not add raw HTTP, manual auth headers, local SDK or DTO forks, generated SDK edits, client-side array pagination, or backend SDK imports.

## Verification

Run the narrowest check first, then the complete application check when an application boundary changes:

```text
pnpm typecheck
pnpm test
pnpm build
pnpm check
```

