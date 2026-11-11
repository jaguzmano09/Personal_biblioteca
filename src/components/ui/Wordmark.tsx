import Link from 'next/link'
import { webBrand } from '@/lib/web-brand'

export default function Wordmark({
  href
}: {
  href: '/' | '/login' | '/biblioteca'
}) {
  return (
    <Link
      href={href}
      className="wordmark inline-flex w-fit items-center gap-2 rounded-sm text-cloth"
    >
      <svg viewBox="0 0 64 64" className="size-9 shrink-0" aria-hidden="true">
        <path
          fill="currentColor"
          d="M13 13h38l2 11h-3c-2-6-5-8-11-8h-3v25l4 3v3H24v-3l4-3V16h-3c-6 0-9 2-11 8h-3z"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 47q11-2 19 7 8-9 19-7"
        />
      </svg>
      <span className="font-display text-2xl font-semibold tracking-tight">
        {webBrand.name}
      </span>
    </Link>
  )
}
