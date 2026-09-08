import Link from 'next/link'
import type { Libro } from '@/lib/types'

const ESTADO_LABEL: Record<string, string> = {
  'Leído': 'LEÍDO',
  'Leyendo': 'EN CURSO',
  'Pendiente': 'PENDIENTE',
  'Abandonado': 'ABANDONADO',
}

export default function LibroCard({ libro }: { libro: Libro }) {
  const esActivo = libro.estado === 'Leído' || libro.estado === 'Leyendo'

  return (
    <Link
      href={`/biblioteca/${libro.id}`}
      className="group block bg-paper border border-rule hover:border-ink transition-colors"
    >
      {/* Barra de estado tipo sello */}
      <div
        className={`px-2 py-1 font-mono text-[10px] tracking-wide flex justify-between ${
          esActivo ? 'bg-cloth text-paper' : 'bg-transparent text-stamp border-b border-rule'
        }`}
      >
        <span>{ESTADO_LABEL[libro.estado]}</span>
        {libro.puntuacion != null && <span>{libro.puntuacion.toFixed(1)}</span>}
      </div>

      <div className="aspect-[2/3] bg-rule/20 overflow-hidden">
        {libro.portada_url ? (
          <img
            src={libro.portada_url}
            alt={libro.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-3 text-center font-display text-sm text-ink/60">
            {libro.titulo}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-rule">
        <p className="font-display text-base leading-snug line-clamp-2 group-hover:text-cloth-dark">
          {libro.titulo}
        </p>
        <p className="font-mono text-xs text-ink/60 truncate mt-1">
          {libro.autores?.join(', ')}
        </p>
      </div>
    </Link>
  )
}