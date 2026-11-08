import type { Libro } from './types'

export function readingStatistics(libros: Libro[], year: number) {
  const completed = libros.filter(book => book.estado === 'Leído' && book.anio_lectura === year)
  const rated = completed.filter(book => book.puntuacion !== null)
  const counts = new Map<string, number>()
  completed.forEach(book => new Set(book.autores ?? []).forEach(author => counts.set(author, (counts.get(author) ?? 0) + 1)))
  const top = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]
  return {
    total: completed.length,
    promedioPuntuacion: rated.length ? rated.reduce((sum, book) => sum + book.puntuacion!, 0) / rated.length : null,
    autorTop: top && top[1] > 1 ? top[0] : null,
    totalPaginas: completed.reduce((sum, book) => sum + (book.paginas ?? 0), 0),
  }
}
