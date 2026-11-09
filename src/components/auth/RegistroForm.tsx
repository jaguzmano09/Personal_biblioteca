'use client'

import { useState } from 'react'
import Link from 'next/link'
import Wordmark from '@/components/ui/Wordmark'
import { registrarUsuario } from '@/lib/auth'

export default function RegistroForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [exito, setExito] = useState(false)
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError(null)

    try {
      const resultado = await registrarUsuario(email, password)
      if (resultado?.error) setError(resultado.error)
      else setExito(true)
    } catch { setError('No se pudo completar el registro. Inténtalo de nuevo.') }
    finally { setCargando(false) }
  }

  if (exito) {
    return (
      <main className="mx-auto my-12 max-w-md px-5">
        <Wordmark href="/login" />
        <section className="mt-6 rounded-2xl border border-rule bg-surface p-6 sm:p-8" aria-labelledby="confirmation-title">
          <h1 id="confirmation-title" className="mb-4 font-display text-3xl">¡Revisa tu correo!</h1>
          <p className="text-ink/80">
            Si el registro es válido, recibirás un enlace de confirmación en <strong>{email}</strong>. Confírmalo para poder iniciar sesión.
          </p>
          <Link href="/login" className="editorial-link mt-5 inline-block text-sm">Volver al inicio de sesión</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto my-12 max-w-md px-5">
      <Wordmark href="/login" />
      <section className="mt-6 rounded-2xl border border-rule bg-surface p-6 sm:p-8" aria-labelledby="registration-title">
        <h1 id="registration-title" className="mb-6 font-display text-3xl">Crear cuenta</h1>

        <form onSubmit={handleSubmit} className="space-y-4" aria-busy={cargando}>
          <div>
            <label htmlFor="registroform-1" className="block text-sm font-medium mb-1">Correo electrónico</label>
            <input id="registroform-1"
              type="email"
                autoComplete="email"
                maxLength={254}
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="editorial-input"
            />
          </div>

          <div>
            <label htmlFor="registroform-2" className="block text-sm font-medium mb-1">Contraseña</label>
            <input id="registroform-2"
              type="password"
                autoComplete="new-password"
              required
              minLength={12}
              maxLength={128}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="editorial-input"
            />
          </div>

          {error && <p role="alert" className="editorial-alert">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="editorial-button w-full"
          >
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-ink/70 mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="editorial-link">
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  )
}
