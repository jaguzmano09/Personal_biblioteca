# Documentation

Read [platform progress](project/progress.md) for the current implementation state and outstanding work. Repository documentation is written in English. Product-facing copy is in Spanish, including the legal notices that will be prepared for publication.

| Area | Document | Purpose |
| --- | --- | --- |
| Project | [Platform progress](project/progress.md) | Completed increments, checks, publication status and next work |
| Project | [Historical handoff](project/handoff.md) | Original product intent, constraints and implementation context |
| Operations | [Deployment](operations/deployment.md) | Database rollout, staging acceptance and private operator configuration |
| Operations | [Authentication email](operations/auth-email.md) | Signed Supabase Auth hook and Brevo delivery procedures |
| Design | [Frontend skills](design/frontend-skills.md) | Reviewed skill sources, revisions and design decisions |
| Security | [Privacy readiness](security/privacy-readiness.md) | Data flows, launch findings, verification and repository exposure review |
| Legal | [Internal legal drafts](legal/drafts.md) | Draft policy, terms and storage information for review |

`README.md` introduces the application and development commands. `AGENTS.md` holds the shared agent instructions at the repository root, and `CLAUDE.md` imports them. Next.js manages the marked framework block in `AGENTS.md`.

Paths in code blocks and inline code refer to the repository root unless a guide says otherwise. Relative Markdown links resolve from their containing document.

Record each completed implementation or maintenance increment in `project/progress.md`. Put detailed operational procedures, design decisions and privacy findings in their corresponding documents and link to them from the progress entry. Keep real account details, personal contact values, credentials and local tool state in private configuration.
