// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.themoviedb.org/3'
export const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
export const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'

// Image Optimization
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original'
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original'
  }
} as const

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  // SWR Configuration
  swr: {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000, // 5 minutes
    keepPreviousData: true,
  },
  
  // Hero Banner
  hero: {
    dedupingInterval: 600000, // 10 minutes
  },
  
  // Search
  search: {
    debounceMs: 300,
    minQueryLength: 2,
    maxResults: 20,
  },
  
  // Pagination
  pagination: {
    itemsPerPage: 20,
    maxPages: 500,
  },

  // Cache
  cache: {
    defaultTTL: 300000, // 5 minutes
    longTTL: 3600000, // 1 hour
  }
} as const

// Movie Genres
export const MOVIE_GENRES = {
  28: 'Acción',
  12: 'Aventura',
  16: 'Animación',
  35: 'Comedia',
  80: 'Crimen',
  99: 'Documental',
  18: 'Drama',
  10751: 'Familiar',
  14: 'Fantasía',
  36: 'Historia',
  27: 'Terror',
  10402: 'Música',
  9648: 'Misterio',
  10749: 'Romance',
  878: 'Ciencia ficción',
  10770: 'Película de TV',
  53: 'Suspenso',
  10752: 'Bélica',
  37: 'Western'
} as const

// TV Genres
export const TV_GENRES = {
  10759: 'Acción y Aventura',
  16: 'Animación',
  35: 'Comedia',
  80: 'Crimen',
  99: 'Documental',
  18: 'Drama',
  10751: 'Familiar',
  10762: 'Kids',
  9648: 'Misterio',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
  37: 'Western'
} as const

// UI Configuration
export const UI_CONFIG = {
  // Animation durations
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // Breakpoints
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  },
  
  // Colors
  colors: {
    primary: '#dc2626',
    secondary: '#1f2937',
    accent: '#f59e0b',
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  }
} as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  API_ERROR: 'Error al cargar los datos. Intenta de nuevo.',
  SEARCH_ERROR: 'Error en la búsqueda. Verifica tu consulta.',
  NOT_FOUND: 'No se encontraron resultados.',
  GENERIC: 'Algo salió mal. Intenta de nuevo.',
  TIMEOUT: 'La solicitud tardó demasiado. Intenta de nuevo.',
  UNAUTHORIZED: 'No tienes permisos para acceder a este recurso.',
  FORBIDDEN: 'Acceso denegado.',
  SERVER_ERROR: 'Error interno del servidor.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  SEARCH_SUCCESS: 'Búsqueda completada exitosamente.',
  FAVORITE_ADDED: 'Agregado a favoritos.',
  FAVORITE_REMOVED: 'Removido de favoritos.',
  DATA_LOADED: 'Datos cargados correctamente.',
  SETTINGS_SAVED: 'Configuración guardada.',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  FAVORITES: 'cineapp_favorites',
  SEARCH_HISTORY: 'cineapp_search_history',
  USER_PREFERENCES: 'cineapp_user_preferences',
  THEME: 'cineapp_theme',
  LANGUAGE: 'cineapp_language',
} as const

// Route Paths
export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  MOVIE_DETAILS: '/movie/[id]',
  TV_DETAILS: '/tv/[id]',
  FAVORITES: '/favorites',
  SETTINGS: '/settings',
} as const

// API Endpoints
export const API_ENDPOINTS = {
  SEARCH: '/api/search',
  MOVIES: {
    POPULAR: '/api/movies/popular',
    TOP_RATED: '/api/movies/top_rated',
    GENRE: '/api/movies/genre/[id]',
    DETAILS: '/api/movie/[id]',
    CREDITS: '/api/movie/[id]/credits',
  },
  TV: {
    POPULAR: '/api/tv/popular',
    TOP_RATED: '/api/tv/top_rated',
    GENRE: '/api/tv/genre/[id]',
    DETAILS: '/api/tv/[id]',
    CREDITS: '/api/tv/[id]/credits',
  },
} as const

// Media Types
export const MEDIA_TYPES = {
  MOVIE: 'movie',
  TV: 'tv',
} as const

// Filter Types
export const FILTER_TYPES = {
  ALL: 'all',
  MOVIE: 'movie',
  TV: 'tv',
} as const

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const

// Sort Options
export const SORT_OPTIONS = {
  POPULARITY: 'popularity.desc',
  RATING: 'vote_average.desc',
  RELEASE_DATE: 'release_date.desc',
  TITLE: 'title.asc',
} as const

// Default Values
export const DEFAULTS = {
  PAGE: 1,
  PER_PAGE: 20,
  SEARCH_DEBOUNCE: 300,
  CACHE_TTL: 300000,
  MAX_SEARCH_HISTORY: 10,
  MAX_FAVORITES: 100,
} as const 