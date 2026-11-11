# Borradores legales de Tinteruna

Versión de trabajo 0.1, preparada el 10 de noviembre de 2026. Estos textos requieren revisión y decisiones operativas antes de publicarse. La fecha de entrada en vigor se fijará con la publicación aprobada.

## Decisiones pendientes antes de publicar

- Cargar los datos del responsable desde variables privadas del servidor al preparar la publicación, según el contenido mínimo de la política previsto en el artículo 2.2.2.25.3.1 del Decreto 1074 de 2015. Los datos se suministraron para configuración local. Su publicación exige considerar que los visitantes podrán leerlos.
- Confirmar configuración de correo, regiones de tratamiento, encargados, contratos, conservación de registros y respaldos, y procedimiento de supresión y atención de derechos.
- Revisar el tratamiento de datos de adolescentes de 15 a 17 años. El registro necesita un procedimiento verificable de autorización del representante legal, escucha del adolescente y evaluación de su interés superior y derechos. La preferencia de admitir mayores de 14 años requiere esa implementación y revisión jurídica.
- Aprobar las finalidades y la autorización de tratamiento que corresponda. La aceptación de condiciones y la autorización de datos personales tendrán controles separados y una constancia verificable cuando corresponda.
- Implementar y probar los enlaces antes del registro, las solicitudes de derechos, la recuperación de acceso y el cierre de cuenta. Revisar el inventario de cookies de una sesión real antes de publicar sus duraciones.

## Aviso y política de tratamiento de datos personales

### Quién responde por tus datos

El responsable de Tinteruna se identificará con el nombre configurado en `TINTERUNA_OPERATOR_NAME`. El servicio comienza en Colombia. El canal de privacidad, soporte y consultas será el configurado en `TINTERUNA_PRIVACY_EMAIL`. El domicilio, dirección y teléfono se cargarán desde `TINTERUNA_OPERATOR_CITY`, `TINTERUNA_OPERATOR_ADDRESS` y `TINTERUNA_OPERATOR_PHONE` al preparar el documento aprobado para su publicación.

### Qué información utiliza Tinteruna

Tinteruna permite llevar una biblioteca personal. Para crear y usar tu cuenta se procesa tu correo y la información necesaria para autenticarte. Supabase Auth gestiona tu contraseña y tus sesiones.

Tu biblioteca puede incluir títulos, autores, ediciones, portadas, estados de lectura, puntuaciones, fechas de lectura, metas, notas personales, citas y personajes favoritos. Tú decides qué anotaciones escribir y puedes modificarlas. Evita incluir datos personales de otras personas o información sensible que sea innecesaria para tu diario de lectura.

El servicio procesa además las consultas que confirmas para buscar libros y las solicitudes técnicas necesarias para entregar las páginas y proteger las cuentas.

### Para qué se utiliza

La información permite autenticarte, guardar y mostrar tu biblioteca, conservar tus anotaciones, calcular tus avances y atender tus solicitudes. Los controles técnicos de autenticación, aislamiento entre cuentas y límites de solicitudes ayudan a proteger el servicio.

La búsqueda se consulta en Google Books cuando pulsas «Buscar libro». Las notas personales y citas de tu biblioteca se guardan como contenido privado. El código de esta versión no envía esas anotaciones a Google Books ni a servicios de inteligencia artificial.

### Proveedores y circulación de la información

La aplicación utiliza Supabase para autenticación y base de datos y Vercel para alojamiento web. La región del proyecto Supabase consultado es `us-east-1`, en Estados Unidos. Deben confirmarse los demás destinos, encargados y acuerdos de tratamiento antes de publicar esta política.

Google Books recibe el texto de las búsquedas confirmadas. Al cargar una portada, el servidor consulta al proveedor de la imagen. El navegador solicita las portadas a Tinteruna mediante un intermediario autenticado. Las fuentes tipográficas se sirven con la aplicación después de su preparación durante la compilación.

El repositorio contiene una integración de correos de autenticación con Brevo. El proveedor de envío activo y su tratamiento deben verificarse en producción antes de describirlo como práctica efectiva.

### Tus derechos y cómo solicitarlos

Puedes solicitar conocer, actualizar o rectificar tus datos, obtener copia de la información que te corresponda, conocer el uso de tus datos, consultar la autorización otorgada y solicitar su supresión o revocatoria cuando proceda. También puedes acudir a la Superintendencia de Industria y Comercio siguiendo los requisitos legales aplicables.

