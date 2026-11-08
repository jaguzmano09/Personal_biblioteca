'use server'

import { requireUser } from './session'
import { integer } from './validation'
import { revalidatePath } from 'next/cache'

export async function obtenerMeta(anio: number): Promise<number | null> {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase.from('metas_lectura').select('meta_libros')
    .eq('user_id', user.id).eq('anio', integer(anio, 1000, 9999)).maybeSingle()
  if (error) throw new Error('No se pudo cargar la meta.')
  return data?.meta_libros ?? null
}

export async function guardarMeta(anio: number, metaLibros: number) {
  const { supabase, user } = await requireUser()
  const { error } = await supabase.from('metas_lectura').upsert({
    user_id: user.id, anio: integer(anio, 1000, 9999), meta_libros: integer(metaLibros, 1, 100000),
  }, { onConflict: 'user_id,anio' })
  if (error) throw new Error('No se pudo guardar la meta.')
  revalidatePath('/biblioteca')
}
