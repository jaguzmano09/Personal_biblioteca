# Platform progress

Last updated on November 14, 2026. This is the current working record for Tinteruna. Update it with each completed increment, including changes, evidence, open work and publication status.

## Current state

Tinteruna is a private reading journal with a Spanish interface, editorial typography and a mobile-first direction. The initial launch market is Colombia. Adults have guided self-registration; ages 15–17 have an assisted contact route whose authorization and verification require operational review.

| Area | Implemented | Verification and remaining work |
| --- | --- | --- |
| Public welcome and identity | Illustrated story, interactive temporary journal preview, shared literary typography and magical-realism artwork | Anonymous production pages and isolated components reviewed at four widths; zero axe findings in checked views. Physical-device review remains open. |
| Access | Guided registration with separate choices, confirmation renewal, recovery, password update, sign-in and sign-out | Real Supabase password update/new-password sign-in passed through a local production build. Inbox delivery, recovery-link consumption and production callback allowlist still need release checks. |
| Library | Dashboard before the catalog, annual goals, current-reading continuation, filters, detail and inline notes; completion suggests the current year | Real Supabase persistence/reload, goal acknowledgement and completion-to-goal checks passed. Explicit historical/undated choices passed in actual-component fixtures. Physical-device review remains open. |
| Discovery and addition | Google Books search/edition comparison and manual metadata entry, with the shared personal-note/save journey | Live Google Books search passed in the original audit; new manual creation, decimal score and export passed against real Supabase through the local production build. |
| Privacy controls | Private JSON export, public Spanish privacy/terms/help pages and private server contact configuration | Public notices passed responsive/axe checks with fictional contact details. Five encrypted production settings are saved; the web deployment must activate the pages/contact. |
| Launch preparation | Data-flow inventory, notices, separate registration controls, assisted contact path and documented request handling | Legal/operational review, verified adolescent authorization, durable acceptance evidence, retention/backups, closure and provider evidence remain open. |
| Repository | English documentation grouped by purpose, shared agent instructions and ignored local tool state | Local links, repository exposure checks and documentation consistency reviewed with this increment. |
| Production origin | Tinteruna is canonical; the legacy production hostname redirects with HTTP 308 | Published in Vercel project-level routing. Passed 22 live HTTP assertions, including paths, queries, anonymous access boundaries and no loops. Authenticated migration remains untested. |

## Publication status

The owner previously published the dashboard commits. The last verified web production revision is READY `b0894f7`; the first-reader review exercised that live version. The eight reviewed findings now have application corrections committed locally on `main`, without a push or web deployment in this increment. The canonical-origin rule remains active. Five encrypted Vercel production operator settings were saved and the backward-compatible recovery mail hook is active as version 13. The next web deployment must activate the code/settings, followed by public contact, redirect-allowlist, actual email delivery and recovery/confirmation-link acceptance checks. Local real-provider testing does not establish that those production paths have passed.

## Change record

### November 14, 2026 — Sixteen-control security assessment and roadmap

- Checked the owner's sixteen security requirements against source, live Supabase schema/policies/grants/functions/advisors, Vercel's active firewall and anonymous production HTTP responses. Recorded the [assessment and ordered roadmap](../security/hardening-roadmap.md), separating implemented controls, missing application integration and unverified provider operations.
- Confirmed forced owner-only RLS on books/goals, no anonymous application-table grants, no app-role schema creation/private-schema access, no public views/Storage buckets and no app admin/debug route found. Checked live app responses have no cross-origin allow headers and preserve existing security headers/anonymous denial. The CSP remains partial. Default SSR cookies lack an explicit hardened application policy; CAPTCHA and a shared login limiter are absent from source. Vercel has no custom firewall configuration; provider Auth limits and actual backup history remain unverified.
- Re-read security advisories: mutable timestamp-trigger search path, excessive client EXECUTE on a privileged event-trigger helper, intentional guarded quota RPCs, deliberately policy-free private quota tables and disabled leaked-password protection. The event-trigger helper's RPC exploitability was not demonstrated; the roadmap requires staged permission review rather than claiming an admin takeover.
- Verification: all 41 tests passed; the npm audit returned zero known vulnerabilities after retrying a sandbox network failure. Final exposure checks covered 115 versionable files/49 built client files with no configured private values or secret signatures found; documentation checks passed 42 local links across 13 Markdown files. No existing accounts/content/hashes were read, no application/provider/database behavior was changed and no brute-force/load test was run. Only documentation is changed in this increment; no application rebuild is needed.
- Commit: `docs(security): assess sixteen controls and prioritize hardening`. Local on `main`, not pushed. Implementation starts with session hardening, a recoverable backup gate before database changes, privileged-function review and coordinated bot/attempt protection; full CSP/live acceptance follows.

