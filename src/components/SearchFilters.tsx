import { Film, Tv, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { FilterType } from '../hooks/useSearch'

interface SearchFiltersProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  className?: string
}

export default function SearchFilters({
  activeFilter,
  onFilterChange,
  className = ""
}: SearchFiltersProps) {
  const filters = [
    { 
      value: 'all' as const, 
      label: 'Todos', 
      icon: '🎬',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30'
    },
    { 
      value: 'movie' as const, 
      label: 'Películas', 
      icon: <Film className="w-4 h-4" />,
      color: 'from-cineRed to-red-600',
      bgColor: 'bg-gradient-to-r from-cineRed/20 to-red-600/20',
      borderColor: 'border-cineRed/30'
    },
    { 
      value: 'tv' as const, 
      label: 'Series', 
      icon: <Tv className="w-4 h-4" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30'
    },
  ]

  return (
    <motion.div 
      className={`mb-8 sm:mb-10 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Filter Header */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700/50">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300 font-medium">Filtrar por tipo</span>
        </div>
      </div>

      {/* Enhanced Filter Tabs */}
      <div className="flex justify-center">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/50 shadow-xl">
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((filter, index) => (
              <motion.button
                key={filter.value}
                onClick={() => onFilterChange(filter.value)}
                className={`relative px-4 sm:px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium ${
                  activeFilter === filter.value
                    ? `bg-gradient-to-r ${filter.color} text-white shadow-lg border ${filter.borderColor}`
                    : `text-gray-300 hover:text-white ${filter.bgColor} hover:border ${filter.borderColor} border-transparent`
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Active indicator */}
                {activeFilter === filter.value && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl"
                    layoutId="activeFilter"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <span className="relative z-10">
                  {typeof filter.icon === 'string' ? (
                    <span className="text-base">{filter.icon}</span>
                  ) : (
                    filter.icon
                  )}
                </span>
                <span className="relative z-10">{filter.label}</span>
                
                {/* Glow effect for active filter */}
                {activeFilter === filter.value && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Stats */}
      <motion.div 
        className="text-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-gray-500">
          Filtro activo: <span className="text-gray-300 font-medium">
            {filters.find(f => f.value === activeFilter)?.label}
          </span>
        </p>
      </motion.div>
    </motion.div>
  )
} 