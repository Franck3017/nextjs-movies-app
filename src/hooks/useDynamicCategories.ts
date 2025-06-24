import { useState, useEffect } from 'react'

export interface DynamicCategory {
  id: number
  name: string
  fetchUrl: string
  showRating: boolean
  icon: string
}

export interface CategoryData {
  genres: Array<{
    id: number
    name: string
  }>
}

const getGenreIcon = (genreName: string): string => {
  const iconMap: { [key: string]: string } = {
    'Acción': '🎭',
    'Aventura': '🗺️',
    'Animación': '🎨',
    'Comedia': '😄',
    'Crimen': '🔫',
    'Documental': '🌍',
    'Drama': '🎭',
    'Familiar': '👨‍👩‍👧‍👦',
    'Fantasía': '🏰',
    'Historia': '📚',
    'Terror': '😱',
    'Música': '🎵',
    'Misterio': '🔍',
    'Romance': '💕',
    'Ciencia ficción': '🚀',
    'Película de TV': '📺',
    'Suspenso': '🔍',
    'Bélica': '⚔️',
    'Western': '🤠',
    'Acción y Aventura': '🎭',
    'Kids': '👶',
    'News': '📰',
    'Reality': '📺',
    'Sci-Fi & Fantasy': '🚀',
    'Soap': '🧼',
    'Talk': '💬',
    'War & Politics': '⚔️'
  }
  
  return iconMap[genreName] || '🎬'
}

export const useDynamicCategories = (type: 'movies' | 'tv') => {
  const [categories, setCategories] = useState<DynamicCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch genres from TMDB API
        const genresResponse = await fetch(`/api/genres/${type}`)
        if (!genresResponse.ok) {
          throw new Error('Failed to fetch genres')
        }
        
        const genresData: CategoryData = await genresResponse.json()
        
        // Create categories with popular and top rated
        const baseCategories: DynamicCategory[] = [
          {
            id: -1,
            name: '🔥 Tendencias',
            fetchUrl: `/api/${type}/popular`,
            showRating: true,
            icon: '🔥'
          },
          {
            id: -2,
            name: '⭐ Mejor Valoradas',
            fetchUrl: `/api/${type}/top_rated`,
            showRating: true,
            icon: '⭐'
          }
        ]

        // Add genre-based categories
        const genreCategories: DynamicCategory[] = genresData.genres.map(genre => ({
          id: genre.id,
          name: genre.name,
          fetchUrl: `/api/${type}/genre/${genre.id}`,
          showRating: true,
          icon: getGenreIcon(genre.name)
        }))

        setCategories([...baseCategories, ...genreCategories])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching categories')
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [type])

  return {
    categories,
    loading,
    error,
    getCategoryById: (id: number) => categories.find(cat => cat.id === id),
    getCategoryByName: (name: string) => categories.find(cat => cat.name === name)
  }
} 