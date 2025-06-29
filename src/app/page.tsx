'use client'
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import HeroBanner from '../components/HeroBanner'
import CategoryRow from '../components/CategoryRow'
import LoadingSpinner from '../components/LoadingSpinner'
import ApiKeyError from '../components/ApiKeyError'
import { useDynamicCategories } from '../hooks/useDynamicCategories'
import { useFeaturedContent } from '../hooks/useFeaturedContent'
import { motion, AnimatePresence } from 'framer-motion'
import { isApiKeyConfigured } from '../utils'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'movies' | 'tv'>('movies')
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null)
  
  const { 
    categories: movieCategories, 
    loading: moviesLoading, 
    error: moviesError 
  } = useDynamicCategories('movies')
  
  const { 
    categories: tvCategories, 
    loading: tvLoading, 
    error: tvError 
  } = useDynamicCategories('tv')

  const {
    content: featuredContent,
    loading: featuredLoading,
    error: featuredError
  } = useFeaturedContent(activeTab)

  // Verificar si la API key está configurada
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        // Hacer una llamada de prueba a la API para verificar si funciona
        const response = await fetch('/api/test-env')
        if (response.ok) {
          const data = await response.json()
          setApiKeyConfigured(!!data.tmdb)
        } else {
          setApiKeyConfigured(false)
        }
      } catch (error) {
        setApiKeyConfigured(false)
      }
    }

    checkApiKey()
  }, [])

  const isLoading = moviesLoading || tvLoading || featuredLoading
  const hasError = moviesError || tvError || featuredError

  // Mostrar ApiKeyError si la API key no está configurada
  if (apiKeyConfigured === false) {
    return <ApiKeyError />
  }

  // Mostrar loading mientras se verifica la API key
  if (apiKeyConfigured === null) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Verificando configuración..." />
        </div>
      </Layout>
    )
  }

  if (hasError) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-xl sm:text-2xl font-bold text-cineRed mb-3 sm:mb-4">Error al cargar las categorías</h1>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">{hasError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-cine px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
            >
              Reintentar
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Banner */}
        {featuredContent && (
          <HeroBanner
            backdropPath={featuredContent.backdrop_path}
            posterPath={featuredContent.poster_path}
            title={featuredContent.title}
            overview={featuredContent.overview}
            rating={featuredContent.vote_average}
            releaseDate={featuredContent.release_date || featuredContent.first_air_date}
            runtime={featuredContent.runtime}
            genres={featuredContent.genres?.map(genre => genre.name) || []}
            cast={featuredContent.cast || []}
            trailerKey={featuredContent.trailerKey}
            mediaType={featuredContent.media_type}
            id={featuredContent.id}
            budget={featuredContent.budget}
            revenue={featuredContent.revenue}
            productionCompanies={featuredContent.production_companies || []}
            voteCount={featuredContent.vote_count}
            popularity={featuredContent.popularity}
          />
        )}

        {/* Content Tabs - Responsive */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-full p-1 sm:p-2 border border-gray-700/50">
              <button
                onClick={() => setActiveTab('movies')}
                className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
                  activeTab === 'movies'
                    ? 'bg-cineRed text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="hidden sm:inline">🎬 Películas</span>
                <span className="sm:hidden">🎬</span>
              </button>
              <button
                onClick={() => setActiveTab('tv')}
                className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
                  activeTab === 'tv'
                    ? 'bg-cineRed text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="hidden sm:inline">📺 Series</span>
                <span className="sm:hidden">📺</span>
              </button>
            </div>
          </motion.div>

          {/* Loading State - Responsive */}
          {isLoading && (
            <div className="flex justify-center items-center py-12 sm:py-16 lg:py-20">
              <LoadingSpinner />
            </div>
          )}

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'movies' && !moviesLoading && (
              <motion.div
                key="movies"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                {movieCategories.map((category, index) => (
                  <CategoryRow
                    key={category.id}
                    title={category.name}
                    fetchUrl={category.fetchUrl}
                    showRating={category.showRating}
                    icon={category.icon}
                  />
                ))}
              </motion.div>
            )}

            {activeTab === 'tv' && !tvLoading && (
              <motion.div
                key="tv"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                {tvCategories.map((category, index) => (
                  <CategoryRow
                    key={category.id}
                    title={category.name}
                    fetchUrl={category.fetchUrl}
                    showRating={category.showRating}
                    icon={category.icon}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State - Responsive */}
          {!isLoading && !hasError && (
            (activeTab === 'movies' && movieCategories.length === 0) ||
            (activeTab === 'tv' && tvCategories.length === 0)
          ) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12 sm:py-16 lg:py-20 px-4"
            >
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎬</div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                No se encontraron categorías
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                No se pudieron cargar las categorías de {activeTab === 'movies' ? 'películas' : 'series'}.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  )
}