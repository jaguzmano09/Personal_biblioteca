'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Plus, Leaf, UserRound, LogOut } from 'lucide-react'
import Wordmark from './Wordmark'
import { cerrarSesion } from '@/lib/auth'

const LINKS = [
  { href: '/biblioteca', label: 'Biblioteca', icon: BookOpen },
  { href: '/biblioteca/agregar', label: 'Agregar libro', icon: Plus },
  { href: '/biblioteca/datos', label: 'Tus datos', icon: Leaf }
]

export default function LibraryNavigation({
  email
}: {
  email: string | undefined
}) {
  const pathname = usePathname()
  const currentSection =
    LINKS.find(link => link.href === pathname)?.href ?? '/biblioteca'
  const links = LINKS.map(({ href, label, icon: Icon }) => (
    <Link
      key={href}
      href={href}
      className="nav-link"
      aria-current={currentSection === href ? 'page' : undefined}
    >
      <Icon aria-hidden="true" className="size-5" />
      <span>{label}</span>
    </Link>
  ))

  return (
    <>
      <a href="#contenido" className="skip-link">
        Ir al contenido
      </a>
      <header className="app-header">
        <div className="site-width app-header-inner">
          <Wordmark href="/biblioteca" />
          <nav className="desktop-nav" aria-label="Tu cuaderno">
            {links}
          </nav>
          <details className="account-menu">
            <summary aria-label="Tu cuenta">
              <UserRound aria-hidden="true" className="size-5" />
              <span className="hidden sm:inline">Cuenta</span>
            </summary>
            <div className="account-popover">
              <p className="break-all text-sm text-ink/80">{email}</p>
              <form action={cerrarSesion}>
                <button
                  type="submit"
                  className="editorial-link mt-3 inline-flex min-h-11 items-center gap-2 text-sm"
                >
                  <LogOut aria-hidden="true" className="size-4" /> Cerrar sesión
                </button>
              </form>
            </div>
          </details>
        </div>
      </header>
      <nav className="mobile-nav" aria-label="Tu cuaderno en el móvil">
        {links}
      </nav>
    </>
  )
}
