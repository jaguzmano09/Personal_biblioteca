'use client'

import { useEffect, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export type ChallengeConfig = { required: boolean; siteKey: string | null }
export const noChallenge: ChallengeConfig = { required: false, siteKey: null }

export default function CaptchaChallenge({
  config,
  action,
  onToken
}: {
  config: ChallengeConfig
  action: 'login' | 'signup' | 'recovery' | 'confirmation'
  onToken: (value: string) => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    if (!config.required || !config.siteKey) return
    const timer = setTimeout(() => {
      if (!window.turnstile) {
        onToken('')
        setError(
          'No se cargó la verificación. Revisa tu conexión y vuelve a intentarlo.'
        )
      }
    }, 15000)
    return () => clearTimeout(timer)
  }, [config.required, config.siteKey, onToken, retry])
  if (!config.required) return null
  if (!config.siteKey)
    return (
      <Alert variant="destructive">
        <AlertDescription>
          La verificación no está disponible. Inténtalo más tarde.
        </AlertDescription>
      </Alert>
    )
  const fail = () => {
    onToken('')
    setError(
      'No se completó la verificación. Revisa tu conexión y vuelve a intentarlo.'
    )
  }
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <p className="text-sm text-ink/75">
        Una comprobación breve para proteger tu biblioteca.
      </p>
      <Turnstile
        key={retry}
        siteKey={config.siteKey}
        options={{
          action,
          language: 'es',
          theme: 'light',
          size: 'compact',
          refreshExpired: 'manual',
          retry: 'never'
        }}
        onSuccess={token => {
          setError(null)
          onToken(token)
        }}
        onExpire={() => {
          onToken('')
          setError('La verificación caducó. Compruébala de nuevo para continuar.')
        }}
        onError={fail}
        onTimeout={fail}
        onUnsupported={fail}
        scriptOptions={{ id: 'tinteruna-turnstile-script', onError: fail }}
        className="min-w-0"
      />
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (!window.turnstile)
              document.getElementById('tinteruna-turnstile-script')?.remove()
            onToken('')
            setError(null)
            setRetry(value => value + 1)
          }}
        >
          Reintentar verificación
        </Button>
      )}
    </div>
  )
}
