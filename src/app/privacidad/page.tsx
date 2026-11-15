import Link from 'next/link'
import DocumentoPublico from '@/components/privacy/DocumentoPublico'
import { operatorConfig } from '@/lib/operator-config'
import { NOTICE_VERSION } from '@/lib/registration'
export const dynamic = 'force-dynamic'
export default function Privacidad() {
  const operator = operatorConfig()
  return (
    <DocumentoPublico title="Tus lecturas y tus datos.">
      <p>
        Política de tratamiento de datos personales y aviso de privacidad.
        Versión {NOTICE_VERSION}. Tinteruna inicia su servicio en Colombia.
      </p>
      <h2>Responsable y contacto</h2>
      {operator.ready ? (
        <dl className="flex flex-col gap-2">
          <div>
            <dt>Responsable</dt>
            <dd>{operator.name}</dd>
          </div>
          <div>
            <dt>Domicilio y dirección</dt>
            <dd>
              {operator.city}. {operator.address}
            </dd>
          </div>
          <div>
            <dt>Teléfono</dt>
            <dd>{operator.phone}</dd>
          </div>
          <div>
            <dt>Privacidad y soporte</dt>
            <dd>
              <a
                className="editorial-link break-all"
                href={`mailto:${operator.email}`}
              >
                {operator.email}
              </a>
            </dd>
          </div>
        </dl>
      ) : (
        <p role="alert">
          La identificación del responsable está pendiente de configuración. El
          autorregistro permanecerá cerrado mientras no esté completa.
        </p>
      )}
      <h2>Qué información usamos y para qué</h2>
      <p>
        Tratamos el correo y la información de autenticación para crear y
        proteger tu cuenta. Supabase gestiona las credenciales y las sesiones.
        Guardamos los libros, estados, puntuaciones, fechas, metas, notas y
        citas que decidas registrar para ofrecerte una biblioteca y un diario
        personal.
      </p>
      <p>
        Registramos tu declaración de mayoría de edad, las versiones de los
        avisos aceptados y la fecha de aceptación. No pedimos tu fecha de
        nacimiento en el autorregistro. También se procesan datos técnicos
        necesarios para servir páginas, controlar solicitudes y proteger el
        servicio.
      </p>
      <p>
        No hay perfiles públicos ni publicación de tus anotaciones. Evita
        escribir información sensible o datos innecesarios de otras personas en
        tus notas.
      </p>
      <h2>Proveedores y búsquedas</h2>
      <p>
        Utilizamos Vercel para el alojamiento y Supabase para autenticación y
        base de datos. La base de datos del servicio está ubicada en Estados
        Unidos. Los servicios de infraestructura y correo pueden tratar
        información fuera de Colombia bajo sus condiciones de servicio y medidas
        de protección.
      </p>
      <p>
        Cuando pulsas «Buscar libro», Google Books recibe tu consulta. Puedes
        añadir un libro manualmente si prefieres no buscarlo o no aparece. Las
        portadas se solicitan a través del servidor de Tinteruna. Tus notas no
        forman parte de las consultas al catálogo.
      </p>
      <p>
        Los correos de acceso contienen la dirección destinataria y el enlace o
        código necesario para la acción solicitada. La integración de correo
        utiliza Brevo. No compartas esos enlaces o códigos.
      </p>
      <h2>Autorización y tus derechos</h2>
      <p>
        El registro distingue la aceptación de términos de la autorización para
        tratar los datos con las finalidades descritas aquí. No se solicita
        autorización para publicidad. Puedes conocer, actualizar y rectificar
        tus datos, solicitar prueba de autorización e información sobre su uso,
        pedir acceso gratuito, presentar consultas o reclamos y solicitar
        supresión o revocación cuando proceda.
      </p>
      <p>
        Escribe por el{' '}
        <Link href="/ayuda" className="editorial-link">
          canal de ayuda y privacidad
        </Link>{' '}
        desde el correo de tu cuenta. Indica el objeto de la solicitud; no
        envíes contraseñas. Se verificará tu identidad de forma proporcional. La
        página de ayuda explica los plazos y el procedimiento de atención.
        Puedes acudir a la Superintendencia de Industria y Comercio conforme al
        procedimiento aplicable.
      </p>
      <h2>Conservación y eliminación</h2>
      <p>
        La biblioteca se conserva para prestarte el servicio mientras mantengas
        la cuenta. Puedes eliminar libros o solicitar el cierre de la cuenta y
        la eliminación de sus datos. Las solicitudes se revisan teniendo en
        cuenta las obligaciones legales de conservación y la seguridad. Las
        copias de respaldo y registros técnicos pueden seguir su ciclo de
        retención; al atender una solicitud se informará su alcance y las
        limitaciones aplicables.
      </p>
      <h2>Adolescentes</h2>
      <p>
        El servicio se dirige a personas mayores de 14 años. El acceso de
        adolescentes de 15 a 17 años requiere un registro acompañado y revisión
        previa de la autorización del representante legal, del derecho a ser
        escuchados y de su interés superior. El autorregistro no habilita
        cuentas de adolescentes; consulta{' '}
        <Link href="/ayuda" className="editorial-link">
          cómo solicitar el registro acompañado
        </Link>
        .
      </p>
      <h2>Sesiones y cambios de esta política</h2>
      <p>
        Usamos cookies necesarias para mantener la sesión y verificar los
        enlaces de acceso. La demostración de la portada vive solo en la memoria
        de esa página. Esta versión no incorpora herramientas propias de
        publicidad o analítica de comportamiento. Publicaremos una nueva versión
        cuando cambien estas condiciones y solicitaremos nueva autorización
        cuando corresponda.
      </p>
    </DocumentoPublico>
  )
}
