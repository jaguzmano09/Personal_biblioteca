'use client'

import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { safeCover } from '@/lib/covers'

export default function PortadaLibro({ url }: { url: string | null }) {
  const portada = safeCover(url)
  const [fallida, setFallida] = useState<string | null>(null)

  return (
    <span className="relative flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden rounded-r-sm border-l border-cloth/30 bg-cloth/10 text-cloth">
      {portada && fallida !== portada ? (
        <img
          src={portada}
          alt=""
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setFallida(portada)}
          className="h-full w-full object-cover"
        />
      ) : (
        <BookOpen
          aria-label="Sin portada disponible"
          role="img"
          className="h-6 w-6"
        />
      )}
    </span>
  )
}
