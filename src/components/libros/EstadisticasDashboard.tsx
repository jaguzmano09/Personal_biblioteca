'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { Check, Leaf, Pencil, RotateCcw } from 'lucide-react'
import { guardarMeta, obtenerMeta } from '@/lib/metas'
import { readingStatistics } from '@/lib/statistics'
import type { Libro } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import LecturaActual from './LecturaActual'

interface Props {
  libros: Libro[]
  metaInicial: number | null
  anioActual: number
}

export default function EstadisticasDashboard({
  libros,
  metaInicial,
  anioActual
}: Props) {
  const [anioSeleccionado, setAnioSeleccionado] = useState(anioActual)
  const [meta, setMeta] = useState(metaInicial)
  const [anioMeta, setAnioMeta] = useState(anioActual)
  const [errorCarga, setErrorCarga] = useState(false)
  const [reintento, setReintento] = useState(0)
  const [cargandoMeta, setCargandoMeta] = useState(false)
  const [editandoMeta, setEditandoMeta] = useState(false)
  const [metaInput, setMetaInput] = useState(metaInicial?.toString() ?? '')
  const [error, setError] = useState<string | null>(null)
  const [guardada, setGuardada] = useState(false)
  const [isPending, startTransition] = useTransition()
  const editarButton = useRef<HTMLButtonElement>(null)

  const aniosDisponibles = useMemo(() => {
    const anios = new Set([anioActual])
    libros.forEach(libro => {
      if (libro.anio_lectura) anios.add(libro.anio_lectura)
    })
    return Array.from(anios).sort((a, b) => b - a)
  }, [libros, anioActual])

  useEffect(() => {
    let active = true
    setCargandoMeta(true)
    setErrorCarga(false)
    setError(null)
    setEditandoMeta(false)
    obtenerMeta(anioSeleccionado)
      .then(value => {
        if (active) {
          setMeta(value)
          setMetaInput(value?.toString() ?? '')
        }
      })
      .catch(() => {
        if (active) setErrorCarga(true)
      })
      .finally(() => {
        if (active) {
          setAnioMeta(anioSeleccionado)
          setCargandoMeta(false)
        }
      })
    return () => {
      active = false
    }
  }, [anioSeleccionado, metaInicial, reintento])

  const stats = useMemo(
    () => readingStatistics(libros, anioSeleccionado),
    [libros, anioSeleccionado]
  )
  const cargando = cargandoMeta || anioMeta !== anioSeleccionado
  const progreso = meta ? Math.min(100, (stats.total / meta) * 100) : 0
  const cumplida = meta !== null && stats.total >= meta
  const numero = new Intl.NumberFormat('es-CO')
  const restantes = meta === null ? 0 : Math.max(0, meta - stats.total)
  const motivacion = cumplida
    ? 'Cada nueva lectura suma a tu recorrido.'
    : anioSeleccionado < anioActual
      ? `Así fue tu recorrido en ${anioSeleccionado}. Cada lectura dejó su huella.`
      : stats.total === 0
        ? 'Tu primera lectura abre el camino. Empieza a tu ritmo.'
        : restantes === 1
          ? 'Una historia más y llegas a tu meta. A tu ritmo.'
          : `Te quedan ${numero.format(restantes)} historias. Una página a la vez.`

  function cerrarEdicion() {
    setEditandoMeta(false)
    setError(null)
    requestAnimationFrame(() => editarButton.current?.focus())
  }

  function handleGuardarMeta() {
    if (isPending) return
    const valor = Number(metaInput)
    if (!Number.isSafeInteger(valor) || valor <= 0 || valor > 100000) {
      setError('Elige un número entero entre 1 y 100000.')
      return
    }
    setError(null)
    startTransition(async () => {
      try {
        await guardarMeta(anioSeleccionado, valor)
        setMeta(valor)
        setGuardada(true)
        cerrarEdicion()
      } catch {
        setError(
          'No se pudo guardar la meta. Tu cambio sigue aquí para reintentarlo.'
        )
      }
    })
  }

  return (
    <section
      className="reading-dashboard"
      aria-labelledby="reading-notes-title"
    >
      <header className="dashboard-heading">
        <h2 id="reading-notes-title">Tu ritmo de lectura</h2>
        <Field orientation="horizontal" className="dashboard-year">
          <FieldLabel
            htmlFor="statistics-year"
            className="sr-only sm:not-sr-only"
          >
            Año de lectura
          </FieldLabel>
          <NativeSelect
            id="statistics-year"
            disabled={isPending}
            value={anioSeleccionado}
            onChange={event => {
              setGuardada(false)
              setAnioSeleccionado(Number(event.target.value))
            }}
          >
            {aniosDisponibles.map(anio => (
              <NativeSelectOption key={anio} value={anio}>
                {anio}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
      </header>
      <div className="dashboard-spread">
        <section
          className="dashboard-goal"
          aria-labelledby="reading-goal-title"
          aria-busy={cargando || isPending}
        >
          <div className="dashboard-goal-heading">
            <h3 id="reading-goal-title">Meta {anioSeleccionado}</h3>
            {!cargando && !errorCarga && !editandoMeta && (
              <Button
                ref={editarButton}
                type="button"
                variant="link"
                onClick={() => {
                  setMetaInput(meta?.toString() ?? '')
                  setGuardada(false)
                  setEditandoMeta(true)
                }}
              >
                <Pencil aria-hidden="true" data-icon="inline-start" />{' '}
                {meta ? 'Editar meta' : 'Definir meta'}
              </Button>
            )}
          </div>
          {cargando ? (
            <div className="flex flex-col gap-4 py-3" role="status">
              <span className="sr-only">Cargando meta…</span>
              <Skeleton className="h-9 w-40" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          ) : errorCarga ? (
            <Alert variant="destructive">
              <AlertDescription>
                No se pudo cargar la meta de {anioSeleccionado}.
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3"
                  onClick={() => setReintento(value => value + 1)}
                >
                  <RotateCcw aria-hidden="true" data-icon="inline-start" />{' '}
                  Reintentar
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {meta !== null ? (
                <div className="goal-progress">
                  <p className="goal-fraction">
                    <strong>{numero.format(stats.total)}</strong> de{' '}
                    {numero.format(meta)} libros
                  </p>
                  <Progress
                    value={progreso}
                    aria-label={`Progreso de la meta ${anioSeleccionado}`}
                    aria-valuetext={`${numero.format(stats.total)} de ${numero.format(meta)} libros leídos`}
                  />
                  <p className="goal-message">
                    {cumplida && (
                      <span className="goal-achieved">
                        <Leaf aria-hidden="true" /> Meta cumplida.{' '}
                      </span>
                    )}
                    {motivacion}
                  </p>
                </div>
              ) : (
                <div className="goal-invitation">
                  <p>Una historia puede ser el comienzo.</p>
                  <p>
                    {anioSeleccionado < anioActual
                      ? 'Puedes guardar una meta para este año de tu recorrido.'
                      : 'Elige cuántos libros te gustaría leer. La meta la decides tú.'}
                  </p>
                </div>
              )}
              {editandoMeta && (
                <form
                  className="goal-form"
                  onSubmit={event => {
                    event.preventDefault()
                    handleGuardarMeta()
                  }}
                >
                  <FieldGroup>
                    <Field data-invalid={!!error} data-disabled={isPending}>
                      <FieldLabel htmlFor="goal-count">
                        Número de libros de la meta
                      </FieldLabel>
                      <Input
                        id="goal-count"
                        type="number"
                        inputMode="numeric"
                        required
                        min={1}
                        max={100000}
                        step={1}
                        autoFocus
                        disabled={isPending}
                        value={metaInput}
                        aria-invalid={!!error}
                        aria-describedby={error ? 'goal-error' : undefined}
                        onChange={event => setMetaInput(event.target.value)}
                      />
                    </Field>
                  </FieldGroup>
                  {error && (
                    <Alert variant="destructive" id="goal-error">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={isPending}>
                      <Check aria-hidden="true" data-icon="inline-start" />{' '}
                      {isPending ? 'Guardando…' : 'Guardar meta'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isPending}
                      onClick={cerrarEdicion}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}
              {guardada && (
                <p role="status" className="goal-saved">
                  Meta guardada. Sigue a tu ritmo.
                </p>
              )}
            </>
          )}
        </section>
        <LecturaActual libros={libros} />
      </div>
      <dl
        className="dashboard-metrics"
        aria-label={`Lecturas terminadas en ${anioSeleccionado}`}
      >
        <div>
          <dt>Libros leídos</dt>
          <dd>{numero.format(stats.total)}</dd>
        </div>
        <div>
          <dt>Páginas leídas</dt>
          <dd>{numero.format(stats.totalPaginas)}</dd>
        </div>
        <div>
          <dt>Puntuación media</dt>
          <dd>
            {stats.promedioPuntuacion === null
              ? '—'
              : stats.promedioPuntuacion.toLocaleString('es-CO', {
                  maximumFractionDigits: 1
                })}
            <span>{stats.promedioPuntuacion === null ? '' : ' / 10'}</span>
          </dd>
        </div>
      </dl>
      {stats.autorTop && (
        <p className="dashboard-author">
          Vuelves a las historias de <strong>{stats.autorTop}</strong>, tu autor
          más leído en {anioSeleccionado}.
        </p>
      )}
      <p className="dashboard-scope">
        Las cifras cuentan solo los libros terminados en {anioSeleccionado}.
      </p>
    </section>
  )
}
