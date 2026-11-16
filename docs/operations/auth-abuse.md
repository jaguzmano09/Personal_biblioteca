# Free-plan authentication abuse controls

Implemented November 15, 2026. The owner explicitly requires no new paid services. The shared limiter uses the existing Supabase Free database; CAPTCHA targets Cloudflare Turnstile Free. No Redis subscription, paid WAF, Worker, DNS change, plan upgrade or billing add-on was activated.

## Current activation state

| Boundary | State |
| --- | --- |
| Database | Additive migration `20261116025030_auth_abuse_limits.sql` applied and tested against live anonymous RPC calls |
| Signing configuration | Matching key stored in ignored local configuration and encrypted Vercel production settings; no privileged database key added to the app |
| Web code | Committed locally; needs publication before production Server Actions use these controls |
| Cloudflare account connection | Official MCP registered; OAuth completed. The current agent session cannot yet invoke the newly registered server; reload Codex to load its tools |
| Turnstile widget/provider enforcement | Not created/enabled or verified yet. Do not enable the web CAPTCHA flag until the coordinated setup below |
| Backups | Remain on the Free-only external-copy path in [backup operations](backups.md); no automatic copy or restore is claimed |

## Shared attempts without storing raw identifiers

The server accepts a trusted client IP only from Vercel's overwritten `x-forwarded-for` header when running on Vercel. Other production hosting needs a reviewed ingress adapter and currently fails closed. Localhost tests use a fixed local identity and ignore forwarded headers. IPv4-mapped addresses normalize to IPv4; IPv6 addresses share a /64 budget.

Before contacting Auth, the server HMACs the normalized IP and normalized email. It signs the action, identifiers, issued timestamp and fresh UUID nonce. `consume_auth_attempt` checks the signature using a private signing key, accepts only timestamps within 60 seconds and rejects reused nonces. Clients cannot read/write the tables or call the internal bucket helper. A stolen limiter key would affect abuse controls, not grant library access or database administration; it still must be kept secret.

The intentionally pre-auth public SECURITY DEFINER RPC is executable by app roles only because valid signed requests are required. It has an empty search path and only touches its own private tables. Tables have RLS without permissive client policies. Security-advisor warnings for this deliberate RPC/private-table arrangement must be reviewed with that context, rather than disabled by broad grants. Existing owner policies, user records, search/cover quotas and timestamp/platform helpers were not changed by this migration. Earlier timestamp/helper permission changes remain pending.

The migration adds new objects and a random signing key, without rewriting existing user data. It was verified in isolated PostgreSQL before the additive production application. Its local filename matches the provider migration version. This limited, reversible addition is not evidence that a recoverable database backup exists; it does not waive the backup gate for existing-data/privilege migrations.

| Budget | Limit/window |
| --- | --- |
| Aggregate auth attempts per IP/prefix | 30 per 60 seconds |
| Login attempts per IP/prefix | 20 per 60 seconds |
| Login attempts per IP/prefix + normalized account | 5 per 10 minutes |
| Signup attempts per IP/prefix | 3 per 10 minutes |
| Recovery or confirmation attempts per action + IP/prefix | 5 per 10 minutes |
| Email-producing requests per normalized recipient, across signup/recovery/confirmation | 3 per hour |

All attempts count, including successful ones. There is no permanent global account login lockout that an unrelated IP can trigger. Email recipients deliberately have a shared mail budget to reduce flooding, independent of whether an account exists. IP limits can affect shared networks; tune them using non-sensitive observations rather than promising perfect attack prevention.

Bucket upserts are atomic and stop creating pair buckets after the IP cap. Counters expire logically at their window end; nonces expire after two minutes. A valid signed request cleans expired rows. Physical deletion is activity-driven, so an idle project can retain expired pseudonymous rows until the next valid request. No raw email, IP, password, note or book content is stored in these tables. A future scheduled cleanup can tighten physical retention without changing the form contract.

These limits protect the application's actions. Direct Supabase Auth requests separately depend on the provider's Auth rate limits and CAPTCHA enforcement. Vercel SSR can aggregate outbound provider traffic under a server IP; no privileged key or untrusted IP forwarding was introduced to work around that.

## Configuration

Set these privately per environment:

| Setting | Purpose |
| --- | --- |
| `TINTERUNA_AUTH_RATE_LIMIT_ENABLED=true` | Enforce the shared limiter; migration/key/ingress failures deny the attempt |
| `TINTERUNA_AUTH_RATE_LIMIT_SECRET` | 64 lowercase hex characters matching the private database signing key |
| `TINTERUNA_CAPTCHA_ENABLED=true` | Require a CAPTCHA token in all four actions; enable only with actual provider enforcement |
| `TURNSTILE_SITE_KEY` | Public widget key sent to the browser by server-rendered pages |
| `TURNSTILE_SECRET_KEY` | Private provisioning value for Supabase Auth's Turnstile configuration; never sent to the browser or required in web client code |

Absent/explicit `false` flags preserve the existing rollout behavior; misspelled enabled flags fail closed. Required-but-missing CAPTCHA configuration blocks submission. Known dummy site keys are rejected for public origins and allowed only for local testing. Preview needs its own matching setup; do not share a production limiter key with an unrelated database. A clean environment generates a different database signing key, which must be synchronized privately before enablement.

