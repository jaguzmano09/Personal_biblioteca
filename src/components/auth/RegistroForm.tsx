'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { MailCheck, Loader2 } from 'lucide-react'
import { registrarUsuario } from '@/lib/auth'
import AuthShell from './AuthShell'
import PasswordInput from './PasswordInput'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { NOTICE_VERSION } from '@/lib/registration'

export default function RegistroForm({
  enabled = false
}: {
  enabled?: boolean
}) {
  const [age, setAge] = useState('')
  const [terms, setTerms] = useState(false)
  const [privacy, setPrivacy] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [exito, setExito] = useState(false)
  const [cargando, setCargando] = useState(false)
  const confirmacion = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (exito) confirmacion.current?.focus()
  }, [exito])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (cargando) return
    setCargando(true)
    setError(null)
    try {
      const resultado = await registrarUsuario(email, password, {
        age,
        terms,
        privacy,
        version: NOTICE_VERSION
      })
      if (resultado?.error) setError(resultado.error)
      else setExito(true)
    } catch {
      setError(
        'No se pudo completar el registro. Revisa tu conexión e inténtalo de nuevo.'
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <AuthShell>
      {exito ? (
        <section aria-labelledby="confirmation-title">
          <MailCheck aria-hidden="true" className="mb-6 size-10 text-cloth" />
          <h1
            id="confirmation-title"
            ref={confirmacion}
            tabIndex={-1}
            className="auth-heading"
          >
            Tu primera página está cerca.
          </h1>
          <p
            role="status"
            className="mt-6 break-words text-base leading-relaxed text-ink/80"
          >
            Si el registro es válido, recibirás un enlace de confirmación en{' '}
            <strong>{email}</strong>. Abre el enlace en este navegador para
            confirmar tu cuenta.
          </p>
          <Link href="/login" className="editorial-button mt-7 w-full">
            Ir al inicio de sesión
          </Link>
          <Link
            href="/confirmar"
            className="editorial-link mt-4 inline-flex min-h-12 items-center"
          >
            No recibí la confirmación
          </Link>
        </section>
      ) : (
        <section aria-labelledby="registration-title">
          <h1 id="registration-title" className="auth-heading">
            Tu biblioteca empieza contigo.
          </h1>
          <p className="mb-8 mt-5 text-base leading-relaxed text-ink/75">
            Un lugar para tus libros y todo lo que dejan en ti.
          </p>
          <Field className="mb-6">
            <FieldLabel htmlFor="registration-age">
              ¿Qué opción corresponde a tu edad?
            </FieldLabel>
            <NativeSelect
              id="registration-age"
              value={age}
              onChange={event => setAge(event.target.value)}
            >
              <NativeSelectOption value="">Elige una opción</NativeSelectOption>
              <NativeSelectOption value="adult">
                Tengo 18 años o más
              </NativeSelectOption>
              <NativeSelectOption value="teen">
                Tengo entre 15 y 17 años
              </NativeSelectOption>
              <NativeSelectOption value="under">
                Tengo menos de 15 años
              </NativeSelectOption>
            </NativeSelect>
          </Field>
          {age === 'teen' && (
            <div className="flex flex-col gap-4">
              <p>
                Tu registro requiere acompañamiento y autorización previa de tu
                representante legal. No crees una cuenta todavía: consulta el
                procedimiento para adolescentes.
              </p>
              <Link
                className="editorial-link inline-flex min-h-12 items-center"
                href="/ayuda"
              >
                Consultar el registro acompañado
              </Link>
            </div>
          )}
          {age === 'under' && (
            <p role="status">
              El registro de Tinteruna no está disponible para menores de 15
              años.
            </p>
          )}
          {!enabled && (
            <p role="alert" className="editorial-alert my-4">
              El registro está temporalmente cerrado mientras se completa el
              canal de privacidad. Puedes consultar{' '}
              <Link href="/ayuda" className="editorial-link">
                la ayuda
              </Link>
              .
            </p>
          )}
          {age === 'adult' && enabled && (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              aria-busy={cargando}
              aria-describedby={error ? 'registration-error' : undefined}
            >
              <fieldset disabled={cargando} className="min-w-0 space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="registroform-1"
                    className="block text-sm font-medium"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="registroform-1"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    required
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    className="editorial-input"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="registroform-2"
                    className="block text-sm font-medium"
                  >
                    Contraseña
                  </label>
                  <PasswordInput
                    id="registroform-2"
                    value={password}
                    onChange={setPassword}
                    autoComplete="new-password"
                    minLength={12}
                    describedBy="password-help"
                  />
                  <p
                    id="password-help"
                    className="text-xs leading-relaxed text-ink/75"
                  >
                    Usa entre 12 y 128 caracteres.
                  </p>
                </div>
                {error && (
                  <p
                    id="registration-error"
                    role="alert"
                    className="editorial-alert"
                  >
                    {error}
                  </p>
                )}
                <FieldGroup>
                  <Field orientation="horizontal">
                    <Checkbox
                      id="registration-terms"
                      checked={terms}
                      onCheckedChange={value => setTerms(value === true)}
                      required
                    />
                    <FieldLabel
                      htmlFor="registration-terms"
                      className="min-h-12"
                    >
                      <span>
                        He leído y acepto los{' '}
                        <Link href="/terminos" className="editorial-link">
                          términos de uso
                        </Link>
                        .
                      </span>
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox
                      id="registration-privacy"
                      checked={privacy}
                      onCheckedChange={value => setPrivacy(value === true)}
                      required
                    />
                    <FieldLabel
                      htmlFor="registration-privacy"
                      className="min-h-12"
                    >
                      <span>
                        Autorizo el tratamiento de mis datos para las finalidades
                        de la{' '}
                        <Link href="/privacidad" className="editorial-link">
                          política de privacidad
                        </Link>
                        .
                      </span>
                    </FieldLabel>
                  </Field>
                </FieldGroup>
                <button
                  type="submit"
                  disabled={cargando || !terms || !privacy}
                  className="editorial-button w-full"
                >
                  {cargando && (
                    <Loader2
                      aria-hidden="true"
                      className="size-4 motion-safe:animate-spin"
                    />
                  )}
                  {cargando ? 'Creando tu espacio…' : 'Crear mi cuenta'}
                </button>
              </fieldset>
            </form>
          )}
          <p className="mt-7 text-center text-sm text-ink/80">
            ¿Ya tienes tu biblioteca?{' '}
            <Link
              href="/login"
              className="editorial-link inline-flex min-h-11 items-center"
            >
              Inicia sesión
            </Link>
          </p>
        </section>
      )}
    </AuthShell>
  )
}
