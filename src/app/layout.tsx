import type { CSSProperties } from 'react'
import { webBrand } from '@/lib/web-brand'
import type { Metadata } from 'next'
import { Fraunces, IBM_Plex_Mono, Inter } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--type-editorial',
  weight: ['400', '500', '600'],
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--type-catalog',
  weight: ['400', '500'],
})

const inter = Inter({ subsets: ['latin'], variable: '--type-body' })

export const metadata: Metadata = {
  title: webBrand.name,
  description: webBrand.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${plexMono.variable} ${inter.variable}`} suppressHydrationWarning>
      <body style={Object.fromEntries(Object.entries(webBrand.colors).map(([key, value]) => [`--brand-${key}`, value])) as CSSProperties}>{children}</body>
    </html>
  )
}
