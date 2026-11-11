import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Wordmark from '@/components/ui/Wordmark'

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-layout">
      <aside className="auth-art" aria-label="El universo de Tinteruna">
        <Image src="/brand/reading-river.webp" fill sizes="50vw" alt="" />
        <div className="auth-art-copy">
          <p className="max-w-md font-display text-5xl leading-tight">
            Hay historias que siguen creciendo después de la última página.
          </p>
          <p className="mt-5 text-sm leading-relaxed text-paper/90">
            Guarda las tuyas en Tinteruna.
          </p>
        </div>
      </aside>
      <div className="auth-form-side">
        <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-6 sm:px-10">
          <Wordmark href="/" />
          <Link
            href="/"
            className="editorial-link inline-flex min-h-11 items-center gap-2 text-xs"
          >
            <ArrowLeft aria-hidden="true" className="size-4" /> Volver al inicio
          </Link>
        </header>
        <div className="auth-form-body">{children}</div>
      </div>
    </main>
  )
}
