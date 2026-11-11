# Correos de autenticación con la API de Brevo

Esta integración es opcional y no se activa al fusionar o desplegar la aplicación en Vercel.
Supabase Auth invoca una Edge Function firmada, que llama a `POST https://api.brevo.com/v3/smtp/email`.
No utiliza el relay SMTP. La entrega puede seguir estando sujeta a restricciones de la cuenta de Brevo;
cambiar el transporte no garantiza por sí solo que el proveedor acepte un envío.

## 1. Crear la clave en Brevo (cuando se vaya a activar)

En SMTP & API, sección **API Keys**, crea una clave API dedicada, por ejemplo `Personal Biblioteca Auth`.
Es una **clave API**, distinta de las claves SMTP probadas anteriormente. Guarda el valor en privado.
El remitente debe estar verificado en esa misma cuenta. No agregues la clave a GitHub, Vercel,
variables `NEXT_PUBLIC_*`, capturas ni conversaciones.

## 2. Preparar y desplegar la función

Requiere Supabase CLI y acceso al proyecto. Desde este repositorio:

```bash
supabase login
supabase functions deploy send-auth-email --project-ref jhncyzebeqyepmlccvny --no-verify-jwt
```

`supabase/config.toml` configura el punto de entrada JavaScript. La ausencia de JWT es intencional:
la función exige una firma Standard Webhooks válida y vigente, validada con `standardwebhooks@1.0.0`.
No es un endpoint de envío público. `SUPABASE_URL` es una variable integrada de las Edge Functions;
no necesita la clave de servicio ni acceso a tablas de usuarios.

También puede desplegarse con el editor de Edge Functions del panel, conservando los dos archivos
`index.js` y `handler.js` y el punto de entrada `index.js`. Desactiva la verificación JWT de esta función.

## 3. Configurar el hook y los secretos

En Authentication, sección **Hooks**, configura un **Send Email** HTTP hook con esta URL:

```text
https://jhncyzebeqyepmlccvny.supabase.co/functions/v1/send-auth-email
```

Genera su secreto de firma. Guarda el valor completo (formato `v1,whsec_...`).
Mantén el hook deshabilitado hasta que los secretos estén guardados y la función desplegada.
Si el panel obliga a habilitar al guardar, evita registros durante esa breve configuración.

En los secretos de Edge Functions del proyecto, agrega:

| Nombre | Valor |
| --- | --- |
| `BREVO_API_KEY` | La nueva clave API de Brevo |
| `BREVO_SENDER_EMAIL` | El correo del remitente verificado, guardado como secreto del proveedor |
| `SEND_EMAIL_HOOK_SECRET` | El secreto del hook generado por Supabase |
| `AUTH_EMAIL_CALLBACK_URL` | `https://personal-biblioteca.vercel.app/api/auth/callback` |

Alternativa CLI: prepara un archivo `.env.local` privado fuera del repositorio con esas cuatro
variables y ejecuta `supabase secrets set --project-ref jhncyzebeqyepmlccvny --env-file /ruta/privada/.env.local`.
Nunca pegues secretos directamente en comandos compartidos.

Mantén el proveedor Email, el registro y la confirmación de correo habilitados.
El SMTP personalizado de Brevo puede permanecer desactivado. Cuando el hook está habilitado,
Supabase lo utiliza en lugar del SMTP. No hay que cambiar el formulario ni redesplegar Vercel.
Comprueba que la URL de callback anterior siga permitida en la configuración de redirecciones de Auth.

## 4. Activar y comprobar

1. Habilita el hook ya configurado.
2. Registra una cuenta de prueba con un correo al que tengas acceso.
3. Comprueba que Brevo acepta el envío y que llega el correo.
4. Abre el enlace en el mismo navegador donde hiciste el registro (flujo PKCE de la aplicación).
5. Confirma que vuelves a `/biblioteca` con una sesión y que puedes cerrar sesión e iniciarla nuevamente.

La función solo devuelve éxito cuando Brevo acepta todos los correos de la operación. Una aceptación
HTTP de Brevo no equivale a entrega en la bandeja de entrada. Si hay un rechazo, los registros de la
Edge Function tendrán `brevo_send_failed` y el estado HTTP: 401 apunta a autenticación API,
403 a permisos/restricciones, 429 a cuotas y 5xx al proveedor. Un fallo de red muestra
`brevo_unavailable`. No se registran direcciones, claves, firmas, cuerpos ni tokens.

## Alcance y límites

- Genera mensajes en español para registro, invitación, recuperación, magic link, cambio de correo
  y reautenticación. Las acciones desconocidas se rechazan sin enviar.
- Los cambios seguros de correo envían a ambas direcciones con el mapeo de hashes de Supabase.
- Los enlaces van al verificador de Auth y a un callback fijo de confianza; se ignoran destinos del payload.
- La aplicación conserva su callback PKCE existente. No se añaden pantallas de recuperación o cambio de
  correo: esos recorridos no están disponibles todavía y deben implementarse y probarse antes de ofrecerlos.
- No hay reintentos internos. Si el proveedor acepta un mensaje pero se pierde la respuesta, un reintento
  externo puede duplicarlo. Un cambio de correo con dos envíos puede quedar parcialmente enviado.
- El presupuesto total de peticiones a Brevo es de 3,5 segundos para respetar el tiempo del hook.
- Fusionar el código no configura cuentas externas ni prueba la entrega real.

## Reversión

Deshabilita **Send Email Hook**. Con SMTP personalizado desactivado, Supabase vuelve a su servicio
predeterminado, que tiene restricciones de destinatarios/cuotas y sirve para pruebas limitadas.
No desactives la confirmación de correo. Revoca la clave API de Brevo si abandonas la integración.

## Referencias oficiales

- https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook
- https://developers.brevo.com/reference/send-transac-email

## Identidad visual compartida

`supabase/functions/_shared/brand.js` contiene el nombre, descripción, paleta y tipografías
seguras para correos. La web importa esa configuración y la expone como variables CSS para
Tailwind. Los correos la importan directamente y generan estilos inline, sin cargar imágenes,
fuentes externas ni scripts. `send-auth-email/template.js` contiene los mensajes y el diseño.

Después de modificar la identidad, publica ambos consumidores: despliegue de Vercel desde `main`
y `supabase functions deploy send-auth-email --project-ref jhncyzebeqyepmlccvny --no-verify-jwt`.
El commit por sí solo no actualiza una función editada manualmente en el panel. La función ahora
requiere `index.js`, `handler.js`, `template.js` y `../_shared/brand.js`; despliega desde el repositorio
con la CLI para incluir automáticamente las importaciones compartidas. Conserva los secretos y el hook.
Las plantillas de Authentication → Email Templates no controlan estos mensajes del hook.
