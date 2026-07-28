# SDKWork Messaging PC

Commercial browser notification center for SDKWork applications. The application consumes the composed Messaging App SDK, shares the appbase IAM TokenManager, and keeps notification workflows isolated behind a narrow service port.

## Package Map

| Package | Role |
| --- | --- |
| `@sdkwork/messaging-pc-core` | Runtime config, composed SDK client construction, and service adapter |
| `@sdkwork/messaging-pc-notifications` | Paginated notification center feature and package-local i18n |
| `@sdkwork/messaging-pc-shell` | Flat application shell, account controls, and route composition |

## Commands

```powershell
pnpm dev
pnpm typecheck
pnpm test
pnpm build
pnpm check
```

The default development URL is `http://127.0.0.1:5184/notifications`.

