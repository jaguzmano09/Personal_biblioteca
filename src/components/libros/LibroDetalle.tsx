'use client'

import { safeCover } from '@/lib/covers'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Bookmark, Save } from 'lucide-react'
import { actualizarLibro, eliminarLibro } from '@/lib/libros'
import type { Libro, EstadoLectura, FormatoLectura, ProcedenciaLibro } from '@/lib/types'

const ESTADOS: EstadoLectura[] = ['Pendiente', 'Leyendo', 'Leído', 'Abandonado']
const FORMATOS: FormatoLectura[] = ['Física', 'Digital']
const PROCEDENCIAS: ProcedenciaLibro[] = ['Casa de mis papás', 'Regalado', 'Comprado']

const READING_CONTEXT = {
  Leído: { label: 'Leído', heading: 'Lo que dejó esta lectura' },
  Leyendo: { label: 'En lectura', heading: 'Entre páginas' },
  Pendiente: { label: 'Pendiente', heading: 'Una historia por abrir' },
  Abandonado: { label: 'Abandonado', heading: 'Un libro al que puedes volver' },
} satisfies Record<EstadoLectura, { label: string; heading: string }>

export default function LibroDetalle({ libro }: { libro: Libro }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [editando, setEditando] = useState(false)
  const [focoEdicion, setFocoEdicion] = useState<'estado' | 'notas'>('notas')
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  const [estado, setEstado] = useState(libro.estado)
  const [puntuacion, setPuntuacion] = useState(libro.puntuacion?.toString() ?? '')
  const [resumenAnalisis, setResumenAnalisis] = useState(libro.resumen_analisis ?? '')
  const [personajeFavorito, setPersonajeFavorito] = useState(libro.personaje_favorito ?? '')
  const [citasDestacadas, setCitasDestacadas] = useState(libro.citas_destacadas ?? '')
  const [anioLectura, setAnioLectura] = useState(libro.anio_lectura?.toString() ?? '')
  const [mesLectura, setMesLectura] = useState(libro.mes_lectura?.toString() ?? '')
  const [formato, setFormato] = useState<FormatoLectura | ''>(libro.formato ?? '')
  const [procedencia, setProcedencia] = useState<ProcedenciaLibro | ''>(libro.procedencia ?? '')
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
        portada_url: portadaUrl || null,
      })
      setEditando(false)
      router.refresh()
    } catch {
      setError('No se pudieron guardar los cambios. Revisa los campos e inténtalo de nuevo.')
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

  const contexto = READING_CONTEXT[libro.estado]
  const portada = safeCover(libro.portada_url)
  const tieneNotas = Boolean(libro.resumen_analisis || libro.citas_destacadas || libro.personaje_favorito)
  const fechaLectura = libro.anio_lectura
    ? libro.mes_lectura
      ? `${new Date(2000, libro.mes_lectura - 1).toLocaleDateString('es-CO', { month: 'long' })} de ${libro.anio_lectura}`
      : String(libro.anio_lectura)
    : null

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
      <Link href="/biblioteca" className="editorial-link mb-6 inline-flex min-h-11 items-center gap-2 text-sm">
        <ArrowLeft aria-hidden="true" className="size-4" /> Volver a la biblioteca
      </Link>

      <header className="grid gap-6 border-b border-rule pb-8 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8">
        <div className="aspect-[2/3] w-28 overflow-hidden rounded-l-sm rounded-r-md bg-cloth shadow-sm ring-1 ring-ink/15 sm:w-full">
          {portada ? (
            <img src={portada} referrerPolicy="no-referrer" alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Bookmark aria-hidden="true" className="size-8 text-gilt" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-cloth">{contexto.label}</p>
          <h1 className="mt-2 wrap-break-word font-display text-4xl leading-tight text-cloth sm:text-5xl">{libro.titulo}</h1>
          {libro.autores?.length ? <p className="mt-2 wrap-break-word font-display text-xl text-ink/85">{libro.autores.join(', ')}</p> : null}
          <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/75">
            {libro.editorial && <div><dt className="sr-only">Editorial</dt><dd>{libro.editorial}</dd></div>}
            {libro.fecha_publicacion && <div><dt className="inline">Publicación: </dt><dd className="inline">{libro.fecha_publicacion}</dd></div>}
            {libro.paginas != null && <div><dt className="sr-only">Extensión</dt><dd>{libro.paginas} páginas</dd></div>}
          </dl>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            {!editando && (libro.estado === 'Pendiente' || libro.estado === 'Abandonado') && (
              <button type="button" className="editorial-button" disabled={eliminando} onClick={() => abrirEdicion('estado')}>
                {libro.estado === 'Pendiente' ? 'Empezar a leer' : 'Retomar lectura'}
              </button>
            )}
            <button type="button" disabled={guardando || eliminando} className="editorial-link min-h-11 text-sm"
              onClick={() => {
                if (editando) { setEditando(false); setError(null) }
                else abrirEdicion('notas')
              }}
            >
              {editando ? 'Cancelar edición' : 'Editar ficha'}
            </button>
          </div>
        </div>
      </header>

      {error && <p role="alert" className="editorial-alert mt-4">{error}</p>}

      {editando ? (
        <section className="mt-8" aria-labelledby="edit-reading-title">
          <h2 id="edit-reading-title" className="mb-5 font-display text-2xl text-cloth">Editar ficha</h2>
          <form className="space-y-4" aria-busy={guardando} onSubmit={e => { e.preventDefault(); void handleGuardar() }}>
            <div>
              <label htmlFor="librodetallemodal-1" className="block text-sm font-medium mb-1">URL de portada (enlace directo a una imagen)</label>
              <input id="librodetallemodal-1"
                type="url"
                value={portadaUrl}
                onChange={e => setPortadaUrl(e.target.value)}
                className="editorial-input"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="librodetallemodal-2" className="block text-sm font-medium mb-1">Estado</label>
                <select id="librodetallemodal-2"
                  autoFocus={focoEdicion === 'estado'}
                  value={estado}
                  onChange={e => setEstado(e.target.value as EstadoLectura)}
                  className="editorial-input"
                >
                  {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="librodetallemodal-3" className="block text-sm font-medium mb-1">Puntuación</label>
                <input id="librodetallemodal-3"
                  type="number" min="0" max="10" step="0.1"
                  value={puntuacion}
                  onChange={e => setPuntuacion(e.target.value)}
                  className="editorial-input"
                />
              </div>
              <div>
                <label htmlFor="librodetallemodal-4" className="block text-sm font-medium mb-1">Formato</label>
                <select id="librodetallemodal-4"
                  value={formato}
                  onChange={e => setFormato(e.target.value as FormatoLectura)}
                  className="editorial-input"
                >
                  <option value="">Sin especificar</option>
                  {FORMATOS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="librodetallemodal-5" className="block text-sm font-medium mb-1">Procedencia</label>
                <select id="librodetallemodal-5"
                  value={procedencia}
                  onChange={e => setProcedencia(e.target.value as ProcedenciaLibro)}
                  className="editorial-input"
                >
                  <option value="">Sin especificar</option>
                  {PROCEDENCIAS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="librodetallemodal-6" className="block text-sm font-medium mb-1">Año de lectura</label>
                <input id="librodetallemodal-6"
                  type="number"
                  value={anioLectura}
                  onChange={e => setAnioLectura(e.target.value)}
                  className="editorial-input"
                />
              </div>
              <div>
                <label htmlFor="librodetallemodal-7" className="block text-sm font-medium mb-1">Mes de lectura</label>
                <input id="librodetallemodal-7"
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
              <label htmlFor="librodetallemodal-8" className="block text-sm font-medium mb-1">Personaje favorito</label>
              <input id="librodetallemodal-8"
                type="text"
                value={personajeFavorito}
                onChange={e => setPersonajeFavorito(e.target.value)}
                className="editorial-input"
              />
            </div>

            <div>
              <label htmlFor="librodetallemodal-9" className="block text-sm font-medium mb-1">Notas de lectura</label>
              <textarea id="librodetallemodal-9"
                autoFocus={focoEdicion === 'notas'}
                value={resumenAnalisis}
                onChange={e => setResumenAnalisis(e.target.value)}
                rows={6}
                className="editorial-input"
              />
            </div>

            <div>
              <label htmlFor="librodetallemodal-10" className="block text-sm font-medium mb-1">Citas destacadas</label>
              <textarea id="librodetallemodal-10"
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
              <Save aria-hidden="true" className="size-4" /> {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </section>
      ) : (
        <>
          <section className="py-8" aria-labelledby="reading-memory-title">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-cloth">Cuaderno de lectura</p>
            <h2 id="reading-memory-title" className="mt-2 font-display text-3xl text-cloth">{contexto.heading}</h2>
            <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/80">
              {fechaLectura && <div><dt className="inline">{libro.estado === 'Leído' ? 'Leído en: ' : 'Fecha de lectura anotada: '}</dt><dd className="inline">{fechaLectura}</dd></div>}
              {libro.puntuacion != null && <div><dt className="inline">Puntuación: </dt><dd className="inline">{libro.puntuacion.toLocaleString('es-CO')} / 10</dd></div>}
              {libro.formato && <div><dt className="inline">Formato: </dt><dd className="inline">{libro.formato}</dd></div>}
              {libro.procedencia && <div><dt className="inline">Procedencia: </dt><dd className="inline">{libro.procedencia}</dd></div>}
            </dl>

            {tieneNotas ? (
              <div className="mt-6 max-w-[66ch] space-y-6">
                {libro.citas_destacadas && (
                  <div className="border-l-2 border-gilt bg-surface p-5 sm:p-6">
                    <h3 className="font-mono text-xs uppercase tracking-wider text-ink/75">Citas que guardaste</h3>
                    <blockquote className="mt-3 whitespace-pre-wrap wrap-break-word font-display text-xl leading-relaxed text-cloth">
                      {libro.citas_destacadas}
                    </blockquote>
                  </div>
                )}
                {libro.resumen_analisis && (
                  <div>
                    <h3 className="font-display text-xl text-cloth">Tus notas</h3>
                    <p className="mt-2 whitespace-pre-wrap wrap-break-word leading-relaxed text-ink/90">{libro.resumen_analisis}</p>
                  </div>
                )}
                {libro.personaje_favorito && (
                  <p className="wrap-break-word text-sm text-ink/85"><strong>Personaje favorito:</strong> {libro.personaje_favorito}</p>
                )}
              </div>
            ) : (
              <div className="mt-5 border-l-2 border-gilt bg-surface p-5">
                <p className="text-ink/85">
                  {libro.estado === 'Leído' ? '¿Qué escena, frase o sensación te quedó de esta lectura?'
                    : libro.estado === 'Abandonado' ? '¿Qué te atrajo del libro la primera vez? Puedes guardar ese recuerdo aunque decidas dejarlo aquí.'
                    : libro.estado === 'Pendiente' ? '¿Qué te hizo guardar este libro? Deja una pista para cuando llegue su turno.'
                    : 'Anota una impresión o una frase para reencontrarla cuando vuelvas.'}
                </p>
                <button type="button" disabled={eliminando} onClick={() => abrirEdicion('notas')} className="editorial-link mt-2 min-h-11 text-sm">
                  Añadir una nota
                </button>
              </div>
            )}
          </section>

          <footer className="border-t border-rule pt-4">
            <button type="button" onClick={handleEliminar} disabled={eliminando || guardando} className="min-h-11 rounded-sm text-sm text-stamp-dark underline underline-offset-4 disabled:opacity-60">
              {eliminando ? 'Eliminando…' : 'Eliminar de mi biblioteca'}
            </button>
          </footer>
        </>
      )}
    </main>
  )
}
