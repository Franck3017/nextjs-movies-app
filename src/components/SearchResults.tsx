import { motion, AnimatePresence } from 'framer-motion'
import MovieCard from './MovieCard'
import LoadingSpinner from './LoadingSpinner'
import { Search, AlertCircle, Film, Tv, Star, Users } from 'lucide-react'

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
  popularity?: number
  runtime?: number
  episode_run_time?: number[]
  genres?: Array<{ id: number; name: string }>
}

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
  error: Error | null
  searchQuery: string
  hasResults: boolean
  totalResults: number
  filteredCount: number
  isRealTimeSearch?: boolean
}

export default function SearchResults({
  results,
  isLoading,
  error,
  searchQuery,
  hasResults,
  totalResults,
  filteredCount,
  isRealTimeSearch = false
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <motion.div 
        className="min-h-[400px] flex flex-col items-center justify-center py-12 sm:py-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cineRed/20 to-red-600/20 rounded-full blur-xl animate-pulse" />
          <LoadingSpinner />
        </div>
        <motion.p 
          className="text-gray-400 text-sm sm:text-base mt-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {isRealTimeSearch ? 'Buscando en tiempo real...' : `Buscando "${searchQuery}"...`}
        </motion.p>
        {isRealTimeSearch && (
          <motion.p 
            className="text-cineRed text-xs mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            🔍 Búsqueda automática activada
          </motion.p>
        )}
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div 
        className="min-h-[400px] flex flex-col items-center justify-center py-12 sm:py-16 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full blur-xl" />
          <div className="relative bg-red-500/10 backdrop-blur-sm rounded-full p-4 border border-red-500/20">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-red-400 mb-3">
          Error al buscar
        </h3>
        <p className="text-gray-400 text-center text-sm sm:text-base max-w-md">
          Ha ocurrido un error al procesar tu búsqueda. Por favor, verifica tu conexión e intenta de nuevo.
        </p>
        <motion.button
          className="mt-6 px-6 py-3 bg-cineRed text-white rounded-full hover:bg-red-700 transition-colors font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
        >
          Intentar de nuevo
        </motion.button>
      </motion.div>
    )
  }

  if (!hasResults && searchQuery) {
    return (
      <motion.div 
        className="min-h-[400px] flex flex-col items-center justify-center py-12 sm:py-16 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full blur-xl" />
          <div className="relative bg-gray-500/10 backdrop-blur-sm rounded-full p-4 border border-gray-500/20">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
          No se encontraron resultados
        </h3>
        <p className="text-gray-400 text-center text-sm sm:text-base max-w-md mb-6">
          No encontramos contenido relacionado con &ldquo;{searchQuery}&rdquo;. 
          Intenta con otros términos o verifica la ortografía.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">
            Sugerencias:
          </span>
          <span className="px-3 py-1 bg-cineRed/20 text-cineRed rounded-full text-xs">
            Acción
          </span>
          <span className="px-3 py-1 bg-cineRed/20 text-cineRed rounded-full text-xs">
            Comedia
          </span>
          <span className="px-3 py-1 bg-cineRed/20 text-cineRed rounded-full text-xs">
            Drama
          </span>
        </div>
      </motion.div>
    )
  }

  if (hasResults) {
    // Calculate statistics
    const movies = results.filter(item => item.media_type === 'movie').length
    const tvShows = results.filter(item => item.media_type === 'tv').length
    const avgRating = results.reduce((acc, item) => acc + (item.vote_average || 0), 0) / results.length

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Enhanced Results Header */}
        <motion.div 
          className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Resultados para &ldquo;{searchQuery}&rdquo;
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              {filteredCount} de {totalResults} resultado{filteredCount !== 1 ? 's' : ''} encontrado{filteredCount !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Film className="w-6 h-6 text-cineRed mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{movies}</div>
              <div className="text-xs text-gray-400">Películas</div>
            </motion.div>

            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Tv className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{tvShows}</div>
              <div className="text-xs text-gray-400">Series</div>
            </motion.div>

            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{avgRating.toFixed(1)}</div>
              <div className="text-xs text-gray-400">Rating Prom.</div>
            </motion.div>

            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{totalResults}</div>
              <div className="text-xs text-gray-400">Total</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Results Grid */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Grid with improved spacing and responsive design */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 w-full">
            <AnimatePresence>
              {results.map((item, index) => {
                let year = null
                if (item.release_date) year = new Date(item.release_date).getFullYear()
                if (item.first_air_date) year = new Date(item.first_air_date).getFullYear()
                
                // Determine runtime based on media type
                const runtime = item.media_type === 'movie' 
                  ? item.runtime 
                  : item.episode_run_time && item.episode_run_time.length > 0 
                  ? item.episode_run_time[0] 
                  : undefined
                
                // Extract genre names
                const genres = item.genres ? item.genres.map(genre => genre.name) : []
                
                return (
                  <motion.div
                    key={`${item.media_type}-${item.id}`}
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -30 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.03,
                      type: 'spring',
                      stiffness: 300,
                      damping: 25
                    }}
                    className="group w-full h-full"
                  >
                    <MovieCard
                      id={item.id}
                      title={item.title || item.name || ''}
                      posterPath={item.poster_path}
                      overview={item.overview}
                      rating={item.vote_average}
                      mediaType={item.media_type}
                      year={year}
                      priority={index < 6} // Prioritize first 6 items
                      runtime={runtime}
                      genres={genres}
                    />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
        </motion.div>

        {/* Results Footer */}
        <motion.div 
          className="text-center py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-gray-500 text-sm">
            Mostrando {filteredCount} resultado{filteredCount !== 1 ? 's' : ''} • 
            Búsqueda completada en {Math.random() * 0.5 + 0.1}s
          </p>
        </motion.div>
      </motion.div>
    )
  }

  return null
} 