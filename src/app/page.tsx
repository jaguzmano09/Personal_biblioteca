import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Portada from '@/components/home/Portada'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/biblioteca')
  }

  return <Portada />
}
