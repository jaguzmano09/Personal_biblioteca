'use client'

import type { EstadoLectura } from '@/lib/types'

export type Ordenamiento = 'puntuacion' | 'actualizado' | 'titulo'

interface Props {
  busqueda: string
  onBusquedaChange: (v: string) => void
  estadoFiltro: EstadoLectura | 'Todos'
  onEstadoChange: (v: EstadoLectura | 'Todos') => void
  orden: Ordenamiento
  onOrdenChange: (v: Ordenamiento) => void
}

const ESTADOS: (EstadoLectura | 'Todos')[] = ['Todos', 'Pendiente', 'Leyendo', 'Leído', 'Abandonado']

export default function FiltrosOrdenamiento({
  busqueda, onBusquedaChange,
  estadoFiltro, onEstadoChange,
  orden, onOrdenChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 items-center mb-6">
      <input
        type="text"
        placeholder="Buscar en tu biblioteca..."
        value={busqueda}
        onChange={e => onBusquedaChange(e.target.value)}
        className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />

      <select
        value={estadoFiltro}
        onChange={e => onEstadoChange(e.target.value as EstadoLectura | 'Todos')}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      >
        {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
      </select>

      <select
        value={orden}
        onChange={e => onOrdenChange(e.target.value as Ordenamiento)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      >
        <option value="actualizado">Actualizado recientemente</option>
        <option value="puntuacion">Mejor puntuados</option>
        <option value="titulo">Título (A-Z)</option>
      </select>
    </div>
  )
}