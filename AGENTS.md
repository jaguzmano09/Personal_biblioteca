# Agent instructions

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project workflow

- Communicate with the project owner in Spanish. Write repository documentation and commit messages in English. Product-facing copy follows the existing Spanish interface.
- Read [current progress](docs/project/progress.md) before starting an increment. Use the [documentation index](docs/README.md) to find design, operations, privacy and historical context.
- Work directly on `main` and use small Conventional Commits. Preserve existing local work. Publication follows the project owner's explicit instructions.
- Keep personal details, credentials and local tool state in ignored files or private provider settings. Review versionable files before committing. Report historical exposures without printing their values.
- Update `docs/project/progress.md` for each completed increment with the changes, verification evidence, unresolved work and publication status. Include the commit SHA or message when available. Describe authenticated and production checks according to the evidence actually obtained.
