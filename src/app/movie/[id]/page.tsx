'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, Heart, Star, Clock, Users, Calendar, Globe } from 'lucide-react'
import Image from 'next/image'
import Layout from '../../../components/Layout'
import LoadingSpinner from '../../../components/LoadingSpinner'
import SEOHead from '../../../components/SEOHead'
import AvatarGroup from '../../../components/AvatarGroup'
import VideoModal from '../../../components/VideoModal'
import MovieCard from '../../../components/MovieCard'
import { useNotifications } from '../../../contexts/NotificationContext'
import { useFavorites } from '../../../contexts/FavoritesContext'

interface MovieDetails {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string
  backdrop_path: string
  vote_average: number
  vote_count: number
  release_date?: string
  first_air_date?: string
  runtime?: number
  episode_run_time?: number[]
  genres: Array<{ id: number; name: string }>
  production_companies: Array<{ name: string; logo_path?: string }>
  spoken_languages: Array<{ name: string; iso_639_1: string }>
  budget?: number
  revenue?: number
  status: string
  tagline?: string
  homepage?: string
  imdb_id?: string
  videos?: {
    results: Array<{
      id: string
      key: string
      name: string
      site: string
      type: string
    }>
  }
}

interface Credits {
  cast: Array<{
    id: number
    name: string
    character: string
    profile_path?: string
    order: number
  }>
  crew: Array<{
    id: number
    name: string
    job: string
    department: string
    profile_path?: string
  }>
}

interface SimilarMovie {
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

export default function MoviePage() {
  const params = useParams()
  const router = useRouter()
  const { showNotification } = useNotifications()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [credits, setCredits] = useState<Credits | null>(null)
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie')
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [trailerKey, setTrailerKey] = useState<string | undefined>(undefined)
  
  const movieId = params?.id as string

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) return

