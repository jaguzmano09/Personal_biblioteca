'use client'

import { useState } from 'react'
import { Check, Leaf, RotateCcw } from 'lucide-react'
import type { EstadoLectura } from '@/lib/types'

const PROMPTS: Record<EstadoLectura, string> = {
  Pendiente: '¿Qué te hizo elegir esta historia?',
  Leyendo: '¿Qué te está pasando entre estas páginas?',
  Leído: '¿Qué parte de este libro se quedó contigo?',
  Abandonado: '¿Qué te gustaría encontrar si volvieras?'
}

export default function JournalDemo() {
  const [estado, setEstado] = useState<EstadoLectura>('Leyendo')
  const [nota, setNota] = useState('')
  const [guardada, setGuardada] = useState(false)

  return (
    <div className="journal-sheet">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-rule pb-4">
        <h3 className="font-display text-2xl text-cloth">Una página para ti</h3>
        <Leaf aria-hidden="true" className="size-5 text-stamp-dark" />
      </div>
      <fieldset>
        <legend className="mb-3 text-sm text-ink/75">
          Elige un momento de lectura para probar
        </legend>
        <div className="reading-tabs">
          {(Object.keys(PROMPTS) as EstadoLectura[]).map(value => (
            <button
              type="button"
              key={value}
              aria-pressed={estado === value}
              className="reading-tab"
              onClick={() => setEstado(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </fieldset>
      <form
        className="mt-7"
        onSubmit={event => {
          event.preventDefault()
          if (nota.trim()) setGuardada(true)
        }}
      >
        <label
          htmlFor="sample-note"
          className="mb-4 block font-display text-2xl leading-snug text-cloth"
        >
          {PROMPTS[estado]}
        </label>
        <textarea
          id="sample-note"
          value={nota}
          maxLength={1000}
          rows={4}
          placeholder="Una escena, una frase, algo que sentiste…"
          className="editorial-input resize-y font-display text-lg leading-relaxed"
          aria-describedby="sample-privacy"
          onChange={event => {
            setNota(event.target.value)
            setGuardada(false)
          }}
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!nota.trim() || guardada}
            className="editorial-button"
          >
            {guardada ? 'Huella guardada en esta prueba' : 'Dejar mi huella'}
          </button>
          {nota && (
            <button
              type="button"
              className="editorial-link inline-flex min-h-11 items-center gap-2 text-sm"
              onClick={() => {
                setNota('')
                setGuardada(false)
              }}
            >
              <RotateCcw aria-hidden="true" className="size-4" /> Borrar prueba
            </button>
          )}
        </div>
        <div role="status" className="mt-4 min-h-6">
          {guardada && (
            <span className="ink-imprint">
              <Check aria-hidden="true" className="size-4" /> Esta lectura ya
              tiene tu voz.
            </span>
          )}
        </div>
        <p
          id="sample-privacy"
          className="mt-3 text-xs leading-relaxed text-ink/75"
        >
          Esta es una demostración. Lo que escribes vive en esta página y se
          borra al cerrarla.
        </p>
      </form>
    </div>
  )
}
