'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import BuscadorGoogleBooks from '@/components/libros/BuscadorGoogleBooks'
import LibroFormPersonal from '@/components/libros/LibroFormPersonal'
import type { GoogleBookResult } from '@/lib/types'

export default function AgregarLibroPage() {
  const [libroSeleccionado, setLibroSeleccionado] =
    useState<GoogleBookResult | null>(null)
  const titulo = useRef<HTMLHeadingElement>(null)
  const ultimaSeleccion = useRef<HTMLElement | null>(null)

  function seleccionar(libro: GoogleBookResult) {
    ultimaSeleccion.current = document.activeElement as HTMLElement
    setLibroSeleccionado(libro)
    requestAnimationFrame(() => titulo.current?.focus())
  }

  function volverABuscar() {
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

      <h1
        ref={titulo}
        tabIndex={-1}
        className="font-display text-3xl leading-tight text-cloth sm:text-4xl"
      >
        {libroSeleccionado
          ? 'Un lugar en tu biblioteca'
          : 'Encuentra tu próxima historia'}
      </h1>
      <p className="mb-7 mt-3 text-sm leading-relaxed text-ink/75">
        {libroSeleccionado
          ? 'Guarda esta edición y lo que quieras recordar de ella.'
          : 'Busca el libro que quieres guardar y elige tu edición.'}
      </p>

      <div hidden={!!libroSeleccionado}>
        <BuscadorGoogleBooks onSeleccionar={seleccionar} />
      </div>
      {libroSeleccionado && (
        <LibroFormPersonal
          libroSeleccionado={libroSeleccionado}
          onCancelar={volverABuscar}
        />
      )}
    </main>
  )
}
