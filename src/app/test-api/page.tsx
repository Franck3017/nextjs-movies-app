'use client'
import { useState, useEffect } from 'react'

interface MovieData {
  id: number
  title?: string
  name?: string
  runtime?: number
  episode_run_time?: number[]
  genres: Array<{ id: number; name: string }>
}

export default function TestAPIPage() {
  const [movieData, setMovieData] = useState<MovieData | null>(null)
  const [tvData, setTvData] = useState<MovieData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testAPIs = async () => {
      try {
        setLoading(true)
        
        // Test movie API (using a popular movie ID)
        const movieResponse = await fetch('/api/movie/550') // Fight Club
        if (movieResponse.ok) {
          const movie = await movieResponse.json()
          setMovieData(movie)
        }

        // Test TV API (using a popular TV show ID)
        const tvResponse = await fetch('/api/tv/1399') // Game of Thrones
        if (tvResponse.ok) {
          const tv = await tvResponse.json()
          setTvData(tv)
        }
      } catch (error) {
        console.error('Error testing APIs:', error)
      } finally {
        setLoading(false)
      }
    }

    testAPIs()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Cargando datos de prueba...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Prueba de APIs - Runtime, Episode_run_time y Géneros</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Movie Data */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Película (Fight Club - ID: 550)</h2>
          {movieData ? (
            <div className="space-y-4">
              <div>
                <strong>Título:</strong> {movieData.title || movieData.name}
              </div>
              <div>
                <strong>Runtime:</strong> {movieData.runtime ? `${movieData.runtime} minutos` : 'No disponible'}
              </div>
              <div>
                <strong>Episode_run_time:</strong> {movieData.episode_run_time ? JSON.stringify(movieData.episode_run_time) : 'No disponible'}
              </div>
              <div>
                <strong>Géneros:</strong>
                <ul className="mt-2">
                  {movieData.genres.map(genre => (
                    <li key={genre.id} className="ml-4">• {genre.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-red-400">Error al cargar datos de película</div>
          )}
        </div>

        {/* TV Data */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Serie de TV (Game of Thrones - ID: 1399)</h2>
          {tvData ? (
            <div className="space-y-4">
              <div>
                <strong>Título:</strong> {tvData.title || tvData.name}
              </div>
              <div>
                <strong>Runtime:</strong> {tvData.runtime ? `${tvData.runtime} minutos` : 'No disponible'}
              </div>
              <div>
                <strong>Episode_run_time:</strong> {tvData.episode_run_time ? JSON.stringify(tvData.episode_run_time) : 'No disponible'}
              </div>
              <div>
                <strong>Géneros:</strong>
                <ul className="mt-2">
                  {tvData.genres.map(genre => (
                    <li key={genre.id} className="ml-4">• {genre.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-red-400">Error al cargar datos de TV</div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Resumen de la Prueba</h3>
        <div className="space-y-2">
          <div>✅ Runtime: {movieData?.runtime ? 'Disponible en películas' : 'No disponible en películas'}</div>
          <div>✅ Episode_run_time: {tvData?.episode_run_time ? 'Disponible en TV' : 'No disponible en TV'}</div>
          <div>✅ Géneros películas: {movieData?.genres?.length ? `${movieData.genres.length} géneros` : 'No disponibles'}</div>
          <div>✅ Géneros TV: {tvData?.genres?.length ? `${tvData.genres.length} géneros` : 'No disponibles'}</div>
        </div>
      </div>
    </div>
  )
} 