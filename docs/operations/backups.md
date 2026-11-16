# Backup verification and activation

Status checked November 15, 2026. The connected Supabase organization reports `plan=free` and `tier=tier_free`. The [provider backup documentation](https://supabase.com/docs/guides/platform/backups) documents daily recoverable backups for eligible paid plans and recommends off-site dumps for Free. No paid plan/add-on was activated.

The current connector exposes project/organization metadata, SQL and advisors, but no backup-list/backup-schedule operation. The isolated dashboard browser reached the provider sign-in screen, rather than an authenticated backup inventory. Local configuration contains no Management access token or direct database connection. Authorization to perform the work is already given; those missing credentials are an independent access requirement, not another approval request. We cannot treat a healthy database or the Free plan as proof that any specific backup exists or can be restored.

## Safe inventory command

```bash
npm run security:backups
```

The command loads ignored local environment settings with the project's existing Next environment loader. It derives the project reference from the standard Supabase URL, or uses `SUPABASE_PROJECT_REF` for a custom domain. It calls only the fixed HTTPS Supabase Management API backup-list endpoint, rejects redirects and invalid project references, and times out. It never performs a backup, restore, plan change or schema mutation.

Configure `SUPABASE_ACCESS_TOKEN` in ignored `.env.local` only. Where scoped tokens are available, limit it to this project and Backups read access; see [provider access-token guidance](https://supabase.com/docs/guides/platform/personal-access-tokens). Do not paste it in chat, put it in the web deployment, use a database/service-role key instead, or commit it. The connected OAuth tools do not expose a reusable token for this command.

The output allowlists only status, count, the provider's PITR flag when present and a fixed `restoreVerified=false`. Provider error bodies, backup entries, signed download links and credentials are never printed. Missing credentials/unavailable access/unknown response shape are explicitly unverified. The command exits nonzero for those states and an empty inventory. Even a nonempty list is not a restoration test or proof of a working automatic schedule.

The actual command currently reports `blocked / missing_management_token`. Tests cover missing credentials, fixed-host requests, redirect rejection configuration, error redaction and exclusion of signed links/raw provider data.

## External backup activation gate

For this Free project, prepare an external arrangement or separately approve an eligible paid provider plan. Actual activation still needs:

1. A private Postgres backup connection scoped appropriately, with verified TLS; do not reset the live database password to obtain access.
2. A defined private storage destination and write credentials, plus retention, lifecycle expiry and failure notifications. Do not use public repository/Actions artifacts as the backup destination.
3. A maintained encryption tool and separate key custody. Encrypt before off-site upload; keep decryption keys outside CI output, Git and the backup object itself.
4. A supported dump/restore procedure covering application data/schema, identities and required grants/policies; separately cover Storage objects if uploads are introduced. User JSON export does not meet this requirement.
5. A scheduled job, an initial successful copy and an isolated restore proving identity access, owner RLS and data integrity. Never restore over production to test it. Record the actual recovery time and backup age; the roadmap's targets are not yet guarantees.

No copy job, encrypted snapshot, storage destination or restoration has been provisioned/verified in this increment. Do not apply the pending timestamp/helper-permission migrations until a recoverable copy and isolated validation exist. Cookie code and other independent source work can proceed without mutating the database schema.
