'use server'

import { createClient } from './supabase/server'
import { siteOrigin } from './supabase/config'
import { credentials, ValidationError } from './validation'
import { redirect } from 'next/navigation'
import { registrationConsent } from './registration'
import { operatorConfig } from './operator-config'
import { guardAuthAttempt } from './auth-security'

export async function iniciarSesion(
  email: string,
  password: string,
  captchaToken?: string
) {
  let input
  try {
    input = credentials(email, password)
  } catch {
    return { error: 'Revisa el correo y la contraseña.' }
  }
  const supabase = await createClient()
  const guard = await guardAuthAttempt(supabase, input.email, 'login', captchaToken)
  if (guard.error) return { error: guard.error }
  const { error } = await supabase.auth.signInWithPassword({
    ...input,
    options: { captchaToken: guard.captchaToken }
  })
  if (error)
    return {
      error:
        'No se pudo iniciar sesión. Revisa tus credenciales o inténtalo más tarde.'
    }
  redirect('/biblioteca')
}

export async function registrarUsuario(
  email: string,
  password: string,
  consent: unknown,
  captchaToken?: string
) {
  if (!operatorConfig().ready)
    return {
      error:
        'El registro está temporalmente cerrado. Consulta la ayuda y privacidad.'
    }
  let input
  try {
    input = credentials(email, password, true)
  } catch (error) {
    if (error instanceof ValidationError)
      return {
        error: 'Usa un correo válido y una contraseña de 12 a 128 caracteres.'
      }
    throw error
  }
  let acceptance
  try {
    acceptance = registrationConsent(consent)
  } catch {
    return {
      error:
        'Revisa tu edad y acepta los términos y la autorización de datos. Para adolescentes, consulta el registro acompañado.'
    }
  }
  const supabase = await createClient()
  const guard = await guardAuthAttempt(supabase, input.email, 'signup', captchaToken)
  if (guard.error) return { error: guard.error }
  const { error } = await supabase.auth.signUp({
    ...input,
    options: {
      captchaToken: guard.captchaToken,
      emailRedirectTo: `${siteOrigin()}/api/auth/callback`,
      data: { registration_acceptance: acceptance }
    }
  })
  // Keep account existence and provider details private.
  if (error)
    return { error: 'No se pudo completar el registro. Inténtalo más tarde.' }
  return { success: true }
}

export async function solicitarCorreo(
  email: string,
  kind: 'recovery' | 'confirmation',
  captchaToken?: string
) {
  let normalized
  try {
    normalized = credentials(email, 'x').email
  } catch {
    return { error: 'Escribe un correo válido.' }
  }
  if (!['recovery', 'confirmation'].includes(kind))
    return { error: 'Solicitud inválida.' }
  const supabase = await createClient()
  const guard = await guardAuthAttempt(supabase, normalized, kind, captchaToken)
  if (guard.error) return { error: guard.error }
  try {
    if (kind === 'recovery') {
      await supabase.auth.resetPasswordForEmail(normalized, {
        captchaToken: guard.captchaToken,
        redirectTo: `${siteOrigin()}/api/auth/callback?flow=recovery`
      })
    } else {
      await supabase.auth.resend({
        type: 'signup',
        email: normalized,
        options: {
          emailRedirectTo: `${siteOrigin()}/api/auth/callback`,
          captchaToken: guard.captchaToken
        }
      })
    }
  } catch {
    /* The public response must not expose account existence or provider errors. */
  }
  return { success: true }
}

export async function actualizarClave(password: string, confirmation: string) {
  try {
    credentials('validation@example.test', password, true)
  } catch {
    return { error: 'Usa una contraseña de 12 a 128 caracteres.' }
  }
  if (password !== confirmation) return { error: 'Las contraseñas no coinciden.' }
  const supabase = await createClient()
  const {
    data: { user },
    error: sessionError
  } = await supabase.auth.getUser()
  if (sessionError || !user)
    return {
      error: 'El enlace ya no permite cambiar la contraseña. Solicita uno nuevo.'
    }
  const { error } = await supabase.auth.updateUser({ password })
  if (error)
    return {
      error:
        'No se pudo cambiar la contraseña. Solicita un enlace nuevo e inténtalo otra vez.'
    }
  const { error: signOutError } = await supabase.auth.signOut()
  return { success: true, sessionClosed: !signOutError }
}

export async function cerrarSesion() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error('No se pudo cerrar la sesión. Inténtalo de nuevo.')
  redirect('/login')
}
