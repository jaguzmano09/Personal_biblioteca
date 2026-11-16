import LoginForm from '@/components/auth/LoginForm'
import { authChallengeConfig } from '@/lib/auth-security'
export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  return (
    <LoginForm
      challenge={authChallengeConfig()}
      confirmationError={params.error === 'confirmation'}
    />
  )
}
