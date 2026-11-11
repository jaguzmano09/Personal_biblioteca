'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Loader2 } from 'lucide-react'

export default function DatosPersonales({
  contacto
}: {
  contacto: { nombre: string; email: string } | null
}) {
  const [descargando, setDescargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [descargado, setDescargado] = useState(false)

  async function descargar() {
    if (descargando) return
    setDescargando(true)
    setDescargado(false)
    setError(null)
    try {
      const response = await fetch('/api/account/export', { cache: 'no-store' })
      if (!response.ok) throw new Error('Export failed')
      const copia = await response.blob()
      const url = URL.createObjectURL(copia)
      const enlace = document.createElement('a')
      enlace.href = url
      enlace.download = `tinteruna-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(enlace)
      enlace.click()
      enlace.remove()
      // Keep the object alive until the browser has consumed the download event.
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setDescargado(true)
    } catch {
      setError(
        'No se pudo descargar la copia. Comprueba tu sesión e inténtalo de nuevo.'
      )
    } finally {
      setDescargando(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <Link
        href="/biblioteca"
        className="editorial-link mb-5 inline-flex min-h-11 items-center gap-2 text-sm"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Volver a la
        biblioteca
      </Link>
      <h1 className="font-display text-3xl text-cloth sm:text-4xl">
        Tus datos, a mano
      </h1>
      <section className="journal-sheet mt-7" aria-labelledby="descarga-titulo">
        <h2 id="descarga-titulo" className="font-display text-2xl text-cloth">
          Una copia de tu biblioteca
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Descarga un archivo JSON con tus libros, anotaciones, citas, metas y
          el correo de tu cuenta.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink/75">
          La copia incluye tus notas privadas. Guárdala en un lugar seguro.
        </p>
        <button
          type="button"
          onClick={descargar}
          disabled={descargando}
          className="editorial-button mt-5 w-full sm:w-auto"
        >
          {descargando ? (
            <Loader2
              aria-hidden="true"
              className="h-4 w-4 motion-safe:animate-spin"
            />
          ) : (
            <Download aria-hidden="true" className="h-4 w-4" />
          )}
          {descargando ? 'Preparando copia…' : 'Descargar mis datos'}
        </button>
        <p role="status" className="mt-3 text-sm text-cloth">
          {descargado
            ? 'La copia está lista. Revisa las descargas de tu navegador.'
            : descargando
              ? 'Reuniendo tu biblioteca y tus metas…'
              : ''}
        </p>
        {error && (
          <p role="alert" className="editorial-alert mt-3">
            {error}
          </p>
        )}
      </section>
      {contacto && (
        <section className="py-6" aria-labelledby="solicitudes-titulo">
          <h2
            id="solicitudes-titulo"
            className="font-display text-2xl text-cloth"
          >
            Consultas sobre tus datos
          </h2>
          <p className="mt-3 text-sm leading-relaxed">
            Puedes corregir tus libros y notas en la biblioteca. Para consultar
            tus datos, solicitar una corrección de cuenta, retirar una
            autorización o pedir el cierre de tu cuenta, escribe al responsable,{' '}
            {contacto.nombre}.
          </p>
          <a
            href={`mailto:${contacto.email}`}
            className="editorial-link mt-3 inline-flex min-h-11 items-center break-all"
          >
            {contacto.email}
          </a>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">
            Escribe desde el correo de tu cuenta e indica tu solicitud. Mantén
            en privado tu contraseña y tus códigos de acceso.
          </p>
        </section>
      )}
    </main>
  )
}
