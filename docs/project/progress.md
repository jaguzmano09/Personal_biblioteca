# Platform progress

Last updated on November 14, 2026. This is the current working record for Tinteruna. Update it with each completed increment, including changes, evidence, open work and publication status.

## Current state

Tinteruna is a private reading journal with a Spanish interface, editorial typography and a mobile-first direction. The initial launch market is Colombia. The intended audience older than 14 includes adolescents whose registration requires further safeguards and review.

| Area | Implemented | Verification and remaining work |
| --- | --- | --- |
| Public welcome and identity | Illustrated story, interactive temporary journal preview, shared literary typography and magical-realism artwork | Anonymous production pages and isolated components reviewed at four widths; zero axe findings in checked views. Physical-device review remains open. |
| Access | Registration, confirmation, sign-in and sign-out | Live sign-in/sign-out and protected-library denial passed with an isolated account. Public signup/email delivery, recovery and complete account lifecycle remain open. |
| Library | A prominent reading dashboard before the catalog, current-reading continuation, mobile navigation, filters, sorting, annual goals, reading-state detail and inline notes | Live goal/book/note persistence, completion, filters and confirmed deletion passed. Missing reading-year guidance and goal-save feedback are open findings. Physical-device review remains open. |
| Discovery and addition | Explicit Google Books search, edition comparison, optional personal note, recoverable save errors and bookmark confirmation | Live Google Books edition search and addition passed. No-result discovery lacks a manual-book fallback. Earlier isolated checks covered save recovery and keyboard focus. |
| Privacy controls | Private JSON export and a protected data/contact page | Live downloaded JSON matched the isolated account and its test records. Public notices and a usable deployed privacy/support contact remain open findings. |
| Launch preparation | Data-flow inventory, readiness assessment and internal legal drafts | Approved notices, adolescent safeguards, retention, recovery/closure operations and provider evidence remain open. |
| Repository | English documentation grouped by purpose, shared agent instructions and ignored local tool state | Local links, repository exposure checks and documentation consistency reviewed with this increment. |
| Production origin | Tinteruna is canonical; the legacy production hostname redirects with HTTP 308 | Published in Vercel project-level routing. Passed 22 live HTTP assertions, including paths, queries, anonymous access boundaries and no loops. Authenticated migration remains untested. |

## Publication status

The owner published the dashboard commits. On November 14, a read-only Vercel check confirmed the production deployment as READY from `main` commit `b0894f7`, and the first-reader review exercised that live version. The previously published canonical-origin routing rule remains independent of application releases. This review's report and progress updates are local documentation until explicitly published; the findings have not been implemented. Email delivery, recovery, physical-device and remaining launch checks still need evidence.

## Change record

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

1. Resolve the [first-reader findings](../qa/first-reader-review-2026-11-14.md), starting with the finish-book/year-to-goal journey and access recovery. Follow with physical-phone keyboard and device checks.
2. Complete recovery, account correction, closure and withdrawal procedures with proportionate identity verification and retention/backup decisions.
3. Implement and review the adolescent registration safeguards for the intended Colombia audience.
4. Finalize Spanish legal notices and terms, consent/acceptance controls where applicable, and pre-registration links after the operational facts are confirmed.
5. Address the recorded security and provider findings, then review public-launch readiness.
6. Review the implemented welcome and library on physical phones, then refine the identity using reader feedback and observed task completion.
