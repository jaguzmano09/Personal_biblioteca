# Tinteruna

A private reading journal and personal book catalog built with Next.js, React and Supabase. The interface is in Spanish; this documentation is in English.

Start with the [documentation index](docs/README.md) for operational guides and design/privacy decisions. [Platform progress](docs/project/progress.md) records completed increments, verification and pending work.

Users can discover books through Google Books, maintain their own catalog, record reviews and reading dates, and track annual reading goals. Public registration does **not** make anyone's library public.

## Features

- An illustrated public welcome with Tinteruna's story and a temporary, browser-only reading journal preview.
- A shared literary identity across access, library, reading notes and data controls, with mobile navigation.
- Email/password registration, email confirmation and cookie-based sessions.
- Private book creation, editing and deletion.
- Google Books search by title, author or ISBN, with a server-side API key.
- Reading states: pending, reading, completed and abandoned.
- Scores from 0 to 10, personal analysis, favorite characters and quotations.
- Reading year/month, physical/digital format and book provenance.
- Catalog search, filters, sorting and incremental display of 50 books.
- Annual goals and statistics based **only on completed books** in the selected year.
- A protected data page with a private JSON export of books, notes, quotations, goals and basic account identity.

## Stack and requirements

| Technology | Purpose |
| --- | --- |
| Next.js 16 / React 19 | App Router, server rendering and UI |
| TypeScript (strict mode) | Application types |
| Tailwind CSS 4 / Lucide | Styling and icons |
| Supabase Auth / PostgreSQL | Identity, persistence and row-level authorization |
| Google Books API | Book discovery and metadata |
| Node test runner / PGlite | Validation and PostgreSQL security regression tests |

Use **Node.js 22.18+** (or a newer supported LTS) and npm. Node's built-in TypeScript stripping runs the tests. A Supabase project is required to run authenticated functionality. A Google Books API key is optional for development but recommended for a public deployment.

## Quick start

```bash
git clone https://github.com/jaguzmano09/Personal_biblioteca.git
cd Personal_biblioteca
nvm use
npm ci
cp .env.example .env.local
```

Fill in `.env.local`, apply the database migration described below, then start:

```bash
npm run dev
```

Open http://localhost:3000.

### Environment variables

All settings used by this application are **server-only**. Do not add `NEXT_PUBLIC_` variants.

| Variable | Required | Description |
| --- | --- | --- |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase `anon` JWT or publishable key; RLS must be active |
| `SITE_URL` | Yes | Exact application origin, e.g. `https://example.com`; no path/query |
| `GOOGLE_BOOKS_API_KEY` | Recommended | Google Books API key used only by the server |
| `TINTERUNA_OPERATOR_NAME`, `TINTERUNA_PRIVACY_EMAIL` | For the data-page contact | Operator identity and privacy/support channel, configured privately |
| `TINTERUNA_OPERATOR_CITY`, `TINTERUNA_OPERATOR_ADDRESS`, `TINTERUNA_OPERATOR_PHONE` | For preparing legal notices | Operator contact details, configured privately |

Never use `service_role` or an `sb_secret_` key in this application. Privileged keys can bypass RLS. Configuration rejects known privileged key formats. HTTP is accepted for `SITE_URL` only on localhost/127.0.0.1.

## Database setup and migration

The schema and authorization rules are versioned in:

1. [`202611080001_public_launch.sql`](supabase/migrations/202611080001_public_launch.sql) — base schema and account isolation.
2. [`202611080002_manual_covers.sql`](supabase/migrations/202611080002_manual_covers.sql) — provider-independent cover storage and authenticated image-proxy quota.

The initial migration supports a new project or the existing `libros`/`metas_lectura` schema documented by the original project. It is a **one-time migration**, not a script to repeatedly paste into production.

1. Back up the existing database and test the migration on a staging copy.
2. Inspect legacy rows for duplicate `(user_id, google_books_id)` pairs, orphaned owners, invalid scores/dates and oversized text. Resolve them deliberately before migrating. No records or stored cover URLs are deleted or rewritten to pass validation.
3. Run both SQL files **in order** in the Supabase SQL Editor as the database owner. If the original 001 failed on `libros_values_valid`, issue `ROLLBACK`, retry the corrected 001 from this revision, then run 002. If 001 already completed successfully, run only 002. Alternatively, apply it using your established Supabase CLI migration workflow. Project configuration is in `supabase/config.toml`, with local CLI linkage stored under the ignored `supabase/.temp/` directory.
4. Confirm the transaction committed successfully and the new policies, constraints and `consume_book_search()` function exist.
5. Deploy the matching application code **after** the migration.
6. Test with two real accounts and an anonymous client as described in the [deployment guide](docs/operations/deployment.md).

The migration is transactional: incompatible legacy data causes it to abort. If the SQL Editor leaves a failed transaction open, issue `ROLLBACK` before correcting data and retrying. Existing custom tables or additional exposed schemas require their own review.

### What the migration enforces

- RLS is enabled and forced on both application tables.
- Anonymous clients have no table access.
- Authenticated clients can select, insert, update and delete only their own rows.
- Update policies check both the existing and resulting owner.
- Legacy policies on these two tables are removed so old permissive policies cannot override isolation.
- Ownership, creation timestamps and record identities cannot be reassigned through ordinary updates.
- Owner foreign keys cascade on account deletion from Supabase Auth.
- Scores use `numeric(3,1)`, including `10.0`; ranges and field lengths are constrained.
- Google Books IDs are unique **per user**; annual goals are unique per user/year.
- `updated_at` is maintained by database triggers.
- A private table supports an atomic search quota shared across application instances.

