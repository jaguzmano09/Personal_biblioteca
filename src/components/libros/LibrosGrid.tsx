'use client'

import { useMemo, useState } from 'react'
import LibroCard from './LibroCard'
import FiltrosOrdenamiento, { Ordenamiento } from './FiltrosOrdenamiento'
import type { Libro, EstadoLectura } from '@/lib/types'

export default function LibrosGrid({ libros }: { libros: Libro[] }) {
  const [busqueda, setBusqueda] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoLectura | 'Todos'>('Todos')
  const [orden, setOrden] = useState<Ordenamiento>('actualizado')

  const librosFiltrados = useMemo(() => {
    let resultado = libros

    if (estadoFiltro !== 'Todos') {
      resultado = resultado.filter(l => l.estado === estadoFiltro)
    }

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase()
      resultado = resultado.filter(l =>
        l.titulo.toLowerCase().includes(q) ||
        l.autores?.some(a => a.toLowerCase().includes(q))
      )
    }

    resultado = [...resultado].sort((a, b) => {
      if (orden === 'puntuacion') return (b.puntuacion ?? 0) - (a.puntuacion ?? 0)
      if (orden === 'titulo') return a.titulo.localeCompare(b.titulo)
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

    return resultado
  }, [libros, busqueda, estadoFiltro, orden])

  return (
    <div>
      <FiltrosOrdenamiento
        busqueda={busqueda} onBusquedaChange={setBusqueda}
        estadoFiltro={estadoFiltro} onEstadoChange={setEstadoFiltro}
        orden={orden} onOrdenChange={setOrden}
      />

      {librosFiltrados.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No se encontraron libros.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {librosFiltrados.map(libro => (
            <LibroCard key={libro.id} libro={libro} />
          ))}
        </div>
      )}
    </div>
  )
}