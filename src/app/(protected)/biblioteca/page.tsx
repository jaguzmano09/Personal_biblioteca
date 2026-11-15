import Link from 'next/link'
import { Plus } from 'lucide-react'
import { obtenerLibros } from '@/lib/libros'
import { obtenerMeta } from '@/lib/metas'
import LibrosGrid from '@/components/libros/LibrosGrid'
import EstadisticasDashboard from '@/components/libros/EstadisticasDashboard'
import { Button } from '@/components/ui/button'

export default async function BibliotecaPage() {
  const anioActual = new Date().getFullYear()
  const [libros, meta] = await Promise.all([
    obtenerLibros(),
    obtenerMeta(anioActual)
  ])
  return (
    <main className="site-width library-workspace">
      <header className="library-heading">
        <div>
          <h1>Mi biblioteca</h1>
          <p>
            {libros.length === 0
              ? 'Tu próxima historia empieza aquí.'
              : `${libros.length} ${libros.length === 1 ? 'historia que forma' : 'historias que forman'} parte de ti.`}
          </p>
        </div>
        <Button asChild variant="outline" className="hidden sm:inline-flex">
          <Link href="/biblioteca/agregar">
            <Plus aria-hidden="true" data-icon="inline-start" /> Agregar libro
          </Link>
        </Button>
      </header>
      <EstadisticasDashboard
        libros={libros}
        metaInicial={meta}
        anioActual={anioActual}
      />
      <section
        id="tus-libros"
        className="library-catalog"
        aria-label="Tus libros"
      >
        <LibrosGrid libros={libros} />
      </section>
    </main>
  )
}
