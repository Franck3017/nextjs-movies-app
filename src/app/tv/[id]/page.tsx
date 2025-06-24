'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Play, 
  Heart, 
  Star, 
  Calendar, 
  Clock, 
  Users, 
  Film,
  Tv,
  ExternalLink,
  Share2,
  Download,
  Bookmark
} from 'lucide-react'
import Layout from '../../../components/Layout'
import LoadingSpinner from '../../../components/LoadingSpinner'
import ApiKeyError from '../../../components/ApiKeyError'
import VideoModal from '../../../components/VideoModal'
import { useNotifications } from '../../../contexts/NotificationContext'
import { useFavorites } from '../../../contexts/FavoritesContext'

interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string
  backdrop_path: string
  vote_average: number
  vote_count: number
  first_air_date: string
  last_air_date: string
  number_of_seasons: number
  number_of_episodes: number
  status: string
  type: string
  genres: Array<{ id: number; name: string }>
  production_companies: Array<{ id: number; name: string; logo_path?: string }>
  networks: Array<{ id: number; name: string; logo_path?: string }>
  created_by: Array<{ id: number; name: string; profile_path?: string }>
  seasons: Array<{
    id: number
    name: string
    overview: string
    poster_path: string
    season_number: number
    episode_count: number
    air_date: string
  }>
  similar: {
    results: Array<{
      id: number
      name: string
      poster_path: string
      vote_average: number
      first_air_date: string
    }>
  }
  recommendations: {
    results: Array<{
      id: number
      name: string
      poster_path: string
      vote_average: number
      first_air_date: string
    }>
  }
  videos: {
    results: Array<{
      id: string
      key: string
      name: string
      site: string
      type: string
    }>
  }
  credits: {
    cast: Array<{
      id: number
      name: string
      character: string
      profile_path: string
      order: number
    }>
    crew: Array<{
      id: number
      name: string
      job: string
      department: string
      profile_path: string
    }>
  }
}

