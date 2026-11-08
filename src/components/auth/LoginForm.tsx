'use client'
import { brand } from '../../../supabase/functions/_shared/brand.js'

import { useState } from 'react'
import Link from 'next/link'
import { iniciarSesion } from '@/lib/auth'

export default function LoginForm({ confirmationError = false }: { confirmationError?: boolean }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(confirmationError ? 'El enlace de confirmación no es válido o ha caducado.' : null)
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError(null)

    try {
      const resultado = await iniciarSesion(email, password)
      if (resultado?.error) setError(resultado.error)
    } catch { setError('No se pudo iniciar sesión. Inténtalo de nuevo.') }
    finally { setCargando(false) }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--brand-gilt)_12%,transparent),_transparent_38%),linear-gradient(135deg,var(--brand-paper)_0%,var(--brand-paper-end)_100%)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-rule bg-surface/90 shadow-[0_24px_80px_color-mix(in_srgb,var(--brand-ink)_12%,transparent)] backdrop-blur-sm">
        <div className="border-b border-rule bg-ink px-6 py-5 text-center text-paper">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted">{brand.name}</p>
          <h1 className="mt-2 font-display text-3xl text-surface">Iniciar sesión</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
          <div className="space-y-2">
            <label htmlFor="loginform-1" className="block text-sm font-medium text-ink">Email</label>
            <input id="loginform-1"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full rounded-xl border border-rule bg-white/70 px-3.5 py-3 text-sm text-ink shadow-sm outline-none transition focus:border-cloth focus:ring-4 focus:ring-cloth/10"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="loginform-2" className="block text-sm font-medium text-ink">Contraseña</label>
            <input id="loginform-2"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-rule bg-white/70 px-3.5 py-3 text-sm text-ink shadow-sm outline-none transition focus:border-cloth focus:ring-4 focus:ring-cloth/10"
            />
          </div>

          {error && (
            <div role="alert" className="rounded-xl border border-stamp/30 bg-stamp/8 px-3 py-2 text-sm text-stamp-dark">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-xl bg-cloth px-4 py-3 text-sm font-medium text-surface shadow-lg shadow-cloth/20 transition hover:bg-cloth-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="border-t border-rule bg-footer px-6 py-4 text-center text-sm text-ink">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="font-medium text-cloth transition hover:text-cloth-dark hover:underline">
            Regístrate
          </Link>
        </div>
      </div>
    </main>
  )
}