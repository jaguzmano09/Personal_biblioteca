'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import BuscadorGoogleBooks from '@/components/libros/BuscadorGoogleBooks'
import LibroFormPersonal from '@/components/libros/LibroFormPersonal'
import type { GoogleBookResult } from '@/lib/types'

export default function AgregarLibroPage() {
  const [libroSeleccionado, setLibroSeleccionado] = useState<GoogleBookResult | null>(null)

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Link
        href="/biblioteca"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a la biblioteca
      </Link>

      <h1 className="text-2xl font-bold mb-6">Agregar libro</h1>

      {!libroSeleccionado ? (
        <BuscadorGoogleBooks onSeleccionar={setLibroSeleccionado} />
      ) : (
        <LibroFormPersonal
          libroSeleccionado={libroSeleccionado}
          onCancelar={() => setLibroSeleccionado(null)}
        />
      )}
    </div>
  )
}