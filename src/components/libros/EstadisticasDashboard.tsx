'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { Pencil, Check } from 'lucide-react'
import { guardarMeta, obtenerMeta } from '@/lib/metas'
import type { Libro } from '@/lib/types'

interface Props {
  libros: Libro[]
  metaInicial: number | null
  anioActual: number
}

export default function EstadisticasDashboard({ libros, metaInicial, anioActual }: Props) {
  const [anioSeleccionado, setAnioSeleccionado] = useState(anioActual)
  const [meta, setMeta] = useState(metaInicial)
  const [cargandoMeta, setCargandoMeta] = useState(false)

  const [editandoMeta, setEditandoMeta] = useState(false)
  const [metaInput, setMetaInput] = useState(metaInicial?.toString() ?? '')
  const [isPending, startTransition] = useTransition()

  const aniosDisponibles = useMemo(() => {
    const anios = new Set<number>()
    anios.add(anioActual) // siempre disponible, aunque no tenga libros aún
    libros.forEach(l => { if (l.anio_lectura) anios.add(l.anio_lectura) })
    return Array.from(anios).sort((a, b) => b - a)
  }, [libros, anioActual])

  // Cada vez que cambia el año seleccionado (y no es el año inicial), busca su meta
  useEffect(() => {
    if (anioSeleccionado === anioActual) {
      setMeta(metaInicial)
      setMetaInput(metaInicial?.toString() ?? '')
      return
    }

    setCargandoMeta(true)
    obtenerMeta(anioSeleccionado)
      .then(valor => {
        setMeta(valor)
        setMetaInput(valor?.toString() ?? '')
      })
      .finally(() => setCargandoMeta(false))
  }, [anioSeleccionado, anioActual, metaInicial])

  const stats = useMemo(() => {
    const librosDelAnio = libros.filter(l => l.anio_lectura === anioSeleccionado)

    const conPuntuacion = librosDelAnio.filter(l => l.puntuacion != null)
    const promedioPuntuacion = conPuntuacion.length
      ? conPuntuacion.reduce((sum, l) => sum + (l.puntuacion ?? 0), 0) / conPuntuacion.length
      : null

    const conteoAutores = new Map<string, number>()
    librosDelAnio.forEach(l => {
      l.autores?.forEach(a => conteoAutores.set(a, (conteoAutores.get(a) ?? 0) + 1))
    })
    let autorTop: string | null = null
    let maxConteo = 1
    conteoAutores.forEach((count, autor) => {
      if (count > maxConteo) {
        maxConteo = count
        autorTop = autor
      }
    })

    const totalPaginas = librosDelAnio
      .filter(l => l.estado === 'Leído')
      .reduce((sum, l) => sum + (l.paginas ?? 0), 0)

    return { total: librosDelAnio.length, promedioPuntuacion, autorTop, totalPaginas }
  }, [libros, anioSeleccionado])

  function handleGuardarMeta() {
    const valor = Number(metaInput)
    if (!valor || valor <= 0) return

    startTransition(async () => {
      await guardarMeta(anioSeleccionado, valor)
      setMeta(valor)
      setEditandoMeta(false)
    })
  }

  const progreso = meta ? Math.min(100, Math.round((stats.total / meta) * 100)) : 0

  return (
    <div className="border border-rule mb-8">
      <div className="flex justify-between items-center px-4 pt-4">
        <p className="font-mono text-[10px] text-ink/50 uppercase tracking-wide">Estadísticas de</p>
        <select
          value={anioSeleccionado}
          onChange={e => setAnioSeleccionado(Number(e.target.value))}
          className="font-mono text-sm border border-rule px-2 py-1 bg-paper"
        >
          {aniosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-rule border-b border-rule mt-3">
        <div className="p-4">
          <p className="font-mono text-[10px] text-ink/50 uppercase tracking-wide">Leídos en {anioSeleccionado}</p>
          <p className="font-display text-2xl mt-1">{stats.total}</p>
        </div>
        <div className="p-4">
          <p className="font-mono text-[10px] text-ink/50 uppercase tracking-wide">Puntuación promedio</p>
          <p className="font-display text-2xl mt-1">
            {stats.promedioPuntuacion != null ? stats.promedioPuntuacion.toFixed(1) : '—'}
          </p>
        </div>
        <div className="p-4">
          <p className="font-mono text-[10px] text-ink/50 uppercase tracking-wide">Autor más repetido</p>
          <p className="font-display text-lg mt-1 truncate">{stats.autorTop ?? '—'}</p>
        </div>
        <div className="p-4">
          <p className="font-mono text-[10px] text-ink/50 uppercase tracking-wide">Páginas leídas</p>
          <p className="font-display text-2xl mt-1">{stats.totalPaginas.toLocaleString()}</p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="font-mono text-[10px] text-ink/50 uppercase tracking-wide">
            Meta {anioSeleccionado}
          </p>

          {cargandoMeta ? (
            <span className="font-mono text-xs text-ink/40">Cargando...</span>
          ) : editandoMeta ? (
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="1"
                autoFocus
                value={metaInput}
                onChange={e => setMetaInput(e.target.value)}
                className="w-16 border border-rule px-1.5 py-0.5 text-xs font-mono"
              />
              <button onClick={handleGuardarMeta} disabled={isPending} className="text-cloth-dark">
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditandoMeta(true)}
              className="flex items-center gap-1 font-mono text-xs text-ink/50 hover:text-ink"
            >
              {meta ? `${meta} libros` : 'Definir meta'} <Pencil className="w-3 h-3" />
            </button>
          )}
        </div>

        {meta ? (
          <div className="h-2 bg-rule/30 w-full">
            <div className="h-full bg-cloth transition-all" style={{ width: `${progreso}%` }} />
          </div>
        ) : (
          !cargandoMeta && <p className="font-mono text-xs text-ink/40">Define cuántos libros quieres leer este año.</p>
        )}

        {meta && !cargandoMeta && (
          <p className="font-mono text-xs text-ink/50 mt-1">
            {stats.total} de {meta} · {progreso}%
          </p>
        )}
      </div>
    </div>
  )
}