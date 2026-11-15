import Link from 'next/link'
import Wordmark from '@/components/ui/Wordmark'
import LegalLinks from './LegalLinks'
export default function DocumentoPublico({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="site-width py-6 sm:py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Wordmark href="/" />
        <Link
          href="/"
          className="editorial-link inline-flex min-h-12 items-center text-sm"
        >
          Volver al inicio
        </Link>
      </header>
      <main className="public-document">
        <h1>{title}</h1>
        {children}
      </main>
      <footer className="border-t border-rule py-5">
        <LegalLinks />
      </footer>
    </div>
  )
}
