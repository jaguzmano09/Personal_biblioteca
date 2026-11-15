'use client'
import { useState } from 'react'
import type { BookMetadata } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function LibroManual({
  onSeleccionar,
  onCancelar
}: {
  onSeleccionar: (book: BookMetadata) => void
  onCancelar: () => void
}) {
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [paginas, setPaginas] = useState('')
  const [isbn, setIsbn] = useState('')
  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={event => {
        event.preventDefault()
        onSeleccionar({
          google_books_id: null,
          titulo: titulo.trim(),
          autores: autor.trim() ? [autor.trim()] : [],
          editorial: null,
          fecha_publicacion: null,
          paginas: paginas ? Number(paginas) : null,
          isbn: isbn.trim() || null,
          portada_url: null
        })
      }}
    >
      <p className="text-sm leading-relaxed text-ink/80">
        No necesitas que el libro aparezca en un catálogo. Escribe el título y
        añade los datos que conozcas. Después podrás elegir su estado y guardar
        tus notas.
      </p>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="manual-title">Título del libro</FieldLabel>
          <Input
            id="manual-title"
            required
            maxLength={1000}
            value={titulo}
            onChange={event => setTitulo(event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="manual-author">
            Autor o autora (opcional)
          </FieldLabel>
          <Input
            id="manual-author"
            maxLength={500}
            value={autor}
            onChange={event => setAutor(event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="manual-pages">
            Número de páginas (opcional)
          </FieldLabel>
          <Input
            id="manual-pages"
            type="number"
            inputMode="numeric"
            min={0}
            max={1000000}
            step={1}
            value={paginas}
            onChange={event => setPaginas(event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="manual-isbn">ISBN (opcional)</FieldLabel>
          <Input
            id="manual-isbn"
            maxLength={32}
            value={isbn}
            onChange={event => setIsbn(event.target.value)}
          />
        </Field>
      </FieldGroup>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={!titulo.trim()}>
          Continuar con este libro
        </Button>
        <Button type="button" variant="outline" onClick={onCancelar}>
          Volver a la búsqueda
        </Button>
      </div>
    </form>
  )
}