export default function TVShowPage() {
  const params = useParams()
  const router = useRouter()
  const { showNotification } = useNotifications()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [tvShow, setTvShow] = useState<TVShow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'cast' | 'seasons' | 'similar'>('overview')
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [trailerKey, setTrailerKey] = useState<string | undefined>(undefined)

  const tvShowId = params.id as string

  useEffect(() => {
    const fetchTVShow = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/tv/${tvShowId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch TV show details')
        }

        const data = await response.json()
        setTvShow(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching TV show')
        console.error('Error fetching TV show:', err)
      } finally {
        setLoading(false)
      }
    }

    if (tvShowId) {
      fetchTVShow()
    }
  }, [tvShowId])

  const handleBackClick = () => {
    router.back()
  }

  const handlePlayClick = async () => {
    try {
      // Find trailer in videos
      const trailer = tvShow?.videos?.results?.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      )

      if (trailer) {
        setTrailerKey(trailer.key)
        setIsVideoModalOpen(true)
      } else {
        showNotification({
          type: 'info',
          title: 'Trailer no disponible',
          message: 'No hay trailers disponibles para esta serie'
        })
      }
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo cargar el trailer'
      })
    }
  }

  const closeVideoModal = () => {
    setIsVideoModalOpen(false)
    setTrailerKey(undefined)
  }

  const handleFavoriteClick = () => {
    if (!tvShow) return

    const favoriteItem = {
      id: tvShow.id,
      title: tvShow.name,
      poster_path: tvShow.poster_path,
      overview: tvShow.overview,
      vote_average: tvShow.vote_average,
      media_type: 'tv' as const,
      release_date: tvShow.first_air_date,
      first_air_date: tvShow.first_air_date
    }

    if (isFavorite(tvShow.id, 'tv')) {
      removeFromFavorites(tvShow.id, 'tv')
    } else {
      addToFavorites(favoriteItem)
    }
  }

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: tvShow?.name || 'Serie de TV',
        text: tvShow?.overview || '',
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showNotification({
        type: 'success',
        title: 'Enlace copiado',
        message: 'El enlace se ha copiado al portapapeles'
      })
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-cineRed mb-4">Error al cargar la serie</h1>
            <p className="text-gray-400 mb-4">{error}</p>
            <button onClick={handleBackClick} className="btn-cine">
              Volver
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  if (!tvShow) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-cineRed mb-4">Serie no encontrada</h1>
            <button onClick={handleBackClick} className="btn-cine">
              Volver
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const backdropUrl = `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`
  const posterUrl = `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
  const year = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : null

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[70vh] lg:h-[80vh] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${backdropUrl})` }}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Back Button */}
          <motion.button
            onClick={handleBackClick}
            className="absolute top-4 left-4 z-20 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </motion.button>

          {/* Content */}
          <div className="relative z-10 container mx-auto h-full flex items-end px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
              {/* Poster */}
              <motion.div
                className="flex-shrink-0"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <img
                  src={posterUrl}
                  alt={tvShow.name}
                  className="w-48 h-72 lg:w-64 lg:h-96 rounded-xl shadow-2xl"
                />
              </motion.div>

              {/* Info */}
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  {/* Title and Badges */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/90 text-white rounded-full text-sm font-semibold">
                      <Tv className="w-4 h-4" />
                      Serie
                    </span>
                    {year && (
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold">
                        {year}
                      </span>
                    )}
                    {tvShow.status && (
                      <span className="px-3 py-1 bg-green-600/90 text-white rounded-full text-sm font-semibold">
                        {tvShow.status}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    {tvShow.name}
                  </h1>

                  {/* Rating */}
                  {tvShow.vote_average > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1 bg-yellow-400/90 text-black px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold">{tvShow.vote_average.toFixed(1)}</span>
                      </div>
                      <span className="text-gray-300 text-sm">
                        ({tvShow.vote_count.toLocaleString()} votos)
                      </span>
                    </div>
                  )}

                  {/* Overview */}
                  <p className="text-gray-200 text-lg mb-6 max-w-3xl leading-relaxed">
                    {tvShow.overview || 'Sin descripción disponible.'}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-300">
                    {tvShow.number_of_seasons > 0 && (
                      <div className="flex items-center gap-2">
                        <Film className="w-4 h-4" />
                        <span>{tvShow.number_of_seasons} temporada{tvShow.number_of_seasons !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {tvShow.number_of_episodes > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{tvShow.number_of_episodes} episodios</span>
                      </div>
                    )}
                    {tvShow.first_air_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(tvShow.first_air_date).toLocaleDateString('es-ES')}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      onClick={handlePlayClick}
                      className="btn-cine flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-5 h-5" />
                      Ver Ahora
                    </motion.button>
                    
                    <motion.button
                      onClick={handleFavoriteClick}
                      className={`px-6 py-3 backdrop-blur-sm rounded-full transition-all duration-300 flex items-center gap-2 border font-semibold ${
                        isFavorite(tvShow.id, 'tv')
                          ? 'bg-cineRed/90 text-white border-cineRed/60 hover:bg-cineRed'
                          : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        animate={{ 
                          scale: isFavorite(tvShow.id, 'tv') ? 1.2 : 1,
                          rotate: isFavorite(tvShow.id, 'tv') ? 10 : 0
                        }}
                        transition={{ duration: 0.5, type: 'spring' }}
                      >
                        <Heart 
                          className={`w-5 h-5 ${
                            isFavorite(tvShow.id, 'tv') 
                              ? 'fill-white text-white' 
                              : 'text-white'
                          }`} 
                        />
                      </motion.div>
                      {isFavorite(tvShow.id, 'tv') ? 'En Favoritos' : 'Favoritos'}
                    </motion.button>
                    
                    <motion.button
                      onClick={handleShareClick}
                      className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Share2 className="w-5 h-5" />
                      Compartir
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-full p-2 border border-gray-700/50">
              {(['overview', 'cast', 'seasons', 'similar'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-cineRed text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {tab === 'overview' && 'Resumen'}
                  {tab === 'cast' && 'Reparto'}
                  {tab === 'seasons' && 'Temporadas'}
                  {tab === 'similar' && 'Similares'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h2 className="text-2xl font-bold text-white mb-4">Información General</h2>
                  
                  {/* Genres */}
                  {tvShow.genres && tvShow.genres.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Géneros</h3>
                      <div className="flex flex-wrap gap-2">
                        {tvShow.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="px-3 py-1 bg-cineRed/20 text-cineRed rounded-full text-sm border border-cineRed/30"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Production Companies */}
                  {tvShow.production_companies && tvShow.production_companies.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Productoras</h3>
                      <div className="flex flex-wrap gap-2">
                        {tvShow.production_companies.map((company) => (
                          <span
                            key={company.id}
                            className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm"
                          >
                            {company.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Networks */}
                  {tvShow.networks && tvShow.networks.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Cadenas</h3>
                      <div className="flex flex-wrap gap-2">
                        {tvShow.networks.map((network) => (
                          <span
                            key={network.id}
                            className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm border border-blue-600/30"
                          >
                            {network.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Created By */}
                  {tvShow.created_by && tvShow.created_by.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Creada por</h3>
                      <div className="flex flex-wrap gap-2">
                        {tvShow.created_by.map((creator) => (
                          <span
                            key={creator.id}
                            className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm border border-purple-600/30"
                          >
                            {creator.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'cast' && (
              <motion.div
                key="cast"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h2 className="text-2xl font-bold text-white mb-6">Reparto Principal</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tvShow.credits?.cast?.slice(0, 9).map((actor) => (
                      <div
                        key={actor.id}
                        className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w45${actor.profile_path}`}
                          alt={actor.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-white font-semibold">{actor.name}</h4>
                          <p className="text-gray-400 text-sm">{actor.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'seasons' && (
              <motion.div
                key="seasons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h2 className="text-2xl font-bold text-white mb-6">Temporadas</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tvShow.seasons?.map((season) => (
                      <div
                        key={season.id}
                        className="bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-700/50 transition-colors"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
                          alt={season.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="text-white font-semibold mb-2">{season.name}</h4>
                          <p className="text-gray-400 text-sm mb-2">
                            {season.episode_count} episodios
                          </p>
                          {season.air_date && (
                            <p className="text-gray-500 text-xs">
                              {new Date(season.air_date).toLocaleDateString('es-ES')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'similar' && (
              <motion.div
                key="similar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h2 className="text-2xl font-bold text-white mb-6">Series Similares</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {tvShow.similar?.results?.slice(0, 10).map((show) => (
                      <div
                        key={show.id}
                        className="bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-700/50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/tv/${show.id}`)}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
                          alt={show.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-3">
                          <h4 className="text-white font-semibold text-sm truncate">{show.name}</h4>
                          {show.vote_average > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-gray-400 text-xs">{show.vote_average.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={closeVideoModal}
        videoKey={trailerKey}
        title={tvShow?.name}
      />
    </Layout>
  )
} 