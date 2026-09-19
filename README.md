# Mi Biblioteca

Aplicación web personal para gestionar una biblioteca de lectura con enfoque privado, visual limpio y análisis de hábitos lectores. El proyecto está construido con Next.js y utiliza Supabase para autenticación y almacenamiento persistente, además de la API de Google Books para buscar títulos y completar metadatos automáticamente.

La idea central del sistema es permitir que cada usuario mantenga un catálogo de libros propio, con información personal del estado de lectura, valoración, comentarios, año/mes de lectura, formato y procedencia, todo dentro de un entorno protegido y personal.

---

## Índice

- [Resumen general](#resumen-general)
- [Características principales](#características-principales)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Flujos de la aplicación](#flujos-de-la-aplicación)
- [Requisitos previos](#requisitos-previos)
- [Configuración del entorno](#configuración-del-entorno)
- [Instalación](#instalación)
- [Ejecución local](#ejecución-local)
- [Base de datos y Supabase](#base-de-datos-y-supabase)
- [Cómo se usa la aplicación](#cómo-se-usa-la-aplicación)
- [Notas de seguridad y consideraciones](#notas-de-seguridad-y-consideraciones)
- [Despliegue](#despliegue)
- [Roadmap y extensiones futuras](#roadmap-y-extensiones-futuras)

---

## Resumen general

Mi Biblioteca es una plataforma de catálogo personal para lectores. Permite:

- registrar libros propios con su información bibliográfica,
- buscar libros en Google Books para importar datos automáticamente,
- enriquecer cada registro con notas personales,
- mantener un seguimiento del estado de lectura,
- guardar metas anuales de lectura,
- analizar estadísticas por año, autor, páginas leídas y puntuación promedio.

La app está diseñada para un uso individual y privado. Cada usuario accede con su propia cuenta y solo ve sus libros y sus metas. Todo el acceso está protegido con autenticación de Supabase y rutas privadas.

---

## Características principales

### 1. Autenticación de usuarios

- Registro con email y contraseña.
- Inicio de sesión con credenciales personales.
- Cierre de sesión.
- Redirecciones automáticas entre rutas públicas y protegidas.
- Protección de páginas como `/biblioteca` y `/biblioteca/agregar`.

### 2. Búsqueda de libros desde Google Books

- El usuario puede buscar por título, autor o ISBN.
- La aplicación consulta la API de Google Books.
- Se normalizan los resultados para extraer información útil:
  - título
  - autores
  - editorial
  - fecha de publicación
  - número de páginas
  - portada
  - ISBN

### 3. Registro de libros personales

Cada libro guardado puede estar enriquecido con campos personales, por ejemplo:

- estado de lectura: `Pendiente`, `Leyendo`, `Leído`, `Abandonado`
- puntuación de 0 a 10
- resumen o análisis personal
- personaje favorito
- citas destacadas
- año y mes de lectura
- formato: `Física` o `Digital`
- procedencia: `Casa de mis papás`, `Regalado`, `Comprado`
- URL personalizada de portada

### 4. Dashboard de estadísticas

La vista principal de la biblioteca muestra un panel con:

- número de libros leídos en el año seleccionado,
- puntuación promedio,
- autor repetido más veces,
- páginas leídas,
- meta de lectura anual,
- progreso visual respecto a la meta.

### 5. Metas anuales de lectura

El sistema permite:

- definir una meta de libros para cada año,
- guardar la meta por usuario y año,
- visualizar el progreso con barra de avance,
- cambiar la meta desde la misma vista principal.

### 6. Interfaz moderna y minimalista

- diseño centrado en lectura,
- estilo editorial y minimalista,
- uso de Tailwind CSS para una estructura visual consistente,
- componentes reutilizables para formularios, cards, inputs y spinner.

---

## Stack tecnológico

El proyecto utiliza principalmente estas tecnologías:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Supabase SSR
- Google Books API
- Lucide React

### Dependencias clave

- `next`: framework principal
- `react` y `react-dom`: renderizado de interfaces
- `@supabase/ssr`: integración con Supabase en server-side rendering
- `tailwindcss`: estilos
- `lucide-react`: iconos

---

## Arquitectura del proyecto

La estructura actual del repositorio está organizada de la siguiente manera:

```text
Personal_biblioteca/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── registro/
│   │   ├── (protected)/
│   │   │   ├── biblioteca/
│   │   │   │   ├── [id]/
│   │   │   │   └── agregar/
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── callback/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   ├── libros/
│   │   └── ui/
│   ├── hooks/
│   │   └── useDebounce.ts
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── googleBooks.ts
│   │   ├── libros.ts
│   │   ├── metas.ts
│   │   ├── types.ts
│   │   └── supabase/
│   ├── proxy.ts
│   └── ...
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── README.md
└── .env.local
```

### Descripción de capas

#### `src/app/`
Contiene la estructura de rutas y páginas de la aplicación. Aquí se definen:

- páginas públicas: login, registro
- páginas protegidas: biblioteca y detalle/agregar libro
- callback de autenticación de Supabase
- layout general de la aplicación

#### `src/components/`
Contiene componentes visuales reutilizables:

- formularios de autenticación
- buscador de Google Books
- tarjeta de libro
- modal de detalle
- dashboard de estadísticas
- formulario para personalizar cada libro

#### `src/lib/`
Es la capa de negocio y acceso a datos:

- `auth.ts`: login, registro y cierre de sesión
- `libros.ts`: CRUD de libros por usuario
- `metas.ts`: gestión de metas anuales de lectura
- `googleBooks.ts`: consultas a la API de Google Books
- `types.ts`: tipos de dominio
- `supabase/`: cliente del servidor y del navegador

#### `src/proxy.ts`
Archivo para controlar acceso a rutas y redirigir según si el usuario está autenticado o no.

---

## Flujos de la aplicación

### 1. Flujo de autenticación

1. El usuario entra a `/login` o `/registro`.
2. Registra o inicia sesión con Supabase Auth.
3. Al autenticarse, la app redirige a `/biblioteca`.
4. Si alguien intenta entrar sin sesión a una ruta protegida, se redirige hacia `/login`.

### 2. Flujo principal de la biblioteca

1. El usuario ve su catálogo principal.
2. Puede navegar por la lista de libros registrados.
3. Puede agregar un nuevo libro usando el buscador de Google Books.
4. El sistema obtiene datos bibliográficos desde la API.
5. El usuario personaliza el libro con su propia información de lectura.
6. Se guarda en Supabase asociado al usuario actual.

### 3. Flujo de estadísticas

1. La página de biblioteca obtiene el listado de libros del usuario actual.
2. Calcula métricas por año actual o seleccionado.
3. Muestra el progreso comparado con la meta anual.
4. Permite cambiar la meta del año desde el mismo dashboard.

---

## Requisitos previos

Necesitas tener instalado en tu máquina:

- Node.js 18 o superior
- npm o pnpm o yarn
- una cuenta de Supabase
- acceso a Google Books API (opcional, aunque recomendada)

---

## Configuración del entorno

Crea un archivo `.env.local` en la raíz del proyecto con este formato:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY=tu_api_key_de_google_books
```

### Variables explicadas

- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto en Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: clave anónima pública de Supabase.
- `NEXT_PUBLIC_SITE_URL`: URL base del frontend para callbacks de autenticación.
- `NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY`: clave opcional para Google Books.

> Si no agregas la API key, la búsqueda puede seguir funcionando con límites de cuota compartida o con menos disponibilidad, pero es recomendable configurarla para una mejor experiencia.

---

## Instalación

Desde la raíz del proyecto:

```bash
npm install
```

Si usas otra gestión de paquetes:

```bash
pnpm install
# o
yarn install
```

---

## Ejecución local

Inicia el entorno de desarrollo:

```bash
npm run dev
```

Luego abre:

```text
http://localhost:3000
```

También puedes compilar el proyecto para producción:

```bash
npm run build
npm run start
```

---

## Base de datos y Supabase

Este proyecto depende de Supabase para almacenar:

- usuarios y autenticación,
- libros del usuario,
- metas de lectura por año.

### Tablas recomendadas

#### `libros`

La estructura de esta tabla se corresponde con el modelo de TypeScript en `src/lib/types.ts`.

Campos principales:

```sql
id uuid primary key default gen_random_uuid(),
user_id uuid not null,
google_books_id text,
titulo text not null,
autores text[],
editorial text,
fecha_publicacion text,
paginas integer,
portada_url text,
isbn text,
estado text not null check (estado in ('Leído','Leyendo','Pendiente','Abandonado')),
puntuacion numeric(2,1),
resumen_analisis text,
personaje_favorito text,
citas_destacadas text,
anio_lectura integer,
mes_lectura integer,
formato text check (formato in ('Física','Digital')),
procedencia text check (procedencia in ('Casa de mis papás','Regalado','Comprado')),
created_at timestamptz default now(),
updated_at timestamptz default now()
```

#### `metas_lectura`

```sql
user_id uuid not null,
anio integer not null,
meta_libros integer not null,
created_at timestamptz default now(),
updated_at timestamptz default now(),
primary key (user_id, anio)
```

### Recomendaciones

- habilita Row Level Security (RLS) en Supabase,
- restringe cada usuario para que solo vea sus propios registros,
- usa políticas tipo `user_id = auth.uid()` para libros y metas,
- activa `updated_at` con triggers si quieres automatizar cambios.

El proyecto actual usa `createClient()` para obtener la sesión del usuario autenticado y consultar la base de datos con el contexto correcto.

---

## Cómo se usa la aplicación

### Registro

1. Accede a `/registro`.
2. Define tu email y contraseña.
3. Confirma la creación de la cuenta en Supabase.
4. Se te redirige al login, o una vez verificado, al catálogo.

### Inicio de sesión

1. Entra en `/login`.
2. Escribe tus credenciales.
3. Si todo es correcto, serás enviado a `/biblioteca`.

### Agregar un libro

1. Entra a la sección de biblioteca.
2. Haz clic en `+ Agregar libro`.
3. Busca un título, autor o ISBN.
4. Selecciona el resultado que te interesa.
5. Completa datos personales del libro:
   - estado
   - puntuación
   - personaje favorito
   - resumen
   - citas
   - año y mes de lectura
   - formato y procedencia
   - portada opcional
6. Guarda el libro.

### Ver detalles y editar

Desde la vista principal, cada libro aparece como tarjeta o elemento del catálogo. La aplicación está preparada para permitir revisitar registrados y actualizar su información, aunque la parte de detalle visual puede ampliarse según la evolución del proyecto.

### Metas anuales

1. Desde la vista de biblioteca, selecciona el año.
2. Pulsa la opción de meta.
3. Indica cuántos libros quieres leer en ese periodo.
4. El sistema calculará progreso y lo mostrará en una barra.

---

## Notas de seguridad y consideraciones

- La aplicación usa autenticación real con Supabase Auth.
- Las rutas protegidas se validan con el usuario autenticado.
- Se evita exponer lógica sensible en el cliente.
- Las operaciones de escritura se ejecutan en el servidor con acceso controlado.
- Las credenciales de Supabase y la clave de Google Books deben mantenerse en variables de entorno y no subirse al repositorio.

### Consideraciones importantes del proyecto actual

- El sistema está orientado a un usuario individual, no a una red social o biblioteca compartida.
- La gestión de libros y metas está atada al `user_id` actual.
- La API de Google Books puede devolver resultados incompletos según el registro o disponibilidad.
- La búsqueda es client-side sobre una función del servidor, por lo que debe asegurarse el correcto manejo de CORS/requests del entorno de producción.

---

## Despliegue

La app puede desplegarse fácilmente sobre plataformas como:

- Vercel
- Netlify
- cualquier hosting compatible con Next.js

### Recomendación práctica

Para despliegue en Vercel:

1. conecta el repositorio,
2. configura las variables de entorno,
3. añade la URL del dominio en `NEXT_PUBLIC_SITE_URL`,
4. habilita Supabase con la misma configuración,
5. despliega.

En entornos de producción se recomienda usar:

- `NEXT_PUBLIC_SITE_URL` con la URL real del dominio,
- reglas de Supabase correctas,
- variable de Google Books si se usa en producción.

---

## Roadmap y extensiones futuras

Este proyecto ya tiene una base sólida para crecer en varias direcciones:

- agregar detalle completo de cada libro con vista individual,
- edición avanzada del registro,
- ordenamiento por estado, fechas o puntuación,
- filtros por autor, formato, año y procedencia,
- exportación de la biblioteca a CSV o JSON,
- recomendaciones basadas en autores y géneros,
- integración de lectura digital o seguimiento de páginas leídas,
- funciones de wishlist para libros pendientes,
- soporte para múltiples colecciones o bibliotecas temáticas,
- panel más completo con gráficos de evolución anual.

---

## Conclusión

Mi Biblioteca es un proyecto de catálogo personal de lectura pensado para mantener un registro íntimo y ordenado de todo lo que se lee. Combina autenticación segura, integración con bibliografía externa, personalización del registro y análisis de hábitos de lectura.

Su valor principal no es solo guardar libros, sino construir una bitácora de lectura propia, útil para recordar qué se leyó, cómo se sintió, qué se aprendió y qué se quiere leer después.

---

## Créditos y contexto

Este proyecto está enfocado a un uso personal y académico, con una estructura clara para ser ampliada. Está pensado para funcionar como base de una aplicación más robusta de lectura, bibliotecas personales, seguimiento de hábitos y gestión de colecciones.

Si quieres, en el siguiente paso puedo dejarte también una versión todavía más premium del README con:

- badges de tecnologías,
- imagen de portada,
- secciones de screenshots,
- guía de instalación paso a paso,
- sección de arquitectura detallada por módulos,
- una versión lista para GitHub con estilo profesional tipo open source.

