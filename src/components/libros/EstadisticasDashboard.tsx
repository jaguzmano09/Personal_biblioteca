'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { Pencil, Check, Sparkle } from 'lucide-react'
import { guardarMeta, obtenerMeta } from '@/lib/metas'
import { readingStatistics } from '@/lib/statistics'
import type { Libro } from '@/lib/types'

interface Props {
  libros: Libro[]
  metaInicial: number | null
  anioActual: number
}

export default function EstadisticasDashboard({ libros, metaInicial, anioActual }: Props) {
  const [anioSeleccionado, setAnioSeleccionado] = useState(anioActual)
  const [meta, setMeta] = useState(metaInicial)
  const [error, setError] = useState<string | null>(null)
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

  useEffect(() => {
    let active = true
    setError(null)
    setMeta(null)
    setCargandoMeta(true)
    setEditandoMeta(false)
    obtenerMeta(anioSeleccionado)
      .then(value => { if (active) { setMeta(value); setMetaInput(value?.toString() ?? '') } })
      .catch(() => { if (active) setError('No se pudo cargar la meta. Vuelve a seleccionar el año.') })
      .finally(() => { if (active) setCargandoMeta(false) })
    return () => { active = false }
  }, [anioSeleccionado, metaInicial])

  const stats = useMemo(() => readingStatistics(libros, anioSeleccionado), [libros, anioSeleccionado])

  function handleGuardarMeta() {
    const valor = Number(metaInput)
    if (!Number.isSafeInteger(valor) || valor <= 0 || valor > 100000) {
      setError('La meta debe ser un entero entre 1 y 100000.'); return
    }
    setError(null)

    startTransition(async () => {
      try {
        await guardarMeta(anioSeleccionado, valor)
        setMeta(valor)
        setEditandoMeta(false)
      } catch { setError('No se pudo guardar la meta. Inténtalo de nuevo.') }
    })
  }

  const progreso = meta ? Math.min(100, Math.round((stats.total / meta) * 100)) : 0

  const metaCumplida = meta !== null && stats.total >= meta
  const numero = new Intl.NumberFormat('es-CO')
  const metricas = [
    { label: 'Libros leídos', value: numero.format(stats.total) },
    { label: 'Páginas leídas', value: numero.format(stats.totalPaginas) },
    {
      label: 'Puntuación promedio',
      value: stats.promedioPuntuacion === null ? '—' : stats.promedioPuntuacion.toLocaleString('es-CO', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    },
  ]

  return (
    <aside aria-labelledby="reading-notes-title" className="min-w-0 border-t border-rule pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
      <h2 id="reading-notes-title" className="font-display text-3xl italic text-cloth">Notas al margen</h2>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label htmlFor="statistics-year" className="font-mono text-xs uppercase tracking-wide text-ink/75">Año de lectura</label>
        <select
          id="statistics-year"
          disabled={isPending}
          value={anioSeleccionado}
          onChange={e => setAnioSeleccionado(Number(e.target.value))}
          className="editorial-input w-auto py-2"
        >
          {aniosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <dl className="mt-4 divide-y divide-rule">
        {metricas.map(({ label, value }) => (
          <div key={label} className="flex items-baseline justify-between gap-3 py-3">
            <dt className="text-sm text-ink/80">{label}</dt>
            <dd className="font-display text-2xl tabular-nums text-cloth">{value}</dd>
          </div>
        ))}
        <div className="py-3">
          <dt className="text-sm text-ink/80">Autor más repetido</dt>
          <dd className="mt-1 wrap-break-word font-display text-lg text-cloth">{stats.autorTop ?? '—'}</dd>
        </div>
      </dl>

      <section aria-labelledby="reading-goal-title" aria-busy={cargandoMeta || isPending} className="mt-4 border-t border-rule pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="reading-goal-title" className="font-mono text-xs uppercase tracking-wide text-ink/75">Meta {anioSeleccionado}</h3>
          {!cargandoMeta && !editandoMeta && (
            <button type="button" onClick={() => setEditandoMeta(true)} className="editorial-link inline-flex min-h-11 items-center gap-1.5 text-xs">
              {meta ? 'Editar meta' : 'Definir meta'} <Pencil aria-hidden="true" className="size-3" />
            </button>
          )}
        </div>

        {error && <p role="alert" className="editorial-alert my-2">{error}</p>}
        {cargandoMeta && <p role="status" className="mt-2 text-sm text-ink/75">Cargando meta…</p>}

        {!cargandoMeta && editandoMeta && (
          <form className="my-3 flex items-center gap-2" onSubmit={e => { e.preventDefault(); handleGuardarMeta() }}>
            <input
              type="number"
              aria-label="Número de libros de la meta"
              required
              max="100000"
              step="1"
              min="1"
              autoFocus
              value={metaInput}
              onChange={e => setMetaInput(e.target.value)}
              className="editorial-input min-w-0"
            />
            <button type="submit" aria-label="Guardar meta" disabled={isPending} className="editorial-button">
              <Check aria-hidden="true" className="size-4" />
            </button>
          </form>
        )}

        {meta !== null && !cargandoMeta ? (
          <div className="mt-3">
            {metaCumplida && (
              <div className="my-5 flex items-center justify-center gap-2 text-stamp-dark">
                <span className="inline-block -rotate-3 rounded-[50%] border-4 border-double border-stamp-dark px-5 py-2 text-center font-display text-lg leading-tight">
                  Meta cumplida
                </span>
                <Sparkle aria-hidden="true" className="size-5 shrink-0 fill-gilt text-gilt" />
              </div>
            )}
            <div role="progressbar" aria-label="Progreso de la meta anual" aria-valuenow={progreso} className="h-1.5 overflow-hidden rounded-full bg-rule/55">
              <div className="h-full bg-cloth motion-safe:transition-all" style={{ width: `${progreso}%` }} />
            </div>
            <p className="mt-2 font-display text-lg italic text-ink/85">{numero.format(stats.total)} de {numero.format(meta)} libros</p>
          </div>
        ) : !cargandoMeta && !editandoMeta && (
          <p className="mt-2 text-sm leading-relaxed text-ink/75">¿Cuántos libros te gustaría leer este año?</p>
        )}
      </section>
    </aside>
  )
}
