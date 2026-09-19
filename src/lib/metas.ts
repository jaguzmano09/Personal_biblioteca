'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function obtenerMeta(anio: number): Promise<number | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('metas_lectura')
    .select('meta_libros')
    .eq('anio', anio)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data?.meta_libros ?? null
}

export async function guardarMeta(anio: number, metaLibros: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { error } = await supabase
    .from('metas_lectura')
    .upsert(
      { user_id: user.id, anio, meta_libros: metaLibros },
      { onConflict: 'user_id,anio' }
    )

  if (error) throw new Error(error.message)
  revalidatePath('/biblioteca')
}