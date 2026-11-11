# Platform progress

Last updated on November 10, 2026. This is the current working record for Tinteruna. Update it with each completed increment, including changes, evidence, open work and publication status.

## Current state

Tinteruna is a private reading journal with a Spanish interface, editorial typography and a mobile-first direction. The initial launch market is Colombia. The intended audience older than 14 includes adolescents whose registration requires further safeguards and review.

| Area | Implemented locally | Verification and remaining work |
| --- | --- | --- |
| Public welcome and identity | Illustrated story, interactive temporary journal preview, shared literary typography and magical-realism artwork | Anonymous production pages and isolated components reviewed at four widths; zero axe findings in checked views. Physical-device review remains open. |
| Access | Registration, confirmation, sign-in and sign-out | Anonymous boundaries checked locally. Real authenticated recovery and complete account lifecycle remain open. |
| Library | Current-reading continuation, mobile navigation, filters, sorting, annual goals, reading-state detail and inline notes | Regression checks cover data validation and PostgreSQL isolation. Isolated browser checks cover filters, goals, note retry and all four states. Real authenticated persistence and device review remain open. |
| Discovery and addition | Explicit Google Books search, edition comparison, optional personal note, recoverable save errors and bookmark confirmation | Isolated browser checks cover 360, 390, 768 and 1366 px, short viewports and keyboard focus. Real provider/save persistence remains open. |
| Privacy controls | Private JSON export and a protected data/contact page | Tests cover ownership filters, pagination, anonymous denial and safe failure. Real authenticated export remains open. |
| Launch preparation | Data-flow inventory, readiness assessment and internal legal drafts | Approved notices, adolescent safeguards, retention, recovery/closure operations and provider evidence remain open. |
| Repository | English documentation grouped by purpose, shared agent instructions and ignored local tool state | Local links, repository exposure checks and documentation consistency reviewed with this increment. |

## Publication status

The historical handoff reported publication of `ae7a23f`. Before the identity increment, local `main` and its tracking reference were at `619106b`, including documentation organization and the earlier mobile/privacy changes below. The identity increment is committed locally on `main`; this work does not publish or deploy it. Hosted deployment state, private environment configuration and authenticated acceptance checks require separate evidence.

## Change record

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

1. Verify authenticated search/add, inline notes and export using isolated authorized accounts, followed by phone keyboard and device checks.
2. Complete recovery, account correction, closure and withdrawal procedures with proportionate identity verification and retention/backup decisions.
3. Implement and review the adolescent registration safeguards for the intended Colombia audience.
4. Finalize Spanish legal notices and terms, consent/acceptance controls where applicable, and pre-registration links after the operational facts are confirmed.
5. Address the recorded security and provider findings, then review public-launch readiness.
6. Review the implemented welcome and library on physical phones, then refine the identity using reader feedback and observed task completion.
