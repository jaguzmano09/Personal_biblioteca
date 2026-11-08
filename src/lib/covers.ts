import { coverUrl } from './validation'
export function safeCover(value: unknown) {
  try { return coverUrl(value) } catch { return null }
}
