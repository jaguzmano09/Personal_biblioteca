import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, BookOpen, Feather, Bookmark } from 'lucide-react'
import Wordmark from '@/components/ui/Wordmark'
import JournalDemo from './JournalDemo'

export default function Portada() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Ir al contenido
      </a>
      <header className="site-width landing-nav">
        <Wordmark href="/" />
        <nav
          aria-label="Navegación principal"
          className="flex items-center gap-5 sm:gap-8"
        >
          <a
            href="#tu-huella"
            className="hidden text-sm text-cloth sm:inline-flex sm:min-h-11 sm:items-center"
          >
            Conoce Tinteruna
          </a>
          <Link
            href="/login"
            className="editorial-link inline-flex min-h-11 items-center text-sm"
          >
            Entrar
          </Link>
        </nav>
      </header>
      <main id="contenido">
        <section
          className="site-width landing-hero"
          aria-labelledby="home-title"
        >
          <h1 id="home-title" className="hero-title">
            Lo que lees también te escribe.
          </h1>
          <div className="story-art landing-art">
            <Image
              src="/brand/reading-river.webp"
              width={1536}
              height={1024}
              preload
              sizes="(min-width: 1000px) 50vw, 100vw"
              alt="Un río nace entre las páginas de un libro y lleva un pequeño bote de papel con una flor."
            />
          </div>
          <div className="hero-body min-w-0">
            <p className="hero-copy">
              Los libros terminan. Lo que te hacen sentir merece un lugar donde
              quedarse. Reúne tus lecturas, tus frases y tu propia manera de
              recordarlas.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-7">
              <Link
                href="/registro"
                className="editorial-button w-full sm:w-auto"
              >
                Crear mi biblioteca
              </Link>
              <a
                href="#tu-huella"
                className="editorial-link inline-flex min-h-11 items-center gap-2 text-sm"
              >
                <ArrowDown aria-hidden="true" className="size-4" /> Abre una
                página de prueba
              </a>
            </div>
            <p className="mt-7 text-sm leading-relaxed text-ink/75">
              Una biblioteca personal. Un diario de lo que lees.
            </p>
          </div>
        </section>

        <section
          id="tu-huella"
          className="site-width landing-story"
          aria-labelledby="trace-title"
        >
          <div className="story-columns">
            <div>
              <h2 id="trace-title" className="story-title">
                La historia del libro.
                <br />Y la que deja en ti.
              </h2>
              <p className="mt-6 max-w-lg text-base leading-loose text-ink/80">
                Tinteruna nace de una idea sencilla: recordar una lectura es
                recordar también quién eras mientras la leías.
              </p>
              <p className="mt-4 max-w-lg text-base leading-loose text-ink/80">
                Una frase que subrayaste. Un personaje al que vuelves. Esa
                sensación que cuesta explicar. Aquí tienen su lugar, junto a
                cada libro.
              </p>
              <p className="mt-7 font-display text-2xl italic leading-relaxed text-cloth">
                Empieza por algo pequeño.
                <br />
                Una línea también deja huella.
              </p>
            </div>
            <JournalDemo />
          </div>
          <ul className="path-list">
            <li>
              <BookOpen aria-hidden="true" className="mb-4 size-6 text-cloth" />
              <h3 className="font-display text-2xl text-cloth">
                Encuentra tu edición
              </h3>
              <p className="mt-3 text-sm leading-loose text-ink/80">
                Busca por título, autor o ISBN y elige el libro que tienes entre
                manos.
              </p>
            </li>
            <li>
              <Feather aria-hidden="true" className="mb-4 size-6 text-cloth" />
              <h3 className="font-display text-2xl text-cloth">
                Conserva lo que te mueve
              </h3>
              <p className="mt-3 text-sm leading-loose text-ink/80">
                Guarda notas y citas. Ponle palabras a tu lectura, a tu manera y
                cuando quieras.
              </p>
            </li>
            <li>
              <Bookmark aria-hidden="true" className="mb-4 size-6 text-cloth" />
              <h3 className="font-display text-2xl text-cloth">
                Vuelve a tu recorrido
              </h3>
              <p className="mt-3 text-sm leading-loose text-ink/80">
                Reencuentra lo leído, lo pendiente y lo que dejaste a medias. El
                ritmo lo eliges tú.
              </p>
            </li>
          </ul>
        </section>

        <section
          className="night-section py-16 sm:py-24"
          aria-labelledby="invitation-title"
        >
          <div className="site-width flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <h2
                id="invitation-title"
                className="max-w-2xl font-display text-4xl leading-tight sm:text-5xl"
              >
                Hazle un lugar a tu próxima historia.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-paper/85">
                Tu biblioteca crece con cada libro. Tu diario, con cada
                recuerdo.
              </p>
            </div>
            <Link
              href="/registro"
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-md bg-paper px-6 py-3 text-sm font-semibold text-cloth hover:bg-surface"
            >
              Empezar mi biblioteca
            </Link>
          </div>
        </section>

        <section
          id="preguntas"
          className="site-width landing-story"
          aria-labelledby="questions-title"
        >
          <div className="story-columns">
            <h2 id="questions-title" className="story-title">
              Antes de abrir
              <br />
              el primer libro.
            </h2>
            <div>
              <details className="faq-row">
                <summary>¿Qué puedo guardar en Tinteruna?</summary>
                <p>
                  Tus libros, su estado de lectura, puntuaciones, fechas, citas
                  y notas personales. También puedes definir una meta anual si
                  te ayuda a seguir tu recorrido.
                </p>
              </details>
              <details className="faq-row">
                <summary>¿Quién puede ver mis notas?</summary>
                <p>
                  Tu biblioteca y tus anotaciones se consultan desde tu cuenta.
                  Cada persona tiene su propio espacio. No hay perfiles
                  públicos ni un muro donde se publiquen tus notas.
                </p>
              </details>
              <details className="faq-row">
                <summary>¿Tengo que escribir una reseña de cada libro?</summary>
                <p>
                  Las notas son opcionales. Puedes guardar una sola frase,
                  escribir más adelante o simplemente llevar tu lista de
                  lecturas.
                </p>
              </details>
              <details className="faq-row">
                <summary>¿Puedo llevarme una copia de mi biblioteca?</summary>
                <p>
                  Sí. Desde «Tus datos» puedes descargar un archivo JSON con tus
                  libros, notas, citas, metas y los datos básicos de tu cuenta.
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-width flex flex-wrap items-center justify-between gap-5 border-t border-rule py-8">
        <Wordmark href="/" />
        <p className="text-sm text-ink/75">
          Un lugar para lo que queda entre páginas.
        </p>
        <a
          href="#preguntas"
          className="editorial-link inline-flex min-h-11 items-center text-sm"
        >
          Sobre tu biblioteca
        </a>
      </footer>
    </>
  )
}
