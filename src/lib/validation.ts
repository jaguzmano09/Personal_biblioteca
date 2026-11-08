import type { GoogleBookResult, Libro } from './types'

export class ValidationError extends Error {}
const invalid = () => new ValidationError('Datos inválidos. Revisa los campos e inténtalo de nuevo.')
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw invalid()
  return value as Record<string, unknown>
}
function text(value: unknown, max: number, required = false): string | null {
  if (value == null || value === '') { if (required) throw invalid(); return null }
  if (typeof value !== 'string' || value.length > max) throw invalid()
  const result = value.trim()
  if (!result && required) throw invalid()
  return result || null
}
export function integer(value: unknown, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < min || value > max) throw invalid()
  return value
}
function optionalInteger(value: unknown, min: number, max: number) {
  return value == null ? null : integer(value, min, max)
}
function choice<T extends string>(value: unknown, choices: readonly T[], required = false): T | null {
  if (value == null && !required) return null
  if (typeof value !== 'string' || !choices.includes(value as T)) throw invalid()
  return value as T
}
export function uuid(value: unknown): string {
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) throw invalid()
  return value
}
export function coverUrl(value: unknown): string | null {
  const result = text(value, 8192)
  if (!result) return null
  let url: URL
  try { url = new URL(result) } catch { throw invalid() }
  // Storage is provider-independent. Network destinations are verified by the server proxy.
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.port || !url.hostname) throw invalid()
  return result
}
export type PersonalData = Pick<Libro, 'estado' | 'puntuacion' | 'resumen_analisis' | 'personaje_favorito' | 'citas_destacadas' | 'anio_lectura' | 'mes_lectura' | 'formato' | 'procedencia'>
export type BookChanges = PersonalData & Pick<Libro, 'portada_url'>
export function personalData(value: unknown): PersonalData {
  const v = record(value)
  const puntuacion = v.puntuacion == null ? null : v.puntuacion
  if (puntuacion !== null && (typeof puntuacion !== 'number' || !Number.isFinite(puntuacion) || puntuacion < 0 || puntuacion > 10 || !Number.isInteger(puntuacion * 10))) throw invalid()
  const anio = optionalInteger(v.anio_lectura, 1000, 9999)
  const mes = optionalInteger(v.mes_lectura, 1, 12)
  if (mes !== null && anio === null) throw invalid()
  return {
    estado: choice(v.estado, ['Leído', 'Leyendo', 'Pendiente', 'Abandonado'], true)!,
    puntuacion: puntuacion as number | null,
    resumen_analisis: text(v.resumen_analisis, 20000),
    personaje_favorito: text(v.personaje_favorito, 500),
    citas_destacadas: text(v.citas_destacadas, 20000),
    anio_lectura: anio, mes_lectura: mes,
    formato: choice(v.formato, ['Física', 'Digital']),
    procedencia: choice(v.procedencia, ['Casa de mis papás', 'Regalado', 'Comprado']),
  }
}
export function bookChanges(value: unknown): BookChanges {
  const v = record(value)
  return { ...personalData(v), portada_url: coverUrl(v.portada_url) }
}
export function googleBook(value: unknown): GoogleBookResult {
  const v = record(value)
  if (!Array.isArray(v.autores) || v.autores.length > 50) throw invalid()
  return {
    google_books_id: text(v.google_books_id, 200, true)!,
    titulo: text(v.titulo, 1000, true)!,
    autores: v.autores.map(a => text(a, 500, true)!),
    editorial: text(v.editorial, 1000), fecha_publicacion: text(v.fecha_publicacion, 100),
    paginas: optionalInteger(v.paginas, 0, 1000000), portada_url: coverUrl(v.portada_url), isbn: text(v.isbn, 32),
  }
}
export function credentials(email: unknown, password: unknown, registration = false) {
  const normalized = text(email, 254, true)!
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || typeof password !== 'string' ||
      password.length > 128 || password.length < (registration ? 12 : 1)) throw invalid()
  return { email: normalized, password }
}
