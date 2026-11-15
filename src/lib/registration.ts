export const NOTICE_VERSION = '2026-11-14'

export function registrationConsent(value: unknown) {
  if (!value || typeof value !== 'object')
    throw new Error('Revisa las condiciones de registro.')
  const consent = value as Record<string, unknown>
  if (
    consent.age !== 'adult' ||
    consent.terms !== true ||
    consent.privacy !== true ||
    consent.version !== NOTICE_VERSION
  ) {
    throw new Error(
      'El autorregistro requiere mayoría de edad y las dos aceptaciones. Para adolescentes, consulta el registro acompañado.'
    )
  }
  return {
    age_declaration: 'adult',
    terms_version: NOTICE_VERSION,
    privacy_version: NOTICE_VERSION,
    accepted_at: new Date().toISOString()
  }
}
