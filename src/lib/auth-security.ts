import 'server-only'
import { headers } from 'next/headers'
import { siteOrigin } from './supabase/config'
import { authAttemptProof, trustedAuthIp, type AuthAttempt } from './auth-abuse'
import type { SupabaseClient } from '@supabase/supabase-js'

function featureEnabled(name: string) {
  const value = process.env[name]
  if (value === undefined || value === 'false') return false
  if (value === 'true') return true
  throw new Error('Invalid authentication feature configuration')
}

export function authChallengeConfig() {
  let required: boolean
  try {
    required = featureEnabled('TINTERUNA_CAPTCHA_ENABLED')
  } catch {
    return { required: true, siteKey: null }
  }
  const value = process.env.TURNSTILE_SITE_KEY?.trim()
  if (!required) return { required: false, siteKey: null }
  const local = ['localhost', '127.0.0.1'].includes(new URL(siteOrigin()).hostname)
  const testKey = /^[123]x00000000000000000000/.test(value ?? '')
  return {
    required,
    siteKey:
      value && /^[a-zA-Z0-9_-]{10,100}$/.test(value) && (local || !testKey)
        ? value
        : null
  }
}

export async function guardAuthAttempt(
  client: SupabaseClient,
  email: string,
  action: AuthAttempt,
  token: unknown
) {
  try {
    if (featureEnabled('TINTERUNA_AUTH_RATE_LIMIT_ENABLED')) {
      const origin = new URL(siteOrigin())
      const ip = trustedAuthIp(
        await headers(),
        process.env.VERCEL === '1',
        ['localhost', '127.0.0.1'].includes(origin.hostname)
      )
      const proof = authAttemptProof(
        process.env.TINTERUNA_AUTH_RATE_LIMIT_SECRET ?? '',
        action,
        ip,
        email
      )
      const { data, error } = await client.rpc('consume_auth_attempt', proof)
      if (error || typeof data !== 'boolean')
        return {
          error: 'El acceso no está disponible temporalmente. Inténtalo más tarde.'
        }
      if (!data)
        return { error: 'Demasiados intentos. Espera antes de volver a intentarlo.' }
    }
    const config = authChallengeConfig()
    if (config.required) {
      if (!config.siteKey)
        return {
          error: 'La verificación de acceso no está disponible. Inténtalo más tarde.'
        }
      if (typeof token !== 'string' || !token.trim() || token.length > 2048)
        return { error: 'Completa de nuevo la verificación de seguridad.' }
      return { captchaToken: token }
    }
    return {}
  } catch {
    return {
      error: 'El acceso no está disponible temporalmente. Inténtalo más tarde.'
    }
  }
}
