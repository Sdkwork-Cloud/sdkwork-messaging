# MESSAGING Database Module

Canonical lifecycle assets for `sdkwork-messaging` per `DATABASE_FRAMEWORK_SPEC.md`.

- moduleId: `messaging`
- serviceCode: `MESSAGING`
- tablePrefix: `messaging_`

## Commands

```bash
pnpm run db:materialize:contract
pnpm run db:validate
```

Legacy SQL: `crates/sdkwork-messaging-delivery-repository-sqlx/migrations/0001_messaging_storage.sql` → `database/ddl/baseline/postgres/0001_messaging_legacy_baseline.sql`

Runtime bootstrap: `sdkwork-messaging-database-host` / `connect_and_bootstrap_messaging_database_from_env()`.
