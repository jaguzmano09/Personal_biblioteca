import { createClient } from '@/lib/supabase/server'
import { coverUrl } from '@/lib/validation'
import { fetchCoverBytes, sanitizeCover } from '@/lib/cover-proxy'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  const headers = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' }
  const error = (status: number) => new Response('Portada no disponible.', { status, headers })
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return error(401)
  let source: string | null
  try { source = coverUrl(new URL(request.url).searchParams.get('url')) } catch { return error(400) }
  if (!source) return error(400)
  const { data: allowed, error: quotaError } = await supabase.rpc('consume_cover_request')
  if (quotaError) return error(503)
  if (!allowed) return new Response('Espera un minuto para cargar más portadas.', { status: 429, headers: { ...headers, 'Retry-After': '60' } })
  try {
    const image = await sanitizeCover(await fetchCoverBytes(source))
    return new Response(new Uint8Array(image), { headers: { ...headers, 'Content-Type': 'image/jpeg' } })
  } catch { return error(502) }
}
