'use server'

import type { GoogleBookResult, Libro } from './types'
import { bookChanges, googleBook, personalData, uuid, ValidationError } from './validation'
import { requireUser } from './session'
import { revalidatePath } from 'next/cache'

export async function guardarLibro(libroGoogle: GoogleBookResult, datosPersonales: unknown) {
  const { supabase, user } = await requireUser()
  let payload
  try {
    payload = { ...googleBook(libroGoogle), ...personalData(datosPersonales), user_id: user.id }
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false as const, error: error.message }
    throw error
  }
  const { data, error } = await supabase.from('libros').insert(payload).select().single()
  if (error) {
    return {
      ok: false as const,
      error: error.code === '23505'
        ? 'Ya tienes esta edición en tu biblioteca. Tus anotaciones siguen aquí para que puedas copiarlas antes de volver.'
        : 'No se pudo guardar el libro. Tus datos siguen aquí para que puedas reintentarlo.'
    }
  }
  revalidatePath('/biblioteca')
  return { ok: true as const, libro: data as Libro }
}

export async function actualizarLibro(id: string, cambios: unknown) {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase.from('libros').update(bookChanges(cambios))
    .eq('id', uuid(id)).eq('user_id', user.id).select().single()
  if (error) throw new Error('No se pudo actualizar el libro.')
  revalidatePath('/biblioteca')
  revalidatePath(`/biblioteca/${id}`)
  return data as Libro
}

export async function guardarNotaLibro(id: string, nota: unknown, notaAnterior: string | null) {
  const { supabase, user } = await requireUser()
  const libroId = uuid(id)

  if (typeof nota !== 'string' || nota.length > 20000 ||
      (notaAnterior !== null && (typeof notaAnterior !== 'string' || notaAnterior.length > 20000))) {
    throw new Error('Nota inválida.')
  }

  const update = supabase.from('libros').update({ resumen_analisis: nota.trim() || null })
    .eq('id', libroId).eq('user_id', user.id)
  const matchingNote = notaAnterior === null
    ? update.is('resumen_analisis', null)
    : update.eq('resumen_analisis', notaAnterior)
  const { data, error } = await matchingNote.select('id').maybeSingle()

  if (error || !data) throw new Error('No se pudo guardar la nota.')
  revalidatePath('/biblioteca')
  revalidatePath(`/biblioteca/${libroId}`)
}

export async function eliminarLibro(id: string) {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase.from('libros').delete()
    .eq('id', uuid(id)).eq('user_id', user.id).select('id').maybeSingle()
  if (error || !data) throw new Error('No se pudo eliminar el libro.')
  revalidatePath('/biblioteca')
}

export async function obtenerLibros() {
  const { supabase, user } = await requireUser()
  // Supabase caps responses. Read bounded batches so the dashboard never silently omits books.
  const libros: Libro[] = []
  const batch = 500
  for (let offset = 0; ; offset += batch) {
    const { data, error } = await supabase.from('libros').select('*').eq('user_id', user.id)
      .order('updated_at', { ascending: false }).order('id').range(offset, offset + batch - 1)
    if (error) throw new Error('No se pudo cargar la biblioteca.')
    libros.push(...data as Libro[])
    if (data.length < batch) return libros
  }
}

export async function obtenerLibroPorId(id: string) {
  const { supabase, user } = await requireUser()
  // Missing and inaccessible IDs deliberately have the same result.
  const { data, error } = await supabase.from('libros').select('*')
    .eq('id', uuid(id)).eq('user_id', user.id).maybeSingle()
  if (error) throw new Error('No se pudo cargar el libro.')
  return data as Libro | null
}
