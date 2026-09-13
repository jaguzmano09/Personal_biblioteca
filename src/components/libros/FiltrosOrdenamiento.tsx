'use client'

import type { EstadoLectura, ProcedenciaLibro } from '@/lib/types'

export type Ordenamiento = 'puntuacion' | 'actualizado' | 'titulo'

interface Props {
  busqueda: string
  onBusquedaChange: (v: string) => void
  estadoFiltro: EstadoLectura | 'Todos'
  onEstadoChange: (v: EstadoLectura | 'Todos') => void
  anioFiltro: string
  onAnioChange: (v: string) => void
  aniosDisponibles: number[]
  procedenciaFiltro: ProcedenciaLibro | 'Todos'
  onProcedenciaChange: (v: ProcedenciaLibro | 'Todos') => void
  orden: Ordenamiento
  onOrdenChange: (v: Ordenamiento) => void
}

const ESTADOS: (EstadoLectura | 'Todos')[] = ['Todos', 'Pendiente', 'Leyendo', 'Leído', 'Abandonado']
const PROCEDENCIAS: (ProcedenciaLibro | 'Todos')[] = ['Todos', 'Casa de mis papás', 'Regalado', 'Comprado']

export default function FiltrosOrdenamiento({
  busqueda, onBusquedaChange,
  estadoFiltro, onEstadoChange,
  anioFiltro, onAnioChange, aniosDisponibles,
  procedenciaFiltro, onProcedenciaChange,
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
        value={anioFiltro}
        onChange={e => onAnioChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      >
        <option value="Todos">Todos los años</option>
        {aniosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
      </select>

      <select
        value={procedenciaFiltro}
        onChange={e => onProcedenciaChange(e.target.value as ProcedenciaLibro | 'Todos')}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      >
        {PROCEDENCIAS.map(p => <option key={p} value={p}>{p}</option>)}
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