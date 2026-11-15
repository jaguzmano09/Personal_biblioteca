import 'server-only'
export function operatorConfig() {
  const read = (key: string) => process.env[key]?.trim() || null
  const name = read('TINTERUNA_OPERATOR_NAME')
  const email = read('TINTERUNA_PRIVACY_EMAIL')
  const city = read('TINTERUNA_OPERATOR_CITY')
  const address = read('TINTERUNA_OPERATOR_ADDRESS')
  const phone = read('TINTERUNA_OPERATOR_PHONE')
  const validEmail =
    email && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ? email : null
  return {
    name,
    email: validEmail,
    city,
    address,
    phone,
    ready: !!(name && validEmail && city && address && phone)
  }
}
