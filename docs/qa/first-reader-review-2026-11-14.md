# First-reader production review

Date: November 14, 2026, America/Bogota. Target: https://tinteruna.vercel.app. Reviewed production revision: `b0894f7`, confirmed READY on Vercel from `main`.

The owner authorized an unfamiliar-reader walkthrough and test-account access. This is a review of observed behavior, not an implementation or a launch-readiness certification. Findings below remain open.

## Scope and evidence

- Followed the live home, registration/sign-in screens, empty library, annual goal, Google Books search, edition selection, book creation, notes, completion, filters, data export, deletion and sign-out.
- Used agent-browser with Edge and Chrome. A separate Chrome/Playwright check resolved a download-tool discrepancy and checked rendered layouts/accessibility. No application source was read to establish these findings; administrative database inspection was limited to preparing and cleaning isolated test access.
- Inspected mobile and desktop layouts. Live authenticated library, detail, addition and data views were checked at 320, 390, 768 and 1440 px, with no horizontal overflow or axe findings in those checked views. This does not substitute for physical-phone keyboards or screen-reader testing.
- The existing database accounts were not identified as test accounts, and reusable test credentials were unavailable. After the owner's explicit authorization, a dedicated account was provisioned administratively with a reserved, non-deliverable email, a random password and a QA marker. Regular browser email/password sign-in succeeded. Existing accounts, passwords and personal records were not changed.
- Registration UI was reviewed, but public signup, actual email delivery, confirmation/resend and password-reset completion were not exercised. Administrative confirmation of the QA account is not evidence that those flows work.
- Screenshots are local evidence under the Git-ignored `.local-reviews/2026-11-14/screenshots/` directory. Filenames below refer to that directory. They are deliberately excluded from the public repository. No account credentials, session tokens, operator contact values or existing private notes are included here.
- Interactive evidence uses screenshots and observed browser states. Video recording was unavailable because the recorder requires ffmpeg, which was not installed.

## Summary

| Severity | Count |
| --- | --- |
| Critical | 0 |
| High | 5 |
| Medium | 3 |
| Low | 0 |
| Total | 8 |

The most direct reading-motivation problem is ISSUE-005: finishing a book without a year leaves the annual dashboard unchanged. The other high-priority gaps concern account recovery, confirmation recovery and access to privacy/support information. ISSUE-008 is a catalog-coverage limitation, not a broken provider request.

## Confirmed findings

### ISSUE-001: Registration has no pre-registration privacy or terms links

Severity: high. Category: privacy UX/content. Route: `/registro`.

Reproduce:

1. From the home page, choose **Crear mi biblioteca**.
2. Inspect the complete registration page, including the area below the form.
3. The page requests email and password, with a password-length hint and a sign-in link. It provides no privacy-policy or terms links before submission.

Expected improvement: publish readable, reviewed Spanish notices accessible before registration, with appropriate acceptance controls where applicable. A reader should be able to understand data handling before providing account details.

Evidence: `02-registration-mobile.png`. Static observation; no signup was submitted.

### ISSUE-002: Registration does not explain the intended age eligibility

Severity: medium. Category: onboarding/content. Route: `/registro`.

Reproduce: inspect the same complete registration page. There is no visible eligibility guidance or adolescent/guardian path, despite the intended product audience including adolescents.

Expected improvement: define and present an understandable eligibility path consistent with the reviewed product requirements. This finding describes the visible onboarding gap; it does not establish what unobserved server-side safeguards do.

Evidence: `02-registration-mobile.png`. Static observation.

### ISSUE-003: Sign-in has no password-recovery entry

Severity: high. Category: account access/UX. Route: `/login`.

Reproduce:

1. Choose **Entrar** or **Inicia sesión**.
2. Inspect the complete sign-in page.
3. Available actions are password visibility, sign-in, account creation and return home. A reader who forgot the password cannot find a recovery action there.

Expected improvement: provide an accessible recovery entry and a complete reset flow with safe delivery feedback and understandable expired-link handling.

