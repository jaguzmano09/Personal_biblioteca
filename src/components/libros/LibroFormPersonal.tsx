'use client'

import { useState } from 'react'
import { guardarLibro } from '@/lib/libros'
import { useRouter } from 'next/navigation'
import type { GoogleBookResult, EstadoLectura, FormatoLectura, ProcedenciaLibro } from '@/lib/types'


const ESTADOS: EstadoLectura[] = ['Pendiente', 'Leyendo', 'Leído', 'Abandonado']
const FORMATOS: FormatoLectura[] = ['Física', 'Digital']
const PROCEDENCIAS: ProcedenciaLibro[] = ['Casa de mis papás', 'Regalado', 'Comprado']


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
  const [anioLectura, setAnioLectura] = useState('')
  const [mesLectura, setMesLectura] = useState('')
  const [formato, setFormato] = useState<FormatoLectura | ''>('')
  const [procedencia, setProcedencia] = useState<ProcedenciaLibro | ''>('')

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
        anio_lectura: anioLectura ? Number(anioLectura) : null,
        mes_lectura: anioLectura && mesLectura ? Number(mesLectura) : null,
        formato: formato || null,
        procedencia: procedencia || null,
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
          <label className="block text-sm font-medium mb-1">Formato</label>
          <select
            value={formato}
            onChange={e => setFormato(e.target.value as FormatoLectura)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Sin especificar</option>
            {FORMATOS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Procedencia</label>
          <select
            value={procedencia}
            onChange={e => setProcedencia(e.target.value as ProcedenciaLibro)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Sin especificar</option>
            {PROCEDENCIAS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Año de lectura</label>
          <input
            type="number"
            placeholder="Ej: 2024"
            min="1000"
            max="9999"
            value={anioLectura}
            onChange={e => setAnioLectura(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Mes <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <select
            value={mesLectura}
            onChange={e => setMesLectura(e.target.value)}
            disabled={!anioLectura}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">No recuerdo el mes</option>
            <option value="1">Enero</option>
            <option value="2">Febrero</option>
            <option value="3">Marzo</option>
            <option value="4">Abril</option>
            <option value="5">Mayo</option>
            <option value="6">Junio</option>
            <option value="7">Julio</option>
            <option value="8">Agosto</option>
            <option value="9">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
          </select>
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