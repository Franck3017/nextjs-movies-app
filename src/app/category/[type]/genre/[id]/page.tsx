'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid, 
  List,
  Star,
  Calendar,
  TrendingUp,
  Users,
  Tag
} from 'lucide-react'
import Layout from '../../../../../components/Layout'
import MovieCard from '../../../../../components/MovieCard'
import LoadingSpinner from '../../../../../components/LoadingSpinner'
import Pagination from '../../../../../components/Pagination'
import { useNotifications } from '../../../../../contexts/NotificationContext'

interface CategoryItem {
  id: number
  title?: string
  name?: string
  poster_path: string
  overview: string
  vote_average: number
  release_date?: string
  first_air_date?: string
  media_type: 'movie' | 'tv'
  runtime?: number
  episode_run_time?: number[]
  genres?: Array<{ id: number; name: string }>
}

interface CategoryResponse {
  results: CategoryItem[]
  total_pages: number
  total_results: number
  page: number
}

interface GenreInfo {
  id: number
  name: string
  description?: string
}

export default function GenrePage() {
  const router = useRouter()
  const params = useParams()
  const { showNotification } = useNotifications()
  const [items, setItems] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [genreInfo, setGenreInfo] = useState<GenreInfo | null>(null)
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'date' | 'title'>('popularity')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Get params from Next.js dynamic route
  const type = params?.type as string // 'movies' or 'tv'
  const genreId = params?.id as string

  useEffect(() => {
    // Only fetch data if we have valid params
    if (!type || !genreId) {
      setError('Parámetros de categoría inválidos')
      setLoading(false)
      return
    }

    // Validate that type is either 'movies' or 'tv'
    if (type !== 'movies' && type !== 'tv') {
      setError('Tipo de contenido inválido')
      setLoading(false)
      return
    }

    // Validate that genreId is a number
    if (isNaN(Number(genreId))) {
      setError('ID de género inválido')
      setLoading(false)
      return
    }

    const fetchGenreData = async () => {
      try {
        setLoading(true)
        
        // Fetch genre info
        const genreUrl = `/api/genres/${type}/${genreId}`
        const genreResponse = await fetch(genreUrl)
        if (genreResponse.ok) {
          const genreData = await genreResponse.json()
          setGenreInfo(genreData)
        } else {
          throw new Error('No se pudo cargar la información del género')
        }

        // Fetch items
        const itemsUrl = `/api/${type}/genre/${genreId}?page=${currentPage}&sort_by=${sortBy}&sort_order=${sortOrder}`
        const itemsResponse = await fetch(itemsUrl)
        if (!itemsResponse.ok) {
          throw new Error('Error al cargar los datos')
        }
        
        const data: CategoryResponse = await itemsResponse.json()
        setItems(data.results)
        setTotalPages(data.total_pages)
        setTotalResults(data.total_results)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        showNotification({
          type: 'error',
          title: 'Error',
          message: 'No se pudieron cargar los datos del género'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchGenreData()
  }, [type, genreId, currentPage, sortBy, sortOrder, showNotification])

  const handleBackClick = () => {
    router.back()
  }

  const handleSortChange = (newSortBy: 'popularity' | 'rating' | 'date' | 'title') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getSortIcon = (sortType: 'popularity' | 'rating' | 'date' | 'title') => {
    if (sortBy !== sortType) return null
    return sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
  }

  const getSortLabel = (sortType: 'popularity' | 'rating' | 'date' | 'title') => {
    switch (sortType) {
      case 'popularity': return 'Popularidad'
      case 'rating': return 'Valoración'
      case 'date': return 'Fecha'
      case 'title': return 'Título'
      default: return ''
    }
  }

  if (loading && !genreInfo) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Cargando género..." />
        </div>
      </Layout>
    )
  }

  if (error || !genreInfo) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-xl sm:text-2xl font-bold text-cineRed mb-3 sm:mb-4">Error al cargar el género</h1>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">{error || 'No se encontró el género'}</p>
            <button 
              onClick={handleBackClick} 
              className="btn-cine px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
            >
              Volver
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Header - Responsive */}
        <div className="bg-gradient-to-r from-cineRed/20 to-red-600/20 backdrop-blur-sm border-b border-cineRed/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 sm:gap-6"
            >
              {/* Back Button */}
              <motion.button
                onClick={handleBackClick}
                className="p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>

              {/* Category Icon and Title */}
              <div className="flex items-center gap-3 sm:gap-4">
                <motion.div
                  className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cineRed to-red-600 rounded-2xl flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Tag className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                    {genreInfo.name}
                  </h1>
                  <p className="text-gray-300 text-sm sm:text-base">
                    {type === 'movies' ? 'Películas' : 'Series'} de {genreInfo.name.toLowerCase()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-4 sm:mt-6 flex flex-wrap items-center gap-4 sm:gap-6"
            >
              <div className="flex items-center gap-2 text-white">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-cineRed" />
                <span className="text-sm sm:text-base font-medium">
                  {totalResults.toLocaleString()} títulos
                </span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <span className="text-sm sm:text-base font-medium">
                  Página {currentPage} de {totalPages}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Controls - Responsive */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8"
          >
            {/* Sort Controls */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-white text-sm sm:text-base font-medium">Ordenar por:</span>
              {(['popularity', 'rating', 'date', 'title'] as const).map((sortType) => (
                <button
                  key={sortType}
                  onClick={() => handleSortChange(sortType)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    sortBy === sortType
                      ? 'bg-cineRed text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {getSortLabel(sortType)}
                  {getSortIcon(sortType)}
                </button>
              ))}
            </div>

            {/* View Mode and Filters */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  showFilters
                    ? 'bg-cineRed text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filtros
              </button>
              
              <div className="flex items-center bg-white/10 rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-full transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-cineRed text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-full transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-cineRed text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <h3 className="text-white font-semibold mb-3">Filtros</h3>
                <p className="text-gray-400 text-sm">Los filtros estarán disponibles próximamente</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner text="Cargando contenido..." />
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
                >
                  {items.map((item, index) => {
                    const title = item.title || item.name || 'Sin título'
                    const year = item.release_date 
                      ? new Date(item.release_date).getFullYear()
                      : item.first_air_date 
                      ? new Date(item.first_air_date).getFullYear()
                      : null
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                          delay: index * 0.05, 
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
                          mediaType={type as 'movie' | 'tv'}
                          release_date={item.release_date}
                          first_air_date={item.first_air_date}
                          runtime={type === 'movies' ? item.runtime : item.episode_run_time?.[0]}
                          genres={item.genres?.map(genre => genre.name) || []}
                        />
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4"
                >
                  {items.map((item, index) => {
                    const title = item.title || item.name || 'Sin título'
                    const year = item.release_date 
                      ? new Date(item.release_date).getFullYear()
                      : item.first_air_date 
                      ? new Date(item.first_air_date).getFullYear()
                      : null
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: index * 0.05, 
                          duration: 0.5
                        }}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-cineRed/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                            alt={title}
                            className="w-16 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold text-lg mb-1 truncate">{title}</h3>
                            <p className="text-gray-300 text-sm mb-2 line-clamp-2">{item.overview}</p>
                            <div className="flex items-center gap-4 text-sm">
                              {item.vote_average > 0 && (
                                <div className="flex items-center gap-1 text-yellow-400">
                                  <Star className="w-4 h-4" />
                                  <span>{item.vote_average.toFixed(1)}</span>
                                </div>
                              )}
                              {year && (
                                <div className="flex items-center gap-1 text-gray-400">
                                  <Calendar className="w-4 h-4" />
                                  <span>{year}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="mt-8 sm:mt-12 flex justify-center"
                >
                  <Pagination
                    page={currentPage}
                    total={totalPages}
                    onPrev={() => handlePageChange(currentPage - 1)}
                    onNext={() => handlePageChange(currentPage + 1)}
                  />
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  )
} 