Evidence: `03-login-mobile-confirmed.png`. Static observation.

### ISSUE-004: Invalid confirmation offers no resend or help action

Severity: high. Category: account onboarding/UX. Route: `/login?error=confirmation`.

Reproduce:

1. Visit `/api/auth/callback` without a confirmation code, representing an invalid-link destination without consuming a real token.
2. The application redirects to sign-in and reports that the confirmation link is invalid or expired.
3. No resend-confirmation action or help instructions accompany the error. The remaining actions are still sign-in and account creation.

Expected improvement: provide recovery instructions and a safe resend path, with rate limiting and feedback that does not reveal whether an account exists.

Evidence: `05-confirmation-error-mobile.png` and the observed redirect. This verifies the invalid-code error screen, not actual expired-email delivery.

### ISSUE-005: Finishing a book can leave annual progress unchanged without guidance

Severity: high. Category: core reading workflow/data-completeness UX. Routes: book detail editor and `/biblioteca`.

Reproduce:

1. Add a book as **Leyendo**. In this review, a real edition of *Cien años de soledad* was used.
2. Open **Editar ficha**, change **Estado** to **Leído**, and optionally give it a score. Leave **Año de lectura** empty.
3. Choose **Guardar cambios**, return to the library and reload.
4. The catalog shows the book as completed and preserves its score, but the selected-year dashboard still shows zero completed books/pages and no goal progress. The form accepted completion without asking for the year or warning about exclusion.
5. Edit the same record and explicitly set the reading year to 2026. The dashboard now shows one completed book, 531 pages, a 7.6 score and one of two goal progress.

Expected improvement: explicitly resolve the completion year when marking a book read, or explain the effect of leaving it unknown and provide a direct correction action. A sensible editable date default can help new readers while preserving deliberate historical/undated records. Consider an actionable group of completed books without a year.

The annual arithmetic was correct once the year was supplied. The problem is that the completion flow fails to connect that required piece of information to the reader's goal.

Evidence: `13-complete-without-year.png`, `14-read-book-zero-progress.png` after reload, and `15-reading-year-restores-progress.png` showing the contrast.

### ISSUE-006: Goal changes lose a perceivable success acknowledgement

Severity: medium. Category: feedback/UX. Route: `/biblioteca`.

Reproduce:

1. Define a goal of two books and save it.
2. Edit the goal to three and save again.
3. In both live attempts the editor closed and the value persisted, but the settled page had no goal-save success acknowledgement. Waiting for the expected **Meta guardada** text during the first attempt did not find it. The second settled-page snapshot likewise had no goal-save status.

Expected improvement: keep the success feedback perceivable and announce it after the real save/refresh. Preserve the existing focus restoration and error recovery. Data persistence itself passed; the observed problem is the acknowledgement.

Evidence: `16-goal-edit-before-save.png` and `17-goal-save-feedback.png`. By contrast, note saving visibly reported **Huella guardada**.

### ISSUE-007: The deployed experience has no usable privacy/support contact

Severity: high. Category: support/privacy UX. Routes: public access pages and `/biblioteca/datos`.

Reproduce:

1. Inspect the public footer and access screens for a help/privacy contact.
2. Sign in and open **Tus datos**.
3. The deployed page contains only the JSON-export section and a back link. No contact channel is provided for privacy questions, account correction or closure requests. No support destination was visible in the reviewed navigation.

Expected improvement: expose a verified help/privacy channel and clear account-request instructions. Supply operator details through private production configuration, rather than embedding personal values in the public repository. This observation concerns what users can find; an unpublished operational procedure was not assessed.

Evidence: `19-data-contact-mobile.png` and the complete rendered-page snapshot.

### ISSUE-008: Books absent from Google Books have no creation fallback

Severity: medium. Category: discovery coverage/feature gap. Route: `/biblioteca/agregar`.

Reproduce:

