import { useState, useEffect } from 'react'

interface TMDBMovie {
  id: number
  title: string
  poster_path: string
  backdrop_path: string
  overview: string
  vote_average: number
  release_date: string
  genre_ids: number[]
}

interface TMDBSeries {
  id: number
  name: string
  poster_path: string
  backdrop_path: string
  overview: string
  vote_average: number
  first_air_date: string
  genre_ids: number[]
}

interface TMDBRecommendation {
  id: number
  title?: string
  name?: string
  poster_path: string
  vote_average: number
  media_type: 'movie' | 'tv'
  similarity_score: number
}

interface TMDBStats {
  totalMovies: number
  totalSeries: number
  averageRating: number
  favoriteGenres: Array<{ id: number; name: string; count: number }>
  watchTime: number
  topRated: Array<TMDBMovie | TMDBSeries>
}

export const useTMDBIntegration = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<TMDBRecommendation[]>([])
  const [stats, setStats] = useState<TMDBStats | null>(null)
  const [importedContent, setImportedContent] = useState<Array<TMDBMovie | TMDBSeries>>([])

  // Simular conexión con TMDB
  const connectToTMDB = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simular delay de conexión
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Verificar si hay API key configurada
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
      if (!apiKey) {
        throw new Error('API key de TMDB no configurada')
      }
      
      setIsConnected(true)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con TMDB')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Obtener recomendaciones personalizadas
  const fetchRecommendations = async (favorites: Array<{ id: number; media_type: 'movie' | 'tv' }>) => {
    if (!isConnected) return

    setIsLoading(true)
    try {
      const recommendations: TMDBRecommendation[] = []
      
      // Simular obtención de recomendaciones basadas en favoritos
      for (const favorite of favorites.slice(0, 3)) {
        const response = await fetch(`/api/${favorite.media_type}/${favorite.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.recommendations?.results) {
            const recs = data.recommendations.results.slice(0, 3).map((item: any) => ({
              id: item.id,
              title: item.title || item.name,
              poster_path: item.poster_path,
              vote_average: item.vote_average,
              media_type: favorite.media_type,
              similarity_score: Math.random() * 0.5 + 0.5 // Simular score de similitud
            }))
            recommendations.push(...recs)
          }
        }
      }
      
      // Eliminar duplicados y ordenar por score
      const uniqueRecs = recommendations.filter((rec, index, self) => 
        index === self.findIndex(r => r.id === rec.id)
      ).sort((a, b) => b.similarity_score - a.similarity_score)
      
      setRecommendations(uniqueRecs.slice(0, 10))
    } catch (err) {
      setError('Error al obtener recomendaciones')
    } finally {
      setIsLoading(false)
    }
  }

  // Importar historial desde TMDB
  const importHistory = async () => {
    if (!isConnected) return

    setIsLoading(true)
    try {
      // Simular importación de historial
      const mockHistory: Array<TMDBMovie | TMDBSeries> = [
        {
          id: 550,
          title: 'Fight Club',
          poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
          backdrop_path: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',
          overview: 'Un empleado de oficina insomne...',
          vote_average: 8.8,
          release_date: '1999-10-15',
          genre_ids: [18]
        },
        {
          id: 13,
          title: 'Forrest Gump',
          poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
          backdrop_path: '/yE5d3BUhE8hCnkMUJOoJQKdN1vj.jpg',
          overview: 'La historia de Forrest Gump...',
          vote_average: 8.8,
          release_date: '1994-06-23',
          genre_ids: [35, 18]
        }
      ]
      
      setImportedContent(mockHistory)
      return mockHistory
    } catch (err) {
      setError('Error al importar historial')
      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Obtener estadísticas detalladas
  const fetchStats = async (favorites: Array<{ id: number; media_type: 'movie' | 'tv' }>) => {
    if (!isConnected) return

    setIsLoading(true)
    try {
      const movies = favorites.filter(f => f.media_type === 'movie')
      const series = favorites.filter(f => f.media_type === 'tv')
      
      // Simular cálculo de estadísticas
      const mockStats: TMDBStats = {
        totalMovies: movies.length,
        totalSeries: series.length,
        averageRating: 7.5,
        favoriteGenres: [
          { id: 28, name: 'Acción', count: 15 },
          { id: 12, name: 'Aventura', count: 12 },
          { id: 35, name: 'Comedia', count: 8 }
        ],
        watchTime: 2450, // minutos
        topRated: []
      }
      
      setStats(mockStats)
      return mockStats
    } catch (err) {
      setError('Error al obtener estadísticas')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Sincronizar favoritos con TMDB
  const syncFavorites = async (localFavorites: Array<{ id: number; media_type: 'movie' | 'tv' }>) => {
    if (!isConnected) return

    setIsLoading(true)
    try {
      // Simular sincronización
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Aquí se podría implementar la lógica real de sincronización
      // Por ahora solo simulamos que se sincronizó correctamente
      return true
    } catch (err) {
      setError('Error al sincronizar favoritos')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Desconectar de TMDB
  const disconnectFromTMDB = () => {
    setIsConnected(false)
    setRecommendations([])
    setStats(null)
    setImportedContent([])
    setError(null)
  }

  return {
    isConnected,
    isLoading,
    error,
    recommendations,
    stats,
    importedContent,
    connectToTMDB,
    disconnectFromTMDB,
    fetchRecommendations,
    importHistory,
    fetchStats,
    syncFavorites
  }
} 