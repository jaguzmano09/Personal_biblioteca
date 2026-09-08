export type EstadoLectura = 'Leído' | 'Leyendo' | 'Pendiente' | 'Abandonado'

export interface Libro {
  id: string
  user_id: string
  google_books_id: string | null
  titulo: string
  autores: string[] | null
  editorial: string | null
  fecha_publicacion: string | null
  paginas: number | null
  portada_url: string | null
  isbn: string | null
  estado: EstadoLectura
  puntuacion: number | null
  resumen_analisis: string | null
  personaje_favorito: string | null
  citas_destacadas: string | null
  fecha_inicio: string | null
  fecha_fin: string | null
  created_at: string
  updated_at: string
}

// Resultado crudo de la API de Google Books, ya normalizado
export interface GoogleBookResult {
  google_books_id: string
  titulo: string
  autores: string[]
  editorial: string | null
  fecha_publicacion: string | null
  paginas: number | null
  portada_url: string | null
  isbn: string | null
}