import { createClient } from '@/lib/supabase/server'
import { cerrarSesion } from '@/lib/auth'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b-2 border-ink px-4 sm:px-6 py-4 flex justify-between items-baseline">
        <span className="font-display text-xl">Mi Biblioteca</span>
        <div className="flex items-center gap-4 font-mono text-xs text-ink/70">
          <span>{user?.email}</span>
          <form action={cerrarSesion}>
            <button className="underline decoration-rule hover:decoration-stamp hover:text-stamp transition-colors">
              salir
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  )
}