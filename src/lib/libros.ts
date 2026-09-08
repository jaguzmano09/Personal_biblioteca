'use server'

import { createClient } from '@/lib/supabase/server'
import type { GoogleBookResult, Libro, EstadoLectura } from '@/lib/types'
import { revalidatePath } from 'next/cache'

interface DatosPersonales {
  estado: EstadoLectura
  puntuacion?: number | null
  resumen_analisis?: string | null
  personaje_favorito?: string | null
  citas_destacadas?: string | null
  fecha_inicio?: string | null
  fecha_fin?: string | null
}

export async function guardarLibro(
  libroGoogle: GoogleBookResult,
  datosPersonales: DatosPersonales
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { data, error } = await supabase
    .from('libros')
    .insert({
      user_id: user.id,
      google_books_id: libroGoogle.google_books_id,
      titulo: libroGoogle.titulo,
      autores: libroGoogle.autores,
      editorial: libroGoogle.editorial,
      fecha_publicacion: libroGoogle.fecha_publicacion,
      paginas: libroGoogle.paginas,
      portada_url: libroGoogle.portada_url,
      isbn: libroGoogle.isbn,
      ...datosPersonales,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Ya tienes este libro registrado en tu biblioteca.')
    }
    throw new Error(error.message)
  }

  revalidatePath('/biblioteca')
  return data as Libro
}

export async function actualizarLibro(id: string, cambios: Partial<Libro>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('libros')
    .update(cambios)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/biblioteca')
  revalidatePath(`/biblioteca/${id}`)
  return data as Libro
}

export async function eliminarLibro(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('libros')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/biblioteca')
}

export async function obtenerLibros() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('libros')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Libro[]
}

export async function obtenerLibroPorId(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('libros')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as Libro
}