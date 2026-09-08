import Link from 'next/link'
import { Star } from 'lucide-react'
import type { Libro } from '@/lib/types'

const COLOR_ESTADO: Record<string, string> = {
  'Leído': 'bg-green-100 text-green-700',
  'Leyendo': 'bg-blue-100 text-blue-700',
  'Pendiente': 'bg-gray-100 text-gray-700',
  'Abandonado': 'bg-red-100 text-red-700',
}

export default function LibroCard({ libro }: { libro: Libro }) {
  return (
    <Link
      href={`/biblioteca/${libro.id}`}
      className="group block rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[2/3] bg-gray-100 relative">
        {libro.portada_url ? (
          <img
            src={libro.portada_url}
            alt={libro.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm p-2 text-center">
            {libro.titulo}
          </div>
        )}
        <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${COLOR_ESTADO[libro.estado]}`}>
          {libro.estado}
        </span>
      </div>

      <div className="p-3">
        <p className="font-medium text-sm line-clamp-2 group-hover:text-blue-600">
          {libro.titulo}
        </p>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {libro.autores?.join(', ')}
        </p>
        {libro.puntuacion != null && (
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{libro.puntuacion}</span>
          </div>
        )}
      </div>
    </Link>
  )
}