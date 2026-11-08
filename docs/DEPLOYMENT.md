# Public deployment checklist

## Database and application rollout

- Take a recoverable backup; apply the migration to staging first.
- Resolve incompatible legacy rows without silently deleting user content. Common failures: duplicate book IDs for one owner, owners missing from `auth.users`, month without year, out-of-range values and custom cover hosts.
- Apply `supabase/migrations/202611080001_public_launch.sql` once as the database owner. It deliberately replaces all policies on `libros` and `metas_lectura`; review any custom policy requirements beforehand.
- Verify RLS, grants, ownership constraints and the rate-limit RPC. Application table owners/administrators and service-role credentials remain privileged: never distribute their credentials or use them in the web app.
- Deploy this branch's application after the migration. The search endpoint returns 503 rather than bypassing an unavailable limiter.
- For rollback, prefer rolling back the app while keeping owner-only database policies. Do not disable RLS to fix an application issue. Use the backup and a reviewed follow-up migration for schema recovery.

## Supabase Auth and hosting settings

- Use a dedicated production project and HTTPS domain.
- Set `SITE_URL` to the exact public origin and register its `/api/auth/callback` in Supabase's redirect allowlist. Remove obsolete production redirect destinations; avoid wildcard callback domains.
- Enable email confirmation and disable anonymous sign-in if unused.
- Configure production SMTP, authentication rate limits, at least 12-character passwords, and available compromised-password protection. Test actual delivery and expired confirmation links.
- Configure edge/WAF limits for authentication and search routes; use Google Books API restrictions/quotas and billing alerts appropriate to the server deployment. The database limiter is per account, so it does not prevent bulk account creation or all distributed abuse.
- Review all other exposed Supabase tables, views, buckets and RPCs. This migration covers only the two application tables and its own quota objects.
- Keep secrets out of git/build logs; configure backups, access controls, security update monitoring and incident ownership. Avoid logging personal content or auth tokens.

## Required staging acceptance tests

Use distinct accounts A and B with independent browser sessions, plus a signed-out client.

1. Register, receive email, confirm, sign in, reload an authenticated page and sign out. Expired/invalid confirmation links must show a safe error.
2. A creates, reads, edits and deletes a book and saves an annual goal. Rating 10 must work.
3. B must not see A's books/goals, including by visiting A's detail URL or querying Supabase directly with B's token.
4. Direct authenticated API attempts to insert a row owned by A from B, reassign an owner or change a record identity must fail. Anonymous select/insert/update/delete must fail.
5. B's attempted update/delete of A's rows must affect zero rows; A's content must remain intact.
6. Search without authentication must return 401. Search 21 times within one minute as A: the quota must reject excess calls with 429 and `Retry-After`. B must have an independent quota. A may search again after the window expires.
7. Changing dashboard years rapidly must keep the final selected year's goal. Pending/abandoned books must never advance completed-reading goals.
8. Verify error messages on failed saves/deletes, missing IDs, mobile layout, labels and keyboard-only search selection.
9. Check headers and browser network requests: no arbitrary cover/tracking hosts, no private pages cached by the hosting CDN, no service key in client bundles.

## Public-user operations

Before opening registration, publish an accurate privacy notice and provide a real support/contact channel. Decide retention periods, backups and account/content deletion handling. Document how an administrator fulfills export/deletion requests while self-service screens are absent. Deleting an Auth user cascades application books, goals and quota data; provider logs/backups follow their separately configured retention policies.

The repository checks do not certify legal compliance or complete infrastructure security. The production Auth/hosting settings and acceptance tests above must be verified in the deployed environment.
