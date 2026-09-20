'use client'

import { useState } from 'react'
import Link from 'next/link'
import { iniciarSesion } from '@/lib/auth'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError(null)

    const resultado = await iniciarSesion(email, password)
    if (resultado?.error) {
      setError(resultado.error)
      setCargando(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(176,141,62,0.12),_transparent_38%),linear-gradient(135deg,#f2ecdd_0%,#efe7d7_100%)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-[#c9bfa0] bg-[#f9f5ee]/90 shadow-[0_24px_80px_rgba(43,42,36,0.12)] backdrop-blur-sm">
        <div className="border-b border-[#c9bfa0] bg-[#2b2a24] px-6 py-5 text-center text-[#f2ecdd]">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#d8c9a7]">Mi Biblioteca</p>
          <h1 className="mt-2 font-display text-3xl text-[#f9f5ee]">Iniciar sesión</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#2b2a24]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full rounded-xl border border-[#c9bfa0] bg-white/70 px-3.5 py-3 text-sm text-[#2b2a24] shadow-sm outline-none transition focus:border-[#3f5c4c] focus:ring-4 focus:ring-[#3f5c4c]/10"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#2b2a24]">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#c9bfa0] bg-white/70 px-3.5 py-3 text-sm text-[#2b2a24] shadow-sm outline-none transition focus:border-[#3f5c4c] focus:ring-4 focus:ring-[#3f5c4c]/10"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-[#a63d33]/30 bg-[#a63d33]/8 px-3 py-2 text-sm text-[#7a2f2a]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-xl bg-[#3f5c4c] px-4 py-3 text-sm font-medium text-[#f9f5ee] shadow-lg shadow-[#3f5c4c]/20 transition hover:bg-[#2f4739] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="border-t border-[#c9bfa0] bg-[#f5efe5] px-6 py-4 text-center text-sm text-[#2b2a24]">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="font-medium text-[#3f5c4c] transition hover:text-[#2f4739] hover:underline">
            Regístrate
          </Link>
        </div>
      </div>
    </main>
  )
}