'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Save } from 'lucide-react'
import { actualizarLibro, eliminarLibro } from '@/lib/libros'
import type { Libro, EstadoLectura } from '@/lib/types'

const ESTADOS: EstadoLectura[] = ['Pendiente', 'Leyendo', 'Leído', 'Abandonado']

export default function LibroDetalleModal({ libro }: { libro: Libro }) {
  const router = useRouter()
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  const [estado, setEstado] = useState(libro.estado)
  const [puntuacion, setPuntuacion] = useState(libro.puntuacion?.toString() ?? '')
  const [resumenAnalisis, setResumenAnalisis] = useState(libro.resumen_analisis ?? '')
  const [personajeFavorito, setPersonajeFavorito] = useState(libro.personaje_favorito ?? '')
  const [citasDestacadas, setCitasDestacadas] = useState(libro.citas_destacadas ?? '')

  async function handleGuardar() {
    setGuardando(true)
    try {
      await actualizarLibro(libro.id, {
        estado,
        puntuacion: puntuacion ? Number(puntuacion) : null,
        resumen_analisis: resumenAnalisis || null,
        personaje_favorito: personajeFavorito || null,
        citas_destacadas: citasDestacadas || null,
      })
      setEditando(false)
      router.refresh()
    } finally {
      setGuardando(false)
    }
  }

  async function handleEliminar() {
    if (!confirm(`¿Eliminar "${libro.titulo}" de tu biblioteca?`)) return
    setEliminando(true)
    try {
      await eliminarLibro(libro.id)
      router.push('/biblioteca')
    } finally {
      setEliminando(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex gap-6 pb-6 border-b border-rule">
        {libro.portada_url ? (
          <img src={libro.portada_url} alt={libro.titulo} className="w-40 border border-rule" />
        ) : (
          <div className="w-40 h-56 bg-rule/20 border border-rule" />
        )}

        <div className="flex-1">
          <h1 className="font-display text-3xl leading-tight">{libro.titulo}</h1>
          <p className="font-mono text-sm text-ink/60 mt-2">{libro.autores?.join(', ')}</p>
          {libro.editorial && (
            <p className="font-mono text-xs text-ink/40 mt-1">
              {libro.editorial} {libro.fecha_publicacion && `· ${libro.fecha_publicacion}`}
              {libro.paginas && ` · ${libro.paginas}p`}
            </p>
          )}

          <div className="flex gap-2 mt-4 font-mono text-xs">
            <button onClick={() => setEditando(!editando)} className="border border-ink px-3 py-1.5 hover:bg-ink hover:text-paper transition-colors">
              {editando ? 'cancelar' : 'editar'}
            </button>
            <button onClick={handleEliminar} disabled={eliminando} className="border border-stamp text-stamp px-3 py-1.5 hover:bg-stamp hover:text-paper transition-colors disabled:opacity-50">
              {eliminando ? 'eliminando...' : 'eliminar'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {editando ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select
                  value={estado}
                  onChange={e => setEstado(e.target.value as EstadoLectura)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Puntuación</label>
                <input
                  type="number" min="0" max="10" step="0.5"
                  value={puntuacion}
                  onChange={e => setPuntuacion(e.target.value)}
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
              <label className="block text-sm font-medium mb-1">Resumen / Análisis</label>
              <textarea
                value={resumenAnalisis}
                onChange={e => setResumenAnalisis(e.target.value)}
                rows={6}
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

            <button
              onClick={handleGuardar}
              disabled={guardando}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </>
        ) : (
          <>
            {libro.puntuacion != null && (
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{libro.puntuacion} / 10</span>
              </div>
            )}
            {libro.personaje_favorito && (
              <p><span className="font-medium">Personaje favorito:</span> {libro.personaje_favorito}</p>
            )}
            {libro.resumen_analisis && (
              <div>
                <h3 className="font-medium mb-1">Resumen / Análisis</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{libro.resumen_analisis}</p>
              </div>
            )}
            {libro.citas_destacadas && (
              <div>
                <h3 className="font-medium mb-1">Citas destacadas</h3>
                <p className="text-gray-700 whitespace-pre-wrap italic">{libro.citas_destacadas}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}