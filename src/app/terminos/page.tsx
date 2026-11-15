import Link from 'next/link'
import DocumentoPublico from '@/components/privacy/DocumentoPublico'
import { NOTICE_VERSION } from '@/lib/registration'
export default function Terminos() {
  return (
    <DocumentoPublico title="Un lugar para tus lecturas.">
      <p>Términos de uso. Versión {NOTICE_VERSION}.</p>
      <h2>Qué ofrece Tinteruna</h2>
      <p>
        Una biblioteca personal y un diario de lectura: puedes guardar libros,
        estados, metas, notas y citas. No es un servicio de préstamo ni un
        lector de libros electrónicos. Las portadas y los metadatos de terceros
        conservan sus derechos y pueden contener errores.
      </p>
      <h2>Tu cuenta y tus escritos</h2>
      <p>
        Protege tus credenciales y utiliza únicamente tu cuenta. Conservas los
        derechos sobre tus escritos. Para prestar el servicio, Tinteruna los
        almacena, procesa y muestra dentro de tu espacio y atiende tus
        instrucciones de edición, exportación o eliminación. No publiques
        información ilegal ni datos innecesarios de terceros, ni intentes
        acceder a otras cuentas o eludir las protecciones del servicio.
      </p>
      <h2>Edad y uso acompañado</h2>
      <p>
        El servicio se dirige a mayores de 14 años. El autorregistro está
        disponible para personas de 18 años o más. El registro de adolescentes
        de 15 a 17 años requiere autorización y revisión previa por el canal de{' '}
        <Link href="/ayuda" className="editorial-link">
          registro acompañado
        </Link>
        . No se ofrece registro para menores de 15 años.
      </p>
      <h2>Disponibilidad y solicitudes</h2>
      <p>
        El servicio depende de conexiones y proveedores que pueden sufrir
        interrupciones. Guarda una copia de tus datos cuando la necesites. Para
        ayuda, corrección de cuenta, cierre o solicitudes sobre contenido,
        utiliza el{' '}
        <Link href="/ayuda" className="editorial-link">
          canal de contacto del responsable
        </Link>
        . Las medidas por uso indebido se revisarán de forma proporcional y
        podrás solicitar aclaraciones por ese canal. Estos términos no limitan
        los derechos que te reconoce la ley.
      </p>
      <p>
        El tratamiento de datos se describe en la{' '}
        <Link href="/privacidad" className="editorial-link">
          política de privacidad
        </Link>
        .
      </p>
    </DocumentoPublico>
  )
}
