# Mi Biblioteca

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)

<h3>📚 Biblioteca personal de lectura, privada, ordenada y analítica</h3>

</div>

> Una aplicación para llevar un registro inteligente de cada libro leído, leyendo o pendiente, con una experiencia minimalista y personal.

Mi Biblioteca permite gestionar una biblioteca propia con autenticación segura, búsqueda automatizada desde Google Books y métricas para seguir el progreso lector a lo largo del tiempo.

---

## ✨ Vista rápida

- Registro e inicio de sesión con Supabase
- Búsqueda de libros desde Google Books
- Catálogo personal por usuario
- Estado de lectura, reseñas y puntuaciones
- Metas anuales de lectura
- Dashboard con estadísticas de hábito lector
- Diseño limpio y editorial, pensado para foco y lectura

---

## 🧭 Índice

- [Resumen general](#-resumen-general)
- [Características principales](#-características-principales)
- [Stack tecnológico](#-stack-tecnológico)
- [Arquitectura del proyecto](#-arquitectura-del-proyecto)
- [Flujos de la aplicación](#-flujos-de-la-aplicación)
- [Requisitos previos](#-requisitos-previos)
- [Configuración del entorno](#-configuración-del-entorno)
- [Instalación](#-instalación)
- [Ejecución local](#-ejecución-local)
- [Base de datos y Supabase](#-base-de-datos-y-supabase)
- [Cómo se usa la aplicación](#-cómo-se-usa-la-aplicación)
- [Notas de seguridad](#-notas-de-seguridad)
- [Despliegue](#-despliegue)
- [Roadmap futuro](#-roadmap-futuro)

---

## 🧠 Resumen general

Mi Biblioteca es una plataforma de catálogo personal para lectores que quiere combinar dos cosas: orden y reflexión.

No es solo guardar libros; también ayuda a recordar:

- qué se leyó,
- en qué estado quedó cada lectura,
- cómo se sintió el usuario con cada libro,
- cuántos libros se leen por año,
- qué autores se repiten,
- y qué tan lejos o cerca se está de la meta anual.

La app está pensada para uso individual y privado, con rutas protegidas y acceso por sesión autenticada.

---

## 🌟 Características principales

### 1. 🔐 Autenticación de usuarios

- Registro con email y contraseña
- Inicio de sesión seguro
- Cierre de sesión
- Protección automática de rutas privadas
- Redirección a `/biblioteca` cuando ya existe sesión

### 2. 🔎 Búsqueda de libros con Google Books

La app permite buscar por:

- título
- autor
- ISBN

Y obtiene información útil como:

- autores
- editorial
- fecha de publicación
- páginas
- portada
- ISBN

### 3. 📖 Personalización del registro

Cada libro puede registrarse con campos muy útiles para la bitácora personal:

- estado: `Pendiente`, `Leyendo`, `Leído`, `Abandonado`
- puntuación de 0 a 10
- resumen o análisis personal
- personaje favorito
- citas destacadas
- año y mes de lectura
- formato: `Física` o `Digital`
- procedencia: `Casa de mis papás`, `Regalado`, `Comprado`
- portada personalizada opcional

### 4. 📊 Dashboard de estadísticas

La vista principal incluye métricas como:

- libros del año seleccionado
- puntuación promedio
- autor más repetido
- páginas leídas
- progreso hacia la meta anual

### 5. 🎯 Metas anuales de lectura

El usuario puede:

- definir una meta para cada año,
- guardar esa meta por usuario,
- comparar progreso real vs objetivo,
- editarla directamente desde la interfaz.

### 6. 🎨 Interfaz moderna y minimalista

El proyecto sigue un estilo editorial y sobrio, con una sensación de lectura tranquila y una interfaz pensada para reducir ruido visual.

---

## 🛠️ Stack tecnológico

| Tecnología | Uso |
| --- | --- |
| Next.js 16 | Framework principal de la app |
| React 19 | Interfaz de usuario |
| TypeScript | Tipado seguro y mantenimiento |
| Tailwind CSS | Estilos y diseño visual |
| Supabase | Autenticación y persistencia de datos |
| Google Books API | Búsqueda y metadatos del libro |
| Lucide React | Iconografía |

### Dependencias clave

- `next`: framework principal
- `react` y `react-dom`: renderizado de interfaces
- `@supabase/ssr`: integración con Supabase en servidor
- `tailwindcss`: sistema de estilos
- `lucide-react`: iconos visuales

---

## 🏗️ Arquitectura del proyecto

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
├── .env.local
└── .gitignore
```

### Capas principales

#### `src/app/`
Responsable de las rutas y páginas de la aplicación:

- login y registro
- biblioteca privada
- detalle y alta de libros
- callback de autenticación

#### `src/components/`
Componentes visuales reutilizables:

- formularios de autenticación
- buscador externo
- tarjetas de libros
- modal de detalle
- dashboard
- formulario personal del libro

#### `src/lib/`
Lógica del negocio y acceso a servicios:

- `auth.ts`: inicio, registro y cierre de sesión
- `libros.ts`: CRUD de libros
- `metas.ts`: gestión de metas anuales
- `googleBooks.ts`: consultas a la API
- `types.ts`: tipos del dominio
- `supabase/`: clientes del servidor y del navegador

#### `src/proxy.ts`
Se encarga de proteger rutas y redirigir usuarios no autenticados.

---

## 🔄 Flujos de la aplicación

### 1. Flujo de autenticación

1. El usuario entra a `/login` o `/registro`.
2. Registra o inicia sesión con Supabase Auth.
3. La app redirige a `/biblioteca`.
4. Si no hay sesión, se bloquea el acceso a rutas protegidas.

### 2. Flujo principal de la biblioteca

1. El usuario ve su catálogo.
2. Busca libros en Google Books.
3. Selecciona el título adecuado.
4. Completa la información personal del libro.
5. Guarda el registro bajo su perfil.

### 3. Flujo de estadísticas

1. La app obtiene la lista de libros del usuario.
2. Agrupa datos por año.
3. Calcula promedio, autor más repetido, páginas leídas y progreso.
4. Muestra la meta anual con indicador visual.

---

## ✅ Requisitos previos

Necesitarás lo siguiente:

- Node.js 18 o superior
- npm, pnpm o yarn
- una cuenta de Supabase
- acceso a la Google Books API

---

## ⚙️ Configuración del entorno

Crea un archivo `.env.local` con el siguiente contenido:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY=tu_api_key_de_google_books
```

### Variables explicadas

- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto en Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: clave pública del proyecto
- `NEXT_PUBLIC_SITE_URL`: dominio local o de producción para callbacks
- `NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY`: clave opcional para mayor estabilidad en la búsqueda

> Si no agregas la clave de Google Books, la búsqueda puede seguir funcionando con menos disponibilidad o límites de cuota.

---

## 📦 Instalación

Desde la raíz del proyecto:

```bash
npm install
```

O usando otra herramienta:

```bash
pnpm install
# o
yarn install
```

---

## ▶️ Ejecución local

Inicia la app:

```bash
npm run dev
```

Luego abre:

```text
http://localhost:3000
```

Para entorno de producción:

```bash
npm run build
npm run start
```

---

## 🗄️ Base de datos y Supabase

La app guarda la información central en Supabase, especialmente:

- usuarios autenticados
- libros por usuario
- metas anuales de lectura

### Tabla recomendada: `libros`

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

### Tabla recomendada: `metas_lectura`

```sql
user_id uuid not null,
anio integer not null,
meta_libros integer not null,
created_at timestamptz default now(),
updated_at timestamptz default now(),
primary key (user_id, anio)
```

### Recomendaciones

- habilita Row Level Security (RLS)
- limita cada usuario a sus propios registros
- usa políticas tipo `user_id = auth.uid()`
- configura `updated_at` con triggers si lo deseas

---

## 📚 Cómo se usa la aplicación

### Registro

1. Ingresa a `/registro`
2. Completa email y contraseña
3. Crea la cuenta
4. Inicia sesión y entra a la biblioteca

### Inicio de sesión

1. Accede a `/login`
2. Escribe tu correo y contraseña
3. Serás redirigido a `/biblioteca`

### Agregar un libro

1. Entra a la sección de biblioteca
2. Haz clic en `+ Agregar libro`
3. Busca por título, autor o ISBN
4. Selecciona el resultado
5. Completa datos personales del libro
6. Guarda el registro

### Metas anuales

1. Elige el año desde el dashboard
2. Define cuántos libros quieres leer
3. Observa la barra de progreso y el total acumulado

---

## 🔒 Notas de seguridad

- La autenticación se maneja con Supabase Auth
- Las rutas protegidas validan sesión del usuario
- La lógica sensible se mantiene en server-side
- Las claves de acceso deben quedar en variables de entorno
- No subir secretos ni credenciales al repositorio

---

## 🚀 Despliegue

La aplicación puede desplegarse fácilmente en:

- Vercel
- Netlify
- cualquier hosting compatible con Next.js

### Recomendación práctica para Vercel

1. conecta el repositorio
2. agrega las variables de entorno
3. define la URL real en `NEXT_PUBLIC_SITE_URL`
4. habilita Supabase con la misma configuración
5. despliega la app

---

## 🧩 Roadmap futuro

Este proyecto ya tiene una buena base para crecer con nuevas funciones:

- edición avanzada de libros
- filtros por estado, autor o año
- ordenamiento por puntuación o fecha
- exportación a CSV o JSON
- wishlist de libros pendientes
- recomendaciones por autor o género
- panel con gráficos más completos
- soporte para colecciones temáticas

---

## 🏁 Conclusión

Mi Biblioteca es más que una simple base de datos de libros: es una bitácora personal de lectura, pensada para acompañar cada libro con contexto, memoria y hábito.

Combina la organización de una biblioteca con la reflexión de un diariode lectura, en una solución clara, privada y moderna.

---

## 💡 Nota final

Este proyecto está pensado para crecer, adaptarse y convertirse en una herramienta más robusta de lectura y seguimiento personal.

Si quieres, en el siguiente paso puedo dejarte una versión aún más premium del README con:

- badges más visuales,
- portada estilo GitHub,
- mockups o screenshots,
- y una presentación final mucho más elegante para compartir en público.

