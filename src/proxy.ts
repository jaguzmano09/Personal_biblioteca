import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { supabaseConfig } from '@/lib/supabase/config'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { url, key } = supabaseConfig()

  const supabase = createServerClient(
    url, key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/biblioteca')
  const isAuthRoute = ['/login', '/registro'].includes(request.nextUrl.pathname)

  function privateResponse(target: NextResponse) {
    response.cookies.getAll().forEach(cookie => target.cookies.set(cookie))
    target.headers.set('Cache-Control', 'private, no-store')
    return target
  }

  if (!user && isProtectedRoute) {
    return privateResponse(NextResponse.redirect(new URL('/login', request.url)))
  }

  if (user && isAuthRoute) {
    return privateResponse(NextResponse.redirect(new URL('/biblioteca', request.url)))
  }

  return privateResponse(response)
}

export const config = {
  matcher: ['/', '/login', '/registro', '/biblioteca/:path*', '/api/:path*'],
}
