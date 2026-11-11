import DatosPersonales from '@/components/privacy/DatosPersonales'

export default function DatosPage() {
  const nombre = process.env.TINTERUNA_OPERATOR_NAME?.trim()
  const email = process.env.TINTERUNA_PRIVACY_EMAIL?.trim()
  const contacto = nombre && email ? { nombre, email } : null

  return <DatosPersonales contacto={contacto} />
}
