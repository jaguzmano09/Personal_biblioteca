'use client'

import { safeCover } from '@/lib/covers'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Bookmark, Pencil, Save, Leaf, Check } from 'lucide-react'
import { actualizarLibro, eliminarLibro, guardarNotaLibro } from '@/lib/libros'
import type {
  Libro,
  EstadoLectura,
  FormatoLectura,
  ProcedenciaLibro
} from '@/lib/types'

const ESTADOS: EstadoLectura[] = ['Pendiente', 'Leyendo', 'Leído', 'Abandonado']
const FORMATOS: FormatoLectura[] = ['Física', 'Digital']
const PROCEDENCIAS: ProcedenciaLibro[] = [
  'Casa de mis papás',
  'Regalado',
  'Comprado'
]

const READING_CONTEXT = {
  Leído: {
    label: 'Leído',
    heading: 'Lo que dejó esta lectura',
    prompt: '¿Qué escena o sensación se quedó contigo?'
  },
  Leyendo: {
    label: 'En lectura',
    heading: 'Entre páginas',
    prompt: '¿Qué impresión quieres recordar cuando vuelvas?'
  },
  Pendiente: {
    label: 'Pendiente',
    heading: 'Una historia por abrir',
    prompt: '¿Qué te hizo guardar este libro?'
  },
  Abandonado: {
    label: 'Abandonado',
    heading: 'Un libro al que puedes volver',
    prompt: '¿Qué te atrajo la primera vez?'
  }
} satisfies Record<
  EstadoLectura,
  { label: string; heading: string; prompt: string }
>