Escribe al correo de privacidad del responsable desde el correo de tu cuenta e indica la solicitud. Mantén en privado tu contraseña y códigos de acceso. El responsable debe verificar tu identidad de manera proporcionada y atender la solicitud en los plazos legales. El procedimiento operativo y los plazos que se informarán al usuario deben completarse antes de publicar.

Puedes editar tus anotaciones y eliminar libros desde la biblioteca. «Tus datos» permite descargar una copia JSON de tus libros, anotaciones, citas, metas y datos básicos de tu cuenta. La solicitud de cierre de cuenta, la eliminación en sistemas asociados y los plazos de conservación y respaldo requieren el procedimiento de operación pendiente.

### Adolescentes

La audiencia prevista incluye personas mayores de 14 años. El tratamiento de información de quienes aún sean menores de edad requiere las salvaguardas aplicables en Colombia. Antes de habilitar ese recorrido, Tinteruna debe implementar la autorización verificable del representante legal y el ejercicio del derecho del adolescente a ser escuchado, atendiendo su madurez, autonomía e interés superior.

### Cambios de esta política

Cada publicación aprobada debe mostrar versión y fecha de vigencia. Los cambios en las finalidades o condiciones que exijan una nueva autorización deben comunicarse y tramitarse antes del tratamiento correspondiente.

## Condiciones de uso

Tinteruna es un servicio de biblioteca personal. El responsable y su canal de contacto se cargarán desde las variables privadas indicadas en el aviso de tratamiento. Su lanzamiento inicial está previsto para Colombia y personas mayores de 14 años, con el procedimiento de representación y protección de menores pendiente de implementación para adolescentes.

Eres responsable de proteger tus credenciales y de usar el servicio con información que puedas legítimamente guardar. No utilices Tinteruna para acceder a cuentas ajenas, distribuir contenido ilícito, vulnerar derechos de terceros o eludir sus controles técnicos.

Conservas los derechos sobre tus notas y textos propios. El servicio necesita los permisos limitados de almacenamiento, procesamiento y presentación de ese contenido para operar tu biblioteca y atender tus instrucciones. Deben aprobarse el alcance y las bases del tratamiento antes de publicar las condiciones.

Las portadas y los metadatos pueden proceder de terceros. Su presencia no transfiere derechos sobre esas obras. Puedes comunicar solicitudes de corrección o retirada relacionadas con derechos de autor al canal de contacto. La revisión de las condiciones de Google Books y los proveedores de imágenes forma parte de la preparación del lanzamiento.

El servicio depende de conexiones y proveedores que pueden presentar interrupciones. Las condiciones finales deben explicar de forma proporcionada los cambios de servicio, sus limitaciones y la atención de incidentes sin excluir derechos legales del usuario.

El cierre solicitado por el titular y la suspensión por incumplimientos deben seguir un procedimiento definido, con información sobre motivos, atención de reclamaciones y tratamiento de los datos. Esos procedimientos están pendientes de validación operativa y revisión jurídica.

## Información sobre cookies y almacenamiento

El código utiliza cookies de Supabase SSR para mantener la sesión y el flujo de autenticación. El repositorio no incorpora un SDK de analítica o publicidad ni escribe datos de aplicación en `localStorage` o `sessionStorage`.

La configuración efectiva de la plataforma, el inventario de cookies y sus duraciones deben comprobarse en una sesión autenticada. Los controles opcionales de seguimiento, si llegaran a incorporarse, requieren una evaluación y elecciones diferenciadas según corresponda. Este borrador no añade categorías de rastreo al producto.

## Fuentes para revisión

- [Ley 1581 de 2012, compilación del Ministerio TIC](https://normograma.mintic.gov.co/mintic/compilacion/docs/ley_1581_2012.htm)
- [Decreto 1074 de 2015, artículos 2.2.2.25.2.9 y 2.2.2.25.3.1](https://normograma.mintic.gov.co/mintic/compilacion/docs/decreto_1074_2015.htm)
- [SIC, tratamiento excepcional y autorización del representante legal](https://sedeelectronica.sic.gov.co/publicaciones/boletin-juridico/concepto/tratamiento-excepcional-y-autorizacion-del-representante-legal-con-interes-superior)
- [SIC, autorización y aceptación de políticas](https://sedeelectronica.sic.gov.co/publicaciones/boletin-juridico/boletin/el-silencio-las-casillas-premarcadas-por-defecto-y-la-inaccion-no-constituyen-el-consentimiento-conforme-con)
- [Google Books, condiciones de la API](https://developers.google.com/books/terms)
