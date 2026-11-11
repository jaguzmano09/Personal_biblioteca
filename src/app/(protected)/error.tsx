'use client'
import Link from 'next/link'

export default function LibraryError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-2xl px-5 py-10" role="alert">
      <div className="journal-sheet">
        <h1 className="font-display text-3xl leading-tight text-cloth">
          Esta página necesita otro intento.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-ink/80">
          No se pudo cargar tu biblioteca. Puedes reintentar o volver a iniciar
          sesión si ha caducado.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-5">
          <button type="button" onClick={reset} className="editorial-button">
            Reintentar
          </button>
          <Link
            href="/login"
            className="editorial-link inline-flex min-h-11 items-center text-sm"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </main>
  )
}
