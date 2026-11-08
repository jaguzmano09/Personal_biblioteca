import { Webhook } from 'npm:standardwebhooks@1.0.0'
import { createHandler } from './handler.js'

const getSecret = (name) => {
  const value = Deno.env.get(name)
  if (!value) throw new Error(`Missing configuration: ${name}`)
  return value
}
const webhook = new Webhook(getSecret('SEND_EMAIL_HOOK_SECRET').replace(/^v1,whsec_/, ''))
Deno.serve(createHandler({
  verify: (body, headers) => webhook.verify(body, headers),
  config: {
    apiKey: getSecret('BREVO_API_KEY'),
    senderEmail: getSecret('BREVO_SENDER_EMAIL'),
    supabaseUrl: getSecret('SUPABASE_URL'),
    callbackUrl: getSecret('AUTH_EMAIL_CALLBACK_URL'),
  },
}))
