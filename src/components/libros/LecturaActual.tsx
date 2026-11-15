'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { safeCover } from '@/lib/covers'
import type { Libro } from '@/lib/types'

export default function LecturaActual({ libros }: { libros: Libro[] }) {
  const libro =
    libros.find(item => item.estado === 'Leyendo') ??
    libros.find(item => item.estado === 'Pendiente')
  const [portadaFallida, setPortadaFallida] = useState<string | null>(null)
  const portada = safeCover(libro?.portada_url)
  const leyendo = libro?.estado === 'Leyendo'
  return (
    <section className="dashboard-next" aria-labelledby="next-reading-title">
      <Image
        className="dashboard-landscape"
        src="/brand/reading-river.webp"
        width={768}
        height={512}
        sizes="(min-width: 800px) 45vw, 100vw"
        alt=""
      />
      <div className="dashboard-next-content">
        <h3 id="next-reading-title">
          {leyendo
            ? 'Tu historia sigue aquí'
            : libro
              ? 'Una historia por abrir'
              : 'Hazle lugar a otra historia'}
        </h3>
        {libro ? (
          <div className="dashboard-current-book">
            {portada && portadaFallida !== portada ? (
              <img
                className="dashboard-book-cover"
                src={portada}
                alt=""
                referrerPolicy="no-referrer"
                onError={() => setPortadaFallida(portada)}
              />
            ) : (
              <BookOpen aria-hidden="true" className="dashboard-book-symbol" />
            )}
            <div className="min-w-0">
              <p className="dashboard-book-title">{libro.titulo}</p>
              {libro.autores?.length ? (
                <p className="dashboard-book-author">
                  {libro.autores.join(', ')}
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="dashboard-next-invitation">
            {libros.length
              ? 'Lo que leíste ya forma parte de ti. ¿Qué te gustaría descubrir ahora?'
              : 'Empieza por ese libro que tienes entre manos o uno que te gustaría descubrir.'}
          </p>
        )}
        <Button asChild variant="secondary">
          <Link
            href={libro ? `/biblioteca/${libro.id}` : '/biblioteca/agregar'}
          >
            {leyendo
              ? 'Continuar leyendo'
              : libro
                ? 'Abrir este libro'
                : 'Encontrar mi próxima lectura'}
            <ArrowRight aria-hidden="true" data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
