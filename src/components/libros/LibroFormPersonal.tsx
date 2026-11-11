'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { BookmarkCheck, Loader2 } from 'lucide-react'
import PortadaLibro from './PortadaLibro'
import { guardarLibro } from '@/lib/libros'
import type {
  GoogleBookResult,
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

interface Props {
  libroSeleccionado: GoogleBookResult
  onCancelar: () => void
}

export default function LibroFormPersonal({
  libroSeleccionado,
  onCancelar
}: Props) {
  const [libroGuardado, setLibroGuardado] = useState<string | null>(null)
  const confirmacion = useRef<HTMLHeadingElement>(null)
  const enviando = useRef(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [estado, setEstado] = useState<EstadoLectura>('Pendiente')
  const [puntuacion, setPuntuacion] = useState<string>('')
  const [personajeFavorito, setPersonajeFavorito] = useState('')
  const [resumenAnalisis, setResumenAnalisis] = useState('')
  const [citasDestacadas, setCitasDestacadas] = useState('')
  const [anioLectura, setAnioLectura] = useState('')
  const [mesLectura, setMesLectura] = useState('')
  const [formato, setFormato] = useState<FormatoLectura | ''>('')
  const [procedencia, setProcedencia] = useState<ProcedenciaLibro | ''>('')
  const [portadaUrl, setPortadaUrl] = useState(
    libroSeleccionado.portada_url ?? ''
  )

  useEffect(() => {
    if (libroGuardado) confirmacion.current?.focus()
  }, [libroGuardado])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (enviando.current) return
    enviando.current = true
    setGuardando(true)
    setError(null)

    try {
      const resultado = await guardarLibro(
        { ...libroSeleccionado, portada_url: portadaUrl || null },
        {
          estado,
          puntuacion: puntuacion ? Number(puntuacion) : null,
          personaje_favorito: personajeFavorito || null,
          resumen_analisis: resumenAnalisis || null,
          citas_destacadas: citasDestacadas || null,
          anio_lectura: anioLectura ? Number(anioLectura) : null,
          mes_lectura: anioLectura && mesLectura ? Number(mesLectura) : null,
          formato: formato || null,
          procedencia: procedencia || null
        }
      )
      if (!resultado.ok) {
        setError(resultado.error)
        return
      }
      setLibroGuardado(resultado.libro.id)
    } catch {
      setError(
        'No se pudo confirmar el guardado. Tus datos siguen aquí. Revisa tu conexión y reintenta, o comprueba tu biblioteca.'
      )
    } finally {
      enviando.current = false
      setGuardando(false)
    }
  }

  if (libroGuardado)
    return (
      <section className="relative border-y border-rule py-8 pl-6 sm:pl-8">
        <span
          aria-hidden="true"
          className="reading-bookmark absolute left-0 top-0 h-20 w-3 bg-cloth"
        />
        <BookmarkCheck aria-hidden="true" className="mb-4 h-7 w-7 text-cloth" />
        <h2
          ref={confirmacion}
          tabIndex={-1}
          className="font-display text-3xl text-cloth"
        >
          Una historia más entre tus páginas
        </h2>
        <p role="status" className="mt-3 break-words leading-relaxed">
          «{libroSeleccionado.titulo}» ya está en tu biblioteca.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Link
            href={`/biblioteca/${libroGuardado}`}
            className="editorial-button"
          >
            Abrir libro
          </Link>
          <Link
            href="/biblioteca"
            className="editorial-link inline-flex min-h-11 items-center"
          >
            Volver a la biblioteca
          </Link>
        </div>
      </section>
    )

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={guardando}
      aria-describedby={error ? 'guardar-error' : undefined}
      className="space-y-6"
    >
      <fieldset disabled={guardando} className="min-w-0 space-y-6">
        {/* Vista previa del libro elegido */}
        <div className="flex min-w-0 gap-4 border-y border-rule py-5">
          <PortadaLibro url={libroSeleccionado.portada_url} />
          <div className="min-w-0 space-y-2">
            <p className="break-words font-display text-xl leading-snug text-cloth">
              {libroSeleccionado.titulo}
            </p>
            <p className="break-words text-sm text-ink/75">
              {libroSeleccionado.autores.join(', ') || 'Autor desconocido'}
            </p>
            <p className="break-words text-sm text-ink/75">
              {[
                libroSeleccionado.editorial,
                libroSeleccionado.fecha_publicacion
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
            <button
              type="button"
              onClick={onCancelar}
              className="editorial-link inline-flex min-h-11 items-center text-sm"
            >
              Cambiar libro
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="elegir-estado"
            className="mb-2 block text-sm font-medium"
          >
            ¿Dónde empieza esta historia?
          </label>
          <select
            id="elegir-estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value as EstadoLectura)}
            className="editorial-input text-base"
          >
            {ESTADOS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="libroformpersonal-9"
            className="mb-2 block font-display text-2xl text-cloth"
          >
            ¿Qué te hizo elegir este libro?
          </label>
          <p id="nota-ayuda" className="mb-3 text-sm text-ink/75">
            Opcional. Esta nota quedará en «Tu huella» y podrás ampliarla cuando
            quieras.
          </p>
          <textarea
            id="libroformpersonal-9"
            value={resumenAnalisis}
            onChange={(e) => setResumenAnalisis(e.target.value)}
            maxLength={20000}
            rows={3}
            aria-describedby="nota-ayuda"
            className="editorial-input text-base"
          />
        </div>

        <details className="border-y border-rule py-2">
          <summary className="min-h-12 cursor-pointer py-3 font-medium text-cloth">
            Portada y detalles de lectura (opcionales)
          </summary>
          <div className="space-y-5 pb-4 pt-3">
            <div>
              <label
                htmlFor="libroformpersonal-1"
                className="block text-sm font-medium mb-1"
              >
                URL de portada (enlace directo a una imagen){' '}
                <span className="text-ink/70 font-normal">(opcional)</span>
              </label>
              <input
                id="libroformpersonal-1"
                type="url"
                maxLength={8192}
                placeholder="https://..."
                value={portadaUrl}
                onChange={(e) => setPortadaUrl(e.target.value)}
                className="editorial-input text-base"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="libroformpersonal-3"
                  className="block text-sm font-medium mb-1"
                >
                  Puntuación (0-10)
                </label>
                <input
                  id="libroformpersonal-3"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  inputMode="decimal"
                  value={puntuacion}
                  onChange={(e) => setPuntuacion(e.target.value)}
                  className="editorial-input text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="libroformpersonal-4"
                  className="block text-sm font-medium mb-1"
                >
                  Formato
                </label>
                <select
                  id="libroformpersonal-4"
                  value={formato}
                  onChange={(e) => setFormato(e.target.value as FormatoLectura)}
                  className="editorial-input text-base"
                >
                  <option value="">Sin especificar</option>
                  {FORMATOS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="libroformpersonal-5"
                  className="block text-sm font-medium mb-1"
                >
                  Procedencia
                </label>
                <select
                  id="libroformpersonal-5"
                  value={procedencia}
                  onChange={(e) =>
                    setProcedencia(e.target.value as ProcedenciaLibro)
                  }
                  className="editorial-input text-base"
                >
                  <option value="">Sin especificar</option>
                  {PROCEDENCIAS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="libroformpersonal-6"
                  className="block text-sm font-medium mb-1"
                >
                  Año de lectura
                </label>
                <input
                  id="libroformpersonal-6"
                  type="number"
                  placeholder="Ej: 2024"
                  min="1000"
                  max="9999"
                  value={anioLectura}
                  onChange={(e) => setAnioLectura(e.target.value)}
                  className="editorial-input text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="libroformpersonal-7"
                  className="block text-sm font-medium mb-1"
                >
                  Mes{' '}
                  <span className="text-ink/70 font-normal">(opcional)</span>
                </label>
                <select
                  id="libroformpersonal-7"
                  value={mesLectura}
                  onChange={(e) => setMesLectura(e.target.value)}
                  disabled={!anioLectura}
                  className="editorial-input text-base disabled:bg-cloth/5 disabled:text-ink/60"
                >
                  <option value="">No recuerdo el mes</option>
                  <option value="1">Enero</option>
                  <option value="2">Febrero</option>
                  <option value="3">Marzo</option>
                  <option value="4">Abril</option>
                  <option value="5">Mayo</option>
                  <option value="6">Junio</option>
                  <option value="7">Julio</option>
                  <option value="8">Agosto</option>
                  <option value="9">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="libroformpersonal-8"
                className="block text-sm font-medium mb-1"
              >
                Personaje favorito
              </label>
              <input
                id="libroformpersonal-8"
                type="text"
                maxLength={500}
                value={personajeFavorito}
                onChange={(e) => setPersonajeFavorito(e.target.value)}
                className="editorial-input text-base"
              />
            </div>

            <div>
              <label
                htmlFor="libroformpersonal-10"
                className="block text-sm font-medium mb-1"
              >
                Citas destacadas
              </label>
              <textarea
                id="libroformpersonal-10"
                maxLength={20000}
                value={citasDestacadas}
                onChange={(e) => setCitasDestacadas(e.target.value)}
                rows={3}
                className="editorial-input text-base"
              />
            </div>
          </div>
        </details>
      </fieldset>

      {error && (
        <div id="guardar-error" role="alert" className="editorial-alert">
          <p>{error}</p>
          <Link
            href="/biblioteca"
            className="editorial-link mt-2 inline-flex min-h-11 items-center"
          >
            Comprobar mi biblioteca
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" disabled={guardando} className="editorial-button">
          {guardando && (
            <Loader2
              aria-hidden="true"
              className="h-4 w-4 motion-safe:animate-spin"
            />
          )}
          {guardando ? 'Guardando…' : 'Guardar libro'}
        </button>
        <button
          type="button"
          disabled={guardando}
          onClick={onCancelar}
          className="min-h-12 rounded-xl border border-cloth/50 px-4 py-3 text-sm font-medium text-cloth disabled:opacity-70"
        >
          Cancelar
        </button>
      </div>
      <p role="status" className="text-sm text-cloth">
        {guardando ? 'Guardando el libro y tus anotaciones…' : ''}
      </p>
    </form>
  )
}
