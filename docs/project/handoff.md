# Tinteruna — implementation handoff

Historical brief preserved during the documentation reorganization. Read [current progress](progress.md) for completed work, verification and outstanding decisions. The repository has progressed beyond the baseline and next steps described in this original brief.

Use this document as the working brief in the locally cloned repository. Continue implementation rather than reconstructing the previous conversation. This handoff summarizes reported work; inspect the repository to establish the actual current state before editing.

## Collaboration rules

- Communicate with the project owner in Spanish. Write commits, repository documentation, and PR metadata in English. Keep product copy in its existing language, Spanish.
- Work directly on `main`. Do not create branches. Use small Conventional Commits, for example `feat(search): refine the mobile book discovery flow`, `fix(library): prevent mobile layout overflow`, and `docs(design): document interaction principles`.
- Preserve uncommitted user work. Inspect status before syncing; never reset, force-push, or discard changes to reconcile history.
- Implement and validate progressively. Commit completed changes; push when the project owner requests publication. This handoff is not an instruction to deploy automatically.
- Avoid repeated approval questions for routine, reversible implementation decisions. Ask only when a consequential ambiguity cannot be resolved from the code and this brief.
- Read applicable `AGENTS.md` files and relevant available skills before implementation. Report limitations accurately; never claim to have used unavailable skills or performed unexecuted checks.

## Project and source of truth

- Product: **Tinteruna**, a personal reading library.
- Repository: https://github.com/jaguzmano09/Personal_biblioteca
- Production: https://personal-biblioteca.vercel.app
- Hosting/auth/data context: Vercel and Supabase. Discover framework, commands, dependencies, file locations, and schemas from the actual repository rather than assuming them.
- Last publication reported in the conversation: `ae7a23f91867f9a28cb53e10674ce6c1ae1944a3`, `feat(library): add inline reading notes and refine the bookshelf`.
- That publication was reported deployed. This is a historical reference, not proof of today's remote HEAD. Do not reset the clone to it or recreate its changes.
- Earlier work sometimes published through a GitHub integration, producing remote SHAs different from local ones. Compare history and contents if reconciliation is needed; do not duplicate patches.

## Implemented baseline to verify, preserve, and extend

1. Web identity: editorial T monogram in SVG, favicon, Fraunces and Inter, shared form styles; identity applied to login, registration, email-confirmation screen, and library header.
2. Library as a reader's journal: covers first, statistics in “Notas al margen”, achievement seal for completed reading goals. Mobile puts search/books before statistics. Existing filters, sorting, goal editing, and real covers must remain available.
3. Book detail responds to reading status:
   - **Leído:** memories, notes, saved quotations, favorite character, reading date.
   - **Abandonado:** invitation to return, terracotta bookmark. “Retomar lectura” opens editing with “Leyendo” preselected; it must not silently save the change.
   - **Pendiente:** invitation to begin and remember why it was saved; “Empezar a leer”.
   - **Leyendo:** current impressions and quotations.
4. “Tu huella” is central to the detail page, with inline note creation/editing and a status-specific prompt when empty. Reuse existing notes storage; avoid parallel data fields without a real requirement.
5. Publication date and personal reading date are distinct. Delete is at the bottom of the detail. Decimal ratings such as 7.6 must survive editing.
6. Bookshelf titles/statuses/ratings were aligned across different title lengths. Covers have subtle edge light and hover/keyboard-focus elevation.

Previous reports said build, TypeScript, 29 tests, and anonymous-access checks passed. Treat those as historical results, not current verification. Authenticated note saving and mobile composition still require real review.

## Product intent and visual identity

Tinteruna should feel like a personal literary notebook: contemporary editorial design, poetic details, and occasional magical realism. It should help preserve the emotional trace of reading and encourage brief personal notes or summaries without imposing homework.

- Editorial serif T monogram; Fraunces for expressive headings/brand and Inter for controls/body text, subject to verification of existing implementation.
- Reference colors: ink green `#253D33`, ivory `#F5EDE0`, dark ink `#252822`, aged gold `#B69A62`, terracotta `#A65C4B`. Use existing semantic tokens and check contrast; gold is primarily ornamental, and terracotta may need a darker text variant.
- Give covers prominence without obscuring their artwork. Use typography, composition, margins, and meaningful annotations to build identity.
- the project owner approves bolder design evolution, introduced progressively. Avoid a generic dashboard, repeated rounded cards, decorative clutter, or merely recoloring standard forms.
- Previously generated concept images are creative references, not final specifications; they are not bundled with this handoff. Work from the existing application and this direction. Ask for a reference only if it is actually needed.

