# Authentication email through the Brevo API

Supabase Auth can invoke a signed Edge Function that sends transactional email through `POST https://api.brevo.com/v3/smtp/email`. Activation requires the provider secrets, a deployed function and an enabled Auth hook. Brevo account restrictions can still affect delivery.

## Create a Brevo API key

In Brevo, open SMTP & API and create a dedicated API key for authentication email. Verify the sender in the same account. Store the key as a provider secret and keep it out of repository files, browser variables, screenshots and logs.

## Deploy the function

The repository contains the function entry point in `supabase/config.toml`. The deployment workflow pins Supabase CLI 3.0.0 and targets the configured project with `--remote`.

For a manual deployment, replace `YOUR_PROJECT_REF` with the intended project reference supplied through your local configuration.

```bash
supabase login
npx --yes supabase@3.0.0 functions deploy send-auth-email --remote=YOUR_PROJECT_REF --no-verify-jwt --yes
```

The function validates a current Standard Webhooks signature with `standardwebhooks@1.0.0`. Its JWT check is disabled because Supabase Auth authenticates the hook through that signature. `SUPABASE_URL` is provided by the Edge Functions runtime. The function operates without a service-role key or application-table access.

The dashboard editor can also deploy the JavaScript entry point and its imported files. Include `index.js`, `handler.js`, `template.js` and `../_shared/brand.js`, and configure JWT verification consistently with the signed-hook setup.

## Configure the hook and secrets

Under Authentication > Hooks, configure a Send Email HTTP hook using the intended project's function URL.

```text
https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-auth-email
```

Generate the signing secret and store its full value, including the `v1,whsec_` prefix. Enable the hook after its secrets are stored and the function is deployed. If the dashboard enables the hook while saving it, coordinate setup with registration availability.

Configure these values as Edge Function secrets.

| Variable | Value to supply privately |
| --- | --- |
| `BREVO_API_KEY` | Dedicated Brevo API key |
| `BREVO_SENDER_EMAIL` | Verified sender email |
| `SEND_EMAIL_HOOK_SECRET` | Complete Auth hook signing secret |
| `AUTH_EMAIL_CALLBACK_URL` | Exact trusted web callback, such as `https://your-domain.example/api/auth/callback` |

For a CLI-based setup, prepare a private environment file outside the repository. Inspect `supabase secrets set --help` for the installed CLI's target-project and `--env-file` options, then supply the private file. Keep secret values out of command arguments and shared output.

Keep the Email provider, registration and email confirmation enabled. An enabled Send Email hook handles delivery through the function. Ensure the callback origin and path are included in Auth's redirect allowlist.

## Activate and verify

1. Enable the configured hook.
2. Register an isolated test account using an inbox you control.
3. Check Brevo's acceptance and actual inbox delivery.
4. Open the confirmation link in the registration browser to complete the application's PKCE flow.
5. Confirm that the browser reaches `/biblioteca`, then verify sign-out and a subsequent sign-in.

The function returns success after Brevo accepts every required email for the operation. Inbox delivery requires its own check. On rejection, the function logs `brevo_send_failed` with the HTTP status. Status 401 indicates API authentication, 403 indicates permission or account restrictions, 429 indicates quotas, and 5xx indicates provider failure. Network failures use `brevo_unavailable`. Diagnostic output is limited to safe event names and status information.

## Supported behavior and limits

- Spanish templates cover registration, invitations, recovery, magic links, email changes and reauthentication. Unsupported actions are rejected.
- Secure email changes send to both addresses using Supabase's hash mapping for each recipient.
- Confirmation links use the Auth verifier and a fixed trusted callback. The function validates the destination independently of the incoming payload.
- Recovery and email-change templates exist. Their corresponding web screens still require implementation and verification before those flows can be offered.
- Delivery has no internal retry loop. An external retry after an uncertain response can duplicate an email. An operation requiring two emails can partially complete.
- The Brevo request budget is 3.5 seconds to fit the Auth hook timeout.
- Provider configuration and real delivery require separate operational verification after deployment.

## Rollback

Disable the Send Email hook. With custom SMTP disabled, Supabase uses its default delivery service, whose recipient and quota limits apply. Keep email confirmation enabled. Revoke the dedicated Brevo key when retiring the integration.

## Brand configuration

`supabase/functions/_shared/brand.js` defines the email brand, base palette and email-safe fonts. The web derives its brand through `src/lib/web-brand.ts`, which imports the shared base colors. Email templates import the shared module directly and render inline styles. `supabase/functions/send-auth-email/template.js` contains their content and layout.

Publish the affected consumer after changing its brand configuration. Shared email changes require a function deployment that includes every imported file. The workflow is triggered by changes under `supabase/functions/` or to `supabase/config.toml`. Auth dashboard email templates have a separate role from the content rendered by this hook.

## Official references

- [Supabase Send Email hook](https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook)
- [Brevo transactional email API](https://developers.brevo.com/reference/send-transac-email)
