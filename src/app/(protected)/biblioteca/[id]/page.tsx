import { notFound } from 'next/navigation'
import { uuid } from '@/lib/validation'
import { obtenerLibroPorId } from '@/lib/libros'
import LibroDetalle from '@/components/libros/LibroDetalle'

export default async function LibroDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try { uuid(id) } catch { notFound() }
  const libro = await obtenerLibroPorId(id)

  if (!libro) notFound()
  return <LibroDetalle libro={libro} />
}