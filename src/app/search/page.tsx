'use client'
import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import SearchForm from '../../components/SearchForm'
import SearchFilters from '../../components/SearchFilters'
import SearchResults from '../../components/SearchResults'
import SEOHead from '../../components/SEOHead'
import LoadingSpinner from '../../components/LoadingSpinner'
import ApiKeyError from '../../components/ApiKeyError'
import { useSearch } from '../../hooks/useSearch'
import { motion } from 'framer-motion'

export default function SearchPage() {
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null)
  
  const {
    query,
    setQuery,
    searchQuery,
    activeFilter,
    setActiveFilter,
    results,
    isLoading,
    error,
    hasResults,
    totalResults,
    filteredCount,
    isRealTimeSearch,
    handleSearch,
    clearSearch,
  } = useSearch()

  // Verificar si la API key está configurada
  useEffect(() => {
    const checkApiKey = async () => {
      try {
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

  // Update page title based on search query
  useEffect(() => {
    if (searchQuery) {
      document.title = `Búsqueda: "${searchQuery}" | CineApp`
    } else {
      document.title = 'Búsqueda | CineApp'
    }
  }, [searchQuery])

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

  return (
    <>
      <SEOHead 
        title={searchQuery ? `Búsqueda: ${searchQuery}` : 'Búsqueda'}
        description={searchQuery 
          ? `Resultados de búsqueda para "${searchQuery}". Encuentra películas y series relacionadas.`
          : 'Busca entre miles de películas y series. Encuentra tu próximo favorito con nuestra búsqueda avanzada.'
        }
        keywords={searchQuery ? [searchQuery, 'búsqueda', 'películas', 'series'] : ['búsqueda', 'películas', 'series', 'streaming']}
        url={`https://cineapp.com/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}
      />
      
      <Layout>
        <div className="min-h-screen pt-16 sm:pt-20">
          {/* Search Header */}
          <motion.div 
            className="bg-gradient-to-r from-cineRed to-red-700 py-12 sm:py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mx-auto text-center">
                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  🔍 Buscar Contenido
                </motion.h1>
                <motion.p 
                  className="text-lg sm:text-xl text-red-100 mb-6 sm:mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Encuentra tus películas y series favoritas
                </motion.p>
                
                {/* Search Form */}
                <SearchForm
                  query={query}
                  onQueryChange={setQuery}
                  onSubmit={handleSearch}
                  onClear={clearSearch}
                  placeholder="Buscar películas, series, actores..."
                  isSearching={isLoading}
                  isRealTimeSearch={isRealTimeSearch}
                />
              </div>
            </div>
          </motion.div>

          {/* Search Results */}
          {(searchQuery || isRealTimeSearch) && (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {/* Filter Tabs */}
              <SearchFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />

              {/* Results */}
              <SearchResults
                results={results}
                isLoading={isLoading}
                error={error}
                searchQuery={searchQuery}
                hasResults={hasResults}
                totalResults={totalResults}
                filteredCount={filteredCount}
                isRealTimeSearch={isRealTimeSearch}
              />
            </div>
          )}

          {/* Empty State */}
          {!searchQuery && !isRealTimeSearch && (
            <motion.div 
              className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center">
                <motion.div 
                  className="text-6xl sm:text-8xl mb-4 sm:mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                >
                  🎬
                </motion.div>
                <motion.h2 
                  className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  ¿Qué quieres ver hoy?
                </motion.h2>
                <motion.p 
                  className="text-gray-400 text-base sm:text-lg max-w-md mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  Busca entre miles de películas y series para encontrar tu próximo favorito
                </motion.p>
              </div>
            </motion.div>
          )}
        </div>
      </Layout>
    </>
  )
} 