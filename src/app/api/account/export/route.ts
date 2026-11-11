import { createClient } from '@/lib/supabase/server'
import { obtenerLibros } from '@/lib/libros'
import { obtenerMetas } from '@/lib/metas'

export const dynamic = 'force-dynamic'

export async function GET() {
  const headers = {
    'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  }
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error
    } = await supabase.auth.getUser()
    if (error || !user)
      return Response.json(
        { error: 'Inicia sesión para descargar tus datos.' },
        { status: 401, headers }
      )

    const [libros, metas] = await Promise.all([obtenerLibros(), obtenerMetas()])
    const fecha = new Date().toISOString()
    return Response.json(
      {
        version: 1,
        exportado_el: fecha,
        cuenta: { id: user.id, correo: user.email },
        libros,
        metas
      },
      {
        headers: {
          ...headers,
          'Content-Disposition': `attachment; filename="tinteruna-${fecha.slice(0, 10)}.json"`
        }
      }
    )
  } catch {
    return Response.json(
      { error: 'No se pudo preparar la copia. Inténtalo de nuevo.' },
      { status: 500, headers }
    )
  }
}
