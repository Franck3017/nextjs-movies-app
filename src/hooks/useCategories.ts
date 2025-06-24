export interface Category {
  id: string
  title: string
  fetchUrl: string
  showRating: boolean
}

export const MOVIE_CATEGORIES: Category[] = [
  { id: 'trending', title: '🔥 Tendencias', fetchUrl: '/api/movies/popular', showRating: true },
  { id: 'top-rated', title: '⭐ Mejor Valoradas', fetchUrl: '/api/movies/top_rated', showRating: true },
  { id: 'action', title: '🎭 Acción', fetchUrl: '/api/movies/genre/28', showRating: true },
  { id: 'comedy', title: '😄 Comedia', fetchUrl: '/api/movies/genre/35', showRating: true },
  { id: 'romance', title: '💕 Romance', fetchUrl: '/api/movies/genre/10749', showRating: true },
  { id: 'horror', title: '😱 Terror', fetchUrl: '/api/movies/genre/27', showRating: true },
  { id: 'thriller', title: '🔍 Suspenso', fetchUrl: '/api/movies/genre/53', showRating: true },
  { id: 'fantasy', title: '🏰 Fantasía', fetchUrl: '/api/movies/genre/14', showRating: true },
  { id: 'scifi', title: '🚀 Ciencia Ficción', fetchUrl: '/api/movies/genre/878', showRating: true },
  { id: 'family', title: '👨‍👩‍👧‍👦 Familia', fetchUrl: '/api/movies/genre/10751', showRating: true },
  { id: 'animation', title: '🎨 Animación', fetchUrl: '/api/movies/genre/16', showRating: true },
  { id: 'drama', title: '🎭 Drama', fetchUrl: '/api/movies/genre/18', showRating: true },
  { id: 'crime', title: '🔫 Crimen', fetchUrl: '/api/movies/genre/80', showRating: true },
  { id: 'documentary', title: '🌍 Documental', fetchUrl: '/api/movies/genre/99', showRating: true },
]

export const TV_CATEGORIES: Category[] = [
  { id: 'trending', title: '🔥 Tendencias', fetchUrl: '/api/tv/popular', showRating: true },
  { id: 'top-rated', title: '⭐ Mejor Valoradas', fetchUrl: '/api/tv/top_rated', showRating: true },
  { id: 'action-adventure', title: '🎭 Acción y Aventura', fetchUrl: '/api/tv/genre/10759', showRating: true },
  { id: 'comedy', title: '😄 Comedia', fetchUrl: '/api/tv/genre/35', showRating: true },
  { id: 'romance', title: '💕 Romance', fetchUrl: '/api/tv/genre/10749', showRating: true },
  { id: 'horror', title: '😱 Terror', fetchUrl: '/api/tv/genre/27', showRating: true },
  { id: 'thriller', title: '🔍 Suspenso', fetchUrl: '/api/tv/genre/53', showRating: true },
  { id: 'fantasy', title: '🏰 Fantasía', fetchUrl: '/api/tv/genre/14', showRating: true },
  { id: 'scifi', title: '🚀 Ciencia Ficción', fetchUrl: '/api/tv/genre/878', showRating: true },
  { id: 'family', title: '👨‍👩‍👧‍👦 Familia', fetchUrl: '/api/tv/genre/10751', showRating: true },
  { id: 'animation', title: '🎨 Animación', fetchUrl: '/api/tv/genre/16', showRating: true },
  { id: 'drama', title: '🎭 Drama', fetchUrl: '/api/tv/genre/18', showRating: true },
  { id: 'crime', title: '🔫 Crimen', fetchUrl: '/api/tv/genre/80', showRating: true },
  { id: 'documentary', title: '🌍 Documental', fetchUrl: '/api/tv/genre/99', showRating: true },
]

export const useCategories = (type: 'movies' | 'tv') => {
  const categories = type === 'movies' ? MOVIE_CATEGORIES : TV_CATEGORIES

  return {
    categories,
    getCategoryById: (id: string) => categories.find(cat => cat.id === id),
    getCategoryByTitle: (title: string) => categories.find(cat => cat.title === title),
  }
} 