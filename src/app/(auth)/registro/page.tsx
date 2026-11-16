import RegistroForm from '@/components/auth/RegistroForm'
import { operatorConfig } from '@/lib/operator-config'
import { authChallengeConfig } from '@/lib/auth-security'
export const dynamic = 'force-dynamic'

export default function RegistroPage() {
  return (
    <RegistroForm
      challenge={authChallengeConfig()}
      enabled={operatorConfig().ready}
    />
  )
}
