import Link from 'next/link'
import { obtenerLibros } from '@/lib/libros'
import LibrosGrid from '@/components/libros/LibrosGrid'

export default async function BibliotecaPage() {
  const libros = await obtenerLibros()

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex justify-between items-end mb-8 border-b border-rule pb-4">
        <div>
          <h1 className="font-display text-3xl">Catálogo</h1>
          <p className="font-mono text-xs text-ink/60 mt-1">
            {libros.length} {libros.length === 1 ? 'volumen' : 'volúmenes'} registrados
          </p>
        </div>
        <Link
          href="/biblioteca/agregar"
          className="font-mono text-sm border border-ink px-4 py-2 hover:bg-ink hover:text-paper transition-colors"
        >
          + Agregar libro
        </Link>
      </div>

      <LibrosGrid libros={libros} />
    </div>
  )
}