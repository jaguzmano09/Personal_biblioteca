'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import BuscadorGoogleBooks from '@/components/libros/BuscadorGoogleBooks'
import LibroFormPersonal from '@/components/libros/LibroFormPersonal'
import type { BookMetadata } from '@/lib/types'
import LibroManual from '@/components/libros/LibroManual'
import { Button } from '@/components/ui/button'

export default function AgregarLibroPage() {
  const [libroSeleccionado, setLibroSeleccionado] =
    useState<BookMetadata | null>(null)
  const [manual, setManual] = useState(false)
  const titulo = useRef<HTMLHeadingElement>(null)
  const ultimaSeleccion = useRef<HTMLElement | null>(null)

  function seleccionar(libro: BookMetadata) {
    ultimaSeleccion.current = document.activeElement as HTMLElement
    setLibroSeleccionado(libro)
    requestAnimationFrame(() => titulo.current?.focus())
  }

  function volverABuscar() {
    setManual(false)
    setLibroSeleccionado(null)
    requestAnimationFrame(() => ultimaSeleccion.current?.focus())
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <Link
        href="/biblioteca"
        className="editorial-link mb-5 inline-flex min-h-11 items-center gap-2 text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a la biblioteca
      </Link>

      <div className="discovery-opening">
        <h1
          ref={titulo}
          tabIndex={-1}
          className="font-display text-4xl leading-tight text-cloth sm:text-5xl"
        >
          {libroSeleccionado
            ? 'Un lugar en tu biblioteca'
            : manual
              ? 'Un libro a tu manera'
              : 'Encuentra tu próxima historia'}
        </h1>
        <p className="mb-7 mt-3 text-sm leading-relaxed text-ink/75">
          {libroSeleccionado
            ? 'Guarda esta edición y lo que quieras recordar de ella.'
            : manual
              ? 'Escribe los datos que conoces. No necesitas una búsqueda externa.'
              : 'Busca el libro que quieres guardar y elige tu edición.'}
        </p>
      </div>
      <div hidden={!!libroSeleccionado || manual}>
        <BuscadorGoogleBooks onSeleccionar={seleccionar} />
        <div className="mt-6 border-t border-rule pt-5">
          <p className="mb-3 text-sm">
            ¿No aparece tu libro o prefieres escribir sus datos?
          </p>
          <Button
            variant="outline"
            onClick={() => {
              ultimaSeleccion.current = document.activeElement as HTMLElement
              setManual(true)
              requestAnimationFrame(() => titulo.current?.focus())
            }}
          >
            Añadir libro manualmente
          </Button>
        </div>
      </div>
      {manual && !libroSeleccionado && (
        <LibroManual onSeleccionar={seleccionar} onCancelar={volverABuscar} />
      )}
      {libroSeleccionado && (
        <LibroFormPersonal
          libroSeleccionado={libroSeleccionado}
          onCancelar={volverABuscar}
        />
      )}
    </main>
  )
}
