'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
import type { EstadoLectura, ProcedenciaLibro } from '@/lib/types'

export type Ordenamiento = 'puntuacion' | 'actualizado' | 'titulo'
interface Props {
  busqueda: string
  onBusquedaChange: (value: string) => void
  estadoFiltro: EstadoLectura | 'Todos'
  onEstadoChange: (value: EstadoLectura | 'Todos') => void
  anioFiltro: string
  onAnioChange: (value: string) => void
  aniosDisponibles: number[]
  procedenciaFiltro: ProcedenciaLibro | 'Todos'
  onProcedenciaChange: (value: ProcedenciaLibro | 'Todos') => void
  orden: Ordenamiento
  onOrdenChange: (value: Ordenamiento) => void
}
const ESTADOS: (EstadoLectura | 'Todos')[] = [
  'Todos',
  'Pendiente',
  'Leyendo',
  'Leído',
  'Abandonado'
]
const PROCEDENCIAS: (ProcedenciaLibro | 'Todos')[] = [
  'Todos',
  'Casa de mis papás',
  'Regalado',
  'Comprado'
]

export default function FiltrosOrdenamiento({
  busqueda,
  onBusquedaChange,
  estadoFiltro,
  onEstadoChange,
  anioFiltro,
  onAnioChange,
  aniosDisponibles,
  procedenciaFiltro,
  onProcedenciaChange,
  orden,
  onOrdenChange
}: Props) {
  return (
    <div className="mb-4 space-y-5">
      <div>
        <label
          htmlFor="library-search"
          className="mb-3 block font-display text-2xl text-cloth"
        >
          Encuentra entre tus páginas
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-4 size-5 text-cloth"
          />
          <input
            id="library-search"
            type="search"
            value={busqueda}
            onChange={event => onBusquedaChange(event.target.value)}
            placeholder="Título o autor"
            className="editorial-input pl-11"
          />
        </div>
      </div>
      <fieldset>
        <legend className="sr-only">Estado de lectura</legend>
        <div className="reading-tabs">
          {ESTADOS.map(value => (
            <button
              key={value}
              type="button"
              aria-pressed={estadoFiltro === value}
              onClick={() => onEstadoChange(value)}
              className="reading-tab"
            >
              {value}
            </button>
          ))}
        </div>
      </fieldset>
      <details className="border-b border-rule pb-2">
        <summary className="flex min-h-12 cursor-pointer items-center gap-2 text-sm text-cloth">
          <SlidersHorizontal aria-hidden="true" className="size-4" /> Ordenar y
          filtrar
          {(anioFiltro !== 'Todos' ||
            procedenciaFiltro !== 'Todos' ||
            orden !== 'actualizado') && (
            <span className="font-medium">· filtros activos</span>
          )}
        </summary>
        <div className="grid gap-4 pb-3 pt-2 sm:grid-cols-3">
          <label className="space-y-2 text-sm">
            Año de lectura
            <select
              aria-label="Año de lectura"
              value={anioFiltro}
              onChange={event => onAnioChange(event.target.value)}
              className="editorial-input min-w-0"
            >
              <option value="Todos">Todos los años</option>
              {aniosDisponibles.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm">
            Procedencia
            <select
              aria-label="Procedencia"
              value={procedenciaFiltro}
              onChange={event =>
                onProcedenciaChange(
                  event.target.value as ProcedenciaLibro | 'Todos'
                )
              }
              className="editorial-input min-w-0"
            >
              {PROCEDENCIAS.map(value => (
                <option key={value} value={value}>
                  {value === 'Todos' ? 'Toda procedencia' : value}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm">
            Orden del catálogo
            <select
              aria-label="Orden del catálogo"
              value={orden}
              onChange={event =>
                onOrdenChange(event.target.value as Ordenamiento)
              }
              className="editorial-input min-w-0"
            >
              <option value="actualizado">Más recientes</option>
              <option value="puntuacion">Mejor puntuados</option>
              <option value="titulo">Título (A-Z)</option>
            </select>
          </label>
        </div>
      </details>
    </div>
  )
}
