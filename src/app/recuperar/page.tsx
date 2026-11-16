import CorreoAcceso from '@/components/auth/CorreoAcceso'
import { authChallengeConfig } from '@/lib/auth-security'
export default async function Recuperar({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <CorreoAcceso
      challenge={authChallengeConfig()}
      kind="recovery"
      expired={(await searchParams).error === 'expired'}
    />
  )
}
