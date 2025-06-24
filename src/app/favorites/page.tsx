'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Film, Tv, Trash2, Star, Calendar, Users } from 'lucide-react'
import Layout from '../../components/Layout'
import MovieCard from '../../components/MovieCard'
import { useFavorites } from '../../contexts/FavoritesContext'
import Link from 'next/link'
import Image from 'next/image'

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites()
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'tv' | 'person'>('all')

  const movieFavorites = favorites.filter(fav => fav.media_type === 'movie')
  const tvFavorites = favorites.filter(fav => fav.media_type === 'tv')
  const personFavorites = favorites.filter(fav => fav.media_type === 'person')

  const currentFavorites = activeTab === 'all' 
    ? favorites 
    : activeTab === 'movies' 
    ? movieFavorites 
    : activeTab === 'tv' 
    ? tvFavorites 
    : personFavorites

  const handleClearFavorites = () => {
    if (confirm('¿Estás seguro de que quieres eliminar todos los favoritos?')) {
      clearFavorites()
    }
  }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-cineRed/20 to-red-600/20 backdrop-blur-sm border-b border-cineRed/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2],
                    rotate: [0, 10]
                  }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2, repeatType: "reverse" }}
                >
                  <Heart className="w-12 h-12 text-cineRed fill-cineRed" />
                </motion.div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white">
                  Mis Favoritos
                </h1>
              </div>
              
              <p className="text-gray-300 text-lg mb-6">
                {favorites.length === 0 
                  ? 'No tienes favoritos aún. ¡Explora y agrega tus películas y series favoritas!'
                  : `Tienes ${favorites.length} favorito${favorites.length !== 1 ? 's' : ''} guardado${favorites.length !== 1 ? 's' : ''}`
                }
              </p>

              {/* Stats */}
              {favorites.length > 0 && (
                <div className="flex justify-center gap-6 mb-6">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Film className="w-5 h-5 text-cineRed" />
                    <span className="text-white font-semibold">{movieFavorites.length} Películas</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Tv className="w-5 h-5 text-blue-500" />
                    <span className="text-white font-semibold">{tvFavorites.length} Series</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span className="text-white font-semibold">{personFavorites.length} Personas</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          {favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-full p-2 border border-gray-700/50">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    activeTab === 'all'
                      ? 'bg-cineRed text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  Todos ({favorites.length})
                </button>
                <button
                  onClick={() => setActiveTab('movies')}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    activeTab === 'movies'
                      ? 'bg-cineRed text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  Películas ({movieFavorites.length})
                </button>
                <button
                  onClick={() => setActiveTab('tv')}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    activeTab === 'tv'
                      ? 'bg-cineRed text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  Series ({tvFavorites.length})
                </button>
                <button
                  onClick={() => setActiveTab('person')}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    activeTab === 'person'
                      ? 'bg-cineRed text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  Personas ({personFavorites.length})
                </button>
              </div>
            </motion.div>
          )}

          {/* Clear All Button */}
          {favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <motion.button
                onClick={handleClearFavorites}
                className="flex items-center gap-2 px-6 py-3 bg-red-600/20 text-red-400 rounded-full hover:bg-red-600/30 transition-colors border border-red-600/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="w-5 h-5" />
                Eliminar Todos los Favoritos
              </motion.button>
            </motion.div>
          )}

          {/* Favorites Grid */}
          <AnimatePresence mode="wait">
            {currentFavorites.length > 0 ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
              >
                {currentFavorites.map((favorite, index) => (
                  <motion.div
                    key={`${favorite.media_type}-${favorite.id}`}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    layout
                  >
                    {favorite.media_type === 'person' ? (
                      <Link href={`/person/${favorite.id}`}>
                        <div className="relative aspect-[2/3] rounded-xl overflow-hidden group cursor-pointer">
                          <Image
                            src={`https://image.tmdb.org/t/p/w500${favorite.poster_path}`}
                            alt={favorite.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                            <h3 className="font-semibold text-sm">{favorite.title}</h3>
                            <p className="text-xs text-gray-300">Persona</p>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <MovieCard
                        id={favorite.id}
                        title={favorite.title}
                        posterPath={favorite.poster_path}
                        overview={favorite.overview}
                        rating={favorite.vote_average}
                        mediaType={favorite.media_type as 'movie' | 'tv'}
                        year={favorite.release_date 
                          ? new Date(favorite.release_date).getFullYear()
                          : favorite.first_air_date 
                          ? new Date(favorite.first_air_date).getFullYear()
                          : null
                        }
                        release_date={favorite.release_date}
                        first_air_date={favorite.first_air_date}
                        runtime={favorite.runtime}
                        genres={favorite.genres}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : favorites.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-center py-20"
              >
                <div className="text-8xl mb-6">💔</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  No tienes favoritos
                </h2>
                <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                  Explora películas y series, y agrega tus favoritos haciendo clic en el corazón ❤️
                </p>
                <motion.button
                  onClick={() => window.history.back()}
                  className="btn-cine"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explorar Contenido
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🎬</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  No hay {activeTab === 'movies' ? 'películas' : activeTab === 'tv' ? 'series' : 'personas'} en favoritos
                </h2>
                <p className="text-gray-400">
                  Cambia de pestaña para ver otros favoritos
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  )
} 