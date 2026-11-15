import CorreoAcceso from '@/components/auth/CorreoAcceso'
export default async function Recuperar({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <CorreoAcceso
      kind="recovery"
      expired={(await searchParams).error === 'expired'}
    />
  )
}
