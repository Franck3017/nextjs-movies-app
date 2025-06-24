import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, Heart, Star, Eye, Film, Tv, Clock, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useFavorites } from '../contexts/FavoritesContext'

type Props = {
  id: number;
  title: string;
  posterPath: string;
  overview: string;
  rating?: number;
  mediaType?: 'movie' | 'tv';
  year?: number | null;
  priority?: boolean;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  genres?: string[];
}

export default function MovieCard({ 
  id,
  title, 
  posterPath, 
  overview, 
  rating = 0, 
  mediaType, 
  year, 
  priority = false,
  release_date,
  first_air_date,
  runtime,
  genres = []
}: Props) {
  const router = useRouter()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const imgUrl = `https://image.tmdb.org/t/p/w500${posterPath}`
  const isFavorited = mediaType ? isFavorite(id, mediaType) : false

  const handleCardClick = () => {
    const route = mediaType === 'tv' ? `/tv/${id}` : `/movie/${id}`
    router.push(route)
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Navigate to detail page where trailer modal is available
    const route = mediaType === 'tv' ? `/tv/${id}` : `/movie/${id}`
    router.push(route)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!mediaType) return

    const favoriteItem = {
      id,
      title,
      poster_path: posterPath,
      overview,
      vote_average: rating,
      media_type: mediaType,
      release_date,
      first_air_date,
      runtime,
      genres
    }

    if (isFavorited) {
      removeFromFavorites(id, mediaType)
    } else {
      addToFavorites(favoriteItem)
    }
  }

  return (
    <motion.div
      className="movie-card group relative cursor-pointer w-full h-full"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ 
        scale: 1.05, 
        y: -8,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.6, 
        type: 'spring', 
        stiffness: 100, 
        damping: 15 
      }}
      onClick={handleCardClick}
      layout
    >
      <div className="card-inner">
        <div className="relative w-full aspect-[2/3] overflow-hidden">
          <Image
            src={imgUrl}
            alt={`Poster de ${title}`}
            fill
            sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, (max-width: 1024px) 192px, (max-width: 1280px) 224px, 256px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={(e) => {
              const target = e.target as HTMLImageElement
              target.classList.add('loaded')
            }}
          />
          
          <div className="movie-card-overlay" />
          
          {/* Badges - Responsive */}
          <motion.div 
            className="absolute top-1 sm:top-2 left-1 sm:left-2 flex items-center gap-1 sm:gap-1.5 z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {mediaType && (
              <motion.span
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm border ${
                  mediaType === 'movie' 
                    ? 'bg-cineRed/90 text-white border-cineRed/60' 
                    : 'bg-blue-600/90 text-white border-blue-500/60'
                }`}
              >
                {mediaType === 'movie' ? <Film className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <Tv className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                <span className="hidden sm:inline">{mediaType === 'movie' ? 'Película' : 'Serie'}</span>
                <span className="sm:hidden">{mediaType === 'movie' ? 'P' : 'S'}</span>
              </motion.span>
            )}
            {year && (
              <motion.span
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ duration: 0.2 }}
                className="inline-block bg-white/20 backdrop-blur-sm text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold shadow-lg border border-white/30"
              >
                {year}
              </motion.span>
            )}
          </motion.div>

          {/* Rating Badge - Responsive */}
          {rating > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ 
                delay: 0.3, 
                duration: 0.5, 
                type: 'spring',
                stiffness: 300
              }}
              className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-black text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-lg backdrop-blur-sm border border-yellow-200/50 z-10"
            >
              <div className="flex items-center gap-1">
                <Star size={10} className="sm:w-3 sm:h-3 fill-current" />
                <span className="text-xs">{rating.toFixed(1)}</span>
              </div>
            </motion.div>
          )}

          {/* Action Buttons - Responsive */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10"
          >
            <div className="flex gap-1.5 sm:gap-2">
              <motion.button
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="p-2 sm:p-2.5 bg-cineRed shadow-lg rounded-full hover:bg-red-600 transition-colors border-2 border-white/20 hover:border-cineRed/60 backdrop-blur-sm"
                aria-label={`Reproducir ${title}`}
                onClick={handlePlayClick}
              >
                <Play size={14} className="sm:w-4 sm:h-4 text-white fill-white ml-0.5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className={`p-2 sm:p-2.5 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 border-2 ${
                  isFavorited 
                    ? 'bg-cineRed/90 hover:bg-cineRed border-cineRed/60' 
                    : 'bg-white/20 hover:bg-white/30 border-white/20 hover:border-cineRed/40'
                }`}
                aria-label={isFavorited ? `Quitar ${title} de favoritos` : `Agregar ${title} a favoritos`}
                onClick={handleFavoriteClick}
              >
                <motion.div
                  animate={{ 
                    scale: isFavorited ? 1.2 : 1,
                    rotate: isFavorited ? 10 : 0
                  }}
                  transition={{ duration: 0.5, type: 'spring' }}
                >
                  <Heart 
                    size={14} 
                    className={`sm:w-4 sm:h-4 ${isFavorited ? 'fill-cineRed text-cineRed' : 'text-white'} transition-colors duration-300`} 
                  />
                </motion.div>
              </motion.button>
            </div>
          </motion.div>

          {/* Details Button - Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10"
          >
            <motion.button
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="p-1.5 sm:p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 border border-white/20 hover:border-cineRed/40"
              aria-label={`Ver detalles de ${title}`}
              onClick={(e) => {
                e.stopPropagation()
                handleCardClick()
              }}
            >
              <Eye size={12} className="sm:w-3.5 sm:h-3.5 text-white" />
            </motion.button>
          </motion.div>

          {/* Additional Info - Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-2 sm:p-3"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-300">
              <div className="flex items-center gap-1">
                <Clock size={10} className="sm:w-3 sm:h-3" />
                <span className="text-xs">
                  {runtime ? `${runtime} min` : ''}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={10} className="sm:w-3 sm:h-3" />
                <span className="text-xs">
                  {genres.join(', ')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Card Content - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="p-2 sm:p-3"
        >
          <h3 className="text-white font-semibold text-base sm:text-lg mb-1 truncate">{title}</h3>
          {/* Mostrar géneros debajo del título */}
          {genres.length > 0 && (
            <div className="text-xs text-gray-400 mb-1 truncate">
              {genres.join(', ')}
            </div>
          )}
          <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 mb-1">{overview}</p>
          
          <div className="mt-1.5 sm:mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {rating > 0 && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1 text-yellow-400"
                >
                  <Star size={10} className="sm:w-3 sm:h-3 fill-current" />
                  <span className="text-xs font-medium">{rating.toFixed(1)}</span>
                </motion.div>
              )}
            </div>
            <div className="text-xs text-gray-500">
              <span className="hidden sm:inline">{mediaType === 'movie' ? 'Película' : 'Serie'}</span>
              <span className="sm:hidden">{mediaType === 'movie' ? 'P' : 'S'}</span>
            </div>
          </div>
        </motion.div>

        {/* Glow Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-cineRed/0 via-cineRed/10 to-cineRed/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        />
      </div>
    </motion.div>
  )
}