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
  Users
} from 'lucide-react'
import Layout from '../../../../components/Layout'
import MovieCard from '../../../../components/MovieCard'
import LoadingSpinner from '../../../../components/LoadingSpinner'
import Pagination from '../../../../components/Pagination'
import { useNotifications } from '../../../../contexts/NotificationContext'

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

interface CategoryInfo {
  id: number
  name: string
  description?: string
}

export default function CategoryPage() {
  const router = useRouter()
  const params = useParams()
  const { showNotification } = useNotifications()
  const [items, setItems] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null)
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'date' | 'title'>('popularity')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Get params from Next.js dynamic route
  const type = params?.type as string // 'movies' or 'tv'
  const categoryId = params?.id as string

  useEffect(() => {
    // Only fetch data if we have valid params
    if (!type || !categoryId) {
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

    // Validate that categoryId is a number
    if (isNaN(Number(categoryId))) {
      setError('ID de categoría inválido')
      setLoading(false)
      return
    }

    const fetchCategoryData = async () => {
      try {
        setLoading(true)
        
        // Fetch category info
        const categoryUrl = `/api/genres/${type}/${categoryId}`
        const categoryResponse = await fetch(categoryUrl)
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json()
          setCategoryInfo(categoryData)
        } else {
          throw new Error('No se pudo cargar la información de la categoría')
        }

        // Fetch items
        const itemsUrl = `/api/movies/${type}/genre/${categoryId}?page=${currentPage}&sort_by=${sortBy}&sort_order=${sortOrder}`
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
          message: 'No se pudieron cargar los datos de la categoría'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryData()
  }, [type, categoryId, currentPage, sortBy, sortOrder, showNotification])

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

  if (loading && !categoryInfo) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Cargando categoría..." />
        </div>
      </Layout>
    )
  }

  if (error || !categoryInfo) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-xl sm:text-2xl font-bold text-cineRed mb-3 sm:mb-4">Error al cargar la categoría</h1>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">{error || 'No se encontró la categoría'}</p>
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
            >
              {/* Back Button - Responsive */}
              <motion.button
                onClick={handleBackClick}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 sm:mb-6"
                whileHover={{ x: -5 }}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Volver</span>
              </motion.button>

              {/* Category Info - Responsive */}
              <div className="text-center mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-4">
                  {categoryInfo.name}
                </h1>
                <p className="text-gray-300 text-base sm:text-lg mb-3 sm:mb-4">
                  {type === 'movies' ? 'Películas' : 'Series'} de {categoryInfo.name}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{totalResults.toLocaleString()} títulos</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{totalPages} páginas</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Controls - Responsive */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
          >
            {/* Sort Controls - Responsive */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-sm sm:text-base text-gray-400 font-medium">Ordenar por:</span>
              {(['popularity', 'rating', 'date', 'title'] as const).map((sortType) => (
                <motion.button
                  key={sortType}
                  onClick={() => handleSortChange(sortType)}
                  className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                    sortBy === sortType
                      ? 'bg-cineRed text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {getSortIcon(sortType)}
                  {getSortLabel(sortType)}
                </motion.button>
              ))}
            </div>

            {/* View Mode Toggle - Responsive */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-cineRed text-white'
                    : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-cineRed text-white'
                    : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Loading State - Responsive */}
          {loading && (
            <div className="flex justify-center items-center py-12 sm:py-16 lg:py-20">
              <LoadingSpinner text="Cargando contenido..." />
            </div>
          )}

          {/* Content - Responsive */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.1, 
                        duration: 0.5,
                        type: 'spring',
                        stiffness: 100
                      }}
                    >
                      <MovieCard
                        id={item.id}
                        title={item.title || item.name || ''}
                        posterPath={item.poster_path}
                        overview={item.overview}
                        rating={item.vote_average}
                        year={item.release_date 
                          ? new Date(item.release_date).getFullYear()
                          : item.first_air_date 
                          ? new Date(item.first_air_date).getFullYear()
                          : null
                        }
                        mediaType={type as 'movie' | 'tv'}
                        release_date={item.release_date}
                        first_air_date={item.first_air_date}
                        runtime={type === 'movies' ? item.runtime : item.episode_run_time?.[0]}
                        genres={item.genres?.map(genre => genre.name) || []}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: index * 0.1, 
                        duration: 0.5 
                      }}
                      className="flex gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-cineRed/30 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-20 h-30 sm:w-24 sm:h-36">
                        <img
                          src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                          alt={item.title || item.name || ''}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 truncate">
                          {item.title || item.name}
                        </h3>
                        <p className="text-gray-300 text-sm sm:text-base line-clamp-3 mb-3">
                          {item.overview}
                        </p>
                        <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-400">
                          {item.vote_average > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                              <span>{item.vote_average.toFixed(1)}</span>
                            </div>
                          )}
                          {(item.release_date || item.first_air_date) && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>
                                {item.release_date 
                                  ? new Date(item.release_date).getFullYear()
                                  : item.first_air_date 
                                  ? new Date(item.first_air_date).getFullYear()
                                  : ''
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Empty State - Responsive */}
              {items.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-12 sm:py-16 lg:py-20"
                >
                  <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎬</div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    No se encontraron títulos
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base">
                    No hay {type === 'movies' ? 'películas' : 'series'} disponibles en esta categoría.
                  </p>
                </motion.div>
              )}

              {/* Pagination - Responsive */}
              {totalPages > 1 && (
                <div className="mt-8 sm:mt-12">
                  <Pagination
                    page={currentPage}
                    total={totalPages}
                    onPrev={() => handlePageChange(currentPage - 1)}
                    onNext={() => handlePageChange(currentPage + 1)}
                  />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  )
} 