### November 14, 2026 — Remediation evidence and release handoff

- Updated the [original review](../qa/first-reader-review-2026-11-14.md#implementation-follow-up) with a correction/evidence matrix for all eight findings, preserving the original production observations. Updated setup, operations, legal-draft status, design provenance and the privacy baseline follow-up.
- Final verification: 41 passing tests, production build/TypeScript, anonymous smoke checks, four-width actual-UI browser checks, zero axe findings and zero scoped detector findings. Repository/client exposure checks covered 114 versionable files and 49 built client files without matching configured operator values or credential signatures. Documentation checks passed 36 local links across 12 Markdown files and confirmed current Next.js agent rules/private-file ignores.
- Implementation commits: `a55b5e9` manual books/completion; `9f937d1` goal acknowledgement; `1679d05` public notices/contact; `e6d13c6` guided registration/access validation; `4d9b61b` recovery/confirmation renewal. Documentation commit: `docs(qa): record remediation evidence and release checks`.
- No web push/deployment was performed. Five production environment settings and mail-function version 13 are saved/active as described above. Production contact, exact recovery callback allowlist and actual mail-link flows remain release acceptance tasks; physical-device and broader legal/security launch work remain open. No existing user data or password was changed, and all isolated QA data/credentials were removed.

### November 14, 2026 — Recovery and confirmation renewal

- Addressed ISSUE-003 and ISSUE-004 with visible login/registration entries, `/recuperar`, `/confirmar` and `/actualizar-clave`. Conditional email feedback, a 60-second UI cooldown, expired-link guidance and fixed callback routing preserve account privacy. Arbitrary return destinations are ignored.
- The email hook adds the trusted recovery-flow enum only to actual recovery emails. Published `send-auth-email` version 13, preserving its existing signature authentication and secret configuration. The web changes remain local until application publication; production redirect-allowlist and actual delivery/link consumption still need release verification.
- The local production build with an isolated real Supabase account passed password update, session closure and sign-in with the new password. That journey exposed and fixed a success-state issue caused by session revalidation after sign-out. This is authenticated password-change evidence, not evidence of an inbox recovery link.
- Verification passed all 41 tests, build/TypeScript and anonymous smoke checks. Browser tests covered recovery/resend request feedback/cooldowns, expired reset access and mobile layouts without axe findings. Existing accounts were untouched and all temporary data was removed.
- Commit: `feat(auth): add recovery and confirmation renewal`. Application changes local on `main`; the backward-compatible mail hook update is active.

### November 14, 2026 — Guided registration and access-action safeguards

- Resolved ISSUE-002's missing age guidance and completed ISSUE-001's separate unchecked terms/data controls using the reviewed official shadcn Checkbox. Adults can self-register only with complete operator settings and a matching notice version; ages 15–17 receive the assisted route and under-15 registration is unavailable. Credentials are not requested in those youth paths.
- Server validation repeats the eligibility/acceptance checks and writes a versioned receipt to user metadata. That editable metadata is not an immutable authorization record or proof of age. Automated guardian verification and provider-level signup enforcement remain launch work.
- Added server-side recovery/resend/password-update actions for the following access increment. They use fixed destinations, conditional non-enumerating email feedback and a verified session before password mutation.
- Verification: 41 tests passed, including missing consent, youth self-registration, absent operator settings, trusted email destinations and password/session checks. Actual-component browser checks verified the three age paths, two independent controls, disabled submission and confirmation at four widths, with no axe findings. The final mobile consent labels were visually checked after fixing inline wrapping.
- Commit: `feat(auth): guide registration and validate access requests`. Local on `main`; application publication and assisted-process review remain pending.

### November 14, 2026 — Public notices and private operator configuration

- Added Spanish `/privacidad`, `/terminos` and `/ayuda` pages and links from the welcome, access shell and protected data page, addressing ISSUE-001's missing information and ISSUE-007's missing contact path. Dynamic server rendering loads contact values from private settings; no personal values are embedded in versioned source or client bundles.
- Upserted the five encrypted production operator settings in Vercel. They require a subsequent application deployment to take effect. Added the `server-only` import boundary; missing settings show unavailable guidance.
- Applied shadcn, frontend-design, responsive-design and Impeccable guidance while preserving the existing identity. Browser/axe checks passed at 320/390/768/1440 px using fictional operator details. The mechanical scan returned zero findings; repository/client exposure checks found no configured private values. The dependency audit reported zero vulnerabilities.
- Commit: `feat(privacy): add public notices and support access`. Local on `main`; runtime settings are saved, while application publication and operational/legal review remain pending.

### November 14, 2026 — Persistent goal-save feedback

- Resolved ISSUE-006 by keeping the goal acknowledgement when server revalidation supplies updated goal props. Switching years or reopening the editor clears the old acknowledgement.
- Verification: the complete regression suite and build passed. The isolated real-account browser journey saved a goal, observed the acknowledgement after the server refresh and confirmed persisted reading progress after a full reload. No fixture-only persistence claim is used for this check.
- Commit: `fix(dashboard): preserve the goal save acknowledgement`. Local on `main`; application publication remains pending.

### November 14, 2026 — Manual books and dated completion

- Resolved ISSUE-005's completion guidance and ISSUE-008's catalog fallback. Marking an undated book completed suggests the current browser year and explains its annual-goal effect. Explicit historical years remain intact; deliberately clearing the year remains possible with a warning. Pending/abandoned books still do not advance goals.
- Added manual title/author/pages/ISBN entry alongside discovery and reused the existing personal-reading/note/save journey. The server validates metadata, forces a null provider ID and derives ownership from the verified session. The existing schema supports this without a migration.
- Verification: the 41-test suite, production build and TypeScript passed. Actual-component browser checks covered manual creation, historical/undated choices and four widths. A local production build using an isolated real Supabase account verified manual creation, completion, decimal score, reload, annual progress and owner JSON export. The account and all its books/goals/sessions were removed; the two original accounts were unchanged.
- Commit: `feat(books): support manual additions and dated completion`. Local on `main`; application publication remains pending.

### November 14, 2026 — Live first-reader walkthrough

- Completed an unfamiliar-reader walkthrough against the published platform, using the agent-browser exploratory-testing skill and an independently driven Chrome check for download/layout evidence. The [production review](../qa/first-reader-review-2026-11-14.md) records eight open findings: five high and three medium, with reproduction steps, expected improvements and local screenshot references.
- The owner authorized arranging test access. Existing accounts were not marked as test accounts and no reusable credentials were available, so a dedicated confirmed QA account was administratively provisioned. Existing users, passwords and personal records were not modified. Normal browser login was used; administrative provisioning does not verify public signup or email delivery.
- Live passes included Google Books search/selection, creation with a note, note editing and full reload, completed state and decimal score, goal persistence, filters/reset, JSON download, canceled/confirmed deletion, sign-out and signed-out library denial. The export matched only the isolated account and its one book/goal.
- Confirmed a core motivation gap: marking a book read without a reading year leaves annual progress unchanged without warning. Supplying the year restored the correct completed-book count, pages, score and goal progress. The arithmetic itself passed.
- Also recorded missing pre-registration notices/age guidance, password recovery, confirmation-resend guidance, deployed support/privacy contact, stable goal-save acknowledgement and manual-add coverage after no provider results.
- Four live authenticated views at 320/390/768/1440 px had no horizontal overflow or axe findings, and captured page exceptions were empty. Real phones, screen readers, email delivery and exhaustive cross-account/concurrency checks were outside this review. A canceled agent-browser download was contrasted with a successful independent browser download and excluded as a tool issue. Video was unavailable because ffmpeg was absent.
- Deleted the test book through the UI and removed the marked temporary account. Follow-up checks confirmed zero remaining QA accounts, books, goals or sessions, with the original account total restored. Removed temporary credentials/session/export files, deleted the dedicated credential profile and closed review browsers. Evidence is kept in the ignored `.local-reviews/` directory; the versioned report contains no real private values.
- This increment records findings and acceptance evidence; it does not change application behavior, provider settings, schema or deployments. Commit messages: `docs(qa): record the live first-reader review` and `docs(project): record authenticated acceptance results`.

### November 14, 2026 — Reading progress before the catalog

- Moved the dashboard from the end of the mobile catalog/narrow desktop sidebar to a full-width section before the books. A compact library heading leaves room for the annual goal, current-reading action and selected-year metrics.
- Added contextual encouragement grounded in actual completed readings, with clear no-goal and achieved/exceeded states. The next-reading action prefers a current book, then a pending book, then discovery, without automatically modifying any book.
- Installed and applied the official shadcn skill at the owner's request. Integrated reviewed source components with Tinteruna semantic colors, 48 px used controls, visible focus and reduced-motion behavior. Source provenance and MIT attribution are in [design decisions](../design/frontend-skills.md).
- Added goal-load retry, preserved edits on save errors, cancellation with focus restoration and protection against outdated year responses. Existing authenticated server actions, ownership checks and completed-only statistics remain unchanged.
- Verification passed 36 regression tests, TypeScript, production build and anonymous smoke checks. The dependency audit reported zero vulnerabilities. Browser checks of actual components with fixture boundaries covered 320/360/390/768/1024/1440 px, loading/save failures and retry, cancellation, out-of-order loads, empty libraries, absent/achieved/exceeded goals, long content, large values, zero scores, broken covers, short viewports and reduced motion. Axe and the scoped mechanical design detector returned zero findings. Live authenticated persistence remains unverified.
- No provider, database, production-routing or deployment changes are part of this increment. The earlier live canonical-domain redirect remains independent of these local changes.
- Commit sequence: `feat(ui): integrate branded shadcn reading controls`; `feat(dashboard): put reading progress before the catalog`; `docs(dashboard): record the mobile reading experience`.

### November 14, 2026 — One public Tinteruna origin

- Confirmed that `tinteruna.vercel.app` and `personal-biblioteca.vercel.app` are domains of the same project and production deployment. Both previously served the application independently, allowing separate browser sessions per origin. The callback already used the Tinteruna origin.
- Published **Canonical Tinteruna origin**, a narrowly scoped Vercel project-level 308 redirect from the legacy hostname to Tinteruna. Staged and reviewed the one-rule diff before promotion. Kept preview hosts, deployment protection, application code, provider settings and database unchanged.
- Passed 22 public HTTP assertions covering root/access/library/asset/callback routes, exact path and query preservation (including encoded and repeated parameters), HEAD/POST redirect responses on an inert path, no legacy session cookies, no redirect loops and preserved anonymous library/export denial on the primary origin.
- Recorded the configuration, verification procedure, browser-session transition and rollback in [deployment operations](../operations/deployment.md). Actual confirmation delivery and authenticated session migration were not exercised.
- Applied the Vercel domain, CLI and routing guidance; reviewed the existing Supabase callback boundary. No additional dependency or skill installation was required.
- Documentation commit: `docs(hosting): record the canonical Tinteruna origin`.

### November 10, 2026 — Public welcome and platform identity

- Replaced the anonymous root redirect with a public introduction, Tinteruna's reading-journal story, an interactive preview, real feature explanations and questions. Signed-in readers still enter their library.
- Added original magical-realism artwork: an open book becomes an Andean landscape and an ink river. Applied the identity across access, the library, empty states, notes, addition, errors and data controls.
- Reworked mobile and desktop navigation, current-reading continuation, labelled search and filters, password visibility, submission feedback and focused registration confirmation.
- Preserved existing book actions, decimal scores, note conflict handling, secure covers, session/ownership checks and private JSON export. No database migration, new product dependency or provider configuration change was introduced.
- Kept the public preview temporary and local to page memory. No save request, storage write or personal contact value is part of this welcome.
- Consulted Skill Issue again and installed reviewed, pinned Impeccable and community XSS guidance. Reused frontend, responsive and testing skills. See [design decisions and artwork prompt](../design/frontend-skills.md) for provenance and the reusable contract.
- Verification: 36 regression tests, TypeScript and production build, anonymous smoke checks, and browser checks of production public pages plus actual private components with fixture action boundaries. Four widths (360, 390, 768 and 1440 px), all reading states, filter/reset/sort, annual goals, note failure/retry, registration confirmation, literal markup rendering and preview privacy were checked. Axe reported zero findings in the checked views. Real account creation, authenticated persistence and export remain unverified against a live service.
- Exposure checks covered 86 versionable files and 43 built client resources, with no configured operator values or matching credential patterns found. Real private values were omitted from output. New commits use a project identity and a reserved `.invalid` email through per-command Git configuration; personal Git settings are unchanged. Existing historical exposure remains documented in the privacy readiness assessment; this increment does not rewrite history.
- Commit sequence: `feat(design): establish the illustrated Tinteruna identity`; `feat(home): introduce a public reading journal welcome`; `feat(auth): carry the literary identity through account access`; `feat(library): unify the private reading experience`; `docs(design): record identity decisions and verification`.

### November 10, 2026 — Repository documentation and privacy review

- Organized documentation under `project`, `operations`, `design`, `security` and `legal`, with a shared index.
- Retained root agent entry points and added the workflow for maintaining this progress record.
- Translated the email guide and internal legal drafts into English and repaired document references.
- Moved the original untracked handoff into the project documentation and marked it as historical context.
- Updated the main README to reflect the private export and current configuration.
- Reviewed versioned files and reachable Git history for configured operator values and credential patterns. Recorded historical contact/author exposure in [privacy readiness](../security/privacy-readiness.md).
- Removed local Supabase CLI state from version control while preserving local files and adding an ignore rule. Commit `b3742bd`, `chore(privacy): exclude local Supabase CLI metadata`.
- Documentation commit message, `docs(repo): organize English guides and platform progress`.
- Verification checked 24 local links across 11 Markdown files, the shared agent entry points and the installed Next.js managed block. The repository review covered versionable files and locally reachable Git history, with real values omitted from its output. Ignored operator configuration and local Supabase state were confirmed. Application behavior is covered by the previous increment's checks.

### November 10, 2026 — Mobile discovery, addition and private export

| Commit | Change |
| --- | --- |
| `f07ea73` | `feat(search): refine mobile edition discovery` |
| `b566493` | `feat(books): preserve notes through mobile book creation` |
| `99c8f1b` | `feat(privacy): add private account export and server contact settings` |
| `6475c3e` | `docs(launch): record skills and Colombia privacy readiness` |

Installed and applied the reviewed frontend-design, responsive-design and webapp-testing skills. Search sends confirmed queries to Google Books, presents edition metadata and preserves results when switching back from the form. Addition supports optional notes, decimal scores, manual cover URLs, duplicate-submit prevention and confirmation. The protected data page exports books, private writing, goals and account identity through owner-scoped server reads.

Verification passed 36 tests, TypeScript, the production build, anonymous smoke checks and a dependency audit with zero reported vulnerabilities. Playwright checked actual components in an isolated harness with fixture provider/save responses. Separate anonymous browser checks used the production build. Read-only Supabase inspection confirmed owner-scoped table policies and reviewed security advisories. The [readiness assessment](../security/privacy-readiness.md) records the scope and limitations.

## Next work

1. Publish the local application commits when instructed, verify the public operator contact and exact recovery callback allowlist, and exercise real confirmation/resend/recovery emails and expired links. See the [finding resolution matrix](../qa/first-reader-review-2026-11-14.md#implementation-follow-up).
   Before expanding registration, execute the P0 controls in the [security roadmap](../security/hardening-roadmap.md): hardened cookies, recoverable backups, helper permissions and provider-enforced CAPTCHA/shared attempt limits.
2. Complete operational/legal review of the published notices, rights/closure/withdrawal handling and retention/backup decisions.
3. Review proportionate guardian verification, the adolescent's participation, durable authorization evidence and provider-level signup enforcement before opening assisted enrollment.
4. Address the separate recorded security/provider findings, then reassess public-launch readiness.
5. Review physical-phone keyboards and devices, then refine the identity using reader feedback and observed task completion.
