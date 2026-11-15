import { createClient } from '@/lib/supabase/server'
import { siteOrigin } from '@/lib/supabase/config'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const recovery = params.get('flow') === 'recovery'
  const code = params.get('code')
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error)
      return NextResponse.redirect(
        `${siteOrigin()}${recovery ? '/actualizar-clave' : '/biblioteca'}`
      )
  }
  return NextResponse.redirect(
    `${siteOrigin()}${recovery ? '/recuperar?error=expired' : '/login?error=confirmation'}`
  )
}
