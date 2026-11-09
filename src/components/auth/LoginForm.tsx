'use client'
import Wordmark from '@/components/ui/Wordmark'

import { BookOpen, Bookmark, Quote, Eye, EyeOff, ArrowRight, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { iniciarSesion } from '@/lib/auth'

export default function LoginForm({ confirmationError = false }: { confirmationError?: boolean }) {
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(confirmationError ? 'El enlace de confirmación no es válido o ha caducado.' : null)
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (cargando) return
    setCargando(true)
    setError(null)

    try {
      const resultado = await iniciarSesion(email, password)
      if (resultado?.error) setError(resultado.error)
    } catch { setError('No se pudo iniciar sesión. Inténtalo de nuevo.') }
    finally { setCargando(false) }
  }

  return (
    <main className="min-h-svh bg-paper text-ink">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-6 sm:px-10">
        <Wordmark href="/login" />
        <Link href="/registro" className="editorial-link text-sm">Crear cuenta</Link>
      </header>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-12 pt-5 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-16 lg:pt-10">
        <section aria-labelledby="welcome-title" className="min-w-0">
          <h1 id="welcome-title" className="max-w-xl font-display text-[clamp(2.6rem,5.5vw,4.8rem)] leading-[1.07] tracking-tight">Un lugar para los libros que se quedan contigo.</h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/75 sm:text-lg">Organiza lo que lees, guarda las frases que te acompañan y descubre cómo crece tu historia como lector.</p>

          <div className="login-bookshelf relative mt-9 hidden overflow-hidden rounded-t-[48%_12%] bg-cloth px-8 pb-0 pt-10 text-paper sm:block" aria-hidden="true">
            <p className="mb-7 font-display text-xl text-paper/90">Cada lectura deja algo. <span className="ml-2 text-gilt">✦</span></p>
            <div className="flex h-44 items-end justify-center gap-2 border-b-[9px] border-gilt/70 px-4">
              <div className="flex h-36 w-12 items-center justify-center rounded-t-sm border-l-4 border-paper/20 bg-paper text-ink [writing-mode:vertical-rl] font-display text-sm">Por leer</div>
              <div className="flex h-40 w-14 items-center justify-center rounded-t-sm border-l-4 border-paper/20 bg-gilt text-ink [writing-mode:vertical-rl] font-display text-base">Una nueva historia</div>
              <div className="flex h-32 w-10 items-center justify-center rounded-t-sm border-l-4 border-paper/20 bg-stamp text-surface [writing-mode:vertical-rl] font-display text-sm">Mis notas</div>
              <div className="flex h-44 w-14 items-center justify-center rounded-t-sm border-l-4 border-paper/20 bg-footer text-ink [writing-mode:vertical-rl] font-display text-base">Entre páginas</div>
              <div className="ml-3 flex h-36 w-12 origin-bottom rotate-12 items-center justify-center rounded-t-sm border-l-4 border-paper/20 bg-muted text-ink [writing-mode:vertical-rl] font-display text-sm">Favoritos</div>
            </div>
          </div>

          <ul className="mt-7 hidden gap-5 sm:grid sm:grid-cols-3">
            <li><Bookmark className="mb-2 size-5 text-cloth" aria-hidden="true" /><h2 className="text-sm font-semibold">Tu catálogo</h2><p className="mt-1 text-sm leading-relaxed text-ink/70">Leídos, pendientes y los que tienes entre manos.</p></li>
            <li><Quote className="mb-2 size-5 text-cloth" aria-hidden="true" /><h2 className="text-sm font-semibold">Tus recuerdos</h2><p className="mt-1 text-sm leading-relaxed text-ink/70">Reseñas y citas con tu propia mirada.</p></li>
            <li><BookOpen className="mb-2 size-5 text-cloth" aria-hidden="true" /><h2 className="text-sm font-semibold">Tu ritmo</h2><p className="mt-1 text-sm leading-relaxed text-ink/70">Metas y un recorrido por tus lecturas.</p></li>
          </ul>
        </section>

        <section aria-labelledby="login-title" className="w-full rounded-2xl border border-rule bg-surface px-6 py-8 sm:px-9 sm:py-10 lg:justify-self-end">
          <h2 id="login-title" className="font-display text-3xl">Vuelve a tu biblioteca</h2>
          <p className="mb-7 mt-3 text-sm leading-relaxed text-ink/70">Entra para continuar donde dejaste tu última lectura.</p>
        <form onSubmit={handleSubmit} className="space-y-5" aria-busy={cargando}>
          <div className="space-y-2">
            <label htmlFor="loginform-1" className="block text-sm font-medium text-ink">Correo electrónico</label>
            <input id="loginform-1"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="editorial-input"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="loginform-2" className="block text-sm font-medium text-ink">Contraseña</label>
            <div className="relative">
            <input id="loginform-2"
              type={mostrarPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              className="pr-14 editorial-input"
            />
            <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={mostrarPassword} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-cloth focus-visible:outline-2 focus-visible:outline-cloth">
              {mostrarPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
            </button>
            </div>
          </div>

          {error && (
            <div role="alert" className="editorial-alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="editorial-button w-full"
          >
            <span aria-live="polite">{cargando ? 'Entrando a tu biblioteca…' : 'Entrar a mi biblioteca'}</span>
            {!cargando && <ArrowRight className="size-4" aria-hidden="true" />}
          </button>
        </form>

        <div className="mt-7 border-t border-rule pt-6 text-center text-sm text-ink">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="editorial-link">
            Crea tu cuenta
          </Link>
        </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-ink/65"><LockKeyhole className="size-3.5 shrink-0" aria-hidden="true" />Tu biblioteca y tus notas son privadas.</p>
        </section>
      </div>
      <footer className="mx-auto max-w-7xl px-5 pb-7 text-sm text-ink/60 sm:px-10">Un libro a la vez, a tu manera.</footer>
    </main>
  )
}
