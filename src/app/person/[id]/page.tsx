'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Star, 
  Film, 
  Tv, 
  Award, 
  Users, 
  Globe,
  ExternalLink,
  Heart,
  Share2
} from 'lucide-react'
import Image from 'next/image'
import Layout from '../../../components/Layout'
import LoadingSpinner from '../../../components/LoadingSpinner'
import MovieCard from '../../../components/MovieCard'
import { useNotifications } from '../../../contexts/NotificationContext'
import { useFavorites } from '../../../contexts/FavoritesContext'

interface Person {
  id: number
  name: string
  biography: string
  birthday: string
  deathday: string | null
  place_of_birth: string
  profile_path: string
  popularity: number
  known_for_department: string
  gender: number
  adult: boolean
  imdb_id: string
  homepage: string
  also_known_as: string[]
  combined_credits: {
    cast: Array<{
      id: number
      title?: string
      name?: string
      poster_path: string
      overview: string
      vote_average: number
      release_date?: string
      first_air_date?: string
      media_type: 'movie' | 'tv'
      character?: string
      job?: string
      department?: string
    }>
    crew: Array<{
      id: number
      title?: string
      name?: string
      poster_path: string
      overview: string
      vote_average: number
      release_date?: string
      first_air_date?: string
      media_type: 'movie' | 'tv'
      job: string
      department: string
    }>
  }
  images: {
    profiles: Array<{
      file_path: string
      aspect_ratio: number
      height: number
      width: number
    }>
  }
  external_ids: {
    imdb_id: string
    facebook_id: string
    instagram_id: string
    twitter_id: string
  }
}

