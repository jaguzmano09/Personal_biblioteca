# Frontend skills used for this increment

On 2026-11-10 the Skill Issue MCP at `https://skill-issue.in/api/mcp` responded to `initialize`, `tools/list`, `recommend_skills` and `get_skill`. It was registered in personal Codex configuration using `codex mcp add skill-issue --url https://skill-issue.in/api/mcp`.

The upstream instruction files were reviewed before installation. The Codex skill installer downloaded the following pinned packages into the personal `~/.agents/skills` directory. Their installed `SKILL.md` files were read and applied during this session. Codex can discover this directory automatically on the next turn. The server registration and downloaded packages are machine-local.

| Skill and source | Revision | Application |
| --- | --- | --- |
| [frontend-design](https://github.com/anthropics/skills/tree/2c5958ecac7cee2b583967a2c4981d0f4a75c579/skills/frontend-design) | `2c5958e` | Use the existing Fraunces/Inter typography and Tinteruna palette. Let book titles and covers lead edition selection. Tie the bookmark confirmation to saving. |
| [responsive-design](https://github.com/wshobson/agents/tree/9c61ab243def98f72da12abd41cfcf5bcd91af9d/plugins/ui-design/skills/responsive-design) | `9c61ab2` | Single-column phone forms, large touch controls, wrapping titles, page scrolling and optional detail disclosure. |
| [webapp-testing](https://github.com/anthropics/skills/tree/2c5958ecac7cee2b583967a2c4981d0f4a75c579/skills/webapp-testing) | `2c5958e` | Python Playwright, rendered-DOM inspection, keyboard behavior and screenshots in an isolated component harness. |

The instruction packages need no product credentials or runtime integrations. Playwright and esbuild were installed into a temporary verification directory. The browser harness imports the actual changed components with a fixture save boundary, independently of the protected application. This establishes component behavior and responsive layout. It does not establish live authenticated persistence. Existing Supabase, React review and full-flow verification skills also informed the security and implementation review.

The design keeps ink green `#253D33`, paper `#F5EDE0`, ink `#252822`, gold `#B69A62` and terracotta `#A65C4B`. Search, edition choice and personal details follow the reader's actions in one column. Optional details remain accessible in a native disclosure. The confirmation bookmark has a static shape and respects reduced motion.

The Google Books attribution graphic in `public/attribution/google-books-poweredby.png` comes from `https://books.google.com/googlebooks/images/poweredby.png`, referenced by the [official branding guidelines](https://developers.google.com/books/branding). It is served locally at its original 62 × 30 size. Edition links open the provider page only when activated by the reader.
