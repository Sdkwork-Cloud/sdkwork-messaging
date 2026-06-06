# SDKWork Messaging Contracts

Reusable contracts for SDKWork messaging capabilities: in-app notifications, announcements, app push, SMS/email outbound messages, and verification-code delivery.

This package defines the domain vocabulary, delivery statuses, and database table contracts consumed by messaging services, Rust storage, route manifests, OpenAPI generation, and generated SDK ports.

Command idempotency is a transport concern carried by the standard `Idempotency-Key` header. JSON body payload contracts do not duplicate the retry key, and sensitive delivery inputs remain write-only at the OpenAPI boundary.
