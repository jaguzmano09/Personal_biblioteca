'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import PortadaLibro from './PortadaLibro'
import type { GoogleBookResult } from '@/lib/types'

interface Props {
  onSeleccionar: (libro: GoogleBookResult) => void
}

export default function BuscadorGoogleBooks({ onSeleccionar }: Props) {
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState<GoogleBookResult[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [busqueda, setBusqueda] = useState<string | null>(null)
  const solicitud = useRef<AbortController | null>(null)

  useEffect(() => () => solicitud.current?.abort(), [])

  async function buscar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const consulta = query.trim()
    if (consulta.length < 2 || solicitud.current) return
    const controller = new AbortController()
    solicitud.current = controller
    setCargando(true)
    setError(null)
    setResultados([])
    setBusqueda(consulta)

    try {
      const res = await fetch(
        `/api/google-books?q=${encodeURIComponent(consulta)}&maxResults=10`,
        {
          signal: controller.signal,
          cache: 'no-store'
        }
      )
      const body = await res.json()
      if (!res.ok)
        throw new Error(body.error || 'No se pudo consultar Google Books.')
      setResultados(body as GoogleBookResult[])
    } catch (err) {
      if (controller.signal.aborted) return
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo conectar con Google Books.'
      )
    } finally {
      if (!controller.signal.aborted) {
        setCargando(false)
        solicitud.current = null
      }
    }
  }

  return (
    <section aria-label="Buscar una edición" className="min-w-0">
      <form onSubmit={buscar} role="search" className="space-y-3">
        <label htmlFor="buscar-libro" className="block font-medium">
          Título, autor o ISBN
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-4 h-5 w-5 text-cloth"
            />
            <input
              id="buscar-libro"
              aria-describedby="buscar-ayuda"
              required
              minLength={2}
              maxLength={200}
              type="search"
              enterKeyHint="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="El próximo libro de tu biblioteca"
              className="editorial-input min-h-12 pl-11 text-base"
            />
          </div>
          <button
            type="submit"
            disabled={cargando || query.trim().length < 2}
            className="editorial-button min-h-12 sm:shrink-0"
          >
            {cargando && (
              <Loader2
                aria-hidden="true"
                className="h-4 w-4 motion-safe:animate-spin"
              />
            )}
            {cargando
              ? 'Buscando…'
              : error
                ? 'Reintentar búsqueda'
                : 'Buscar libro'}
          </button>
        </div>
        <p id="buscar-ayuda" className="text-sm leading-relaxed text-ink/75">
          Al buscar, tu consulta se envía a Google Books. Puedes comparar las
          ediciones antes de guardar.
        </p>
        <img
          src="/attribution/google-books-poweredby.png"
          width={62}
          height={30}
          alt="Con tecnología de Google"
        />
      </form>

      <p role="status" className="mt-5 text-sm text-cloth">
        {cargando
          ? 'Consultando Google Books…'
          : !error && busqueda && resultados.length > 0
            ? `${resultados.length} ediciones encontradas para «${busqueda}».`
            : ''}
      </p>
      {error && (
        <p role="alert" className="editorial-alert mt-3">
          {error}
        </p>
      )}
      {!cargando && !error && busqueda && resultados.length === 0 && (
        <div role="status" className="border-y border-rule py-8">
          <h2 className="font-display text-2xl">
            Esta búsqueda aún no encuentra su libro
          </h2>
          <p className="mt-2 text-sm text-ink/75">
            Prueba con menos palabras, el apellido del autor o el ISBN de tu
            edición.
          </p>
        </div>
      )}

      {resultados.length > 0 && (
        <ul className="mt-3 divide-y divide-rule border-y border-rule">
          {resultados.map(libro => (
            <li key={libro.google_books_id} className="hover:bg-cloth/5">
              <button
                type="button"
                onClick={() => onSeleccionar(libro)}
                className="flex w-full gap-4 px-1 py-5 text-left focus-visible:bg-cloth/5 sm:gap-5 sm:px-3"
              >
                <PortadaLibro url={libro.portada_url} />
                <span className="min-w-0 flex-1 space-y-1.5">
                  <span className="block break-words font-display text-xl leading-snug text-cloth">
                    {libro.titulo}
                  </span>
                  <span className="block break-words text-sm">
                    {libro.autores.join(', ') || 'Autor desconocido'}
                  </span>
                  <span className="block break-words text-sm text-ink/75">
                    {[libro.editorial, libro.fecha_publicacion]
                      .filter(Boolean)
                      .join(' · ') || 'Edición sin datos de publicación'}
                  </span>
                  {libro.isbn && (
                    <span className="block break-all text-xs text-ink/75">
                      ISBN {libro.isbn}
                    </span>
                  )}
                  <span className="block pt-1 text-sm font-medium text-cloth underline decoration-cloth/40 underline-offset-4">
                    Elegir esta edición
                  </span>
                </span>
              </button>
              <a
                href={`https://books.google.com/books?id=${encodeURIComponent(libro.google_books_id)}`}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                className="editorial-link mb-3 ml-21 inline-flex min-h-11 items-center pr-2 text-sm sm:ml-24"
              >
                Ver edición en Google Books{' '}
                <span className="sr-only">(abre otra pestaña)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