1. Search for a query with no provider match; the review used `QA Tinteruna cuaderno familiar 20261114 zyxwv987654`.
2. The empty state suggests fewer words, an author surname or an ISBN.
3. No manual title/author creation action is offered. A reader with an uncatalogued book cannot complete addition through the reviewed UI.

Expected improvement: provide an explicit manual-add path with minimal metadata and existing validation/ownership safeguards, or state provider-only cataloging as a deliberate product constraint. The normal Google Books search worked; this is a confirmed coverage limitation.

Evidence: `20-discovery-no-results.png` and `21-discovery-no-results-desktop.png`.

## Observed passes

| Journey | Live result |
| --- | --- |
| Public welcome | The purpose, literary identity and registration entry were discoverable. |
| Empty library | The new dashboard appears before the catalog and offers goal/discovery actions. |
| Sign-in | Regular email/password access worked for the isolated confirmed account. |
| Goal persistence | Goals of two and three books persisted; feedback issue is recorded separately. |
| Discovery | A real title search returned editions, covers and edition-selection actions. |
| Book creation | A selected edition, reading state and optional note saved with a clear book-save confirmation. |
| Notes | A note update reported success and survived a full reload. |
| Completion and score | Completed state and decimal score persisted; annual figures matched after supplying the year. |
| Filters | Selecting an unmatched reading state showed an explanatory empty state; **Limpiar filtros** restored the book. |
| Export | A real browser download succeeded. Its JSON contained only the QA account, its one book, saved note, reading year, decimal score and goal. |
| Deletion | Canceling the confirmation preserved the book. Confirming later deleted it and restored the empty library. |
| Sign-out | Signing out returned to login; revisiting the protected library again redirected to login. |
| Layout/accessibility | Four live authenticated views at four widths had no horizontal overflow. Axe and captured page exceptions reported no findings/errors in those checked views. |

## Improvements to explore after confirmed issues

These are proposals, not additional reproduced defects:

- Make finishing a book a short, guided action: state, completion date, optional reflection, and an immediately visible goal update.
- Consider a clearer first-book choice among reading now, read previously and saved for later, linked to how each affects the dashboard.
- Clarify whether **Continuar leyendo** means returning to a reading journal rather than an in-app ebook reader. Test wording with unfamiliar readers before changing it.
- Consider a CSV companion to the complete JSON export for readers who want to inspect their collection in a spreadsheet. JSON is correctly identified in the current copy.
- Review search-result relevance and edition provenance with representative readers. The provider can mix editions and related study material; the review did not independently authenticate every metadata record.

## Recommended correction order

1. Fix ISSUE-005 and verify the complete finish-book-to-goal journey with a real account, including deliberate historical and unknown dates.
2. Complete the access-recovery loops in ISSUE-003 and ISSUE-004.
3. Resolve ISSUE-001, ISSUE-002 and ISSUE-007 against the launch/privacy requirements before expanding public registration.
4. Stabilize goal-save acknowledgement in ISSUE-006 and add manual-book coverage for ISSUE-008 if that capability is accepted.

## Boundaries and cleanup

This was one synthetic account on the real service. It did not test another existing reader's private records, cross-account authorization exhaustively, actual email delivery, physical devices, screen readers, concurrent editing or high-volume rate limits. No denial-of-service, injection or production attack testing was performed.

The agent-browser download helper canceled in both Edge and Chrome. An independent Playwright-driven Chrome download succeeded and its contents were checked, so the helper problem was not counted as an application defect. Shell/reference-selector mistakes during navigation were likewise excluded from the findings.

The book was deleted through the normal UI. The temporary account was then removed using its exact identifier and QA marker. A follow-up administrative check confirmed zero remaining QA accounts, books, goals or sessions, and the original two-account total was restored. Temporary credential/session/export files and the dedicated browser credential profile were removed; review browsers were closed. Only redacted documentation and ignored local evidence remain. No application, database-schema, provider-setting or deployment fix was made as part of this review.
