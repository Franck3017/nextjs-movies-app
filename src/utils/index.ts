// Date utilities
export const formatYear = (dateString?: string): number | null => {
  if (!dateString) return null
  return new Date(dateString).getFullYear()
}

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Fecha no disponible'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Rating utilities
export const formatRating = (rating?: number): string => {
  if (!rating || rating === 0) return 'Sin calificación'
  return rating.toFixed(1)
}

export const getRatingColor = (rating: number): string => {
  if (rating >= 8) return 'text-green-400'
  if (rating >= 6) return 'text-yellow-400'
  if (rating >= 4) return 'text-orange-400'
  return 'text-red-400'
}

// Image utilities
export const getImageUrl = (path: string, size: string = 'w500'): string => {
  if (!path) return '/placeholder-poster.jpg'
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export const getBackdropUrl = (path: string, size: string = 'w1280'): string => {
  if (!path) return '/placeholder-backdrop.jpg'
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export const getProfileUrl = (path: string, size: string = 'w185'): string => {
  if (!path) return '/placeholder-profile.jpg'
  return `https://image.tmdb.org/t/p/${size}${path}`
}

// Text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// Array utilities
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp!
  }
  return shuffled
}

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Performance utilities
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Local storage utilities
export const setLocalStorage = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) as T : defaultValue
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue
  }
}

export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

// Error handling utilities
export const handleApiError = (error: unknown): string => {
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as { response?: { status?: number }; message?: string }
    if (errorObj.response?.status === 404) {
      return 'No se encontró el recurso solicitado'
    }
    if (errorObj.response?.status === 500) {
      return 'Error interno del servidor'
    }
    if (errorObj.message) {
      return errorObj.message
    }
  }
  return 'Ha ocurrido un error inesperado'
}

// Animation utilities
export const getStaggerDelay = (index: number, baseDelay: number = 0.1): number => {
  return index * baseDelay
}

export const getRandomDelay = (min: number = 0, max: number = 0.5): number => {
  return Math.random() * (max - min) + min
}

/**
 * Verifica si la API key de TMDB está configurada
 * @returns true si la API key está configurada, false en caso contrario
 */
export const isApiKeyConfigured = (): boolean => {
  // En el cliente, verificamos si hay una API key pública
  if (typeof window !== 'undefined') {
    return !!process.env.NEXT_PUBLIC_TMDB_API_KEY
  }
  
  // En el servidor, verificamos la API key del servidor
  return !!process.env.TMDB_API_KEY
}

/**
 * Obtiene el estado de configuración de la API key
 * @returns objeto con el estado de configuración y mensaje
 */
export const getApiKeyStatus = (): { configured: boolean; message: string } => {
  if (isApiKeyConfigured()) {
    return {
      configured: true,
      message: 'API key configurada correctamente'
    }
  }
  return {
    configured: false,
    message: 'API key no configurada. Ve a https://www.themoviedb.org/settings/api para obtener una API key gratuita.'
  }
} 