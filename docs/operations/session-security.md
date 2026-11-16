# Server-owned session cookies

Implemented November 15, 2026. The web application uses Supabase only from server code: browser components call Server Actions or same-origin route handlers. No browser Supabase client needs to read session tokens.

`sessionCookieOptions()` in `src/lib/supabase/config.ts` supplies the same policy to both `src/lib/supabase/server.ts` and `src/proxy.ts`:

| Option | Policy |
| --- | --- |
| HttpOnly | Always enabled for session and PKCE cookies |
| Secure | Enabled for the validated HTTPS `SITE_URL`; HTTP remains allowed only for localhost/127.0.0.1 |
| SameSite | Lax, preserving external email-link navigation |
| Path | `/` |
| Domain | Omitted, keeping cookies host-only |
| Expiry/deletion | Owned by the installed SDK, including chunk cleanup and Max-Age=0 on removal |

The existing SDK cookie names are preserved. No tokens are added to client props or browser storage. Supabase session validation, refresh rotation and owner-scoped authorization are unchanged. HttpOnly reduces JavaScript token access; it does not replace XSS/CSRF protection or authorization. Reassess this contract before introducing any browser Auth client.

## Verification

- Regression tests use the installed SSR SDK with fixture HTTP boundaries to exercise PKCE verifier creation/exchange, chunked session cookies, validated user retrieval, refresh and removal. Every emitted cookie, including deletion cookies, has the expected security flags. Invalid remote HTTP origins are rejected; local development remains supported.
- A local production build was served through a local HTTPS test proxy with a temporary certificate and a dedicated confirmed account in real Supabase. Browser login produced Secure/HttpOnly/Lax host-only cookies, which JavaScript could not read. Reload and owner export succeeded. Altering only this synthetic account's local serialized expiry forced proxy refresh; refreshed cookies retained their flags and access survived another reload. Logout removed the session cookies and anonymous export returned 401. An invalid recovery callback showed expired-link guidance without creating a session.
- The temporary account and its sessions/data were removed; follow-up counts were zero, with the two original accounts retained. Private QA credentials and the temporary TLS key were deleted and test processes closed. Public signup, inbox delivery and consumption of a real recovery/confirmation email were not exercised by this increment.
- TypeScript, production build and anonymous smoke checks passed. The first sandbox build could not fetch Google Fonts; the network-enabled retry succeeded. A smoke invocation before the successful build completed could not find a production build; rerunning it after the build passed.

## Release and rollback

These changes are local until the application commits are published. Existing cookies acquire the new attributes when rewritten by login or refresh; deployment alone does not immediately rewrite cookies already in a browser. After release, test a fresh login and a returning session, inspect Set-Cookie without logging values, and verify refresh/logout/PKCE redirects on the canonical origin. Keep the legacy host redirect and avoid parent-domain cookies.

Roll back the application commit if an authentication regression is confirmed. Keep database RLS and owner policies enabled; no database migration or Auth provider configuration is part of this cookie increment. The local test certificate is not a production TLS setting.
