'use client'
import { useState } from 'react'
import Link from 'next/link'
import { actualizarClave } from '@/lib/auth'
import AuthShell from './AuthShell'
import PasswordInput from './PasswordInput'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function NuevaClave({
  authenticated
}: {
  authenticated: boolean
}) {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [closed, setClosed] = useState(true)
  return (
    <AuthShell>
      <h1 className="auth-heading">
        {done
          ? 'Tu contraseña está actualizada.'
          : 'Una nueva llave para tus páginas.'}
      </h1>
      {!authenticated && !done ? (
        <div className="mt-6 flex flex-col gap-5">
          <p>
            Este enlace ya no permite cambiar la contraseña. Solicita uno nuevo
            y ábrelo en el mismo navegador.
          </p>
          <Button asChild>
            <Link href="/recuperar">Solicitar otro enlace</Link>
          </Button>
        </div>
      ) : done ? (
        <div className="mt-6 flex flex-col gap-5">
          <p role="status">
            Ya puedes volver a tu biblioteca con la contraseña nueva.
          </p>
          {!closed && (
            <Alert>
              <AlertDescription>
                La contraseña cambió, pero no se pudieron cerrar todas las
                sesiones. Cierra sesión desde tu cuenta o solicita ayuda si no
                reconoces algún acceso.
              </AlertDescription>
            </Alert>
          )}
          <Button asChild>
            <Link href="/login">Iniciar sesión</Link>
          </Button>
        </div>
      ) : (
        <form
          className="mt-6 flex flex-col gap-5"
          aria-busy={busy}
          onSubmit={async event => {
            event.preventDefault()
            if (busy) return
            setBusy(true)
            setError(null)
            try {
              const result = await actualizarClave(password, confirmation)
              if (result.error) setError(result.error)
              else {
                setPassword('')
                setConfirmation('')
                setClosed(result.sessionClosed ?? false)
                setDone(true)
              }
            } catch {
              setError(
                'No se pudo completar el cambio. Revisa tu conexión e inténtalo de nuevo.'
              )
            } finally {
              setBusy(false)
            }
          }}
        >
          <fieldset disabled={busy}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="new-password">Contraseña nueva</FieldLabel>
                <PasswordInput
                  id="new-password"
                  value={password}
                  onChange={setPassword}
                  autoComplete="new-password"
                  minLength={12}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="repeat-password">
                  Repite la contraseña
                </FieldLabel>
                <PasswordInput
                  id="repeat-password"
                  value={confirmation}
                  onChange={setConfirmation}
                  autoComplete="new-password"
                  minLength={12}
                />
              </Field>
            </FieldGroup>
          </fieldset>
          <p className="text-sm text-ink/75">
            Usa entre 12 y 128 caracteres. No compartas tu contraseña ni el
            enlace de recuperación.
          </p>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" disabled={busy}>
            {busy ? 'Guardando…' : 'Guardar contraseña nueva'}
          </Button>
          <Link
            href="/recuperar"
            className="editorial-link inline-flex min-h-12 items-center text-sm"
          >
            Solicitar otro enlace
          </Link>
        </form>
      )}
    </AuthShell>
  )
}