The current production limiter settings were upserted successfully (two created, zero failed), taking effect on the next web deployment. The CAPTCHA flag is not enabled by this increment. Real values are deliberately omitted from source/docs/output. Do not copy them into shell history, client props, analytics or provider-response logs.

## Coordinated Turnstile activation

The owner requested the [official Cloudflare setup instructions](https://developers.cloudflare.com/agent-setup/prompt.md). The relevant `turnstile-spin` skill was installed from official revision `cbf893b954222276bf1af57e5f23379231e0efb9` in the personal skill directory. The official MCP `https://mcp.cloudflare.com/mcp` was registered and OAuth succeeded. New MCP tools are not available in the current session; reload Codex before the account operations below. Neither the account authorization nor installation alone creates a widget.

1. Use the authenticated Cloudflare account to inspect existing widgets. Reuse a suitable widget; otherwise create one Free managed widget for `tinteruna.vercel.app`, with no pre-clearance or DNS/Workers changes. Keep production domains separate from local testing; use official test keys locally. Confirm the target account if the connection exposes multiple accounts.
2. Store the site key and secret directly in the ignored/private configuration destination without printing secrets or storing them in a temporary review file. Keep any account provisioning token outside the web deployment. Never use a project-local unreviewed executable for a credential-bearing Cloudflare call.
3. Configure Supabase Auth's supported Turnstile protection with the same secret. That provider validation is the single Siteverify redemption. The web server forwards the token through SDK `options.captchaToken` for login, signup, recovery and confirmation resend. Do **not** redeem the same token locally and then submit it to Auth: Turnstile tokens are single-use. A widget or a nonempty token check by itself does not protect a direct Auth call.
4. Publish the prepared web code/site key, then coordinate the provider/web enablement in a controlled release. Preserve existing sessions. Verify missing/invalid/expired tokens fail at the provider, one fresh real token succeeds, replay is rejected, and direct Auth calls cannot bypass the challenge. Include resend and same-browser recovery/confirmation acceptance, without email flooding. Provider Auth configuration access is separate from Cloudflare OAuth.
5. Keep tokens only in component memory. The UI clears and remounts the widget after every submission attempt, handles expiry/error/unsupported browser/script failure, supports retry without clearing email/password, and does not load Cloudflare when disabled. The compact widget fits 320 px layouts. Public privacy copy describes conditional Cloudflare processing and pseudonymous attempt counters.

Supabase handles the supported provider verification in this architecture; the generic Spin direct-Siteverify example is adapted to that existing Auth backend, preserving single redemption. No replacement mail/auth backend or extra paid infrastructure is introduced. A future full CSP must explicitly allow the required Turnstile script/frame/connect sources and preserve existing headers.

## Verification evidence

- 54 tests passed, including actual PostgreSQL signature/timestamp/replay checks, denied direct table/helper access, pair/IP/recipient quotas, rollover, ingress normalization and action gating/token forwarding. Unit/action tests use isolated provider boundaries.
- Live anonymous RPC tests allowed five signed attempts, denied the sixth, allowed another IP, and rejected replay/forgery. A local production build's actual login action with real Supabase allowed five failed synthetic sign-ins and denied the sixth, ignoring a spoofed local forwarded IP and preserving the form. No account was created or email sent. Exact synthetic buckets/nonces were removed.
- Actual UI components with fixture provider/script boundaries passed 320/390/768/1440 px layout and axe checks for login, signup, recovery, confirmation, expiry, error, retry, missing configuration, disabled mode and failed-script retry. The scoped mechanical detector returned zero findings. These tests do not validate a real Turnstile widget or provider enforcement.
- Production build, TypeScript and anonymous smoke passed. Installation of pinned `@marsidev/react-turnstile` 1.6.3 audited zero known vulnerabilities. It uses the existing shadcn Alert/Button and Tinteruna identity; no preset/font replacement was applied.
- Post-migration advisors still report the earlier timestamp search path, platform helper execution and disabled leaked-password protection. New private tables and the intentionally signed pre-auth RPC add expected informational/EXECUTE findings; no claim of a clean advisor report is made.

## Rollback and future paid migration

Coordinate rollback of the web CAPTCHA flag and provider enforcement; disabling only one can break access or leave an unprotected boundary. Missing/misconfigured enforced limiter infrastructure intentionally denies requests. After an assessed incident, the operator can temporarily set its flag to `false` and redeploy while keeping provider limits/CAPTCHA; this is a security reduction, not the normal failure fallback. Never disable RLS to recover login.

Only after the web no longer invokes the new RPC may an operator drop that RPC and its three new private tables/helper as a reviewed rollback. Preserve the two existing quota tables, existing user data/policies and unrelated helpers. Restore/recover procedures still follow [backup operations](backups.md).

Free-plan quotas can interrupt service; no paid overage/add-on is authorized. If the project later chooses a paid plan, keep the form/action contract and replace the limiter adapter or retain Postgres as appropriate. Move signing/configuration through a private migration procedure, run equivalent cross-instance tests, and keep a rollback. Paid backups/PITR, enhanced password checking or managed WAF remain future options requiring a separate explicit decision. Do not automatically upgrade when Free capacity is reached.

References: [Supabase CAPTCHA](https://supabase.com/docs/guides/auth/auth-captcha), [Supabase Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits), [Vercel request headers](https://vercel.com/docs/headers/request-headers), [Turnstile Free](https://developers.cloudflare.com/turnstile/plans/).
