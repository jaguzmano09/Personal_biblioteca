'use client'

import { useMemo, useState } from 'react'
import LibroCard from './LibroCard'
import FiltrosOrdenamiento, { Ordenamiento } from './FiltrosOrdenamiento'
import type { Libro, EstadoLectura, ProcedenciaLibro } from '@/lib/types'
import Link from 'next/link'
import Image from 'next/image'

export default function LibrosGrid({ libros }: { libros: Libro[] }) {
  const [pagina, setPagina] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoLectura | 'Todos'>(
    'Todos'
  )
  const [anioFiltro, setAnioFiltro] = useState('Todos')
  const [procedenciaFiltro, setProcedenciaFiltro] = useState<
    ProcedenciaLibro | 'Todos'
  >('Todos')
  const [orden, setOrden] = useState<Ordenamiento>('actualizado')

  const aniosDisponibles = useMemo(() => {
    const anios = new Set<number>()
    libros.forEach(l => {
      if (l.anio_lectura) anios.add(l.anio_lectura)
    })
    return Array.from(anios).sort((a, b) => b - a)
  }, [libros])

  const librosFiltrados = useMemo(() => {
    let resultado = libros

    if (estadoFiltro !== 'Todos') {
      resultado = resultado.filter(l => l.estado === estadoFiltro)
    }

    if (anioFiltro !== 'Todos') {
      resultado = resultado.filter(l => l.anio_lectura === Number(anioFiltro))
    }

    if (procedenciaFiltro !== 'Todos') {
      resultado = resultado.filter(l => l.procedencia === procedenciaFiltro)
    }

    if (busqueda.trim()) {
      const q = busqueda.trim().toLocaleLowerCase('es')
      resultado = resultado.filter(
        l =>
          l.titulo.toLowerCase().includes(q) ||
          l.autores?.some(a => a.toLowerCase().includes(q))
      )
    }

    resultado = [...resultado].sort((a, b) => {
      if (orden === 'puntuacion')
        return (b.puntuacion ?? 0) - (a.puntuacion ?? 0)
      if (orden === 'titulo') return a.titulo.localeCompare(b.titulo)
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

    return resultado
  }, [libros, busqueda, estadoFiltro, anioFiltro, procedenciaFiltro, orden])

  const visibles = librosFiltrados.slice(0, pagina * 50)
  const filtrosActivos =
    !!busqueda ||
    estadoFiltro !== 'Todos' ||
    anioFiltro !== 'Todos' ||
    procedenciaFiltro !== 'Todos' ||
    orden !== 'actualizado'

  function limpiarFiltros() {
    setBusqueda('')
    setEstadoFiltro('Todos')
    setAnioFiltro('Todos')
    setProcedenciaFiltro('Todos')
    setOrden('actualizado')
    setPagina(1)
  }

  return (
    <div>
      <FiltrosOrdenamiento
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        estadoFiltro={estadoFiltro}
        onEstadoChange={setEstadoFiltro}
        anioFiltro={anioFiltro}
        onAnioChange={setAnioFiltro}
        aniosDisponibles={aniosDisponibles}
        procedenciaFiltro={procedenciaFiltro}
        onProcedenciaChange={setProcedenciaFiltro}
        orden={orden}
        onOrdenChange={setOrden}
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <p role="status" className="text-sm text-ink/75">
          {librosFiltrados.length}{' '}
          {librosFiltrados.length === 1 ? 'libro' : 'libros'}
          {anioFiltro !== 'Todos' ? ` en ${anioFiltro}` : ''}
        </p>
        {filtrosActivos && (
          <button
            type="button"
            onClick={limpiarFiltros}
            className="editorial-link min-h-11 text-sm"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {librosFiltrados.length === 0 ? (
        libros.length === 0 ? (
          <div className="empty-library">
            <Image
              src="/brand/reading-river.webp"
              width={384}
              height={256}
              alt=""
              sizes="(max-width: 400px) 90vw, 384px"
            />
            <h2 className="font-display text-3xl leading-tight text-cloth">
              Tu primera historia está por llegar.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-loose text-ink/75">
              Empieza por un libro que estés leyendo, uno que quieras abrir o
              ese que todavía recuerdas.
            </p>
            <Link href="/biblioteca/agregar" className="editorial-button mt-5">
              Guardar mi primer libro
            </Link>
          </div>
        ) : (
          <div className="border-y border-rule py-10">
            <h2 className="font-display text-2xl text-cloth">
              Ningún libro coincide todavía.
            </h2>
            <p className="mt-3 text-sm text-ink/75">
              Prueba con otro título o ajusta los filtros para volver a tus
              historias.
            </p>
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
          {visibles.map(libro => (
            <LibroCard key={libro.id} libro={libro} />
          ))}
        </div>
      )}
      {visibles.length < librosFiltrados.length && (
        <button
          type="button"
          className="editorial-link mt-6 min-h-11 px-2"
          onClick={() => setPagina(p => p + 1)}
        >
          Mostrar más libros
        </button>
      )}
    </div>
  )
}
