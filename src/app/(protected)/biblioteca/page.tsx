import Link from 'next/link'
import { obtenerLibros } from '@/lib/libros'
import { obtenerMeta } from '@/lib/metas'
import LibrosGrid from '@/components/libros/LibrosGrid'
import EstadisticasDashboard from '@/components/libros/EstadisticasDashboard'
import Image from 'next/image'
import { safeCover } from '@/lib/covers'

export default async function BibliotecaPage() {
  const anioActual = new Date().getFullYear()
  const [libros, meta] = await Promise.all([
    obtenerLibros(),
    obtenerMeta(anioActual)
  ])
  const enLectura = libros.find(libro => libro.estado === 'Leyendo')
  const portadaActual = safeCover(enLectura?.portada_url)

  return (
    <main>
      <section className="library-opening" aria-labelledby="library-title">
        <Image
          src="/brand/reading-river.webp"
          width={1536}
          height={1024}
          alt=""
          sizes="(max-width: 700px) 75vw, 56vw"
        />
        <div className="site-width library-opening-copy">
          <h1 id="library-title">Mi biblioteca</h1>
          <p className="mt-4 text-base leading-relaxed">
            {libros.length === 0
              ? 'Un lugar para los libros que están por encontrarte.'
              : `${libros.length} ${libros.length === 1 ? 'historia que forma' : 'historias que forman'} parte de ti.`}
          </p>
          <Link
            href="/biblioteca/agregar"
            className="mt-6 hidden min-h-12 items-center rounded-md bg-paper px-5 py-3 text-sm font-semibold text-cloth hover:bg-surface sm:inline-flex"
          >
            Agregar libro
          </Link>
        </div>
      </section>
      <div className="site-width grid gap-10 pb-10 lg:grid-cols-[minmax(0,1fr)_17rem] xl:gap-14">
        <section className="min-w-0" aria-label="Tus libros">
          {enLectura && (
            <Link
              href={`/biblioteca/${enLectura.id}`}
              className="reading-return"
            >
              {portadaActual && (
                <img src={portadaActual} referrerPolicy="no-referrer" alt="" />
              )}
              <div className="min-w-0">
                <p className="text-xs text-ink/75">Donde dejaste la historia</p>
                <p className="mt-1 line-clamp-2 break-words font-display text-2xl text-cloth">
                  {enLectura.titulo}
                </p>
                <span className="editorial-link mt-2 inline-block text-sm">
                  Continuar con este libro
                </span>
              </div>
            </Link>
          )}
          <LibrosGrid libros={libros} />
        </section>
        <EstadisticasDashboard
          libros={libros}
          metaInicial={meta}
          anioActual={anioActual}
        />
      </div>
    </main>
  )
}