export default function LibroDetalle({ libro }: { libro: Libro }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [editando, setEditando] = useState(false)
  const [focoEdicion, setFocoEdicion] = useState<'estado' | 'notas'>('notas')
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [notaAnterior, setNotaAnterior] = useState<string | null>(null)
  const [borradorNota, setBorradorNota] = useState<string | null>(null)
  const [guardandoNota, setGuardandoNota] = useState(false)
  const [errorNota, setErrorNota] = useState(false)
  const [notaGuardada, setNotaGuardada] = useState(false)
  const [portadaFallida, setPortadaFallida] = useState<string | null>(null)

  const [estado, setEstado] = useState(libro.estado)
  const [puntuacion, setPuntuacion] = useState(
    libro.puntuacion?.toString() ?? ''
  )
  const [resumenAnalisis, setResumenAnalisis] = useState(
    libro.resumen_analisis ?? ''
  )
  const [personajeFavorito, setPersonajeFavorito] = useState(
    libro.personaje_favorito ?? ''
  )
  const [citasDestacadas, setCitasDestacadas] = useState(
    libro.citas_destacadas ?? ''
  )
  const [anioLectura, setAnioLectura] = useState(
    libro.anio_lectura?.toString() ?? ''
  )
  const [mesLectura, setMesLectura] = useState(
    libro.mes_lectura?.toString() ?? ''
  )
  const [formato, setFormato] = useState<FormatoLectura | ''>(
    libro.formato ?? ''
  )
  const [procedencia, setProcedencia] = useState<ProcedenciaLibro | ''>(
    libro.procedencia ?? ''
  )
  const [portadaUrl, setPortadaUrl] = useState(libro.portada_url ?? '')

  async function handleGuardar() {
    if (guardando || eliminando) return
    setError(null)
    setGuardando(true)
    try {
      await actualizarLibro(libro.id, {
        estado,
        puntuacion: puntuacion ? Number(puntuacion) : null,
        resumen_analisis: resumenAnalisis || null,
        personaje_favorito: personajeFavorito || null,
        citas_destacadas: citasDestacadas || null,
        anio_lectura: anioLectura ? Number(anioLectura) : null,
        mes_lectura: anioLectura && mesLectura ? Number(mesLectura) : null,
        formato: formato || null,
        procedencia: procedencia || null,
        portada_url: portadaUrl || null
      })
      setEditando(false)
      router.refresh()
    } catch {
      setError(
        'No se pudieron guardar los cambios. Revisa los campos e inténtalo de nuevo.'
      )
    } finally {
      setGuardando(false)
    }
  }

  async function handleEliminar() {
    if (!confirm(`¿Eliminar "${libro.titulo}" de tu biblioteca?`)) return
    setError(null)
    setEliminando(true)
    try {
      await eliminarLibro(libro.id)
      router.push('/biblioteca')
    } catch {
      setError('No se pudo eliminar el libro. Inténtalo de nuevo.')
    } finally {
      setEliminando(false)
    }
  }

  function abrirEdicion(destino: 'estado' | 'notas') {
    setEstado(destino === 'estado' ? 'Leyendo' : libro.estado)
    setPuntuacion(libro.puntuacion?.toString() ?? '')
    setResumenAnalisis(libro.resumen_analisis ?? '')
    setPersonajeFavorito(libro.personaje_favorito ?? '')
    setCitasDestacadas(libro.citas_destacadas ?? '')
    setAnioLectura(libro.anio_lectura?.toString() ?? '')
    setMesLectura(libro.mes_lectura?.toString() ?? '')
    setFormato(libro.formato ?? '')
    setProcedencia(libro.procedencia ?? '')
    setPortadaUrl(libro.portada_url ?? '')
    setError(null)
    setFocoEdicion(destino)
    setEditando(true)
  }

  async function guardarHuella() {
    if (borradorNota === null || guardandoNota) return
    setGuardandoNota(true)
    setErrorNota(false)
    try {
      await guardarNotaLibro(libro.id, borradorNota, notaAnterior)
      setBorradorNota(null)
      setNotaGuardada(true)
      router.refresh()
    } catch {
      setErrorNota(true)
    } finally {
      setGuardandoNota(false)
    }
  }

  const contexto = READING_CONTEXT[libro.estado]
  const portada = safeCover(libro.portada_url)
  const editandoNota = borradorNota !== null
  const fechaLectura = libro.anio_lectura
    ? libro.mes_lectura
      ? `${new Date(2000, libro.mes_lectura - 1).toLocaleDateString('es-CO', { month: 'long' })} de ${libro.anio_lectura}`
      : String(libro.anio_lectura)
    : null

  return (
    <main className="book-detail mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
      <Link
        href="/biblioteca"
        className="editorial-link mb-6 inline-flex min-h-11 items-center gap-2 text-sm"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Volver a la
        biblioteca
      </Link>

      <div
        className={
          editando
            ? ''
            : 'grid gap-y-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)] md:gap-x-10'
        }
      >
        <header
          className={
            editando
              ? 'grid gap-6 border-b border-rule pb-8 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8'
              : 'grid grid-cols-[6rem_minmax(0,1fr)] gap-4 border-b border-rule pb-6 md:block md:border-b-0 md:border-r md:pr-7'
          }
        >
          <div className="relative aspect-[2/3] w-full max-w-52 overflow-hidden rounded-l-sm rounded-r-md bg-cloth shadow-md ring-1 ring-ink/15">
            {(libro.estado === 'Abandonado' || libro.estado === 'Leyendo') && (
              <span
                aria-hidden="true"
                className={`absolute top-0 left-3 z-10 h-10 w-4 [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)] ${libro.estado === 'Abandonado' ? 'bg-stamp-dark' : 'bg-cloth'}`}
              />
            )}
            {portada && portada !== portadaFallida ? (
              <img
                src={portada}
                referrerPolicy="no-referrer"
                alt=""
                onError={() => setPortadaFallida(portada)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Bookmark aria-hidden="true" className="size-8 text-gilt" />
              </div>
            )}
          </div>
          <div className={editando ? 'min-w-0' : 'min-w-0 md:mt-5'}>
            <p className="text-sm font-medium text-stamp-dark">
              {contexto.label}
            </p>
            <h1 className="mt-2 wrap-break-word font-display text-3xl leading-tight text-cloth">
              {libro.titulo}
            </h1>
            {libro.autores?.length ? (
              <p className="mt-2 wrap-break-word font-display text-xl text-ink/85">
                {libro.autores.join(', ')}
              </p>
            ) : null}
            <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/75">
              {libro.editorial && (
                <div>
                  <dt className="sr-only">Editorial</dt>
                  <dd>{libro.editorial}</dd>
                </div>
              )}
              {libro.fecha_publicacion && (
                <div>
                  <dt className="inline">Publicación: </dt>
                  <dd className="inline">{libro.fecha_publicacion}</dd>
                </div>
              )}
              {libro.paginas != null && (
                <div>
                  <dt className="sr-only">Extensión</dt>
                  <dd>{libro.paginas} páginas</dd>
                </div>
              )}
            </dl>
            {!editando && (
              <dl className="mt-4 space-y-1 border-t border-rule pt-3 text-sm text-ink/80">
                {fechaLectura && (
                  <div>
                    <dt className="inline">
                      {libro.estado === 'Leído'
                        ? 'Leído en: '
                        : 'Fecha de lectura anotada: '}
                    </dt>
                    <dd className="inline">{fechaLectura}</dd>
                  </div>
                )}
                {libro.puntuacion != null && (
                  <div>
                    <dt className="inline">Puntuación: </dt>
                    <dd className="inline">
                      {libro.puntuacion.toLocaleString('es-CO')} / 10
                    </dd>
                  </div>
                )}
                {libro.formato && (
                  <div>
                    <dt className="inline">Formato: </dt>
                    <dd className="inline">{libro.formato}</dd>
                  </div>
                )}
                {libro.procedencia && (
                  <div>
                    <dt className="inline">Procedencia: </dt>
                    <dd className="inline">{libro.procedencia}</dd>
                  </div>
                )}
              </dl>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              {!editando &&
                (libro.estado === 'Pendiente' ||
                  libro.estado === 'Abandonado') && (
                  <button
                    type="button"
                    className="editorial-button"
                    disabled={eliminando || editandoNota}
                    onClick={() => abrirEdicion('estado')}
                  >
                    {libro.estado === 'Pendiente'
                      ? 'Empezar a leer'
                      : 'Retomar lectura'}
                  </button>
                )}
              <button
                type="button"
                disabled={guardando || eliminando || editandoNota}
                className="editorial-link min-h-11 text-sm"
                onClick={() => {
                  if (editando) {
                    setEditando(false)
                    setError(null)
                  } else abrirEdicion('notas')
                }}
              >
                {editando ? 'Cancelar edición' : 'Editar ficha'}
              </button>
            </div>
          </div>
        </header>

        {error && (
          <p role="alert" className="editorial-alert mt-4 md:col-span-full">
            {error}
          </p>
        )}

        {editando ? (
          <section className="mt-8" aria-labelledby="edit-reading-title">
            <h2
              id="edit-reading-title"
              className="mb-5 font-display text-2xl text-cloth"
            >
              Editar ficha
            </h2>
            <form
              className="space-y-4"
              aria-busy={guardando}
              onSubmit={e => {
                e.preventDefault()
                void handleGuardar()
              }}
            >
              <div>
                <label
                  htmlFor="librodetallemodal-1"
                  className="block text-sm font-medium mb-1"
                >
                  URL de portada (enlace directo a una imagen)
                </label>
                <input
                  id="librodetallemodal-1"
                  type="url"
                  value={portadaUrl}
                  onChange={e => setPortadaUrl(e.target.value)}
                  className="editorial-input"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="librodetallemodal-2"
                    className="block text-sm font-medium mb-1"
                  >
                    Estado
                  </label>
                  <select
                    id="librodetallemodal-2"
                    autoFocus={focoEdicion === 'estado'}
                    value={estado}
                    onChange={e => setEstado(e.target.value as EstadoLectura)}
                    className="editorial-input"
                  >
                    {ESTADOS.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="librodetallemodal-3"
                    className="block text-sm font-medium mb-1"
                  >
                    Puntuación
                  </label>
                  <input
                    id="librodetallemodal-3"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={puntuacion}
                    onChange={e => setPuntuacion(e.target.value)}
                    className="editorial-input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="librodetallemodal-4"
                    className="block text-sm font-medium mb-1"
                  >
                    Formato
                  </label>
                  <select
                    id="librodetallemodal-4"
                    value={formato}
                    onChange={e => setFormato(e.target.value as FormatoLectura)}
                    className="editorial-input"
                  >
                    <option value="">Sin especificar</option>
                    {FORMATOS.map(f => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="librodetallemodal-5"
                    className="block text-sm font-medium mb-1"
                  >
                    Procedencia
                  </label>
                  <select
                    id="librodetallemodal-5"
                    value={procedencia}
                    onChange={e =>
                      setProcedencia(e.target.value as ProcedenciaLibro)
                    }
                    className="editorial-input"
                  >
                    <option value="">Sin especificar</option>
                    {PROCEDENCIAS.map(p => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="librodetallemodal-6"
                    className="block text-sm font-medium mb-1"
                  >
                    Año de lectura
                  </label>
                  <input
                    id="librodetallemodal-6"
                    type="number"
                    value={anioLectura}
                    onChange={e => setAnioLectura(e.target.value)}
                    className="editorial-input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="librodetallemodal-7"
                    className="block text-sm font-medium mb-1"
                  >
                    Mes de lectura
                  </label>
                  <input
                    id="librodetallemodal-7"
                    type="number"
                    min="1"
                    max="12"
                    value={mesLectura}
                    onChange={e => setMesLectura(e.target.value)}
                    className="editorial-input"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="librodetallemodal-8"
                  className="block text-sm font-medium mb-1"
                >
                  Personaje favorito
                </label>
                <input
                  id="librodetallemodal-8"
                  type="text"
                  value={personajeFavorito}
                  onChange={e => setPersonajeFavorito(e.target.value)}
                  className="editorial-input"
                />
              </div>

              <div>
                <label
                  htmlFor="librodetallemodal-9"
                  className="block text-sm font-medium mb-1"
                >
                  Notas de lectura
                </label>
                <textarea
                  id="librodetallemodal-9"
                  autoFocus={focoEdicion === 'notas'}
                  value={resumenAnalisis}
                  onChange={e => setResumenAnalisis(e.target.value)}
                  rows={6}
                  className="editorial-input"
                />
              </div>

              <div>
                <label
                  htmlFor="librodetallemodal-10"
                  className="block text-sm font-medium mb-1"
                >
                  Citas destacadas
                </label>
                <textarea
                  id="librodetallemodal-10"
                  value={citasDestacadas}
                  onChange={e => setCitasDestacadas(e.target.value)}
                  rows={3}
                  className="editorial-input"
                />
              </div>

              <button
                type="submit"
                disabled={guardando || eliminando}
                className="editorial-button"
              >
                <Save aria-hidden="true" className="size-4" />{' '}
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          </section>
        ) : (
          <>
            <section
              className="min-w-0 pb-8"
              aria-labelledby="reading-memory-title"
            >
              <h2
                id="reading-memory-title"
                className="mt-2 max-w-xl font-display text-4xl leading-tight text-cloth sm:text-5xl"
              >
                {contexto.heading}
              </h2>

              <section
                className="journal-sheet mt-7 max-w-[66ch]"
                aria-labelledby="reading-note-title"
              >
                <div className="flex items-center justify-between gap-3 border-b border-rule pb-4">
                  <h3
                    id="reading-note-title"
                    className="font-display text-2xl text-cloth"
                  >
                    Tu huella
                  </h3>
                  <Leaf aria-hidden="true" className="size-5 text-stamp-dark" />
                </div>
                <div role="status" className="mt-3">
                  {notaGuardada && (
                    <span className="ink-imprint">
                      <Check aria-hidden="true" className="size-4" /> Huella
                      guardada
                    </span>
                  )}
                </div>
                {editandoNota ? (
                  <form
                    className="mt-3 space-y-3"
                    aria-busy={guardandoNota}
                    onSubmit={e => {
                      e.preventDefault()
                      void guardarHuella()
                    }}
                  >
                    <label
                      htmlFor="reading-note"
                      className="block text-sm text-ink/80"
                    >
                      {contexto.prompt}
                    </label>
                    <textarea
                      id="reading-note"
                      autoFocus
                      maxLength={20000}
                      rows={6}
                      className="editorial-input font-display text-lg leading-relaxed"
                      value={borradorNota}
                      onChange={e => setBorradorNota(e.target.value)}
                      disabled={guardandoNota}
                    />
                    {errorNota && (
                      <p role="alert" className="editorial-alert">
                        No se pudo guardar. Si editaste esta nota en otra
                        ventana, copia tu borrador antes de recargar.
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        className="editorial-button"
                        disabled={guardandoNota}
                      >
                        {guardandoNota ? 'Guardando…' : 'Guardar nota'}
                      </button>
                      <button
                        type="button"
                        className="editorial-link min-h-11 text-sm"
                        disabled={guardandoNota}
                        onClick={() => setBorradorNota(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {libro.resumen_analisis ? (
                      <p className="mt-3 whitespace-pre-wrap wrap-break-word font-display text-xl leading-relaxed text-ink">
                        {libro.resumen_analisis}
                      </p>
                    ) : (
                      <div className="mt-3 border-y border-rule py-4">
                        <p className="font-display text-xl italic text-ink/85">
                          {contexto.prompt}
                        </p>
                        <p className="mt-2 text-sm text-ink/75">
                          Puede ser una frase o un resumen para volver a ese
                          momento.
                        </p>
                      </div>
                    )}
                    <button
                      type="button"
                      disabled={eliminando}
                      className="editorial-link mt-2 inline-flex min-h-11 items-center gap-2 text-sm"
                      onClick={() => {
                        setNotaAnterior(libro.resumen_analisis)
                        setBorradorNota(libro.resumen_analisis ?? '')
                        setErrorNota(false)
                        setNotaGuardada(false)
                      }}
                    >
                      <Pencil aria-hidden="true" className="size-4" />
                      {libro.resumen_analisis
                        ? 'Editar nota'
                        : 'Escribir una nota'}
                    </button>
                  </>
                )}
              </section>

              {libro.citas_destacadas && (
                <section
                  className="mt-7 max-w-[66ch] border-y border-rule py-6"
                  aria-labelledby="saved-quotes-title"
                >
                  <h3
                    id="saved-quotes-title"
                    className="flex items-center gap-2 font-display text-xl text-cloth"
                  >
                    Citas que guardaste
                  </h3>
                  <blockquote className="mt-3 whitespace-pre-wrap wrap-break-word font-display text-lg italic leading-relaxed text-cloth">
                    {libro.citas_destacadas}
                  </blockquote>
                </section>
              )}
              {libro.personaje_favorito && (
                <p className="mt-5 wrap-break-word text-sm text-ink/85">
                  <strong>Personaje favorito:</strong>{' '}
                  {libro.personaje_favorito}
                </p>
              )}
            </section>

            <footer className="border-t border-rule pt-4 md:col-span-full">
              <button
                type="button"
                onClick={handleEliminar}
                disabled={eliminando || guardando || editandoNota}
                className="min-h-11 rounded-sm text-sm text-stamp-dark underline underline-offset-4 disabled:opacity-60"
              >
                {eliminando ? 'Eliminando…' : 'Eliminar de mi biblioteca'}
              </button>
            </footer>
          </>
        )}
      </div>
    </main>
  )
}
