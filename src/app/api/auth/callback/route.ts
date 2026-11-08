import { createClient } from '@/lib/supabase/server'
import { siteOrigin } from '@/lib/supabase/config'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get('code')
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${siteOrigin()}/biblioteca`)
  }
  return NextResponse.redirect(`${siteOrigin()}/login?error=confirmation`)
}
