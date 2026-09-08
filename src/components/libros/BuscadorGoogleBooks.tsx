'use client'

import { useEffect, useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { buscarLibros } from '@/lib/googleBooks'
import { useDebounce } from '@/hooks/useDebounce'
import type { GoogleBookResult } from '@/lib/types'

interface Props {
  onSeleccionar: (libro: GoogleBookResult) => void
}

export default function BuscadorGoogleBooks({ onSeleccionar }: Props) {
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState<GoogleBookResult[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedQuery = useDebounce(query, 400)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResultados([])
      return
    }

    let cancelado = false
    setCargando(true)
    setError(null)

    buscarLibros(debouncedQuery)
      .then(libros => {
        if (!cancelado) setResultados(libros)
      })
      .catch(() => {
        if (!cancelado) setError('No se pudo conectar con Google Books.')
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [debouncedQuery])

  return (
    <div className="w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Busca por título, autor o ISBN..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {cargando && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {resultados.length > 0 && (
        <ul className="mt-2 border border-gray-200 rounded-lg divide-y max-h-80 overflow-y-auto">
          {resultados.map(libro => (
            <li
              key={libro.google_books_id}
              onClick={() => onSeleccionar(libro)}
              className="flex gap-3 p-3 hover:bg-gray-50 cursor-pointer"
            >
              {libro.portada_url ? (
                <img src={libro.portada_url} alt={libro.titulo} className="w-10 h-14 object-cover rounded" />
              ) : (
                <div className="w-10 h-14 bg-gray-200 rounded" />
              )}
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{libro.titulo}</p>
                <p className="text-xs text-gray-500 truncate">
                  {libro.autores.join(', ') || 'Autor desconocido'}
                </p>
                {libro.fecha_publicacion && (
                  <p className="text-xs text-gray-400">{libro.fecha_publicacion}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}