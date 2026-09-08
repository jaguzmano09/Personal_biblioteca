import Link from 'next/link'
import { Plus } from 'lucide-react'
import { obtenerLibros } from '@/lib/libros'
import LibrosGrid from '@/components/libros/LibrosGrid'

export default async function BibliotecaPage() {
  const libros = await obtenerLibros()

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mi biblioteca</h1>
        <Link
          href="/biblioteca/agregar"
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          <Plus className="w-4 h-4" /> Agregar libro
        </Link>
      </div>

      <LibrosGrid libros={libros} />
    </div>
  )
}