export default function PersonPage() {
  const router = useRouter()
  const { showNotification } = useNotifications()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [person, setPerson] = useState<Person | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'movies' | 'tv' | 'photos'>('overview')

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        setLoading(true)
        const personId = window.location.pathname.split('/')[2]
        
        const response = await fetch(`/api/person/${personId}`)
        if (!response.ok) {
          throw new Error('Error al cargar la información de la persona')
        }
        
        const data = await response.json()
        setPerson(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        showNotification({
          type: 'error',
          title: 'Error',
          message: 'No se pudo cargar la información de la persona'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPerson()
  }, [showNotification])

  const handleBackClick = () => {
    router.back()
  }

  const handleFavoriteClick = () => {
    if (!person) return

    const favoriteItem = {
      id: person.id,
      title: person.name,
      poster_path: person.profile_path,
      overview: person.biography || 'Sin biografía disponible',
      vote_average: person.popularity / 10, // Convertir popularidad a rating
      media_type: 'person' as const,
      release_date: person.birthday,
      first_air_date: person.birthday
    }

    if (isFavorite(person.id, 'person')) {
      removeFromFavorites(person.id, 'person')
    } else {
      addToFavorites(favoriteItem)
    }
  }

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: person?.name || 'Persona',
        text: `Mira la información de ${person?.name}`,
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

  const getAge = (birthday: string, deathday?: string | null) => {
    const birth = new Date(birthday)
    const end = deathday ? new Date(deathday) : new Date()
    const age = end.getFullYear() - birth.getFullYear()
    const monthDiff = end.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      return age - 1
    }
    return age
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Cargando información..." />
        </div>
      </Layout>
    )
  }

  if (error || !person) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-cineRed mb-4">Error al cargar la información</h1>
            <p className="text-gray-400 mb-4">{error || 'No se encontró la información de la persona'}</p>
            <button 
              onClick={handleBackClick} 
              className="btn-cine"
            >
              Volver
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const age = getAge(person.birthday, person.deathday)
  const isDeceased = !!person.deathday

  // Combine cast and crew, remove duplicates, and sort by rating
  const allCredits = [
    ...person.combined_credits.cast.map(item => ({ ...item, creditType: 'cast' as const })),
    ...person.combined_credits.crew.map(item => ({ ...item, creditType: 'crew' as const }))
  ]

  // Remove duplicates based on ID and media_type
  const uniqueCredits = allCredits.filter((item, index, self) => 
    self.findIndex(t => t.id === item.id && t.media_type === item.media_type) === index
  )

  const topMovies = uniqueCredits
    .filter(item => item.media_type === 'movie')
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    .slice(0, 10)
  const topTV = uniqueCredits
    .filter(item => item.media_type === 'tv')
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    .slice(0, 10)

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative">
          {/* Background Image */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90">
            {person.profile_path && (
              <Image
                src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
                alt={person.name}
                fill
                className="object-cover opacity-20"
                priority
              />
            )}
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Profile Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex-shrink-0"
              >
                <div className="relative w-64 h-96 lg:w-80 lg:h-96 mx-auto lg:mx-0">
                  {person.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                      alt={person.name}
                      fill
                      className="object-cover rounded-2xl shadow-2xl"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center">
                      <Users className="w-24 h-24 text-gray-400" />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex-1 space-y-6"
              >
                {/* Header */}
                <div>
                  <motion.button
                    onClick={handleBackClick}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    whileHover={{ x: -5 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Volver
                  </motion.button>

                  <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                    {person.name}
                  </h1>

                  {/* Basic Info */}
                  <div className="flex flex-wrap gap-4 text-gray-300 mb-6">
                    {person.birthday && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(person.birthday)}
                          {!isDeceased && age && ` (${age} años)`}
                          {isDeceased && ` - ${formatDate(person.deathday!)}`}
                        </span>
                      </div>
                    )}
                    {person.place_of_birth && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{person.place_of_birth}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>Popularidad: {person.popularity.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      onClick={handleFavoriteClick}
                      className={`flex items-center gap-2 px-6 py-3 backdrop-blur-sm rounded-full transition-all duration-300 border font-semibold ${
                        isFavorite(person.id, 'person')
                          ? 'bg-cineRed/90 text-white border-cineRed/60 hover:bg-cineRed'
                          : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        animate={{ 
                          scale: isFavorite(person.id, 'person') ? 1.2 : 1,
                          rotate: isFavorite(person.id, 'person') ? 10 : 0
                        }}
                        transition={{ duration: 0.5, type: 'spring' }}
                      >
                        <Heart 
                          className={`w-5 h-5 ${
                            isFavorite(person.id, 'person') 
                              ? 'fill-white text-white' 
                              : 'text-white'
                          }`} 
                        />
                      </motion.div>
                      {isFavorite(person.id, 'person') ? 'En Favoritos' : 'Favorito'}
                    </motion.button>

                    <motion.button
                      onClick={handleShareClick}
                      className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors border border-white/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Share2 className="w-5 h-5" />
                      Compartir
                    </motion.button>

                    {person.homepage && (
                      <motion.a
                        href={person.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600/20 backdrop-blur-sm text-blue-400 rounded-full hover:bg-blue-600/30 transition-colors border border-blue-600/30"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink className="w-5 h-5" />
                        Sitio Web
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-full p-2 border border-gray-700/50">
              {(['overview', 'movies', 'tv', 'photos'] as const).map((tab) => (
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
                  {tab === 'movies' && 'Películas'}
                  {tab === 'tv' && 'Series'}
                  {tab === 'photos' && 'Fotos'}
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
                  <h2 className="text-2xl font-bold text-white mb-4">Biografía</h2>
                  <p className="text-gray-300 leading-relaxed text-lg mb-6">
                    {person.biography || 'No hay biografía disponible.'}
                  </p>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {person.also_known_as.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">También conocido como</h3>
                        <div className="flex flex-wrap gap-2">
                          {person.also_known_as.slice(0, 5).map((name, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Información</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Departamento:</span>
                          <span className="text-white">{person.known_for_department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Género:</span>
                          <span className="text-white">
                            {person.gender === 1 ? 'Femenino' : person.gender === 2 ? 'Masculino' : 'No especificado'}
                          </span>
                        </div>
                        {person.imdb_id && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">IMDb:</span>
                            <a
                              href={`https://www.imdb.com/name/${person.imdb_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300"
                            >
                              Ver perfil
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'movies' && (
              <motion.div
                key="movies"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h2 className="text-2xl font-bold text-white mb-6">Películas Destacadas</h2>
                  {topMovies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {topMovies.map((movie, index) => (
                        <motion.div
                          key={`movie-${movie.id}`}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                          <MovieCard
                            key={`movie-${movie.id}`}
                            id={movie.id}
                            title={movie.title || movie.name || ''}
                            posterPath={movie.poster_path}
                            overview={movie.overview}
                            rating={movie.vote_average}
                            mediaType="movie"
                            year={movie.release_date 
                              ? new Date(movie.release_date).getFullYear()
                              : null
                            }
                            release_date={movie.release_date}
                            first_air_date={movie.first_air_date}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">No hay películas disponibles.</p>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'tv' && (
              <motion.div
                key="tv"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h2 className="text-2xl font-bold text-white mb-6">Series Destacadas</h2>
                  {topTV.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {topTV.map((show, index) => (
                        <motion.div
                          key={`tv-${show.id}`}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                          <MovieCard
                            id={show.id}
                            title={show.title || show.name || ''}
                            posterPath={show.poster_path}
                            overview={show.overview}
                            rating={show.vote_average}
                            mediaType="tv"
                            year={show.first_air_date 
                              ? new Date(show.first_air_date).getFullYear()
                              : null
                            }
                            release_date={show.release_date}
                            first_air_date={show.first_air_date}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">No hay series disponibles.</p>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'photos' && (
              <motion.div
                key="photos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h2 className="text-2xl font-bold text-white mb-6">Galería de Fotos</h2>
                  {person.images.profiles.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {person.images.profiles
                        .filter((image, index, self) => self.findIndex(img => img.file_path === image.file_path) === index)
                        .slice(0, 15)
                        .map((image, index) => (
                        <motion.div
                          key={`photo-${image.file_path}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="relative aspect-[2/3] rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                        >
                          <Image
                            src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                            alt={`${person.name} - Foto ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">No hay fotos disponibles.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  )
} 