### Latest feedback: three priorities

1. **Mobile is a primary use case.** Design small screens first, then extend to desktop. A narrow desktop layout is insufficient.
2. **Magical realism is still too faint.** Cover shine and isolated sparkles have not fulfilled the original concept. Establish a restrained, recognizable interaction language connected to the reader's actions.
3. **Improve the whole journey.** Access, registration, library, search, adding, editing, and book details should share the same care and identity.

Possible motifs, not mandatory features: a small ink trace when a note is saved, a bookmark for an ongoing reading, or a restrained constellation accompanying a personal quotation. Use a coherent motif where it adds meaning. Do not add random particles, intrusive animation, or heavy effects. Support `prefers-reduced-motion` and convey state without relying on animation.

## Skills requirement

The project owner explicitly wants skills used to improve frontend quality. Requested resource:

- Catalog: https://skill-issue.in/?domain=frontend
- MCP endpoint: https://skill-issue.in/api/mcp
- Command previously supplied: `claude mcp add --transport http skill-issue https://skill-issue.in/api/mcp`

### Explicit authorization to install and use skills

the project owner authorizes Codex to independently select, install for its own use, and apply the most suitable frontend skills from the catalog above to improve the entire platform progressively. This is an implementation instruction, not merely a suggestion to consult the catalog. Do not ask the project owner to choose each skill or repeat approval for routine installation within this scope.

- Read the local skill installation/creation guidance and inspect the actual Codex skills/MCP configuration first. Use the supported Codex installation mechanism and persistent user skill location; do not assume Claude configuration applies to Codex.
- Inspect the catalog and the underlying source/instructions before selecting skills. Prefer a small, complementary set covering visual direction, editorial typography/layout, mobile/responsive interaction, accessibility, motion, and browser verification. Use security/privacy guidance where relevant, but do not treat frontend skills as legal authority.
- Review source provenance, dependencies, permissions, and installation steps. Install relevant instruction packages without blindly executing downloaded scripts, exposing credentials, disabling protections, or replacing unrelated existing skills/configuration. Do not commit machine-local skill installations into the product repository unless an intentional project-level setup is appropriate.
- Install and read the chosen skills, verify that Codex can discover them, and apply their workflows to actual design and implementation. If activation needs a new session, state exactly what is installed and the minimal restart/resume step; never claim an inactive skill has been used.
- Briefly record selected skills, source/version where available, intended purpose, and installation/activation status. Avoid dumping entire skill contents into the conversation or adding redundant skills that waste context.
- Use the relevant installed skills again as subsequent sections are improved, not only for the first screen. Keep Tinteruna’s established identity, mobile priorities, privacy, and existing functionality as the design constraints. Skill defaults do not override the project owner’s decisions.
- If the catalog or an individual source is inaccessible, report the specific limitation, use relevant already available skills, and continue independent work. Do not fabricate catalog entries or claim installation succeeded without verification. Broader integrations, paid services, and unrelated global configuration changes are outside this installation authorization.

The previously supplied `claude mcp add` command configures Claude tooling; it does not establish a Codex connection. Prior sessions could not access this catalog and did **not** use its skills. This terminal continuation must check availability afresh rather than inherit that limitation as a permanent fact.

## Product launch readiness: privacy, security, and legal experience

The project owner explicitly requires privacy and security to be central to preparing Tinteruna for public use as a product, including privacy notices, terms of use, and related user controls. This is a release requirement alongside the design work, not a footer-only task. Prior technical checks do not establish legal compliance or complete security.

### Start with an evidence-based assessment

