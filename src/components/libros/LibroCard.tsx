import { safeCover } from '@/lib/covers'
import Link from 'next/link'
import type { Libro } from '@/lib/types'

const ESTADO_LABEL: Record<Libro['estado'], string> = {
  Leído: 'Leído',
  Leyendo: 'En curso',
  Pendiente: 'Pendiente',
  Abandonado: 'Abandonado',
}

export default function LibroCard({ libro }: { libro: Libro }) {
  const portada = safeCover(libro.portada_url)

  return (
    <Link href={`/biblioteca/${libro.id}`} className="group block min-w-0 rounded-sm">
      <div className="relative aspect-[2/3] overflow-hidden rounded-l-sm rounded-r-md bg-cloth shadow-sm ring-1 ring-ink/15 transition-shadow group-hover:shadow-md">
        {portada ? (
          <img
            src={portada}
            referrerPolicy="no-referrer"
            loading="lazy"
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center text-paper">
            <span className="h-px w-8 bg-gilt" aria-hidden="true" />
            <span className="line-clamp-4 font-display text-base leading-snug sm:text-xl">{libro.titulo}</span>
            <span className="h-px w-8 bg-gilt" aria-hidden="true" />
          </div>
        )}
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/25 to-transparent" />
      </div>

      <div className="mt-3 border-b border-rule pb-3">
        <p className="line-clamp-2 font-display text-lg leading-snug group-hover:text-cloth group-hover:underline">
          {libro.titulo}
        </p>
        {libro.autores?.length ? <p className="mt-1 truncate text-xs text-ink/75">{libro.autores.join(', ')}</p> : null}
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-2 font-mono text-[0.6875rem] text-ink/75">
          <span className="uppercase tracking-wide">{ESTADO_LABEL[libro.estado]}</span>
          {libro.puntuacion != null && (
            <span aria-label={`Puntuación: ${libro.puntuacion} de 10`}>{libro.puntuacion.toFixed(1)} / 10</span>
          )}
        </div>
      </div>
    </Link>
  )
}
