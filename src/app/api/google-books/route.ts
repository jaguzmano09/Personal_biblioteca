import { NextResponse } from 'next/server'

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()
  const maxResults = searchParams.get('maxResults') ?? '10'

  if (!q) {
    return NextResponse.json([], { status: 200 })
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY
  const params = new URLSearchParams({
    q,
    maxResults,
  })

  if (apiKey) {
    params.set('key', apiKey)
  }

  const res = await fetch(`${GOOGLE_BOOKS_API}?${params}`)

  if (!res.ok) {
    return NextResponse.json({ error: 'Error al consultar Google Books API' }, { status: 500 })
  }

  const data = await res.json()
  const items = data.items ?? []

  const libros = items
    .filter((item: any) => item?.volumeInfo?.title)
    .map((item: any) => ({
      google_books_id: item.id,
      titulo: item.volumeInfo.title,
      autores: item.volumeInfo.authors ?? [],
      editorial: item.volumeInfo.publisher ?? null,
      fecha_publicacion: item.volumeInfo.publishedDate ?? null,
      paginas: item.volumeInfo.pageCount ?? null,
      portada_url: item.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') ?? null,
      isbn:
        item.volumeInfo.industryIdentifiers?.find((i: any) => i.type === 'ISBN_13')?.identifier ??
        item.volumeInfo.industryIdentifiers?.find((i: any) => i.type === 'ISBN_10')?.identifier ??
        null,
    }))

  return NextResponse.json(libros)
}