- Before expanding the public launch, inventory personal data, reading records, notes, quotations, account identifiers, cookies/local storage, server logs, analytics, error reporting, and actual data flows. Treat personal reading notes as private user content. Identify purposes, necessity, recipients, storage locations, retention, deletion, and backups.
- Inspect actual integrations (Supabase, Vercel, book metadata/cover providers, and the configured email provider). Verify the current email setup rather than assuming Brevo is active. Include externally hosted fonts/images and whether requests disclose IP addresses or search queries. Minimize third-party disclosures and never transmit private notes to providers without a justified, clearly disclosed feature.
- Establish intended markets, operator identity/contact, audience/age policy, and whether minors are admitted. Do not assume Colombian law alone applies merely because the project owner is in Colombia. Ask for missing facts only where they change implementation or legal drafting.
- Use current authoritative regulator/legal sources and official provider documentation to determine applicable obligations. Separate verified requirements, applicability questions, implementation recommendations, and points needing qualified legal review. Do not promise universal compliance or absolute security.
- Produce a concise launch-readiness checklist in repository documentation: finding, evidence, severity/priority, required action, validation, status, and unresolved decision. Keep exploit details and secrets out of public documentation.

### Privacy documents and working user controls

- Prepare Spanish, plain-language privacy and personal-data-processing notices, terms of use, and cookie/storage information as applicable to the verified product and markets. Repository technical documentation remains in English. Include document versions/effective dates and visible links before registration and in appropriate navigation.
- Disclose only verified practices: operator/contact, data categories, purposes and applicable legal grounds, providers/recipients, international processing where relevant, retention/deletion, user rights and request process, account closure, and policy changes. Do not invent an address, retention period, legal basis, provider contract, or capability. Mark unresolved drafts clearly and resolve placeholders before publication.
- Explain account responsibilities, acceptable use, user ownership of notes, the limited permissions needed to operate the service, third-party book metadata/covers, service limitations, suspension/closure, and a contact process. Avoid claiming ownership of users’ writing or third-party artwork.
- Separate terms acceptance from any privacy consent required by applicable law. Make optional analytics/marketing choices genuinely optional and granular; do not bundle them into service access or assume a notice acknowledgment is consent. Record consent or terms acceptance/version only where required and necessary.
- Implement usable access/correction, export, deletion/account closure, and consent withdrawal workflows as applicable. Disclose any justified retention or backup delay accurately. Verify deletion across relevant systems without deleting other users’ records. Never run destructive lifecycle tests against the project owner’s real account.
- Audit actual cookies and similar storage first. Add a consent mechanism only where the technologies and applicable law require it; do not add a decorative cookie banner or introduce analytics just to support one.
- Make all notices and controls accessible and comfortable on mobile, consistent with Tinteruna’s identity. Privacy choices must remain clear and free of manipulative design.

### Security validation and operational readiness

- Verify current authentication/session handling, recovery, email confirmation, logout, authorization on every relevant endpoint, RLS for every user-owned table/function/storage path, cross-account CRUD isolation, and anonymous access boundaries.
- Review input validation, stored/reflected XSS in notes or metadata, CSRF where applicable, open redirects, secure cookies/headers/CSP, dependency vulnerabilities, secret handling, and search/cover abuse controls. Validate cover fetching against SSRF, unsafe protocols, private-network targets, redirects, response type/size, and timeouts while preserving legitimate image-provider diversity.
- Check logs and error responses for personal data/secrets; minimize collection and define retention. Verify least-privilege operational access, backup/recovery arrangements, an incident response/contact process, and applicable breach-notification requirements. Do not fabricate operational guarantees.
- Use isolated test data and accounts; no intrusive production scans or destructive tests. Add meaningful regression checks for security fixes. Distinguish local evidence from checks that require dashboard/provider access.
- Identify launch blockers and resolve or explicitly report them before recommending public launch. Provide evidence and residual limitations; a successful build or a generated legal page is not a security/compliance certification.

### Delivery order and scope

Begin with a bounded privacy/security gap assessment alongside the UI baseline. Address confirmed critical exposure before cosmetic work, then continue mobile search/add improvements and implement the verified privacy/legal controls in separate reviewable increments. Backend/schema changes are authorized when necessary for a demonstrated privacy/security requirement; inspect impact, use safe migrations and targeted tests, and explain them. Preserve production data and do not change live infrastructure, publish unfinished legal text, or deploy automatically. Unknown operator details or jurisdiction decisions should not block independent technical assessment.

## Next implementation: mobile book discovery and addition

