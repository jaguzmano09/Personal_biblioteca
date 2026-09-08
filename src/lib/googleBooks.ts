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