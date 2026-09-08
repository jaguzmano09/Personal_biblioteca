import { obtenerLibroPorId } from '@/lib/libros'
import LibroDetalleModal from '@/components/libros/LibroDetalleModal'

export default async function LibroDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const libro = await obtenerLibroPorId(id)

  return <LibroDetalleModal libro={libro} />
}