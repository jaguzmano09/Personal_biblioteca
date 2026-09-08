'use client'

import { useState } from 'react'
import BuscadorGoogleBooks from '@/components/libros/BuscadorGoogleBooks'
import LibroFormPersonal from '@/components/libros/LibroFormPersonal'
import type { GoogleBookResult } from '@/lib/types'

export default function AgregarLibroPage() {
  const [libroSeleccionado, setLibroSeleccionado] = useState<GoogleBookResult | null>(null)

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
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