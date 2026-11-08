export function supabaseConfig() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Falta configurar Supabase en el servidor.')
  if (key.startsWith('sb_secret_')) throw new Error('Usa una clave pública de Supabase, nunca una clave secreta.')
  const parts = key.split('.')
  if (parts.length === 3) {
    try {
      const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
      if (claims.role !== 'anon') throw new Error('Privileged key')
    } catch { throw new Error('SUPABASE_ANON_KEY debe ser una clave anon o publishable.') }
  }
  return { url, key }
}

export function siteOrigin() {
  const value = process.env.SITE_URL
  if (!value) throw new Error('Configura SITE_URL con el origen de la aplicación.')
  const url = new URL(value)
  const local = ['localhost', '127.0.0.1'].includes(url.hostname)
  if ((url.protocol !== 'https:' && !(local && url.protocol === 'http:')) ||
      url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SITE_URL debe ser un origen HTTPS (HTTP solo en localhost).')
  }
  return url.origin
}