This was the proposed next sequence when the conversation moved to terminal Codex. the project owner's latest request is to continue from this context, with skills and less token overhead. First inspect the current search/add flow and implement a coherent, reviewable increment.

### First pass: establish the baseline

- Read repository instructions, package scripts, routing, design tokens, relevant components, and existing tests.
- Inspect `git status`, branch, and recent history; fetch/fast-forward only when safe. Never overwrite local work.
- Trace search → results → edition selection → add form → successful save → library/detail, including manual cover entry and duplicate handling where implemented.
- Run the application using existing configuration without exposing secrets. Identify available authenticated testing paths; never bypass authentication or weaken RLS for screenshots.
- Briefly state findings and concrete files/changes before editing. Do not spend a turn restating the entire plan or require a new design approval for routine work.

### Implement the first increment

- Make search and adding comfortable on a phone: clear primary action, sensible content order, usable controls with the keyboard open, no horizontal overflow, and no actions hidden behind overlays.
- Give results an editorial Tinteruna composition with readable titles/authors and useful edition information. Preserve existing provider behavior and available metadata; do not invent missing book facts.
- Handle initial, loading, no-results, error/retry, selection, saving, and success states explicitly. Prevent accidental duplicate submissions and preserve input after recoverable errors.
- Keep manual cover URLs from varied image providers supported through the existing secure server flow. `gstatic.com` was only an example, never the intended exclusive provider.
- Consider the optional prompt **“¿Qué te hizo elegir este libro?”** when adding a book, using existing notes if it fits the data model. Do not overwrite existing notes or require the user to write.
- Introduce one meaningful, light magical-realism detail in this journey, consistent with existing brand assets. Prioritize a polished static composition over animation.
- Preserve all existing filters, sorting, goals, metadata editing, reading states, and decimal scores.

### Continue after that increment

1. Review access/registration/confirmation as a coherent mobile welcome experience.
2. Refine library and book detail on mobile, especially “Tu huella”, notes saving, reading-state actions, and emotional composition.
3. Extend the system to remaining forms/settings/empty states discovered in the repository.

Do not rewrite every section in one large commit. Use shared primitives when they reduce inconsistency without broad regressions.

## Security and production invariants

Previous checks reported: account isolation for books and goals; another account receives 404 for private book URLs; logout blocks private detail; anonymous book-search/cover endpoints are blocked; email confirmation is enabled. Preserve and revalidate relevant boundaries when touched.

- Keep Supabase RLS, per-user ownership, authentication, server-side API protections, and rate limits intact.
- Never expose Google Books keys, Supabase privileged credentials, SMTP credentials, or `.env` values in output, commits, or client bundles.
- Do not change schema, policies, SMTP, auth callbacks, or deployment settings merely to improve UI.
- Web brand assets were separated from `supabase/functions/_shared/brand.js`; changes under `supabase/functions/` can trigger email-function deployment. Keep this frontend iteration outside that scope unless explicitly justified.
- Earlier SMTP setup is not a pending task in this handoff. Do not restart it from older chat context.

## Acceptance and verification

- Check approximately 360–390 px phone widths, a wider phone/tablet, and desktop using available browser tooling; ensure long titles, missing covers, and empty lists are usable. Check short viewport heights and keyboard interaction when possible.
- Check keyboard focus, visible labels, accessible names, contrast, touch targets, error association, and reduced motion.
- Verify the full search/add flow with a signed-in account when available, including save persistence and return to the catalog. Do not claim authenticated success from an anonymous smoke test.
- Verify inline notes persist and unrelated fields stay intact if changing that code.
- Run repository-defined checks appropriate to the change: build, type checking, lint if configured, and relevant existing tests. Add targeted tests for meaningful new behavior rather than CSS snapshots or tests that mirror markup.
- Fix failures introduced by the changes. Distinguish pre-existing failures and unavailable credentials/tooling.
- Review the diff for scope, unintended backend edits, secrets, and accessibility regressions before committing.

## Completion report

In Spanish, concisely describe what changed, how it was verified, any unverified authenticated/mobile behavior, and the English Conventional Commit SHA/message. State whether changes are local, pushed, or deployed accurately. Continue autonomous implementation within this scope; do not end with only advice or a proposed plan.
