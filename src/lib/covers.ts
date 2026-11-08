import { coverUrl } from './validation'
export function safeCover(value: unknown) {
  try {
    const source = coverUrl(value)
    return source ? `/api/covers?url=${encodeURIComponent(source)}` : null
  } catch { return null }
}
