# Deployment and release checks

## Canonical production origin

The public origin is **https://tinteruna.vercel.app**. The legacy address, `https://personal-biblioteca.vercel.app`, redirects there with HTTP 308. Both domains belong to the existing `personal-biblioteca` Vercel project and resolve to the same production deployment; they are not separate applications or databases.

On November 14, 2026, the project-level routing rule **Canonical Tinteruna origin** was staged, its diff reviewed, then promoted. Project-level routes run before deployment routes and persist independently of application releases. This operational configuration lives in Vercel, not in `next.config.js` or `vercel.json`. Domain metadata may still list both addresses without a domain-level redirect: the project-level rule is what enforces the public redirect.

Its configuration is:

```json
{
  "name": "Canonical Tinteruna origin",
  "enabled": true,
  "srcSyntax": "regex",
  "route": {
    "src": "^/(.*)$",
    "has": [{ "type": "host", "value": "personal-biblioteca.vercel.app" }],
    "dest": "https://tinteruna.vercel.app/$1",
    "status": 308
  }
}
```

The host condition limits the change to the legacy production address. Preview/deployment hosts and their protection settings are unchanged. Requests retain their path and query parameters, including callback parameters. HTTP 308 preserves the request method. The legacy origin redirects before application session handling, rather than creating another independent session.

Keep production `SITE_URL` and Supabase's approved production callback at `https://tinteruna.vercel.app` and `https://tinteruna.vercel.app/api/auth/callback`, respectively. The live callback's missing-code response was verified to use the Tinteruna origin; this increment did not change environment variables or Supabase Auth settings. New registrations and sign-ins should always begin at Tinteruna. Browser cookies are scoped to their original host: a reader signed in only on the legacy origin may need to sign in again. An unfinished PKCE confirmation begun on the old host may require restarting the flow on Tinteruna; no cookies or credentials are copied across domains.

After a routing change, check the legacy root, login, registration, protected pages, assets and callback using redirects disabled. Each must return 308 with the exact equivalent Tinteruna URL. Include an encoded query and repeated parameters. Follow a few redirects to verify there is no loop. Check that the primary home/login remain available, `/biblioteca` still redirects signed-out visitors to `/login`, and anonymous `/api/account/export` remains 401. November 14 verification passed 22 live HTTP assertions, including HEAD/POST responses on an inert path and no session cookie being set by legacy redirects. No real confirmation code or authenticated account was used.

To reverse the operational rule, open this project's CDN routing settings, disable **Canonical Tinteruna origin**, inspect the staged diff and publish it. The equivalent API workflow edits the existing rule and promotes its staged version. Review the current rules first so that unrelated changes are preserved. Permanent redirects may already be cached by clients; disabling the rule cannot clear those client caches. Do not remove either domain or change DNS to roll back this rule.

## Database and application rollout

- Take a recoverable backup; apply the migration to staging first.
- Resolve incompatible legacy rows without silently deleting user content. Common failures: duplicate book IDs for one owner, owners missing from `auth.users`, month without year, out-of-range values and oversized text.
- Apply `supabase/migrations/202611080001_public_launch.sql` once as the database owner, then `202611080002_manual_covers.sql`. If the old 001 failed on custom covers, issue `ROLLBACK` and retry the corrected 001 before applying 002. If 001 already succeeded, apply only 002. Neither migration rewrites cover URLs. It deliberately replaces all policies on `libros` and `metas_lectura`; review any custom policy requirements beforehand.
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
9. Add a manual direct-image URL from an unrelated public provider (including `encrypted-tbn0.gstatic.com`), save it, reload and edit other reading fields. Confirm the stored source URL is unchanged. Private-address, HTML and SVG URLs must not be served by the image endpoint. Anonymous image requests must return 401.
10. Check headers and browser network requests: the browser loads covers only through `/api/covers`, with no direct third-party image requests, no private pages cached by the hosting CDN, no service key in client bundles.

## Public-user operations

### Operator contact configuration

Set `TINTERUNA_OPERATOR_NAME` and `TINTERUNA_PRIVACY_EMAIL` as server-only environment variables. The protected data page renders the contact section when both are configured. `TINTERUNA_OPERATOR_CITY`, `TINTERUNA_OPERATOR_ADDRESS` and `TINTERUNA_OPERATOR_PHONE` hold the operator details needed when preparing the approved legal notice. Keep actual values in the ignored `.env.local` file and in appropriately scoped hosting environment settings. The example file contains variable names with empty values.

The rendered contact details are visible to the people who can access the relevant page. Publishing a legal notice containing contact details makes those details readable by its visitors. Review contact arrangements before publication. Earlier Git history can retain previously published contact information even after the current documentation is updated.

The protected JSON export includes the session owner's books, notes, quotations, goals and basic account identity. It uses existing owner-scoped reads with pagination and private/no-store responses. It requires no privileged API key. Check the download and failure states with an isolated signed-in account before publication.

Before opening registration, publish an accurate privacy notice and provide a real support/contact channel. Decide retention periods, backups and account/content deletion handling. Document how an administrator verifies and fulfills account correction, deletion and withdrawal requests. Deleting an Auth user cascades application books, goals and quota data. Provider logs/backups follow their separately configured retention policies.

The repository checks do not certify legal compliance or complete infrastructure security. The production Auth/hosting settings and acceptance tests above must be verified in the deployed environment.
