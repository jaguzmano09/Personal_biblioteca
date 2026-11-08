import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buscarLibros } from '@/lib/googleBooks'

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  const reply = (body: unknown, status = 200) => NextResponse.json(body, {
    status, headers: { 'Cache-Control': 'private, no-store', ...(status === 429 ? { 'Retry-After': '60' } : {}) },
  })
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return reply({ error: 'Debes iniciar sesión.' }, 401)
  const params = new URL(request.url).searchParams
  const q = params.get('q')?.trim() ?? ''
  const max = Number(params.get('maxResults') ?? '10')
  if (q.length < 2 || q.length > 200 || !Number.isInteger(max) || max < 1 || max > 20)
    return reply({ error: 'Consulta inválida: usa entre 2 y 200 caracteres y de 1 a 20 resultados.' }, 400)
  // Fail closed when the migration/limiter is unavailable.
  const { data: allowed, error: limitError } = await supabase.rpc('consume_book_search')
  if (limitError) return reply({ error: 'La búsqueda no está disponible temporalmente.' }, 503)
  if (!allowed) return reply({ error: 'Demasiadas búsquedas. Espera un minuto.' }, 429)
  try { return reply(await buscarLibros(q, max)) }
  catch { return reply({ error: 'No se pudo consultar Google Books. Inténtalo más tarde.' }, 502) }
}
