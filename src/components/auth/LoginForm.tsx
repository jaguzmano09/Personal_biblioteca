'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LockKeyhole, Loader2 } from 'lucide-react'
import { iniciarSesion } from '@/lib/auth'
import AuthShell from './AuthShell'
import PasswordInput from './PasswordInput'

export default function LoginForm({
  confirmationError = false
}: {
  confirmationError?: boolean
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(
    confirmationError
      ? 'El enlace de confirmación no es válido o ha caducado.'
      : null
  )
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (cargando) return
    setCargando(true)
    setError(null)
    try {
      const resultado = await iniciarSesion(email, password)
      if (resultado?.error) setError(resultado.error)
    } catch {
      setError(
        'No se pudo iniciar sesión. Revisa tu conexión e inténtalo de nuevo.'
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <AuthShell>
      <h1 className="auth-heading">Vuelve a tus páginas.</h1>
      <p className="mb-8 mt-5 text-base leading-relaxed text-ink/75">
        Entra a tu biblioteca y retoma el hilo de tus lecturas.
      </p>
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        aria-busy={cargando}
        aria-describedby={error ? 'login-error' : undefined}
      >
        <fieldset disabled={cargando} className="min-w-0 space-y-5">
          <div className="space-y-2">
            <label htmlFor="loginform-1" className="block text-sm font-medium">
              Correo electrónico
            </label>
            <input
              id="loginform-1"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="editorial-input"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="loginform-2" className="block text-sm font-medium">
              Contraseña
            </label>
            <PasswordInput
              id="loginform-2"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p id="login-error" role="alert" className="editorial-alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={cargando}
            className="editorial-button w-full"
          >
            {cargando && (
              <Loader2
                aria-hidden="true"
                className="size-4 motion-safe:animate-spin"
              />
            )}
            {cargando ? 'Entrando a tu biblioteca…' : 'Entrar a mi biblioteca'}
          </button>
        </fieldset>
      </form>
      <p className="mt-7 text-center text-sm text-ink/80">
        ¿Tu primera página aquí?{' '}
        <Link
          href="/registro"
          className="editorial-link inline-flex min-h-11 items-center"
        >
          Crea tu cuenta
        </Link>
      </p>
      <p className="mt-7 flex items-start gap-2 border-t border-rule pt-5 text-xs leading-relaxed text-ink/75">
        <LockKeyhole aria-hidden="true" className="mt-0.5 size-4 shrink-0" /> Tu
        biblioteca y tus notas se guardan en tu espacio personal.
      </p>
    </AuthShell>
  )
}
