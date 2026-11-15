import Link from 'next/link'
export default function LegalLinks() {
  return (
    <nav
      aria-label="Ayuda y condiciones"
      className="flex flex-wrap gap-x-5 gap-y-1"
    >
      <Link
        href="/privacidad"
        className="editorial-link inline-flex min-h-12 items-center text-sm"
      >
        Privacidad
      </Link>
      <Link
        href="/terminos"
        className="editorial-link inline-flex min-h-12 items-center text-sm"
      >
        Términos
      </Link>
      <Link
        href="/ayuda"
        className="editorial-link inline-flex min-h-12 items-center text-sm"
      >
        Ayuda y contacto
      </Link>
    </nav>
  )
}
