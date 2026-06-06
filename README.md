# sdkwork-messaging

`sdkwork-messaging` owns the SDKWork messaging system for app-facing notifications, announcements, app push, SMS/email outbound delivery, and verification-code delivery.

The workspace contains the TypeScript contracts, SDK ports, service/runtime facade, Rust domain/storage implementation, route manifests, OpenAPI authorities, and generated SDK inputs for those capabilities.

Create, send, acknowledgement, device registration, verification, and policy update commands use the standard `Idempotency-Key` header. Sensitive inputs such as push tokens, SMS/email targets, and verification codes are write-only in the OpenAPI contract; storage keeps hashes, masks, encrypted tokens, payload hashes, and verification lifecycle state instead of reusable cleartext secrets.

Messaging does not own IM, chat sessions, contacts, social/community surfaces, RTC, or generic communication UI modules. `sdkwork-appbase` may inject generated messaging SDK clients where auth or notification flows need them, but it must not carry local messaging storage, routes, OpenAPI inputs, generated SDKs, or communication implementations.
