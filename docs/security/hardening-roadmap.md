# Security verification and hardening roadmap

Assessed November 14, 2026 (America/Bogota), against repository revision `93006f1`, live read-only Supabase metadata/advisors, Vercel's active firewall configuration and anonymous HTTPS responses from the canonical production origin. This increment implements the assessment and roadmap, not the security controls listed as pending.

## Evidence and limits

- Inspected authentication actions, session/proxy handling, private layout/API routes, validators, owner-scoped queries, migrations, headers, error boundaries and CI workflows. No application admin UI, client-side Supabase Auth client, raw HTML rendering or app debug endpoint was found in the reviewed source.
- Live SQL inspection read schema/policy/function/grant metadata only, without reading account credentials, password hashes or private book content. Both public application tables have forced RLS and owner-only CRUD policies. Neither app role can create objects in `public` or use `private`; there are no public views or Storage buckets in the inspected project.
- Vercel reports no custom firewall configuration; its default firewall applies. This does not mean platform DDoS protection is absent. Supabase Auth CAPTCHA/rate-limit configuration, billing plan, backup history, organization MFA and restore readiness were not available from these reads and remain unverified.
- Anonymous production checks with an unrelated `Origin` returned home/login 200, library 307 to login and account export 401. Checked responses have no `Access-Control-Allow-Origin` or credential-sharing header. HSTS, `nosniff`, frame denial, no-referrer, restrictive permissions and the existing partial CSP are present. These requests do not exhaustively test CORS, CSRF or authenticated cookies.
- All 41 existing tests passed, including local PostgreSQL cross-account/anonymous authorization and identity-reassignment cases. These are isolated regression tests, not a new two-account live penetration test. `npm audit --audit-level=moderate` returned zero known vulnerabilities for the current lockfile. The initial sandbox network failure was retried successfully with network permission.
- Exposure checks covered 114 versionable files and 49 built client resources, without configured operator values or matching secret signatures. This does not certify external logs, historical Git copies or every possible secret format. Historical exposure remains in [privacy readiness](privacy-readiness.md#repository-exposure-review).
- No accounts, provider settings, firewall rules, database schema or application behavior were changed during this assessment. No brute-force or load test was performed.

## The sixteen requested controls

Status describes the observed scope, rather than a universal security guarantee. P0 means the next hardening increment; P1 follows that boundary; P2 is ongoing/conditional work.

| # | Control | Verified current state | Necessary next action |
| --- | --- | --- | --- |
| 1 | CAPTCHA/bot protection | Missing from application forms/actions; provider setting unverified. | P0: integrate Cloudflare Turnstile with Supabase Auth enforcement for supported signup/login/recovery flows; protect renewal against abuse too. Verify direct provider calls, not just the UI. |
| 2 | Login attempt limits | Search/cover quotas exist, but there is no application login limiter or custom Vercel WAF rule. Provider Auth limits exist as a product feature; this project's configuration is unverified. The email UI cooldown is bypassable. | P0: establish shared, atomic server-side/IP controls plus provider limits for login/signup/recovery/resend; temporary backoff and generic feedback, without permanent account lockouts. |
| 3 | CORS without wildcard | No app CORS configuration/wildcard found; checked live app responses do not grant cross-origin access. | Preserve same-origin behavior. Add hostile-origin/preflight and CSRF regression checks. Do not add an unnecessary allow-origin header or treat CORS as authentication. Provider APIs are a separate boundary. |
| 4 | Automatic backups | No scheduled backup workflow in the repo; provider backup history/plan not verified. JSON account export is not a disaster-recovery backup. | P0: confirm provider backups or configure encrypted off-site scheduled backups with expiry/alerts, then prove restoration into isolation. |
| 5 | Prevent self-promotion to admin | No app admin role/path found. Validation discards unexpected fields, policies bind ownership to `auth.uid()`, and app roles lack schema CREATE. | P0: review privileged RPC execution and operator access. Never authorize from editable `user_metadata`; use protected server-managed roles if administration is introduced. Verify provider/operator MFA and least privilege. |
| 6 | Validate submitted content | Runtime allowlists, lengths, enums, UUID/range/URL checks and database constraints exist. Book/goal ownership cannot come from the caller. React renders notes as text. | Maintain tests for direct action/API calls and malformed input; validate new CAPTCHA tokens/request envelopes. Preserve cover SSRF/image restrictions. |
| 7 | Encrypt sensitive data | HTTPS is used. Supabase documents managed at-rest encryption/TLS; application fields are not independently encrypted. No end-to-end encryption is implemented. | P1: verify provider/key/backup controls and minimize collected data. Encrypt off-site backups. P2: decide whether selected fields need envelope encryption with separate keys; document search/export/rotation/recovery costs before migration. |
| 8 | Row-level security | Live `libros` and `metas_lectura`: RLS enabled and forced, owner-only CRUD, UPDATE `USING` and `WITH CHECK`; anonymous table privileges absent. Private quotas have RLS/no app access. | Keep those policies; review RPC permissions and add a gate for future tables/views. Do not create permissive quota policies just to silence an informational advisory. |
| 9 | Cookie protection | Both SSR adapters pass through SDK cookie options. Installed SSR defaults include `SameSite=Lax`, `HttpOnly=false`, and no explicit Secure flag. These are source observations; fresh production Set-Cookie flags were not measured here. | P0: set a consistent server-owned session-cookie policy in both writers: HttpOnly, Secure for HTTPS production, SameSite=Lax and host-only scope. Verify PKCE, refresh, sign-out and cookie chunks in a real browser. |
| 10 | Authentication per private operation and dependency review | Proxy/layout guard private pages; book/goal actions use `requireUser()`/`getUser()`; private APIs verify the user independently. Public notices/login/callback are intentionally public. Audit: zero known package vulnerabilities. | Preserve operation-level authorization; review new routes individually. Add periodic dependency updates/audits and pin CI actions to reviewed SHAs. Do not require login on recovery/public information pages. |
| 11 | Security headers | Live HSTS, `nosniff`, frame denial, referrer/permissions policies present. CSP only restricts frames, objects, base and forms; it does not constrain script/connect sources. | P1: stage a full CSP in Report-Only with Next-compatible nonces/hashes and exact Turnstile allowances, then enforce after verified flows. Avoid a broad `unsafe-inline`/wildcard workaround. |
| 12 | Errors without internal details | Reviewed app/provider errors use fixed safe copy; library boundary omits exception details; email hook logs safe event/status data. | Preserve this behavior; test forced failures and review hosting/provider log redaction/retention. No tokens, passwords, raw notes or provider response bodies in logs. |
| 13 | Each user sees their own data | Server owner filters plus live owner-only RLS and immutable-owner triggers are present. Existing tests reject cross-account access and reassignment. | P1: repeat direct REST/RPC/export/detail negative tests with two isolated live accounts after hardening; clean both accounts afterwards. RLS does not constrain privileged service roles. |
| 14 | Hide API secrets | Config stays server-side; known privileged Supabase key formats are rejected in the app. Current versionable/client scan is clean. | Continue secret scanning/rotation and scoped provider credentials. A publishable/anon key and a CAPTCHA site key are public identifiers, not authorization secrets. Never expose CAPTCHA secret, Google server key or service credentials. |
| 15 | Hash passwords | App delegates password storage to Supabase Auth, which documents bcrypt hashing. No custom password table or plaintext password persistence found. Live advisor says leaked-password protection is disabled. | Keep provider-managed hashing; never double-hash in the browser/app. P0: enable leaked-password checking if supported by the current plan, or document the alternative/plan decision. Do not retrieve hashes to verify this. |
| 16 | Remove admin/debug exposure | No application admin/debug endpoint or raw client debug output found. `poweredByHeader` is disabled; protected content has no-store behavior. | P1: verify production debug/source-map exposure and CI/provider permissions; restrict privileged operator tooling rather than disabling necessary signed email hooks. No need to invent an admin role to remove one. |

## Live advisor triage

The November 14 read returned the following categories. Counts/findings can change independently of source commits.

- `public.set_updated_at`: mutable search path (warning). Pin it in a reviewed migration and test timestamp triggers. It is currently SECURITY INVOKER, so this finding alone does not establish privilege escalation. [Supabase remediation](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable).
- `public.rls_auto_enable`: SECURITY DEFINER with EXECUTE available to `anon` and `authenticated` (warnings). Inspection shows an `event_trigger` return type and a fixed `pg_catalog` search path. Ordinary RPC exploitability was not demonstrated. Review its platform-managed event-trigger role and revoke unnecessary client EXECUTE through a staging-tested migration, preserving automatic RLS behavior. Do not drop the helper blindly. [Anonymous execution advisory](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable).
- `consume_book_search` and `consume_cover_request`: authenticated SECURITY DEFINER execution (warning). These are intentional narrow quota RPCs with an `auth.uid()` guard, empty search path and no anonymous execution. Audit their bodies/grants and preserve working quotas rather than revoking required authenticated access indiscriminately. [Authenticated execution advisory](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).
- Two private quota tables: RLS with no policies (information). App roles lack private-schema use/table privileges; guarded quota RPCs mediate access. This is deliberate denial, not a missing owner policy requiring public access.
- Leaked-password protection disabled (warning). Plan/feature availability needs verification. [Supabase password security](https://supabase.com/docs/guides/auth/password-security).

## Ordered implementation increments

### P0-A — Session boundary and database privileges

Implement shared cookie options used by both the server client and proxy; preserve localhost development and same-browser PKCE. The current app has no browser Supabase client, making server-only HttpOnly cookies a feasible direction to verify. Do not apply that assumption unchanged to a future browser Auth client. Keep SameSite=Lax to support external email redirects; do not add a parent-domain cookie for the legacy host.

Create a staging-tested migration for the timestamp search path and unnecessary helper EXECUTE privileges. Preserve owner policies, identity triggers, quota functionality and platform event-trigger behavior. Review operator MFA separately; user metadata and the registration receipt must never become admin authorization.

Acceptance: login, reload/refresh, confirmation/recovery callback, password update and logout work; all emitted auth/verifier/chunk cookies have expected flags; no session serialization in client props/bundles; database regressions pass and live advisors show the intended disposition. Roll back code/options or specific grants with reviewed changes, never by disabling RLS.

Suggested commits: `fix(auth): harden server session cookies`; `fix(db): restrict helper execution and pin trigger search paths`.

### P0-B — Recoverable backups before data migrations

Confirm the current plan and inspect backup history. Supabase documents daily managed backups for eligible paid plans and off-site dumps for Free; this assessment does not infer which applies. Choose the lowest sufficient supported arrangement, with an encrypted separate storage destination, restricted credentials, retention/expiry, failure alerts and deletion/restore procedures. Proposed starting targets for owner review: daily backups, RPO at most 24 hours, RTO at most 4 hours and 7–30 days retention; these are targets, not current guarantees or published promises.

Include app schemas, Auth/identity data and grants/policies as required by the supported restore procedure. Cover Storage objects separately if uploads are introduced (there are currently no buckets); database backups do not restore object contents. Keep encryption keys separate from ciphertext and out of logs/Git. A public Actions artifact is not a backup destination. Any added paid service/retention commitment needs an explicit cost/configuration decision before activation.

Acceptance: an isolated restore succeeds, records/identity access/RLS/grants are validated, failed jobs alert, expired copies are removed, and the runbook contains no secrets. Never test restoration over production. Obtain a recoverable copy before applying the P0-A database migration; the cookie source change can proceed independently.

Suggested commits: `chore(backup): automate encrypted recoverable database copies`; `docs(operations): record restore and retention procedures`.

### P0-C — Bot and credential-abuse controls

Prefer Turnstile supported by Supabase Auth, with a production hostname-bound widget, Spanish accessible feedback and mobile-width checks. Pass supported CAPTCHA tokens from the UI through server actions into Auth; provider-side enforcement is essential so direct Auth calls cannot bypass the app widget. Verify resend coverage rather than assuming every SDK operation accepts a CAPTCHA token; use compatible provider limits and the shared application limiter for unsupported cases. Handle expiry, replay, missing/invalid tokens, provider downtime and retry without losing email input. Never log tokens/passwords.

Use an atomic shared limiter rather than process memory or UI timers. Protect login, signup, recovery and resend across Vercel instances; combine trusted client-IP controls and short-lived HMAC identifiers for normalized account input, with generic responses and temporary backoff. Initial thresholds should be conservative and tuned using non-sensitive metrics; do not turn this roadmap into a hardcoded permanent lockout policy. Verify the trusted proxy header boundary and IPv4/IPv6 behavior; do not trust caller-supplied IP headers. Inspect actual Supabase Auth rate settings: SSR requests may aggregate under a server IP. Do not introduce a privileged database client merely to forward client IPs.

Stage narrowly scoped Vercel WAF rules where supported, preserving callbacks, normal reading, refresh and public notices. Login/signup/recovery are Server Actions posted to page paths, so path/method coverage must reflect actual traffic. Application WAF rules alone do not protect direct Supabase Auth endpoints. Select a shared-store/WAF option using verified plan capabilities; no new paid service is activated by this document.

Acceptance: missing/replayed CAPTCHA rejected at the provider boundary, legitimate flows succeed on mobile/keyboard, repeated attempts are throttled across instances, another reader is unaffected, renewal cannot flood mail, safe feedback does not enumerate accounts, and required CSP/privacy changes ship with the integration. Prepare code/config together before enabling provider enforcement to avoid locking everyone out.

Suggested commits: `feat(auth): integrate provider-enforced Turnstile`; `feat(security): rate limit authentication attempts`; `docs(operations): record abuse controls and rollback`.

### P1 — Browser policy, operations and release acceptance

Stage a complete CSP in Report-Only, test its reporting/redaction and then enforce it with the actual installed Next.js guidance. Include only required script/frame/connect sources for the chosen CAPTCHA. Retain current headers and same-origin API behavior. Add hostile-origin, failure-redaction, direct route/action access and two-account live authorization checks. Verify session deletion/expiry, provider MFA/access, production debug exposure and dependency-update automation. CI already runs an audit; adding scheduled checks and reviewed immutable action references improves ongoing coverage.

Acceptance: built pages, hydration, fonts, covers, auth and CAPTCHA work under the enforced policy; malicious-origin reads receive no CORS permission; separate CSRF/authorization tests still deny unauthorized mutations; no internal errors/secrets escape; live tenant-isolation tests pass with synthetic accounts and cleanup evidence. Publish and recheck web and provider configuration as a coordinated release.

Suggested commits: `feat(security): enforce a verified content security policy`; `test(security): verify cross-origin and account boundaries`; `chore(ci): schedule dependency and secret checks`.

### P2 — Data protection and continued maintenance

Review data minimization, provider retention, encryption/key ownership and incident handling. Managed disk encryption does not hide data from authorized application/database administrators. If the threat model requires field encryption, first design key custody, authenticated encryption, rotation, migration, search/export behavior and recovery. If protection from the service operator itself is required, evaluate a separate end-to-end design rather than labelling server-side encryption as such. Keep passwords in Supabase Auth and retain ownership checks regardless of encryption.

Acceptance: a documented decision and tested recovery/rotation process, ongoing dependency/advisor/restore checks and accurate product/privacy language. Review safeguards for adolescent authorization alongside this work without storing identity evidence in reading notes or public Git.

## Official implementation references

- [Supabase CAPTCHA integration](https://supabase.com/docs/guides/auth/auth-captcha), [Cloudflare server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).
- [Supabase Auth limits and SSR IP forwarding constraints](https://supabase.com/docs/guides/auth/rate-limits), [Vercel WAF](https://vercel.com/docs/vercel-firewall/vercel-waf).
- [Supabase backup coverage and restoration](https://supabase.com/docs/guides/platform/backups).
- [Supabase SSR cookie considerations](https://supabase.com/docs/guides/auth/server-side/advanced-guide), [Next.js CSP](https://nextjs.org/docs/app/guides/content-security-policy), [Server Action origin protections](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions).
- [Supabase hashing and compromised-password protection](https://supabase.com/docs/guides/auth/password-security), [managed encryption](https://supabase.com/security).

Recheck provider capabilities and the installed Next.js docs at implementation time. This document does not authorize spending, claim a penetration-test certification or mark unobserved provider settings as enabled.
