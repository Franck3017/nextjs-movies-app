// TMDB API Configuration
// IMPORTANTE: Necesitas obtener una API key gratuita de TMDB
// 1. Ve a https://www.themoviedb.org/settings/api
// 2. Crea una cuenta gratuita si no tienes una
// 3. Solicita una API key (API Read Access Token)
// 4. Copia la API key y agrégalo al archivo .env.local

export const TMDB_CONFIG = {
  // Base URL for TMDB API
  BASE_URL: 'https://api.themoviedb.org/3',
  
  // Image base URL
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  
  // API Key - Debe estar en .env.local como TMDB_API_KEY
  API_KEY: process.env.TMDB_API_KEY,
  
  // Language for API requests
  LANGUAGE: 'es-ES',
  
  // Default parameters
  DEFAULT_PARAMS: {
    language: 'es-ES',
    include_adult: false,
    include_video: false,
  },
  
  // Image sizes
  IMAGE_SIZES: {
    poster: {
      small: 'w185',
      medium: 'w342',
      large: 'w500',
      original: 'original',
    },
    backdrop: {
      small: 'w300',
      medium: 'w780',
      large: 'w1280',
      original: 'original',
    },
    profile: {
      small: 'w45',
      medium: 'w185',
      large: 'h632',
      original: 'original',
    },
  },
} as const

// Utility functions for TMDB
export const tmdbUtils = {
  // Get full image URL
  getImageUrl: (path: string, size: string = 'w500'): string => {
    if (!path) return '/placeholder-poster.jpg'
    return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}`
  },
  
  // Get backdrop URL
  getBackdropUrl: (path: string, size: string = 'w1280'): string => {
    if (!path) return '/placeholder-backdrop.jpg'
    return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}`
  },
  
  // Get profile URL
  getProfileUrl: (path: string, size: string = 'w185'): string => {
    if (!path) return '/placeholder-profile.jpg'
    return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}`
  },
  
  // Check if API key is configured
  isApiKeyConfigured: (): boolean => {
    return !!TMDB_CONFIG.API_KEY
  },
  
  // Get API key status message
  getApiKeyStatus: (): { configured: boolean; message: string } => {
    if (TMDB_CONFIG.API_KEY) {
      return {
        configured: true,
        message: 'API key configurada correctamente'
      }
    }
    return {
      configured: false,
      message: 'API key no configurada. Ve a https://www.themoviedb.org/settings/api para obtener una API key gratuita.'
    }
  },
}

// Instructions for setting up TMDB API
export const TMDB_SETUP_INSTRUCTIONS = `
🚀 CONFIGURACIÓN DE TMDB API

Para que la aplicación funcione correctamente, necesitas configurar la API key de TMDB:

1. 🌐 Ve a https://www.themoviedb.org/settings/api
2. 📝 Crea una cuenta gratuita si no tienes una
3. 🔑 Solicita una API key (API Read Access Token)
4. 📋 Copia la API key
5. 📁 Crea un archivo llamado .env.local en la raíz del proyecto
6. ✏️ Agrega esta línea al archivo .env.local:
   TMDB_API_KEY=tu_api_key_aqui
7. 🔄 Reinicia el servidor de desarrollo

Ejemplo del archivo .env.local:
TMDB_API_KEY=1234567890abcdef1234567890abcdef
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.tmdb.org/t/p

¡La API key es completamente gratuita y te permite hacer hasta 1000 requests por día!
` 