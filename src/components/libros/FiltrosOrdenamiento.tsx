'use client'

import { Search } from 'lucide-react'
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
    <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="relative col-span-full">
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-cloth" />
        <input aria-label="Buscar en tu biblioteca"
          type="text"
          placeholder="Buscar en tu biblioteca..."
          value={busqueda}
          onChange={e => onBusquedaChange(e.target.value)}
          className="editorial-input pl-10"
        />
      </div>

      <select aria-label="Estado de lectura"
        value={estadoFiltro}
        onChange={e => onEstadoChange(e.target.value as EstadoLectura | 'Todos')}
        className="editorial-input min-w-0"
      >
        {ESTADOS.map(e => <option key={e} value={e}>{e === 'Todos' ? 'Todos los estados' : e}</option>)}
      </select>

      <select aria-label="Año de lectura"
        value={anioFiltro}
        onChange={e => onAnioChange(e.target.value)}
        className="editorial-input min-w-0"
      >
        <option value="Todos">Todos los años</option>
        {aniosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
      </select>

      <select aria-label="Procedencia"
        value={procedenciaFiltro}
        onChange={e => onProcedenciaChange(e.target.value as ProcedenciaLibro | 'Todos')}
        className="editorial-input min-w-0"
      >
        {PROCEDENCIAS.map(p => <option key={p} value={p}>{p === 'Todos' ? 'Toda procedencia' : p}</option>)}
      </select>

      <select aria-label="Orden del catálogo"
        value={orden}
        onChange={e => onOrdenChange(e.target.value as Ordenamiento)}
        className="editorial-input min-w-0"
      >
        <option value="actualizado">Actualizado recientemente</option>
        <option value="puntuacion">Mejor puntuados</option>
        <option value="titulo">Título (A-Z)</option>
      </select>
    </div>
  )
}
