'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Play, 
  Info, 
  Heart, 
  Share2, 
  Star, 
  Calendar, 
  Clock, 
  Users, 
  Volume2, 
  VolumeX,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Award,
  Eye,
  ArrowRight,
  Film,
  Globe,
  Tag,
  BarChart3,
  Database
} from 'lucide-react'
import { useFavorites } from '../contexts/FavoritesContext'
import { useNotifications } from '../contexts/NotificationContext'
import { useTMDBIntegration } from '../hooks/useTMDBIntegration'

interface Recommendation {
  id: number
  title: string
  poster_path: string
  vote_average: number
  media_type: 'movie' | 'tv'
}

interface HeroBannerProps {
  backdropPath: string
  posterPath: string
  title: string
  overview: string
  rating?: number
  releaseDate?: string
  runtime?: number
  genres?: string[]
  cast?: Array<{ id: number; name: string; character: string; profile_path?: string }>
  trailerKey?: string
  mediaType?: 'movie' | 'tv'
  id: number
  budget?: number
  revenue?: number
  productionCompanies?: Array<{ id: number; name: string; logo_path?: string }>
  voteCount?: number
  popularity?: number
}

export default function HeroBanner({ 
  backdropPath, 
  posterPath, 
  title, 
  overview, 
  rating, 
  releaseDate,
  runtime,
  genres = [],
  cast = [],
  trailerKey,
  mediaType = 'movie',
  id,
  budget,
  revenue,
  productionCompanies = [],
  voteCount,
  popularity
}: HeroBannerProps) {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showTrailer, setShowTrailer] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const [showProductionDetails, setShowProductionDetails] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<{ id: number; name: string; logo_path?: string } | null>(null)
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const [recommendationTrailerKey, setRecommendationTrailerKey] = useState<string | null>(null)
  const [showRecommendationTrailer, setShowRecommendationTrailer] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const recommendationsRef = useRef<HTMLDivElement>(null)
  
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { showNotification } = useNotifications()
  const { importedContent } = useTMDBIntegration()

  const bgUrl = `https://image.tmdb.org/t/p/original${backdropPath}`
  const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`

  // Auto-advance slides
  useEffect(() => {
    if (cast.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(cast.length, 5))
      }, 3000)
      return () => clearInterval(interval)
    }
    return undefined
  }, [cast.length])

  // Fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoadingRecommendations(true)
        const response = await fetch(`/api/${mediaType}/${id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.recommendations?.results) {
            setRecommendations(data.recommendations.results.slice(0, 10).map((item: any) => ({
              id: item.id,
              title: item.title || item.name,
              poster_path: item.poster_path,
              vote_average: item.vote_average,
              media_type: mediaType
            })))
          }
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error)
      } finally {
        setLoadingRecommendations(false)
      }
    }

    fetchRecommendations()
  }, [id, mediaType])

  const handlePlayTrailer = () => {
    if (trailerKey) {
      setShowTrailer(true)
    } else {
      showNotification({
        type: 'info',
        title: 'Trailer no disponible',
        message: 'No hay trailer disponible para este contenido'
      })
    }
  }

  const handleFavorite = () => {
    const favoriteItem = {
      id,
      title,
      poster_path: posterPath,
      overview,
      vote_average: rating || 0,
      media_type: mediaType,
      release_date: releaseDate,
      first_air_date: releaseDate
    }

    if (isFavorite(id, mediaType)) {
      removeFromFavorites(id, mediaType)
    } else {
      addToFavorites(favoriteItem)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: overview,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        showNotification({
          type: 'success',
          title: 'Enlace copiado',
          message: 'El enlace se ha copiado al portapapeles'
        })
      }
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error al compartir',
        message: 'No se pudo compartir el contenido'
      })
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatRuntime = (minutes?: number) => {
    if (!minutes) return ''
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return ''
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num?: number) => {
    if (!num) return ''
    return new Intl.NumberFormat('es-ES').format(num)
  }

  const scrollRecommendations = (direction: 'left' | 'right') => {
    if (recommendationsRef.current) {
      const scrollAmount = 300
      const currentScroll = recommendationsRef.current.scrollLeft
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount
      
      recommendationsRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      })
    }
  }

  const handleMoreInfo = () => {
    setShowMoreInfo(true)
  }

  const handleRecommendationClick = (item: Recommendation) => {
    // Navegar a la página de la película/serie recomendada
    const route = item.media_type === 'movie' ? '/movie' : '/tv'
    router.push(`${route}/${item.id}`)
  }

  const handleCastClick = (personId: number) => {
    // Navegar a la página de la persona
    router.push(`/person/${personId}`)
  }

  const handleRecommendationTrailer = async (e: React.MouseEvent, item: Recommendation) => {
    e.stopPropagation() // Evitar que se active la navegación
    
    try {
      // Obtener los videos de la película/serie recomendada
      const response = await fetch(`/api/${item.media_type}/${item.id}`)
      
      if (response.ok) {
        const data = await response.json()
        
        // Buscar el trailer en los videos disponibles
        const trailer = data.videos?.results?.find(
          (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
        )
        
        if (trailer) {
          // Mostrar el trailer en un modal
          setRecommendationTrailerKey(trailer.key)
          setShowRecommendationTrailer(true)
        } else {
          showNotification({
            type: 'info',
            title: 'Trailer no disponible',
            message: `No hay trailer disponible para ${item.title}`,
          })
        }
      } else {
        showNotification({
          type: 'error',
          title: 'Error',
          message: `No se pudo obtener información de ${item.title}`,
        })
      }
    } catch (error) {
      console.error('Error fetching recommendation trailer:', error)
      showNotification({
        type: 'error',
        title: 'Error',
        message: `Error al obtener el trailer de ${item.title}`,
      })
    }
  }

  return (
    <>
      <div 
        ref={containerRef}
        className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] w-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Image/Video */}
        <motion.div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${bgUrl})` }}
          initial={{ scale: 1.2 }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Interactive Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* Content */}
        <motion.div
          className="relative z-10 container mx-auto h-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="max-w-6xl">
            {/* Top Actions - Responsive */}
            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="flex flex-wrap items-center gap-2">
                {rating && (
                  <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-300 text-black text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-lg">
                    <Star className="w-3 h-3 mr-1" />
                    {rating.toFixed(1)}
                  </div>
                )}
                {releaseDate && (
                  <div className="flex items-center bg-white/20 backdrop-blur-sm text-white text-xs px-2 sm:px-3 py-1 rounded-full">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">{formatDate(releaseDate)}</span>
                    <span className="sm:hidden">{new Date(releaseDate).getFullYear()}</span>
                  </div>
                )}
                {runtime && (
                  <div className="flex items-center bg-white/20 backdrop-blur-sm text-white text-xs px-2 sm:px-3 py-1 rounded-full">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatRuntime(runtime)}
                  </div>
                )}
                {voteCount && (
                  <div className="hidden sm:flex items-center bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                    <Eye className="w-3 h-3 mr-1" />
                    {formatNumber(voteCount)} votos
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
                  title="Ver estadísticas"
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
                <button
                  onClick={handleFavorite}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isFavorite(id, mediaType)
                      ? 'bg-cineRed text-white'
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite(id, mediaType) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Statistics Panel - Responsive */}
            <AnimatePresence>
              {showStats && (
                <motion.div
                  className="mb-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {budget && (
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 mr-1" />
                          <span className="text-white text-xs sm:text-sm font-semibold">Presupuesto</span>
                        </div>
                        <p className="text-gray-300 text-xs">{formatCurrency(budget)}</p>
                      </div>
                    )}
                    {revenue && (
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 mr-1" />
                          <span className="text-white text-xs sm:text-sm font-semibold">Recaudación</span>
                        </div>
                        <p className="text-gray-300 text-xs">{formatCurrency(revenue)}</p>
                      </div>
                    )}
                    {popularity && (
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Award className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-1" />
                          <span className="text-white text-xs sm:text-sm font-semibold">Popularidad</span>
                        </div>
                        <p className="text-gray-300 text-xs">{formatNumber(Math.round(popularity))}</p>
                      </div>
                    )}
                    {productionCompanies.length > 0 && (
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 mr-1" />
                          <span className="text-white text-xs sm:text-sm font-semibold">Productoras</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-1 mb-2">
                          {productionCompanies.slice(0, 2).map((company) => (
                            <div 
                              key={company.id} 
                              className="flex items-center cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => setSelectedCompany(company)}
                              title={`Ver detalles de ${company.name}`}
                            >
                              {company.logo_path ? (
                                <img
                                  src={`https://image.tmdb.org/t/p/original${company.logo_path}`}
                                  alt={company.name}
                                  className="h-4 sm:h-6 max-w-12 sm:max-w-16 object-contain"
                                  title={company.name}
                                />
                              ) : (
                                <span className="text-gray-300 text-xs px-1 py-0.5 bg-white/10 rounded hover:bg-white/20 transition-colors">
                                  {company.name}
                                </span>
                              )}
                            </div>
                          ))}
                          {productionCompanies.length > 2 && (
                            <span className="text-gray-300 text-xs px-1 py-0.5 bg-white/10 rounded">
                              +{productionCompanies.length - 2}
                            </span>
                          )}
                        </div>
                        {productionCompanies.length > 1 && (
                          <button
                            onClick={() => setShowProductionDetails(!showProductionDetails)}
                            className="text-purple-300 text-xs hover:text-purple-200 transition-colors"
                          >
                            {showProductionDetails ? 'Ocultar' : 'Ver todas'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Production Companies Details - Responsive */}
            <AnimatePresence>
              {showProductionDetails && productionCompanies.length > 0 && (
                <motion.div
                  className="mb-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-3">
                    <h4 className="text-white font-semibold text-sm mb-2">Todas las Productoras</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                      {productionCompanies.map((company) => (
                        <div
                          key={company.id}
                          className="flex items-center gap-2 sm:gap-3 p-2 bg-white/5 rounded-lg border border-white/10 hover:border-purple-400/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedCompany(company)}
                        >
                          <div className="flex-shrink-0">
                            {company.logo_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/original${company.logo_path}`}
                                alt={company.name}
                                className="h-6 sm:h-8 w-auto max-w-16 sm:max-w-20 object-contain"
                                title={company.name}
                              />
                            ) : (
                              <div className="h-6 sm:h-8 w-16 sm:w-20 bg-white/10 rounded flex items-center justify-center">
                                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs sm:text-sm font-medium truncate" title={company.name}>
                              {company.name}
                            </p>
                            {company.logo_path && (
                              <p className="text-gray-400 text-xs">Logo disponible</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content - Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-end">
              {/* Left Column - Title and Info */}
              <div className="lg:col-span-2">
                {/* Genres */}
                {genres.length > 0 && (
                  <motion.div
                    className="flex flex-wrap gap-2 mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    {genres.slice(0, 3).map((genre, index) => (
                      <span
                        key={genre}
                        className="text-xs bg-cineRed/80 text-white px-2 py-1 rounded-full"
                        style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                      >
                        {genre}
                      </span>
                    ))}
                  </motion.div>
                )}

                {/* Title - Responsive */}
                <motion.h1 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white drop-shadow-lg mb-3 sm:mb-4 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  {title}
                </motion.h1>
                
                {/* Overview - Responsive */}
                <motion.p 
                  className="max-w-2xl text-sm sm:text-base lg:text-lg text-gray-200 mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  {overview}
                </motion.p>
                
                {/* Action Buttons - Responsive */}
                <motion.div
                  className="flex flex-row gap-3 sm:gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.8 }}
                >
                  <button 
                    onClick={handlePlayTrailer}
                    className="btn-cine w-full sm:w-max flex items-center justify-center sm:justify-start gap-2 group text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Ver Trailer</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <button 
                    onClick={handleMoreInfo}
                    className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 transition-all duration-300 w-full sm:w-max flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base"
                  >
                    <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Más Información</span>
                  </button>
                </motion.div>
              </div>

              {/* Right Column - Cast Carousel - Responsive */}
              {cast.length > 0 && (
                <div className="lg:col-span-1">
                  <motion.div
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-sm">Reparto Principal</h3>
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(cast.length, 5) }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              currentSlide === index ? 'bg-cineRed' : 'bg-white/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentSlide}
                          className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-colors"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          onClick={() => handleCastClick(cast[currentSlide]?.id ?? 0)}
                          title={`Ver perfil de ${cast[currentSlide]?.name}`}
                        >
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                            {cast[currentSlide]?.profile_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w92${cast[currentSlide].profile_path}`}
                                alt={cast[currentSlide].name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-xs sm:text-sm truncate">
                              {cast[currentSlide]?.name}
                            </p>
                            <p className="text-gray-300 text-xs truncate">
                              {cast[currentSlide]?.character}
                            </p>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                      
                      {/* Navigation Arrows - Responsive */}
                      <button
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + Math.min(cast.length, 5)) % Math.min(cast.length, 5))}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % Math.min(cast.length, 5))}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recommendations Section - Responsive */}
      {recommendations.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-700/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-white font-semibold text-base sm:text-lg">Contenido Similar</h3>
              <div className="flex gap-1 sm:gap-2">
                <button
                  onClick={() => scrollRecommendations('left')}
                  className="p-1 sm:p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => scrollRecommendations('right')}
                  className="p-1 sm:p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
                >
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
            
            <div 
              ref={recommendationsRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {recommendations.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex-shrink-0 w-24 sm:w-32 md:w-40 bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 hover:border-cineRed/50 transition-all duration-300 cursor-pointer group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRecommendationClick(item)}
                >
                  <div className="relative">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                      alt={item.title}
                      className="w-full h-36 sm:h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button 
                        className="p-1 sm:p-2 rounded-full bg-cineRed text-white hover:bg-red-700 transition-colors"
                        onClick={(e) => handleRecommendationTrailer(e, item)}
                        title={`Ver trailer de ${item.title}`}
                      >
                        <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                    {item.vote_average > 0 && (
                      <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded flex items-center gap-1">
                        <Star className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400" />
                        {item.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <h4 className="text-white text-xs font-medium truncate" title={item.title}>{item.title}</h4>
                    <p className="text-gray-400 text-xs mt-1">
                      {item.media_type === 'movie' ? 'Película' : 'Serie'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Imported Content Section - Responsive */}
      {importedContent.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-600/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <h3 className="text-white font-semibold text-base sm:text-lg">Contenido Importado de TMDB</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs sm:text-sm bg-blue-900/30 px-2 py-1 rounded-full border border-blue-500/30">
                  {importedContent.length} elementos
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {importedContent.map((item) => (
                <motion.div
                  key={item.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const route = 'title' in item ? '/movie' : '/tv'
                    router.push(`${route}/${item.id}`)
                  }}
                >
                  <div className="relative">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                      alt={'title' in item ? item.title : item.name}
                      className="w-full h-32 sm:h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                        Importado
                      </div>
                    </div>
                    {item.vote_average > 0 && (
                      <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded flex items-center gap-1">
                        <Star className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400" />
                        {item.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <h4 className="text-white text-xs font-medium truncate" title={'title' in item ? item.title : item.name}>
                      {'title' in item ? item.title : item.name}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1">
                      {'title' in item ? 'Película' : 'Serie'}
                    </p>
                    <p className="text-blue-400 text-xs mt-1">
                      {new Date('release_date' in item ? item.release_date : item.first_air_date).getFullYear()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trailer Modal - Responsive */}
      <AnimatePresence>
        {showTrailer && trailerKey && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&controls=1&rel=0`}
                title={`Trailer de ${title}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1 sm:p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommendation Trailer Modal - Responsive */}
      <AnimatePresence>
        {showRecommendationTrailer && recommendationTrailerKey && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowRecommendationTrailer(false)
              setRecommendationTrailerKey(null)
            }}
          >
            <motion.div
              className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${recommendationTrailerKey}?autoplay=1&mute=0&controls=1&rel=0`}
                title="Trailer de recomendación"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => {
                  setShowRecommendationTrailer(false)
                  setRecommendationTrailerKey(null)
                }}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1 sm:p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Production Company Modal - Responsive */}
      <AnimatePresence>
        {selectedCompany && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCompany(null)}
          >
            <motion.div
              className="relative w-full max-w-sm sm:max-w-md bg-gray-900/95 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg">Productora</h3>
                  <button
                    onClick={() => setSelectedCompany(null)}
                    className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-center mb-6">
                  {selectedCompany.logo_path ? (
                    <div className="mb-4">
                      <img
                        src={`https://image.tmdb.org/t/p/original${selectedCompany.logo_path}`}
                        alt={selectedCompany.name}
                        className="mx-auto h-16 sm:h-24 w-auto max-w-32 sm:max-w-48 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="mb-4 h-16 sm:h-24 w-32 sm:w-48 mx-auto bg-white/10 rounded-lg flex items-center justify-center">
                      <Users className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                    </div>
                  )}
                  
                  <h4 className="text-white font-semibold text-lg sm:text-xl mb-2">{selectedCompany.name}</h4>
                  
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>ID de la productora: {selectedCompany.id}</p>
                    {selectedCompany.logo_path ? (
                      <p className="text-green-400">✓ Logo oficial disponible</p>
                    ) : (
                      <p className="text-yellow-400">⚠ Sin logo oficial</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={() => setSelectedCompany(null)}
                    className="px-4 sm:px-6 py-2 bg-cineRed text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* More Info Modal - Responsive */}
      <AnimatePresence>
        {showMoreInfo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMoreInfo(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900/95 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-cineRed/20">
                    <Info className="w-5 h-5 text-cineRed" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg sm:text-xl">Información Detallada</h3>
                    <p className="text-gray-400 text-sm">{mediaType === 'movie' ? 'Película' : 'Serie de TV'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMoreInfo(false)}
                  className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="p-4 sm:p-6">
                  {/* Hero Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Poster */}
                    <div className="lg:col-span-1">
                      <div className="relative group">
                        <img
                          src={posterUrl}
                          alt={title}
                          className="w-full rounded-lg shadow-2xl"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                          <button 
                            onClick={handlePlayTrailer}
                            className="p-3 rounded-full bg-cineRed text-white hover:bg-red-700 transition-colors"
                          >
                            <Play className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="lg:col-span-2">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{title}</h2>
                      
                      {/* Rating and Stats */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        {rating && (
                          <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-300 text-black px-3 py-1 rounded-full font-bold">
                            <Star className="w-4 h-4 mr-1" />
                            {rating.toFixed(1)}
                          </div>
                        )}
                        {voteCount && (
                          <div className="flex items-center bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                            <Eye className="w-4 h-4 mr-1" />
                            {formatNumber(voteCount)} votos
                          </div>
                        )}
                        {popularity && (
                          <div className="flex items-center bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {formatNumber(Math.round(popularity))}
                          </div>
                        )}
                      </div>

                      {/* Overview */}
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                          <Film className="w-4 h-4" />
                          Sinopsis
                        </h4>
                        <p className="text-gray-300 leading-relaxed">{overview}</p>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {releaseDate && (
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-4 h-4 text-blue-400" />
                              <span className="text-white text-sm font-medium">Fecha</span>
                            </div>
                            <p className="text-gray-300 text-sm">{formatDate(releaseDate)}</p>
                          </div>
                        )}
                        {runtime && (
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-green-400" />
                              <span className="text-white text-sm font-medium">Duración</span>
                            </div>
                            <p className="text-gray-300 text-sm">{formatRuntime(runtime)}</p>
                          </div>
                        )}
                        {budget && (
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <DollarSign className="w-4 h-4 text-green-400" />
                              <span className="text-white text-sm font-medium">Presupuesto</span>
                            </div>
                            <p className="text-gray-300 text-sm">{formatCurrency(budget)}</p>
                          </div>
                        )}
                        {revenue && (
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <BarChart3 className="w-4 h-4 text-blue-400" />
                              <span className="text-white text-sm font-medium">Recaudación</span>
                            </div>
                            <p className="text-gray-300 text-sm">{formatCurrency(revenue)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Genres */}
                  {genres.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Géneros
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {genres.map((genre) => (
                          <span
                            key={genre}
                            className="px-3 py-1 bg-cineRed/20 text-cineRed rounded-full text-sm font-medium border border-cineRed/30"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cast */}
                  {cast.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Reparto Principal
                      </h4>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {cast.slice(0, 6).map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-cineRed/50 transition-colors cursor-pointer"
                            onClick={() => handleCastClick(member.id)}
                            title={`Ver perfil de ${member.name}`}
                          >
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                              {member.profile_path ? (
                                <img
                                  src={`https://image.tmdb.org/t/p/w92${member.profile_path}`}
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Users className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm truncate">{member.name}</p>
                              <p className="text-gray-300 text-xs truncate">{member.character}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Production Companies */}
                  {productionCompanies.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Productoras
                      </h4>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {productionCompanies.map((company) => (
                          <div
                            key={company.id}
                            className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-purple-400/50 transition-colors cursor-pointer"
                            onClick={() => setSelectedCompany(company)}
                          >
                            <div className="flex-shrink-0">
                              {company.logo_path ? (
                                <img
                                  src={`https://image.tmdb.org/t/p/original${company.logo_path}`}
                                  alt={company.name}
                                  className="h-8 w-auto max-w-20 object-contain"
                                  title={company.name}
                                />
                              ) : (
                                <div className="h-8 w-20 bg-white/10 rounded flex items-center justify-center">
                                  <Users className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm truncate" title={company.name}>
                                {company.name}
                              </p>
                              {company.logo_path && (
                                <p className="text-green-400 text-xs">Logo disponible</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-white/20">
                    <button 
                      onClick={handlePlayTrailer}
                      className="btn-cine flex items-center justify-center gap-2 px-6 py-3"
                    >
                      <Play className="w-5 h-5" />
                      Ver Trailer
                    </button>
                    <button
                      onClick={handleFavorite}
                      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                        isFavorite(id, mediaType)
                          ? 'bg-cineRed text-white'
                          : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite(id, mediaType) ? 'fill-current' : ''}`} />
                      {isFavorite(id, mediaType) ? 'En Favoritos' : 'Agregar a Favoritos'}
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
                    >
                      <Share2 className="w-5 h-5" />
                      Compartir
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