## Privacy and security model

The application verifies the session for every data operation, applies an explicit owner filter, and validates incoming fields at runtime. PostgreSQL RLS remains the authoritative boundary for direct database API access. TypeScript types and protected pages alone are not authorization.

Book updates accept only the personal reading fields and the cover URL. Submitted ownership, IDs, metadata and timestamps cannot overwrite protected fields. Errors shown to users do not include database/provider details. Session refresh cookies are retained on redirects, and session-dependent responses use `private, no-store`.

Google Books search requires authentication. Each account can make **20 searches per minute**, with a maximum of 20 results and query length of 2–200 characters. The quota is stored in PostgreSQL, not process memory, and search fails closed if the limiter is unavailable. Upstream requests time out after eight seconds. This is an account-level control; configure edge-level abuse protection and Google quota limits before launch.

Manual cover URLs can point to any public image provider, including Google image thumbnails on `encrypted-tbn0.gstatic.com`. Stored URLs remain unchanged. New URLs must use HTTP/HTTPS without embedded credentials or nonstandard ports. All rendered covers use the authenticated `/api/covers` endpoint: the visitor's browser contacts this application, and the application retrieves the image. Providers receive the server's IP rather than the visitor's IP; no visitor cookies or referrer are forwarded. The image itself is re-encoded as JPEG without original metadata; the stored original URL is preserved.

The proxy checks all resolved IP addresses and each redirect, blocks internal/special destinations, and pins outbound connections to a vetted IP while preserving the original Host/TLS name. Downloads are limited to 5 MiB, eight seconds and three redirects; JPEG/PNG/WebP/GIF input is decoded within a 16-million-pixel limit and a three-second processing timeout. HTML, SVG and other unsupported content are rejected. Images are resized to fit 800 × 1200 and served as private, noncached JPEG responses. There is a separate shared quota of 120 image requests per account per minute. Unsupported/unavailable images fail without changing the stored URL. External links can expire or block server downloads; use direct image URLs rather than webpage/search-result URLs. Google receives book-search queries from the server. Supabase and the hosting provider process authentication/application traffic. Personal reviews and quotations are not sent to Google Books.

Security headers disable framing, MIME sniffing, camera/microphone/location permissions and referrer disclosure. The CSP currently restricts framing, objects, base URLs and form destinations; it is **not a complete nonce-based script CSP**.

Do not log passwords, tokens, search queries or reading notes. Define your public privacy notice, retention/deletion process and support contact before accepting public users. Account export is available through the protected data page. Account closure and password recovery still require complete user workflows and operational verification. See [privacy readiness](docs/security/privacy-readiness.md) for the current findings and [legal drafts](docs/legal/drafts.md) for publication work.

## Architecture

```text
src/
  app/
    (auth)/                    Login and registration pages
    (protected)/biblioteca/    Catalog, add-book, detail and data pages
    api/account/export/        Private JSON export
    api/auth/callback/         Email confirmation callback
    api/google-books/          Authenticated, rate-limited search
    api/covers/                Authenticated image intermediary
  components/
    auth/                      Authentication forms
    libros/                    Catalog, dashboard and reading forms
    privacy/                   Data export and contact interface
  hooks/useDebounce.ts
  lib/
    auth.ts                    Authentication server actions
    session.ts                 Verified-user requirement
    libros.ts                  Owner-scoped book operations
    metas.ts                   Owner-scoped annual goals
    validation.ts              Runtime input validation and field allowlists
    statistics.ts              Completed-reading calculations
    googleBooks.ts             Single external metadata integration
    covers.ts                  Same-origin image URLs
    cover-proxy.ts             SSRF-protected fetching and raster re-encoding
    supabase/                  Server client and configuration
  proxy.ts                     Session refresh and navigation protection
supabase/migrations/           PostgreSQL schema, RLS, triggers and search quota
tests/                         Validation and database isolation tests
```

## Verification

```bash
npm test
npm run build
npm run typecheck
npm run test:smoke
npm start
```

The tests run PostgreSQL through PGlite without production credentials. They emulate Supabase's roles and `auth.uid()` JWT subject while executing the actual migration and RLS rules. Coverage includes account isolation, anonymous denial, owner spoofing, immutable identities, constraints, duplicate prevention, search quotas, legacy-policy replacement, input allowlists and completed-reading metrics.

These checks do not replace staging tests against Supabase Auth, PostgREST and your real deployment. A production smoke test also verifies anonymous route/API denial, callback errors and security headers using local placeholder settings. CI runs tests, production build, type checking and smoke checks on pull requests and pushes to `main`.

## Deployment

For optional authentication email delivery through the Brevo HTTP API instead of SMTP, see
the [authentication email guide](docs/operations/auth-email.md). The function and signed Auth hook require separate
Supabase deployment/configuration; merging this repository does not activate email delivery.

Use a Node-compatible Next.js host such as Vercel. Configure server environment variables, apply the migration, and configure Supabase Auth's Site URL and exact confirmation callback URL:

```text
https://your-domain.example/api/auth/callback
```

Enable email confirmation, configure production delivery and appropriate Auth rate limits/password requirements. See the [deployment guide](docs/operations/deployment.md) for release checks and operational requirements. This repository does not automatically change your Supabase or hosting account settings.

## Current boundaries

- Books are fetched in bounded batches to avoid Supabase's response cap; the full per-user catalog is still loaded for local filtering/statistics. Large catalogs will eventually require server-side pagination and aggregate queries.
- Social/public-library sharing, recommendations and self-service account closure remain future work.
- Reading history records one reading year/month per book, not multiple rereads.
- Application strings remain in Spanish.
