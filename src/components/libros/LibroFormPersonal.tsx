'use client'

import { useState } from 'react'
import type { GoogleBookResult, EstadoLectura } from '@/lib/types'
import { guardarLibro } from '@/lib/libros'
import { useRouter } from 'next/navigation'

const ESTADOS: EstadoLectura[] = ['Pendiente', 'Leyendo', 'Leído', 'Abandonado']

interface Props {
  libroSeleccionado: GoogleBookResult
  onCancelar: () => void
}

export default function LibroFormPersonal({ libroSeleccionado, onCancelar }: Props) {
  const router = useRouter()
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [estado, setEstado] = useState<EstadoLectura>('Pendiente')
  const [puntuacion, setPuntuacion] = useState<string>('')
  const [personajeFavorito, setPersonajeFavorito] = useState('')
  const [resumenAnalisis, setResumenAnalisis] = useState('')
  const [citasDestacadas, setCitasDestacadas] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setError(null)

    try {
      await guardarLibro(libroSeleccionado, {
        estado,
        puntuacion: puntuacion ? Number(puntuacion) : null,
        personaje_favorito: personajeFavorito || null,
        resumen_analisis: resumenAnalisis || null,
        citas_destacadas: citasDestacadas || null,
        fecha_inicio: fechaInicio || null,
        fecha_fin: fechaFin || null,
      })
      router.push('/biblioteca')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el libro')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Vista previa del libro elegido */}
      <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
        {libroSeleccionado.portada_url ? (
          <img
            src={libroSeleccionado.portada_url}
            alt={libroSeleccionado.titulo}
            className="w-16 h-24 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-24 bg-gray-200 rounded" />
        )}
        <div>
          <p className="font-semibold">{libroSeleccionado.titulo}</p>
          <p className="text-sm text-gray-500">{libroSeleccionado.autores.join(', ')}</p>
          <button
            type="button"
            onClick={onCancelar}
            className="text-xs text-blue-600 hover:underline mt-1"
          >
            Cambiar libro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            value={estado}
            onChange={e => setEstado(e.target.value as EstadoLectura)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            {ESTADOS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Puntuación (0-10)</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={puntuacion}
            onChange={e => setPuntuacion(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Personaje favorito</label>
        <input
          type="text"
          value={personajeFavorito}
          onChange={e => setPersonajeFavorito(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Resumen / Análisis personal</label>
        <textarea
          value={resumenAnalisis}
          onChange={e => setResumenAnalisis(e.target.value)}
          rows={5}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Citas destacadas</label>
        <textarea
          value={citasDestacadas}
          onChange={e => setCitasDestacadas(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={guardando}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {guardando ? 'Guardando...' : 'Guardar libro'}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}