import Link from 'next/link'
import DocumentoPublico from '@/components/privacy/DocumentoPublico'
import { operatorConfig } from '@/lib/operator-config'
export const dynamic = 'force-dynamic'
export default function Ayuda() {
  const operator = operatorConfig()
  return (
    <DocumentoPublico title="Estamos al otro lado de tus páginas.">
      <p>
        Este es el canal para pedir ayuda con Tinteruna, consultar tus datos,
        corregir tu cuenta, solicitar su cierre o retirar una autorización.
      </p>
      <h2>Contacta al responsable</h2>
      {operator.email ? (
        <>
          <p>{operator.name}</p>
          <p>
            <a
              href={`mailto:${operator.email}`}
              className="editorial-link break-all"
            >
              {operator.email}
            </a>
          </p>
        </>
      ) : (
        <p role="alert">
          El canal de contacto aún no está disponible. El registro no debe
          habilitarse hasta completar esta configuración.
        </p>
      )}
      <p>
        Escribe desde el correo de tu cuenta e indica qué necesitas. Nunca
        envíes contraseñas, enlaces de acceso ni códigos de confirmación. Para
        verificar tu identidad se solicitará únicamente la información necesaria
        para la petición.
      </p>
      <h2>¿No puedes entrar?</h2>
      <p>
        <Link href="/recuperar" className="editorial-link">
          Recupera tu contraseña
        </Link>{' '}
        o{' '}
        <Link href="/confirmar" className="editorial-link">
          pide otra confirmación de correo
        </Link>
        . Abre el enlace en el navegador donde lo solicitaste.
      </p>
      <h2>Consultas y solicitudes sobre tus datos</h2>
      <p>
        Puedes pedir acceso, actualización, corrección, información sobre su
        uso, prueba de autorización, supresión o revocación cuando corresponda.
        Puedes editar y eliminar libros desde tu biblioteca y descargar una
        copia desde «Tus datos».
      </p>
      <p>
        Las consultas se atienden en hasta diez días hábiles. Los reclamos se
        atienden en hasta quince días hábiles contados desde el día siguiente a
        su recepción. Si se necesita una prórroga legal, se comunicarán sus
        motivos y la nueva fecha dentro del plazo inicial. Si falta información
        necesaria para tramitar un reclamo, te indicaremos cómo completarla.
      </p>
      <h2>Registro acompañado de adolescentes</h2>
      <p>
        Tinteruna está dirigida a personas mayores de 14 años. Si tienes entre
        15 y 17 años, tu representante legal debe contactar al responsable antes
        de crear una cuenta. Se revisará la autorización, tu participación y las
        condiciones de protección de tus datos. No envíes documentos de
        identidad ni información sensible en el primer mensaje.
      </p>
      <p>
        El autorregistro en línea está disponible para mayores de edad. La
        selección de una edad no sustituye la autorización y revisión del
        registro acompañado.
      </p>
      <p>
        <Link href="/privacidad" className="editorial-link">
          Consulta la política de tratamiento de datos
        </Link>
        .
      </p>
    </DocumentoPublico>
  )
}
