# Documentation

Read [platform progress](project/progress.md) for the current implementation state and outstanding work. Repository documentation is written in English. Product-facing copy, including the implemented privacy, terms and help notices, is in Spanish.

| Area | Document | Purpose |
| --- | --- | --- |
| Project | [Platform progress](project/progress.md) | Completed increments, checks, publication status and next work |
| Project | [Historical handoff](project/handoff.md) | Original product intent, constraints and implementation context |
| Operations | [Deployment](operations/deployment.md) | Database rollout, staging acceptance and private operator configuration |
| Operations | [Authentication email](operations/auth-email.md) | Signed Supabase Auth hook and Brevo delivery procedures |
| Operations | [Session cookies](operations/session-security.md) | Server-owned cookie policy, browser evidence and rollout |
| Operations | [Backups](operations/backups.md) | Verified plan, safe inventory command and backup activation requirements |
| Design | [Frontend skills](design/frontend-skills.md) | Reviewed skill sources, revisions and design decisions |
| Quality | [First-reader production review](qa/first-reader-review-2026-11-14.md) | Reproduced user-facing issues, authenticated acceptance evidence and correction priorities |
| Security | [Privacy readiness](security/privacy-readiness.md) | Data flows, launch findings, verification and repository exposure review |
| Security | [Security hardening roadmap](security/hardening-roadmap.md) | Sixteen-control verification, live evidence, ordered implementation and release acceptance |
| Legal | [Internal legal drafts](legal/drafts.md) | Draft policy, terms and storage information for review |

`README.md` introduces the application and development commands. `AGENTS.md` holds the shared agent instructions at the repository root, and `CLAUDE.md` imports them. Next.js manages the marked framework block in `AGENTS.md`.

Paths in code blocks and inline code refer to the repository root unless a guide says otherwise. Relative Markdown links resolve from their containing document.

Record each completed implementation or maintenance increment in `project/progress.md`. Put detailed operational procedures, design decisions and privacy findings in their corresponding documents and link to them from the progress entry. Keep real account details, personal contact values, credentials and local tool state in private configuration.
