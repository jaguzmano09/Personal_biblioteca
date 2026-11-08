'use client'
export default function LibraryError({ reset }: { reset: () => void }) {
  return <main className="max-w-2xl mx-auto p-8" role="alert">
    <h1 className="text-2xl mb-4">No se pudo cargar la biblioteca</h1>
    <p>Inténtalo de nuevo. Si tu sesión ha caducado, vuelve a iniciar sesión.</p>
    <button onClick={reset} className="border px-4 py-2 mt-4">Reintentar</button>
    <a href="/login" className="ml-4 underline">Iniciar sesión</a>
  </main>
}
