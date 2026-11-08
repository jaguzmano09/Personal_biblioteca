import type { GoogleBookResult } from './types'
import { coverUrl, googleBook } from './validation'

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes'

interface GoogleVolumeItem {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    publisher?: string
    publishedDate?: string
    pageCount?: number
    imageLinks?: { thumbnail?: string; smallThumbnail?: string }
    industryIdentifiers?: { type: string; identifier: string }[]
  }
}

function normalizarVolumen(item: GoogleVolumeItem): GoogleBookResult {
  let portada: string | null = null
  try { portada = coverUrl(item.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://')) } catch { /* Invalid URL syntax is not rendered. */ }
  const info = item.volumeInfo
  const isbn13 = info.industryIdentifiers?.find(i => i.type === 'ISBN_13')?.identifier
  const isbn10 = info.industryIdentifiers?.find(i => i.type === 'ISBN_10')?.identifier

  return {
    google_books_id: item.id,
    titulo: info.title,
    autores: info.authors?.filter(a => typeof a === 'string') ?? [],
    editorial: info.publisher ?? null,
    fecha_publicacion: info.publishedDate ?? null,
    paginas: info.pageCount ?? null,
    portada_url: portada,
    isbn: isbn13 ?? isbn10 ?? null,
  }
}

export async function buscarLibros(query: string, maxResults = 10): Promise<GoogleBookResult[]> {
  if (!query.trim()) return []

  const params = new URLSearchParams({
    q: query,
    maxResults: String(maxResults),
  })

  // Agregamos la key si existe, para evitar la cuota anónima compartida
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY
  if (apiKey) {
    params.set('key', apiKey)
  }

  const res = await fetch(`${GOOGLE_BOOKS_API}?${params}`, { cache: 'no-store', signal: AbortSignal.timeout(8000) })

  if (!res.ok) {
    throw new Error('Error al consultar Google Books API')
  }

  const data = await res.json()
  const items: GoogleVolumeItem[] = data.items ?? []

  if (!Array.isArray(items)) return []
  return items.flatMap(item => {
    try { return [googleBook(normalizarVolumen(item))] } catch { return [] }
  })
}