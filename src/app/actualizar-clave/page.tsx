import { createClient } from '@/lib/supabase/server'
import NuevaClave from '@/components/auth/NuevaClave'
export default async function ActualizarClave() {
  const supabase = await createClient()
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()
  return <NuevaClave authenticated={!!user && !error} />
}
