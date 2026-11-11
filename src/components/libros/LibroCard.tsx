'use client'

import { useState } from 'react'
import { safeCover } from '@/lib/covers'
import Link from 'next/link'
import type { Libro } from '@/lib/types'

const ESTADO_LABEL: Record<Libro['estado'], string> = {
  Leído: 'Leído',
  Leyendo: 'En curso',
  Pendiente: 'Pendiente',
  Abandonado: 'Abandonado'
}

export default function LibroCard({ libro }: { libro: Libro }) {
  const portada = safeCover(libro.portada_url)
  const [portadaFallida, setPortadaFallida] = useState<string | null>(null)

  return (
    <Link
      href={`/biblioteca/${libro.id}`}
      data-state={libro.estado}
      className="book-tile group flex h-full min-w-0 flex-col rounded-sm"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-l-sm rounded-r-md bg-cloth shadow-sm ring-1 ring-ink/15 motion-safe:transition-[transform,box-shadow] motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:-translate-y-1 group-hover:shadow-lg">
        {portada && portada !== portadaFallida ? (
          <img
            src={portada}
            referrerPolicy="no-referrer"
            loading="lazy"
            alt=""
            onError={() => setPortadaFallida(portada)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center text-paper">
            <span className="h-px w-8 bg-gilt" aria-hidden="true" />
            <span className="line-clamp-4 font-display text-base leading-snug sm:text-xl">
              {libro.titulo}
            </span>
            <span className="h-px w-8 bg-gilt" aria-hidden="true" />
          </div>
        )}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/25 to-transparent"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-1 top-px h-px bg-white/45"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-1 bottom-px h-px bg-gilt/55"
        />
      </div>

      <div className="mt-3 flex flex-1 flex-col border-b border-rule pb-3">
        <p className="line-clamp-2 min-h-[2.75em] font-display text-lg leading-snug group-hover:text-cloth group-hover:underline">
          {libro.titulo}
        </p>
        <p className="mt-1 min-h-4 truncate text-xs text-ink/75">
          {libro.autores?.join(', ')}
        </p>
        <div className="mt-auto flex flex-wrap items-baseline justify-between gap-x-2 pt-3 text-xs text-ink/75">
          <span className="font-medium text-cloth">
            {ESTADO_LABEL[libro.estado]}
          </span>
          {libro.puntuacion != null && (
            <span aria-label={`Puntuación: ${libro.puntuacion} de 10`}>
              {libro.puntuacion.toLocaleString('es-CO', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
              })}{' '}
              / 10
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
