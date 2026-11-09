import Wordmark from '@/components/ui/Wordmark'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cerrarSesion } from '@/lib/auth'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b-2 border-ink px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <Wordmark href="/biblioteca" />
        <div className="flex min-w-0 flex-wrap items-center gap-3 text-xs text-ink/75">
          <span className="min-w-0 break-all">{user.email}</span>
          <form action={cerrarSesion}>
            <button className="editorial-link min-h-11 px-2">
              salir
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  )
}