      try {
        setLoading(true)
        setError(null)

        // First, try to fetch as movie
        const movieResponse = await fetch(`/api/movie/${movieId}`)
        let movieData: MovieDetails
        let currentMediaType: 'movie' | 'tv' = 'movie'

        if (movieResponse.ok) {
          movieData = await movieResponse.json()
          currentMediaType = 'movie'
        } else {
          // If not a movie, try as TV show
          const tvResponse = await fetch(`/api/tv/${movieId}`)
          if (tvResponse.ok) {
            movieData = await tvResponse.json()
            currentMediaType = 'tv'
          } else {
            throw new Error('No se pudo encontrar la película o serie')
          }
        }

        setMovie(movieData)
        setMediaType(currentMediaType)

        // Fetch credits using the correct media type
        const creditsResponse = await fetch(`/api/${currentMediaType}/${movieId}/credits`)
        if (creditsResponse.ok) {
          const creditsData = await creditsResponse.json()
          setCredits(creditsData)
        }

        // Fetch similar movies
        const similarResponse = await fetch(`/api/${currentMediaType}/${movieId}/similar`)
        if (similarResponse.ok) {
          const similarData = await similarResponse.json()
          setSimilarMovies(similarData.results?.slice(0, 10) || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [movieId])

  const handlePlayClick = async () => {
    try {
      // Find trailer in videos
      const trailer = movie?.videos?.results?.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      )

      if (trailer) {
        setTrailerKey(trailer.key)
        setIsVideoModalOpen(true)
      } else {
        showNotification({
          type: 'info',
          title: 'Trailer no disponible',
          message: 'No hay trailers disponibles para esta película'
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
    if (!movie) return

    const favoriteItem = {
      id: movie.id,
      title: movie.title || movie.name || 'Sin título',
      poster_path: movie.poster_path,
      overview: movie.overview,
      vote_average: movie.vote_average,
      media_type: mediaType,
      release_date: movie.release_date,
      first_air_date: movie.first_air_date
    }

    if (isFavorite(movie.id, mediaType)) {
      removeFromFavorites(movie.id, mediaType)
    } else {
      addToFavorites(favoriteItem)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Cargando detalles..." />
        </div>
      </Layout>
    )
  }

  if (error || !movie) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error al cargar la película</h2>
            <p className="text-gray-400 mb-6">{error || 'No se pudo cargar la información de la película.'}</p>
            <button 
              onClick={() => router.back()}
              className="px-6 py-3 bg-cineRed text-white rounded-full hover:bg-red-700 transition-colors"
            >
              Volver atrás
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const title = movie.title || movie.name || 'Sin título'
  const releaseDate = movie.release_date || movie.first_air_date
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null
  const runtime = movie.runtime || (movie.episode_run_time && movie.episode_run_time[0]) || 0

  // Filter crew to get directors and other key roles
  const directors = credits?.crew.filter(person => person.job === 'Director') || []
  const producers = credits?.crew.filter(person => person.job === 'Producer') || []
  const writers = credits?.crew.filter(person => person.job === 'Writer' || person.job === 'Screenplay') || []

  return (
    <>
      <SEOHead 
        title={`${title} (${year})`}
        description={movie.overview}
        keywords={movie.genres.map(g => g.name)}
        image={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
        url={`https://cineapp.com/movie/${movieId}`}
        type="article"
      />
      
      <Layout>
        <div className="min-h-screen">
          {/* Backdrop Image */}
          <div className="relative h-96 sm:h-[500px] lg:h-[600px] overflow-hidden">
            <Image
              src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            {/* Back Button */}
            <motion.button
              onClick={() => router.back()}
              className="absolute top-4 left-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
              <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-end">
                  {/* Poster */}
                  <motion.div
                    className="flex-shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="relative w-48 h-72 sm:w-56 sm:h-84 lg:w-64 lg:h-96 rounded-lg overflow-hidden shadow-2xl">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </motion.div>

                  {/* Movie Info */}
                  <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="space-y-4">
                      {/* Title and Year */}
                      <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                          {title}
                        </h1>
                        {year && (
                          <p className="text-xl text-gray-300">({year})</p>
                        )}
                      </div>

                      {/* Tagline */}
                      {movie.tagline && (
                        <p className="text-lg text-gray-400 italic">&ldquo;{movie.tagline}&rdquo;</p>
                      )}

                      {/* Rating and Stats */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-yellow-500 font-semibold">{movie.vote_average.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-300">
                          <Users className="w-4 h-4" />
                          <span>{movie.vote_count.toLocaleString()} votos</span>
                        </div>
                        {runtime > 0 && (
                          <div className="flex items-center gap-1 text-gray-300">
                            <Clock className="w-4 h-4" />
                            <span>{runtime} min</span>
                          </div>
                        )}
                        {releaseDate && (
                          <div className="flex items-center gap-1 text-gray-300">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(releaseDate).toLocaleDateString('es-ES')}</span>
                          </div>
                        )}
                      </div>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-2">
                        {movie.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="px-3 py-1 bg-cineRed/20 text-cineRed rounded-full text-sm border border-cineRed/30"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <motion.button
                          onClick={handlePlayClick}
                          className="flex items-center gap-2 px-6 py-3 bg-cineRed text-white rounded-full hover:bg-red-700 transition-colors font-semibold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play className="w-5 h-5" />
                          Reproducir
                        </motion.button>
                        <motion.button
                          onClick={handleFavoriteClick}
                          className={`flex items-center gap-2 px-6 py-3 backdrop-blur-sm rounded-full transition-all duration-300 border font-semibold ${
                            isFavorite(movie.id, mediaType)
                              ? 'bg-cineRed/90 text-white border-cineRed/60 hover:bg-cineRed'
                              : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            animate={{ 
                              scale: isFavorite(movie.id, mediaType) ? 1.2 : 1,
                              rotate: isFavorite(movie.id, mediaType) ? 10 : 0
                            }}
                            transition={{ duration: 0.5, type: 'spring' }}
                          >
                            <Heart 
                              className={`w-5 h-5 ${
                                isFavorite(movie.id, mediaType) 
                                  ? 'fill-white text-white' 
                                  : 'text-white'
                              }`} 
                            />
                          </motion.div>
                          {isFavorite(movie.id, mediaType) ? 'En Favoritos' : 'Favorito'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-4">Sinopsis</h2>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {movie.overview || 'No hay sinopsis disponible.'}
                  </p>
                </motion.div>

                {/* Cast Section */}
                {credits && credits.cast && credits.cast.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <AvatarGroup
                      people={credits.cast}
                      title="Reparto"
                      type="cast"
                      maxVisible={12}
                    />
                  </motion.div>
                )}

                {/* Directors Section */}
                {directors && directors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <AvatarGroup
                      people={directors}
                      title="Directores"
                      type="crew"
                      maxVisible={8}
                    />
                  </motion.div>
                )}

                {/* Writers Section */}
                {writers && writers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <AvatarGroup
                      people={writers}
                      title="Guionistas"
                      type="crew"
                      maxVisible={8}
                    />
                  </motion.div>
                )}

                {/* Producers Section */}
                {producers && producers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <AvatarGroup
                      people={producers}
                      title="Productores"
                      type="crew"
                      maxVisible={8}
                    />
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Production Companies */}
                {movie.production_companies && movie.production_companies.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">Productoras</h3>
                    <div className="space-y-2">
                      {movie.production_companies.slice(0, 5).map((company, index) => (
                        <p key={index} className="text-gray-300 text-sm">{company.name}</p>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Languages */}
                {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">Idiomas</h3>
                    <div className="space-y-2">
                      {movie.spoken_languages.map((language) => (
                        <div key={language.iso_639_1} className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">{language.name}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Status */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Información</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estado:</span>
                      <span className="text-white">{movie.status}</span>
                    </div>
                    {movie.budget && movie.budget > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Presupuesto:</span>
                        <span className="text-white">${movie.budget.toLocaleString()}</span>
                      </div>
                    )}
                    {movie.revenue && movie.revenue > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ingresos:</span>
                        <span className="text-white">${movie.revenue.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Similar Movies Section */}
          {similarMovies.length > 0 && (
            <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-8 lg:py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  {mediaType === 'movie' ? 'Películas Relacionadas' : 'Series Relacionadas'}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
                  {similarMovies.map((similarMovie, index) => (
                    <motion.div
                      key={similarMovie.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        delay: 0.9 + (index * 0.1), 
                        duration: 0.5,
                        type: 'spring',
                        stiffness: 100
                      }}
                    >
                      <MovieCard
                        id={similarMovie.id}
                        title={similarMovie.title || similarMovie.name || ''}
                        posterPath={similarMovie.poster_path}
                        overview={similarMovie.overview}
                        rating={similarMovie.vote_average}
                        year={similarMovie.release_date 
                          ? new Date(similarMovie.release_date).getFullYear()
                          : similarMovie.first_air_date 
                          ? new Date(similarMovie.first_air_date).getFullYear()
                          : null
                        }
                        mediaType={similarMovie.media_type}
                        release_date={similarMovie.release_date}
                        first_air_date={similarMovie.first_air_date}
                        runtime={similarMovie.media_type === 'movie' ? similarMovie.runtime : similarMovie.episode_run_time?.[0]}
                        genres={similarMovie.genres?.map(genre => genre.name) || []}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </Layout>
      {isVideoModalOpen && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={closeVideoModal}
          videoKey={trailerKey}
          title={movie?.title || movie?.name}
        />
      )}
    </>
  )
} 