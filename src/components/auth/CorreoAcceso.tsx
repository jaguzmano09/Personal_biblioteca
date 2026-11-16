'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { solicitarCorreo } from '@/lib/auth'
import AuthShell from './AuthShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Alert, AlertDescription } from '@/components/ui/alert'
import CaptchaChallenge, {
  noChallenge,
  type ChallengeConfig
} from './CaptchaChallenge'

export default function CorreoAcceso({
  kind,
  expired = false,
  challenge = noChallenge
}: {
  kind: 'recovery' | 'confirmation'
  expired?: boolean
  challenge?: ChallengeConfig
}) {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState('')
  const [challengeVersion, setChallengeVersion] = useState(0)
  useEffect(() => {
    if (!seconds) return
    const timer = setTimeout(() => setSeconds(value => value - 1), 1000)
    return () => clearTimeout(timer)
  }, [seconds])
  return (
    <AuthShell>
      <h1 className="auth-heading">
        {kind === 'recovery'
          ? 'Vuelve a tu biblioteca.'
          : 'Confirma tu primera página.'}
      </h1>
      <p className="my-5 text-base leading-relaxed text-ink/80">
        {kind === 'recovery'
          ? 'Te enviaremos un enlace para elegir una contraseña nueva.'
          : 'Pide un nuevo enlace para confirmar tu correo. Revisa también la carpeta de correo no deseado.'}{' '}
        Abre el enlace en este mismo navegador.
      </p>
      {expired && (
        <Alert className="mb-5">
          <AlertDescription>
            El enlace no es válido o ha caducado. Puedes pedir otro aquí.
          </AlertDescription>
        </Alert>
      )}
      <form
        className="flex flex-col gap-5"
        aria-busy={busy}
        onSubmit={async event => {
          event.preventDefault()
          if (busy || seconds) return
          setBusy(true)
          setError(null)
          try {
            const result = await solicitarCorreo(email, kind, captchaToken)
            if (result.error) setError(result.error)
            else {
              setSent(true)
              setSeconds(60)
            }
          } catch {
            setError(
              'No se pudo enviar la solicitud. Revisa tu conexión e inténtalo de nuevo.'
            )
          } finally {
            setCaptchaToken('')
            setChallengeVersion(value => value + 1)
            setBusy(false)
          }
        }}
      >
        <FieldGroup>
          <Field data-disabled={busy} data-invalid={!!error}>
            <FieldLabel htmlFor="access-email">Correo electrónico</FieldLabel>
            <Input
              id="access-email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              disabled={busy}
              value={email}
              onChange={event => setEmail(event.target.value)}
              aria-invalid={!!error}
            />
          </Field>
        </FieldGroup>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {sent && (
          <p role="status" className="text-sm leading-relaxed">
            Si la cuenta corresponde y la solicitud puede procesarse, recibirás un
            enlace. Por seguridad, esta respuesta no confirma si existe una cuenta
            con ese correo.
          </p>
        )}
        <CaptchaChallenge
          key={challengeVersion}
          config={challenge}
          action={kind}
          onToken={setCaptchaToken}
        />
        <Button
          disabled={busy || seconds > 0 || (challenge.required && !captchaToken)}
          type="submit"
        >
          {busy
            ? 'Enviando solicitud…'
            : seconds
              ? `Puedes reintentar en ${seconds} s`
              : kind === 'recovery'
                ? 'Solicitar enlace de recuperación'
                : 'Reenviar confirmación'}
        </Button>
      </form>
      <div className="mt-6 flex flex-wrap gap-5">
        <Link
          className="editorial-link inline-flex min-h-12 items-center text-sm"
          href="/login"
        >
          Volver al inicio de sesión
        </Link>
        <Link
          className="editorial-link inline-flex min-h-12 items-center text-sm"
          href="/ayuda"
        >
          Necesito ayuda
        </Link>
      </div>
    </AuthShell>
  )
}
