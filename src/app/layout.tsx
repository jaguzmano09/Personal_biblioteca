import type { CSSProperties } from 'react'
import { brand } from '../../supabase/functions/_shared/brand.js'
import type { Metadata } from 'next'
import { Fraunces, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600'],
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: brand.name,
  description: brand.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body style={Object.fromEntries(Object.entries(brand.colors).map(([key, value]) => [`--brand-${key}`, value])) as CSSProperties}>{children}</body>
    </html>
  )
}