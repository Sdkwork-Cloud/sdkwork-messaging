# SDKWork Messaging PC

Commercial browser notification center for SDKWork applications. Its shell is publicly accessible, while personal notification data is loaded only for authenticated sessions through the composed Messaging App SDK and shared appbase IAM TokenManager.

## Package Map

| Package | Role |
| --- | --- |
| `@sdkwork/messaging-pc-core` | Runtime config, composed SDK client construction, and service adapter |
| `@sdkwork/messaging-pc-notifications` | Public guest state, authenticated paginated notification feature, and package-local i18n |
| `@sdkwork/messaging-pc-shell` | Flat application shell, session-aware account controls, and route composition |

## Commands

```powershell
pnpm dev
pnpm typecheck
pnpm test
pnpm build
pnpm check
```

The default development URL is `http://127.0.0.1:5184/notifications`.
