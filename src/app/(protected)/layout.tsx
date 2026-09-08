import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { cerrarSesion } from '@/lib/auth'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <header className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <span className="font-semibold">📚 Mi Biblioteca</span>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{user?.email}</span>
          <form action={cerrarSesion}>
            <button className="flex items-center gap-1 hover:text-red-600">
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  )
}