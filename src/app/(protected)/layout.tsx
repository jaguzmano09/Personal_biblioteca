import LibraryNavigation from '@/components/ui/LibraryNavigation'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="app-frame bg-paper">
      <LibraryNavigation email={user.email} />
      <div id="contenido">{children}</div>
    </div>
  )
}
