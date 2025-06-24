'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react'
import { useNotifications } from './NotificationContext'

export interface FavoriteItem {
  id: number
  title: string
  poster_path: string
  overview: string
  vote_average: number
  media_type: 'movie' | 'tv' | 'person'
  added_at: string
  release_date?: string
  first_air_date?: string
  runtime?: number
  genres?: string[]
}

interface FavoritesContextType {
  favorites: FavoriteItem[]
  addToFavorites: (item: Omit<FavoriteItem, 'added_at'>) => void
  removeFromFavorites: (id: number, mediaType: 'movie' | 'tv' | 'person') => void
  isFavorite: (id: number, mediaType: 'movie' | 'tv' | 'person') => boolean
  clearFavorites: () => void
  getFavoritesByType: (type: 'movie' | 'tv' | 'person') => FavoriteItem[]
  totalFavorites: number
  updateFavoritesWithDetails: () => Promise<void>
  removeIncompleteFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

interface FavoritesProviderProps {
  children: ReactNode
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const notificationQueue = useRef<Array<{ type: 'success' | 'info' | 'error'; title: string; message: string }>>([])
  const { showNotification } = useNotifications()

  // Function to update favorites with missing details
  const updateFavoritesWithDetails = useCallback(async () => {
    // For now, just remove incomplete favorites instead of trying to fetch data
    // This avoids the API issues and provides a cleaner solution
    setFavorites(prev => prev.filter(fav => {
      if (fav.media_type === 'person') return true;
      return fav.runtime !== undefined && fav.genres !== undefined;
    }))
  }, [])

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('cineapp-favorites')
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites)
        
        // Filter out incomplete favorites (those without runtime or genres)
        const completeFavorites = parsedFavorites.filter((fav: FavoriteItem) => {
          if (fav.media_type === 'person') return true;
          return fav.runtime !== undefined && fav.genres !== undefined;
        })
        
        setFavorites(completeFavorites)
        
        // If we filtered out some favorites, update localStorage
        if (completeFavorites.length !== parsedFavorites.length) {
          localStorage.setItem('cineapp-favorites', JSON.stringify(completeFavorites))
          console.log(`Cleaned up ${parsedFavorites.length - completeFavorites.length} incomplete favorites`)
        }
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Process notification queue after initialization
  useEffect(() => {
    if (isInitialized && notificationQueue.current.length > 0) {
      // Use setTimeout to avoid React state update during render
      setTimeout(() => {
        notificationQueue.current.forEach(notification => {
          showNotification(notification)
        })
        notificationQueue.current = []
      }, 0)
    }
  }, [isInitialized, showNotification])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('cineapp-favorites', JSON.stringify(favorites))
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error)
      }
    }
  }, [favorites, isInitialized])

  const queueNotification = useCallback((notification: { type: 'success' | 'info' | 'error'; title: string; message: string }) => {
    if (isInitialized) {
      // Use setTimeout to avoid React state update during render
      setTimeout(() => {
        showNotification(notification)
      }, 0)
    } else {
      notificationQueue.current.push(notification)
    }
  }, [isInitialized, showNotification])

  const addToFavorites = useCallback((item: Omit<FavoriteItem, 'added_at'>) => {
    const newFavorite: FavoriteItem = {
      ...item,
      added_at: new Date().toISOString()
    }

    setFavorites(prev => {
      // Check if item already exists
      const exists = prev.some(fav => fav.id === item.id && fav.media_type === item.media_type)
      
      if (exists) {
        queueNotification({
          type: 'info',
          title: 'Ya en favoritos',
          message: `${item.title} ya está en tu lista de favoritos`
        })
        return prev
      }

      queueNotification({
        type: 'success',
        title: 'Agregado a favoritos',
        message: `${item.title} se agregó a tu lista de favoritos`
      })

      return [...prev, newFavorite]
    })
  }, [queueNotification])

  const removeFromFavorites = useCallback((id: number, mediaType: 'movie' | 'tv' | 'person') => {
    setFavorites(prev => {
      const itemToRemove = prev.find(fav => fav.id === id && fav.media_type === mediaType)
      
      if (itemToRemove) {
        queueNotification({
          type: 'success',
          title: 'Eliminado de favoritos',
          message: `${itemToRemove.title} se eliminó de tu lista de favoritos`
        })
      }

      return prev.filter(fav => !(fav.id === id && fav.media_type === mediaType))
    })
  }, [queueNotification])

  const isFavorite = useCallback((id: number, mediaType: 'movie' | 'tv' | 'person'): boolean => {
    return favorites.some(fav => fav.id === id && fav.media_type === mediaType)
  }, [favorites])

  const clearFavorites = useCallback(() => {
    setFavorites([])
    queueNotification({
      type: 'success',
      title: 'Favoritos eliminados',
      message: 'Se eliminaron todos los favoritos'
    })
  }, [queueNotification])

  const getFavoritesByType = useCallback((type: 'movie' | 'tv' | 'person'): FavoriteItem[] => {
    return favorites.filter(fav => fav.media_type === type)
  }, [favorites])

  const totalFavorites = favorites.length

  const removeIncompleteFavorites = useCallback(() => {
    setFavorites(prev => prev.filter(fav => {
      if (fav.media_type === 'person') return true;
      return fav.runtime !== undefined && fav.genres !== undefined;
    }))
  }, [])

  const value: FavoritesContextType = React.useMemo(() => ({
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
    getFavoritesByType,
    totalFavorites,
    updateFavoritesWithDetails,
    removeIncompleteFavorites
  }), [favorites, addToFavorites, removeFromFavorites, isFavorite, clearFavorites, getFavoritesByType, totalFavorites, updateFavoritesWithDetails, removeIncompleteFavorites])

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
} 