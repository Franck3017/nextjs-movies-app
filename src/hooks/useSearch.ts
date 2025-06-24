import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import useSWR from 'swr'
import { useNotifications } from '../contexts/NotificationContext'

const API = '/api'

interface SearchResult {
  id: number
  title?: string
  name?: string
  poster_path: string
  overview: string
  vote_average?: number
  media_type: 'movie' | 'tv'
  release_date?: string
  first_air_date?: string
}

interface SearchResponse {
  results: SearchResult[]
  total_results: number
  total_pages: number
  current_page: number
  query: string
}

export type FilterType = 'all' | 'movie' | 'tv'

export const useSearch = () => {
  const [query, setQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [isRealTimeSearch, setIsRealTimeSearch] = useState(false)
  const { showNotification } = useNotifications()
  const lastNotificationRef = useRef<string>('')
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Real-time search with debounce
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    if (query.trim().length >= 2) {
      setIsRealTimeSearch(true)
      debounceTimeoutRef.current = setTimeout(() => {
        setSearchQuery(query.trim())
      }, 500) // 500ms debounce
    } else {
      setIsRealTimeSearch(false)
      setSearchQuery('')
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [query])

  const { data, error, isLoading, mutate } = useSWR<SearchResponse>(
    searchQuery ? `${API}/search?query=${encodeURIComponent(searchQuery)}&type=${activeFilter}` : null,
    async (url: string) => {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`
          
          // Check if it's an API key error
          if (errorMessage.includes('TMDB API key not configured')) {
            showNotification({
              type: 'error',
              title: 'API Key No Configurada',
              message: 'Por favor, configura la API key de TMDB en el archivo .env.local',
              duration: 8000,
            })
          } else {
            showNotification({
              type: 'error',
              title: 'Error de búsqueda',
              message: errorMessage,
              duration: 5000,
            })
          }
          
          throw new Error(errorMessage)
        }
        return response.json()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
        
        // Don't show notification if it's already been shown
        if (!errorMessage.includes('TMDB API key not configured')) {
          showNotification({
            type: 'error',
            title: 'Error de búsqueda',
            message: errorMessage,
            duration: 5000,
          })
        }
        
        throw err
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
      onError: (err) => {
        console.error('Search error:', err)
      },
    }
  )

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Clear any pending debounce
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      setSearchQuery(query.trim())
      setIsRealTimeSearch(false)
      showNotification({
        type: 'info',
        title: 'Buscando...',
        message: `Buscando "${query.trim()}"`,
        duration: 2000,
      })
    }
  }, [query, showNotification])

  const clearSearch = useCallback(() => {
    setQuery('')
    setSearchQuery('')
    setActiveFilter('all')
    setIsRealTimeSearch(false)
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    showNotification({
      type: 'info',
      title: 'Búsqueda limpiada',
      duration: 2000,
    })
  }, [showNotification])

  const filteredResults = useMemo(() => {
    if (!data?.results) return []
    
    return data.results.filter(item => {
      if (activeFilter === 'all') return true
      return item.media_type === activeFilter
    })
  }, [data?.results, activeFilter])

  const hasResults = filteredResults.length > 0
  const totalResults = data?.total_results || 0
  const filteredCount = filteredResults.length

  // Show success notification when results are found (avoid duplicates)
  useEffect(() => {
    if (data && searchQuery && hasResults && !isRealTimeSearch) {
      const notificationKey = `${searchQuery}-${filteredCount}`
      if (lastNotificationRef.current !== notificationKey) {
        lastNotificationRef.current = notificationKey
        showNotification({
          type: 'success',
          title: 'Resultados encontrados',
          message: `${filteredCount} resultado${filteredCount !== 1 ? 's' : ''} para "${searchQuery}"`,
          duration: 3000,
        })
      }
    }
  }, [data, searchQuery, hasResults, filteredCount, showNotification, isRealTimeSearch])

  return {
    // State
    query,
    setQuery,
    searchQuery,
    activeFilter,
    setActiveFilter,
    isRealTimeSearch,
    
    // Data
    results: filteredResults,
    isLoading,
    error,
    hasResults,
    totalResults,
    filteredCount,
    
    // Actions
    handleSearch,
    clearSearch,
    refetch: mutate,
  }
} 