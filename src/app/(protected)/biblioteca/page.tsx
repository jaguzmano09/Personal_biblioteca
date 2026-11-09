import Link from 'next/link'
import { obtenerLibros } from '@/lib/libros'
import { obtenerMeta } from '@/lib/metas'
import LibrosGrid from '@/components/libros/LibrosGrid'
import EstadisticasDashboard from '@/components/libros/EstadisticasDashboard'

export default async function BibliotecaPage() {
  const anioActual = new Date().getFullYear()
  const [libros, meta] = await Promise.all([
    obtenerLibros(),
    obtenerMeta(anioActual),
  ])

  return (
    <main className="mx-auto grid max-w-[96rem] gap-10 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:py-12 xl:gap-12">
      <section className="min-w-0" aria-labelledby="library-title">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-5 border-b border-rule pb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cloth">Cuaderno de lectura</p>
            <h1 id="library-title" className="mt-2 font-display text-4xl tracking-tight text-cloth sm:text-6xl">
              Mi biblioteca
            </h1>
            <p className="mt-2 font-display text-lg italic text-ink/80">
              {libros.length} {libros.length === 1 ? 'volumen registrado' : 'volúmenes registrados'}
            </p>
          </div>
          <Link href="/biblioteca/agregar" className="editorial-button">
            <span aria-hidden="true">+</span> Agregar libro
          </Link>
        </header>

        <LibrosGrid libros={libros} />
      </section>

      <EstadisticasDashboard libros={libros} metaInicial={meta} anioActual={anioActual} />
    </main>
  )
}
