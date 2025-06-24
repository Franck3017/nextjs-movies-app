import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, TrendingUp, Clock, Film, Tv } from 'lucide-react'

interface SearchFormProps {
  query: string
  onQueryChange: (query: string) => void
  onSubmit: (e: React.FormEvent) => void
  onClear: () => void
  placeholder?: string
  isSearching?: boolean
  isRealTimeSearch?: boolean
  suggestions?: string[]
}

export default function SearchForm({ 
  query,
  onQueryChange,
  onSubmit,
  onClear,
  placeholder = "Buscar películas, series, actores...",
  isSearching = false, 
  isRealTimeSearch = false,
  suggestions = []
}: SearchFormProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [focused, setFocused] = useState(false)

  // Popular searches for suggestions
  const popularSearches = [
    'Avengers', 'Batman', 'Spider-Man', 'Star Wars', 'Harry Potter',
    'Breaking Bad', 'Game of Thrones', 'Stranger Things', 'The Office'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSubmit(e)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onQueryChange(suggestion)
    onSubmit({ preventDefault: () => {} } as React.FormEvent)
    setShowSuggestions(false)
  }

  const clearSearch = () => {
    onClear()
    setShowSuggestions(false)
  }

  useEffect(() => {
    if (isRealTimeSearch && query.trim()) {
      const timeoutId = setTimeout(() => {
        onSubmit({ preventDefault: () => {} } as React.FormEvent)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
    return undefined
  }, [query, isRealTimeSearch, onSubmit])

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <motion.form
        onSubmit={handleSubmit}
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search Input */}
        <motion.div
          className={`relative flex items-center bg-white/10 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 ${
            focused 
              ? 'border-cineRed/60 shadow-lg shadow-cineRed/20' 
              : 'border-white/20 hover:border-white/40'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Search Icon */}
          <motion.div
            className="absolute left-4 text-gray-400"
            animate={{ 
              scale: isSearching ? 1.2 : 1,
              rotate: isSearching ? 360 : 0
            }}
            transition={{ 
              duration: 1, 
              repeat: isSearching ? Infinity : 0,
              ease: 'easeInOut'
            }}
          >
            <Search className="w-5 h-5" />
          </motion.div>

          {/* Input Field */}
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => {
              setFocused(true)
              setShowSuggestions(true)
            }}
            onBlur={() => {
              setFocused(false)
              // Delay hiding suggestions to allow clicking on them
              setTimeout(() => setShowSuggestions(false), 200)
            }}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
          />

          {/* Real-time indicator */}
          {isRealTimeSearch && query && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-12"
            >
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.5] }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              />
            </motion.div>
          )}

          {/* Clear Button */}
          {query && (
            <motion.button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 p-1 text-gray-400 hover:text-white transition-colors"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>

        {/* Search Button */}
        <motion.button
          type="submit"
          disabled={!query.trim() || isSearching}
          className={`absolute right-2 top-2 px-6 py-2 bg-cineRed text-white rounded-xl font-semibold transition-all duration-300 ${
            !query.trim() || isSearching 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-red-600 hover:scale-105'
          }`}
          whileHover={query.trim() && !isSearching ? { scale: 1.05 } : {}}
          whileTap={query.trim() && !isSearching ? { scale: 0.95 } : {}}
        >
          {isSearching ? (
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            'Buscar'
          )}
        </motion.button>
      </motion.form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl z-50 overflow-hidden"
          >
            {/* Recent Searches */}
            {suggestions.length > 0 && (
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                  <Clock className="w-4 h-4" />
                  <span>Búsquedas recientes</span>
                </div>
                <div className="space-y-2">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <motion.button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div className="p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                <TrendingUp className="w-4 h-4" />
                <span>Búsquedas populares</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {popularSearches.slice(0, 6).map((search, index) => (
                  <motion.button
                    key={search}
                    onClick={() => handleSuggestionClick(search)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 2 }}
                  >
                    {search.includes('Avengers') || search.includes('Batman') || search.includes('Spider-Man') ? (
                      <Film className="w-3 h-3 text-cineRed" />
                    ) : (
                      <Tv className="w-3 h-3 text-blue-500" />
                    )}
                    {search}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick Filters */}
            <div className="p-4 border-t border-gray-700/50">
              <div className="text-gray-400 text-sm mb-3">Filtros rápidos</div>
              <div className="flex flex-wrap gap-2">
                {['Acción', 'Comedia', 'Drama', 'Terror', 'Romance', 'Ciencia Ficción'].map((filter, index) => (
                  <motion.button
                    key={filter}
                    onClick={() => handleSuggestionClick(filter)}
                    className="px-3 py-1 bg-cineRed/20 text-cineRed rounded-full text-xs hover:bg-cineRed/30 transition-colors"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {filter}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 