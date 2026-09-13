'use client'

import { useMemo, useState } from 'react'
import LibroCard from './LibroCard'
import FiltrosOrdenamiento, { Ordenamiento } from './FiltrosOrdenamiento'
import type { Libro, EstadoLectura, ProcedenciaLibro } from '@/lib/types'

export default function LibrosGrid({ libros }: { libros: Libro[] }) {
  const [busqueda, setBusqueda] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoLectura | 'Todos'>('Todos')
  const [anioFiltro, setAnioFiltro] = useState('Todos')
  const [procedenciaFiltro, setProcedenciaFiltro] = useState<ProcedenciaLibro | 'Todos'>('Todos')
  const [orden, setOrden] = useState<Ordenamiento>('actualizado')

  const aniosDisponibles = useMemo(() => {
    const anios = new Set<number>()
    libros.forEach(l => { if (l.anio_lectura) anios.add(l.anio_lectura) })
    return Array.from(anios).sort((a, b) => b - a)
  }, [libros])

  const librosFiltrados = useMemo(() => {
    let resultado = libros

    if (estadoFiltro !== 'Todos') {
      resultado = resultado.filter(l => l.estado === estadoFiltro)
    }

    if (anioFiltro !== 'Todos') {
      resultado = resultado.filter(l => l.anio_lectura === Number(anioFiltro))
    }

    if (procedenciaFiltro !== 'Todos') {
      resultado = resultado.filter(l => l.procedencia === procedenciaFiltro)
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
  }, [libros, busqueda, estadoFiltro, anioFiltro, procedenciaFiltro, orden])

  return (
    <div>
      <FiltrosOrdenamiento
        busqueda={busqueda} onBusquedaChange={setBusqueda}
        estadoFiltro={estadoFiltro} onEstadoChange={setEstadoFiltro}
        anioFiltro={anioFiltro} onAnioChange={setAnioFiltro} aniosDisponibles={aniosDisponibles}
        procedenciaFiltro={procedenciaFiltro} onProcedenciaChange={setProcedenciaFiltro}
        orden={orden} onOrdenChange={setOrden}
      />

      {anioFiltro !== 'Todos' && (
        <p className="text-sm text-gray-500 mb-4">
          {librosFiltrados.length} {librosFiltrados.length === 1 ? 'libro leído' : 'libros leídos'} en {anioFiltro}
        </p>
      )}

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