import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import MovieCard from './MovieCard'
import SkeletonCard from './SkeletonCard'
import useSWR from 'swr'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useRef, useState } from 'react'

interface CategoryRowProps {
  title: string
  fetchUrl: string
  showRating?: boolean
  icon?: string
}

interface TMDBResponse {
  results: Array<{
    id: number
    title?: string
    name?: string
    poster_path: string
    overview: string
    vote_average?: number
    release_date?: string
    first_air_date?: string
    runtime?: number
    episode_run_time?: number[]
    genres?: Array<{ id: number; name: string }>
  }>
}

export default function CategoryRow({ title, fetchUrl, showRating = false, icon }: CategoryRowProps) {
  const { data, error, isLoading } = useSWR<TMDBResponse>(
    fetchUrl,
    (url: string) => fetch(url).then(r => r.json()),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000,
      keepPreviousData: true,
    }
  )

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  if (error || (!isLoading && (!data || !data.results || data.results.length === 0))) {
    return null
  }

  const results = data?.results || []
  const skeletonCount = 8

  // Function to get icon from title or use provided icon
  const getIcon = () => {
    if (icon) return icon
    
    if (title.includes('🔥') || title.includes('Tendencias')) return '🔥'
    if (title.includes('⭐') || title.includes('Mejor Valoradas')) return '⭐'
    if (title.includes('🎭') || title.includes('Acción') || title.includes('Drama')) return '🎭'
    if (title.includes('😄') || title.includes('Comedia')) return '😄'
    if (title.includes('💕') || title.includes('Romance')) return '💕'
    if (title.includes('😱') || title.includes('Terror')) return '😱'
    if (title.includes('🔍') || title.includes('Suspenso') || title.includes('Misterio')) return '🔍'
    if (title.includes('🏰') || title.includes('Fantasía')) return '🏰'
    if (title.includes('🚀') || title.includes('Ciencia ficción') || title.includes('Sci-Fi')) return '🚀'
    if (title.includes('👨‍👩‍👧‍👦') || title.includes('Familiar') || title.includes('Familia')) return '👨‍👩‍👧‍👦'
    if (title.includes('🎨') || title.includes('Animación')) return '🎨'
    if (title.includes('🔫') || title.includes('Crimen')) return '🔫'
    if (title.includes('🌍') || title.includes('Documental')) return '🌍'
    if (title.includes('🗺️') || title.includes('Aventura')) return '🗺️'
    if (title.includes('📚') || title.includes('Historia')) return '📚'
    if (title.includes('🎵') || title.includes('Música')) return '🎵'
    if (title.includes('⚔️') || title.includes('Bélica') || title.includes('War')) return '⚔️'
    if (title.includes('🤠') || title.includes('Western')) return '🤠'
    if (title.includes('👶') || title.includes('Kids')) return '👶'
    if (title.includes('📰') || title.includes('News')) return '📰'
    if (title.includes('📺') || title.includes('Reality') || title.includes('TV')) return '📺'
    if (title.includes('🧼') || title.includes('Soap')) return '🧼'
    if (title.includes('💬') || title.includes('Talk')) return '💬'
    
    return '🎬'
  }

  // Function to clean title (remove emojis)
  const getCleanTitle = () => {
    return title.replace(/[🔥⭐🎭😄💕😱🔍🏰🚀👨‍👩‍👧‍👦🎨🔫🌍🗺️📚🎵⚔️🤠👶📰📺🧼💬]/g, '').trim()
  }

  // Function to get category link based on fetchUrl
  const getCategoryLink = () => {
    const cleanTitle = getCleanTitle()
    
    // Handle special categories
    if (title.includes('🔥') || title.includes('Tendencias') || fetchUrl.includes('/popular')) {
      const isMovies = fetchUrl.includes('movie')
      return `/category/${isMovies ? 'movies' : 'tv'}/popular`
    }
    
    if (title.includes('⭐') || title.includes('Mejor Valoradas') || fetchUrl.includes('/top_rated')) {
      const isMovies = fetchUrl.includes('movie')
      return `/category/${isMovies ? 'movies' : 'tv'}/top_rated`
    }
    
    // Handle genre-based categories
    const genreMatch = fetchUrl.match(/genre\/(\d+)/)
    if (genreMatch) {
      const genreId = genreMatch[1]
      const isMovies = fetchUrl.includes('movie')
      return `/category/${isMovies ? 'movies' : 'tv'}/genre/${genreId}`
    }
    
    // Handle discover categories with genre IDs
    const discoverGenreMatch = fetchUrl.match(/with_genres=(\d+)/)
    if (discoverGenreMatch) {
      const genreId = discoverGenreMatch[1]
      const isMovies = fetchUrl.includes('discover/movie') || fetchUrl.includes('movie/')
      return `/category/${isMovies ? 'movies' : 'tv'}/genre/${genreId}`
    }
    
    return null
  }

  const categoryLink = getCategoryLink()

  // Scroll functions
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const currentScroll = scrollContainerRef.current.scrollLeft
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      })
    }
  }

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  // Function to get category description
  const getCategoryDescription = () => {
    const cleanTitle = getCleanTitle()
    
    if (title.includes('🔥') || title.includes('Tendencias')) {
      return 'Contenido más popular del momento'
    }
    
    if (title.includes('⭐') || title.includes('Mejor Valoradas')) {
      return 'Contenido con las mejores calificaciones'
    }
    
    return `${results.length} títulos disponibles`
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="mb-8 sm:mb-12 lg:mb-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 lg:mb-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-center gap-3 sm:gap-4"
        >
          {/* Category Icon - Responsive */}
          <motion.div
            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-cineRed to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold">
              {getIcon()}
            </span>
          </motion.div>

          {/* Category Title - Responsive */}
          <div className="flex-1 min-w-0">
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1 sm:mb-2 truncate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {getCleanTitle()}
            </motion.h2>
            
            {/* Category Subtitle - Responsive */}
            <motion.p
              className="text-gray-400 text-xs sm:text-sm lg:text-base truncate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {isLoading ? 'Cargando contenido...' : getCategoryDescription()}
            </motion.p>
          </div>

          {/* View All Button - Responsive */}
          {categoryLink ? (
            <Link href={categoryLink}>
              <motion.button
                className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-cineRed/50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={`Ver todos los ${getCleanTitle().toLowerCase()}`}
              >
                <span className="text-xs sm:text-sm font-medium">Ver todo</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>
            </Link>
          ) : (
            <motion.button
              className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-600/50 backdrop-blur-sm rounded-full text-gray-400 cursor-not-allowed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              disabled
              title="Categoría no disponible"
            >
              <span className="text-xs sm:text-sm font-medium">Ver todo</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.button>
          )}
        </motion.div>
      </div>
      
      {/* Content Container - Responsive */}
      <div className="relative">
        {/* Scroll Navigation Buttons - Desktop Only */}
        <div className="hidden lg:block">
          <motion.button
            onClick={() => scroll('left')}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-all duration-300 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            onClick={() => scroll('right')}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-all duration-300 ${
              canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Enhanced Scroll Container - Responsive */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex gap-3 sm:gap-4"
              >
                {Array.from({ length: skeletonCount }).map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    className="flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.1, 
                      duration: 0.5,
                      type: 'spring',
                      stiffness: 100
                    }}
                  >
                    <SkeletonCard />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex gap-3 sm:gap-4"
              >
                {results.map((item, index) => {
                  const title = item.title || item.name || 'Sin título'
                  const year = item.release_date 
                    ? new Date(item.release_date).getFullYear()
                    : item.first_air_date 
                    ? new Date(item.first_air_date).getFullYear()
                    : null
                  
                  // Determine runtime based on media type
                  const runtime = fetchUrl.includes('movie') 
                    ? item.runtime 
                    : item.episode_run_time && item.episode_run_time.length > 0 
                    ? item.episode_run_time[0] 
                    : undefined
                  
                  // Extract genre names
                  const genres = item.genres ? item.genres.map(genre => genre.name) : []
                  
                  return (
                    <motion.div
                      key={item.id}
                      className="flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56"
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.1, 
                        duration: 0.5,
                        type: 'spring',
                        stiffness: 100
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <MovieCard
                        id={item.id}
                        title={title}
                        posterPath={item.poster_path}
                        overview={item.overview}
                        rating={item.vote_average}
                        year={year}
                        mediaType={fetchUrl.includes('movie') ? 'movie' : 'tv'}
                        release_date={item.release_date}
                        first_air_date={item.first_air_date}
                        runtime={runtime}
                        genres={genres}
                      />
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile View All Button */}
        {categoryLink && (
          <div className="lg:hidden flex justify-center mt-4">
            <Link href={categoryLink}>
              <motion.button
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-cineRed/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={`Ver todos los ${getCleanTitle().toLowerCase()}`}
              >
                <span className="text-sm font-medium">Ver todo</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        )}
      </div>
    </motion.section>
  )
} 