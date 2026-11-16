# Frontend skills and design decisions

On 2026-11-10 the Skill Issue MCP at `https://skill-issue.in/api/mcp` responded to `initialize`, `tools/list`, `recommend_skills` and `get_skill`. It was registered in personal Codex configuration using `codex mcp add skill-issue --url https://skill-issue.in/api/mcp`.

The upstream instruction files were reviewed before installation. The Codex skill installer downloaded the following pinned packages into the personal `~/.agents/skills` directory. Their installed `SKILL.md` files were read and applied during the frontend increment, and the skills are discoverable in this environment. The server registration and downloaded packages are machine-local.

| Skill and source | Revision | Application |
| --- | --- | --- |
| [frontend-design](https://github.com/anthropics/skills/tree/2c5958ecac7cee2b583967a2c4981d0f4a75c579/skills/frontend-design) | `2c5958e` | Use the existing Fraunces/Inter typography and Tinteruna palette. Let book titles and covers lead edition selection. Tie the bookmark confirmation to saving. |
| [responsive-design](https://github.com/wshobson/agents/tree/9c61ab243def98f72da12abd41cfcf5bcd91af9d/plugins/ui-design/skills/responsive-design) | `9c61ab2` | Single-column phone forms, large touch controls, wrapping titles, page scrolling and optional detail disclosure. |
| [webapp-testing](https://github.com/anthropics/skills/tree/2c5958ecac7cee2b583967a2c4981d0f4a75c579/skills/webapp-testing) | `2c5958e` | Python Playwright, rendered-DOM inspection, keyboard behavior and screenshots in an isolated component harness. |

The instruction packages need no product credentials or runtime integrations. Playwright and esbuild were installed into a temporary verification directory. The browser harness imports the actual changed components with a fixture save boundary, independently of the protected application. This establishes component behavior and responsive layout. It does not establish live authenticated persistence. Existing Supabase, React review and full-flow verification skills also informed the security and implementation review.

The design keeps ink green `#253D33`, paper `#F5EDE0`, ink `#252822`, gold `#B69A62` and terracotta `#A65C4B`. Search, edition choice and personal details follow the reader's actions in one column. Optional details remain accessible in a native disclosure. The confirmation bookmark has a static shape and respects reduced motion.

The Google Books attribution graphic in `public/attribution/google-books-poweredby.png` comes from `https://books.google.com/googlebooks/images/poweredby.png`, referenced by the [official branding guidelines](https://developers.google.com/books/branding). It is served locally at its original 62 × 30 size. Edition links open the provider page only when activated by the reader.

## Literary identity increment — November 10, 2026

The second Skill Issue consultation used `recommend_skills` and `search_skills` to select additional guidance. Packages were inspected before installation with the Codex skill installer, pinned to the following upstream revisions and installed only in the personal skills directory:

| Skill and source | Revision | Application |
| --- | --- | --- |
| [Impeccable](https://github.com/pbakaus/impeccable/tree/fead7938331bb92129e3c5ce14f600611067bd06/.agents/skills/impeccable), version 4.8.2 | `fead793` | Context inspection, craft and critique guidance, followed by the mechanical design detector. Existing project documents supply the brief; no repository hooks or product integrations were installed. |
| [Testing for XSS vulnerabilities](https://github.com/mukul975/Anthropic-Cybersecurity-Skills/tree/54a798831d2266a3ca61ce68a7acb80b81160d57/skills/testing-for-xss-vulnerabilities), version 1.0.0 | `54a7988` | Trace untrusted text to React rendering, then verify inert markup in the public demo and an isolated private-note fixture. This is a community collection, not an official Anthropic package. No production scanning or offensive tooling was used. |

Frontend-design, responsive-design and webapp-testing were reused. The React review checklist informed component, state, accessibility and client/server boundary review. Skill instructions were treated as guidance within the authorized scope; no unrelated setup, marketing copy or approval workflow was added.

### Design contract

- Keep the established forest, ivory, ink, gold and terracotta palette and Fraunces/Inter typography. Use generous type, quiet rules, book bindings and writing surfaces rather than interchangeable dashboard tiles.
- Express magical realism through an original landscape emerging from an open book, a river of ink and a paper canoe carrying a flower. Reuse the illustration on the welcome, access, library opening and empty library. Keep the work of reading and writing visually dominant on detail screens.
- Tie the small ink/leaf confirmation to successful note saving. Support reduced motion and avoid continuous effects that compete with reading.
- Put the story and an interactive preview before registration. The preview uses only React memory, makes no save request and writes no browser storage. Refreshing or leaving clears it; this limitation is stated beside the preview.
- Keep private library controls familiar: visible reading states, a labelled search, optional advanced filters, current-reading continuation, annual goals and recoverable edits. Preserve decimal scores and independent reading-state changes.
- Use large touch controls, visible keyboard focus, wrapping titles, accessible password reveal and explicit loading/error/success states. Mobile access places the form first; mobile library navigation includes safe-area spacing and returns to document flow in short viewports.
- Keep operator configuration private and existing authentication, ownership checks, cover proxy and exports intact. The public home publishes no personal contact values or unfinished legal drafts.

### Original illustration

Saved asset: [reading-river.webp](../../public/brand/reading-river.webp), 1536 × 1024, 392,668 bytes. Generated with the imagegen tool and encoded locally as WebP using Sharp. It introduces no external image request. Next.js serves responsive image variants; the hero image is preloaded. This is generated artwork, not a historical photograph or a claim about a specific place.

Final generation prompt:

> Create one production-ready landscape illustration, approximately 3:2, for TINTERUNA, a Colombian Spanish-language private reading journal. Art direction: extraordinary magical realism with tactile fine-art editorial quality, a painstakingly hand-painted gouache / oil-on-paper illustration, subtle scanned paper grain, restrained natural lighting, refined sophisticated warm-ivory and very dark forest-green with small terracotta-orange and aged-gold accents. Scene: on an old reader's writing table, an open ivory book with a dark green cloth binding. Its pages physically unravel into a winding dark ink river that flows toward the foreground through a small lush Andean riverside landscape growing from the margins. One tiny folded paper canoe carries a single terracotta-orange flower downstream. Sparse delicate fern and ceiba-like leaves, a few small orange butterflies, a quiet moon partially hidden in a very deep green forest. Everyday reality and impossible landscape merge convincingly, intimate literary wonder. Composition: very large open book near the lower-middle/right, river clearly readable and winding down toward lower-left, surrounding foliage provides beautiful dark framing and breathing room in upper-left. Rich deep forest background all the way to edges, sculptural cream paper pages, lovely detailed composition at small mobile crop as well as desktop. Elegant art made for an independent literary publisher. Avoid text, typography, logos, UI, computer screens, stock clipart, 3D toy look, neon glows, excessive sparkles, generic fantasy castles, floating book piles and photorealistic humans. All visual storytelling, no letters, no words. This is an original image to be used in the project as a hero illustration.

### Verification boundaries

Production anonymous pages and isolated actual private components were checked at 360, 390, 768 and 1440 px. Playwright exercised the journal preview, access forms, library filters and annual goals, all four reading states, note-save failure/retry and confirmation, plus responsive addition and data pages. Axe reported zero findings in the checked views. The mechanical detector found one existing thick cover border, which was reduced. Inert markup remained text without script execution. These checks establish rendered behavior with fixture action boundaries; they do not establish real authenticated persistence, legal readiness or physical-device usability.

## Reading dashboard prominence — November 14, 2026

The owner requested the official shadcn/ui skills as the primary guidance for this increment. The relevant [shadcn skill](https://github.com/shadcn-ui/ui/tree/e62c9435fff729a175f38983dee73b2cb4f6a069/skills/shadcn) was inspected and installed in the personal skills directory, pinned to `e62c9435fff729a175f38983dee73b2cb4f6a069`. The repository's Radix-to-Base migration skill was not applicable to this existing application. Frontend-design, responsive-design and Impeccable supplied supporting review; agent-browser supplied the initial rendered inspection and Playwright covered asynchronous cases.

The diagnosis was structural: the annual dashboard appeared after the entire catalog on mobile and in a narrow sidebar on desktop. The revised reading order is:

```text
Library heading
Reading rhythm + year
Annual goal | Continue the current book   (stacked on phones)
Completed-reading metrics
Catalog search, filters and books
```

The large library banner was replaced by a compact heading. The existing ink-river artwork now frames the next-reading action. Forest, ivory, terracotta and the existing Fraunces/Inter typography remain authoritative. Goal progress uses real completed-book counts, with supportive copy for the first book, remaining books, completed goals and previous years. The next-reading action prefers a book being read, then a pending book, then discovery. Opening a suggested book does not change its reading state. The next-reading choice is independent of the selected statistical year and catalog filters.

Official CLI `4.23.0` inspected the Next.js/Tailwind v4 project and generated the Radix components through `add` after a dry run and source review. `components.json` records this incremental integration using the existing stylesheet and aliases. No full preset, font or application initialization was applied. The incorporated primitives are Button, Progress, Field, Input, NativeSelect, Skeleton and Alert, with Label/Separator dependencies. [The upstream MIT notice](shadcn-license.txt) accompanies the source. Runtime dependencies are `cn` 0.5.2, `radix-ui` 1.8.1 and the explicitly declared `class-variance-authority` 0.7.1; the lockfile records their dependency tree.

Semantic shadcn colors map to Tinteruna's existing variables on the body, where the brand variables are defined. Component variants use those tokens. Used buttons and form controls have 48 px targets, input text remains 16 px, and loading/progress animation respects reduced motion. The progress wrapper passes its value to Radix so its accessible state matches its visual fill. The annual goal editor supports cancellation, restores focus after closing, preserves drafts on failure and locks the year while saving. Failed goal loads offer retry instead of presenting an unknown goal as absent; obsolete responses from another year are ignored.

Browser verification used actual components with fictional data and fixture action boundaries at 320, 360, 390, 768, 1024 and 1440 px. Checks covered ordering before the catalog, goal editing/cancellation/error/retry, out-of-order year responses, no goal, achieved/exceeded goals, pending-book fallback, empty libraries, long unbroken content, large values, zero scores, broken covers, short viewports and reduced motion. Axe reported zero findings in the checked views; the scoped mechanical detector also returned no findings. These results do not establish authenticated persistence or physical-phone usability.

## First-reader corrections — November 14, 2026

Applied multiple relevant skills: official shadcn guidance for the reviewed Checkbox/Field composition; frontend-design and responsive-design for the existing literary identity and mobile targets; Impeccable for Operate/Read clarity and visual review; Supabase for session/owner boundaries; browser-testing guidance for real journeys and fixtures; and Vercel React/environment guidance for component review and private runtime configuration. Existing reviewed installations were reused. The shadcn CLI added Checkbox incrementally; the existing MIT attribution covers it. No preset, font or brand replacement was introduced.

Public documents use a readable 70-character measure, dynamic server-only contact configuration and accessible links. Access and manual-entry controls preserve the forest/ivory identity, 48 px targets and 16 px inputs. Acceptance labels wrap as inline text inside the Field label rather than splitting the linked phrase into competing flex items. Recovery/resend provide conditional feedback and an explicit cooldown; completion explains the connection between reading year and annual progress.

The updated views passed 320/390/768/1440 px layout and axe checks; the mechanical detector returned zero findings. A local production build using isolated real Supabase access additionally verified goal acknowledgement after RSC refresh, manual-book creation/completion/reload/export and password change with a subsequent sign-in. Mail-request fixtures do not establish inbox delivery or recovery-link consumption. The account and its records were removed. Physical-device and post-publication checks remain open.

## Free authentication protection — November 15, 2026

Reused shadcn Alert/Button and the existing access layout for Turnstile feedback and retry. The compact Spanish widget fits the 320 px reading scene; forms preserve their input after failures and reset tokens after each request. No new preset, illustration, font or visual identity was introduced. Responsive, Impeccable, React and browser guidance supported the review.

Installed the official Cloudflare `turnstile-spin` skill at `cbf893b954222276bf1af57e5f23379231e0efb9` and registered/authenticated the official MCP as requested. New tools require a Codex reload; installation/OAuth are not proof of a created widget. The integration adapts the skill's single-use-token contract to Supabase's existing provider validation, forwarding tokens exactly once rather than redeeming them twice. Pinned `@marsidev/react-turnstile` 1.6.3 is an MIT runtime dependency. Four-width fixture browser/axe checks and a scoped detector pass returned zero findings; the mobile synthetic signup was visually inspected. Real widget/provider verification remains pending, as recorded in [authentication operations](../operations/auth-abuse.md).
