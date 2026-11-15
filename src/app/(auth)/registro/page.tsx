import RegistroForm from '@/components/auth/RegistroForm'
import { operatorConfig } from '@/lib/operator-config'
export const dynamic = 'force-dynamic'

export default function RegistroPage() {
  return <RegistroForm enabled={operatorConfig().ready} />
}
