import LoginForm from '@/components/auth/LoginForm'
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams
  return <LoginForm confirmationError={params.error === 'confirmation'} />
}
