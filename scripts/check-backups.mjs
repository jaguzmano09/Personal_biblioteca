import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

// This command only reads the provider inventory. It never creates/restores a backup.
export async function inspectBackups({ projectRef, token, fetchImpl = fetch }) {
  if (!/^[a-z]{20}$/.test(projectRef ?? ''))
    return { status: 'blocked', reason: 'invalid_project_ref' }
  if (!token || /[\r\n]/.test(token))
    return { status: 'blocked', reason: 'missing_management_token' }
  try {
    const response = await fetchImpl(
      `https://api.supabase.com/v1/projects/${projectRef}/database/backups`,
      {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        redirect: 'error',
        signal: AbortSignal.timeout(15000),
      },
    )
    if (!response.ok)
      return { status: 'unverified', reason: 'provider_request_failed', httpStatus: response.status }
    const data = await response.json()
    if (!data || !Array.isArray(data.backups))
      return { status: 'unverified', reason: 'unexpected_provider_response' }
    // Never print the raw management response: it can contain signed storage links.
    return {
      status: 'listed',
      backupCount: data.backups.length,
      restoreVerified: false,
      pitrEnabled: typeof data.pitr_enabled === 'boolean' ? data.pitr_enabled : null,
    }
  } catch {
    return { status: 'unverified', reason: 'provider_unavailable' }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { loadEnvConfig } = createRequire(import.meta.url)('@next/env')
  loadEnvConfig(process.cwd(), false, { info() {}, error() {} })
  let projectRef = process.env.SUPABASE_PROJECT_REF
  if (!projectRef) {
    try {
      projectRef = new URL(process.env.SUPABASE_URL).hostname.match(/^([a-z]{20})\.supabase\.co$/)?.[1]
    } catch { /* Missing project configuration is reported below. */ }
  }
  const report = await inspectBackups({ projectRef, token: process.env.SUPABASE_ACCESS_TOKEN })
  console.log(JSON.stringify(report))
  // A nonempty listing is evidence of inventory, never proof of successful restoration.
  if (report.status !== 'listed' || report.backupCount === 0) process.exitCode = 2
}
