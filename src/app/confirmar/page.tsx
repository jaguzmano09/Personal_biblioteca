import CorreoAcceso from '@/components/auth/CorreoAcceso'
import { authChallengeConfig } from '@/lib/auth-security'
export const dynamic = 'force-dynamic'
export default function Confirmar() {
  return <CorreoAcceso challenge={authChallengeConfig()} kind="confirmation" />
}
