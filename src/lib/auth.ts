'use server'

import { createClient } from './supabase/server'
import { siteOrigin } from './supabase/config'
import { credentials, ValidationError } from './validation'
import { redirect } from 'next/navigation'

export async function iniciarSesion(email: string, password: string) {
  let input
  try { input = credentials(email, password) } catch { return { error: 'Revisa el correo y la contraseña.' } }
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(input)
  if (error) return { error: 'No se pudo iniciar sesión. Revisa tus credenciales o inténtalo más tarde.' }
  redirect('/biblioteca')
}

export async function registrarUsuario(email: string, password: string) {
  let input
  try { input = credentials(email, password, true) } catch (error) {
    if (error instanceof ValidationError) return { error: 'Usa un correo válido y una contraseña de 12 a 128 caracteres.' }
    throw error
  }
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({ ...input,
    options: { emailRedirectTo: `${siteOrigin()}/api/auth/callback` },
  })
  // Keep account existence and provider details private.
  if (error) return { error: 'No se pudo completar el registro. Inténtalo más tarde.' }
  return { success: true }
}

export async function cerrarSesion() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error('No se pudo cerrar la sesión. Inténtalo de nuevo.')
  redirect('/login')
}
