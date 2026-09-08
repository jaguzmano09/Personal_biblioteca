import type { GoogleBookResult } from './types'

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
  const info = item.volumeInfo
  const isbn13 = info.industryIdentifiers?.find(i => i.type === 'ISBN_13')?.identifier
  const isbn10 = info.industryIdentifiers?.find(i => i.type === 'ISBN_10')?.identifier

  return {
    google_books_id: item.id,
    titulo: info.title,
    autores: info.authors ?? [],
    editorial: info.publisher ?? null,
    fecha_publicacion: info.publishedDate ?? null,
    paginas: info.pageCount ?? null,
    portada_url: info.imageLinks?.thumbnail?.replace('http://', 'https://') ?? null,
    isbn: isbn13 ?? isbn10 ?? null,
  }
}

export async function buscarLibros(query: string): Promise<GoogleBookResult[]> {
  if (!query.trim()) return []

  const params = new URLSearchParams({
    q: query,
    maxResults: '10',
  })

  // Agregamos la key si existe, para evitar la cuota anónima compartida
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY
  if (apiKey) {
    params.set('key', apiKey)
  }

  const res = await fetch(`${GOOGLE_BOOKS_API}?${params}`)

  if (!res.ok) {
    throw new Error('Error al consultar Google Books API')
  }

  const data = await res.json()
  const items: GoogleVolumeItem[] = data.items ?? []

  return items
    .filter(item => item.volumeInfo?.title)
    .map(normalizarVolumen)
}