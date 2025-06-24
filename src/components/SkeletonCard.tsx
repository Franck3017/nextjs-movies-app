import { motion } from 'framer-motion'

export default function SkeletonCard() {
  return (
    <motion.div
      className="movie-card group relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
    >
      <div className="card-inner">
        <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg">
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800"
            animate={{
              background: [
                'linear-gradient(45deg, #374151, #4B5563, #374151)',
                'linear-gradient(45deg, #4B5563, #6B7280, #4B5563)',
                'linear-gradient(45deg, #374151, #4B5563, #374151)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
          
          {/* Badge placeholders */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
            <motion.div
              className="w-16 h-6 bg-gray-600 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="w-12 h-6 bg-gray-600 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
          </div>

          {/* Rating placeholder */}
          <motion.div
            className="absolute top-2 right-2 w-12 h-6 bg-gray-600 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          />
        </div>
        
        {/* Content skeleton */}
        <div className="p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-sm">
          {/* Title skeleton */}
          <motion.div
            className="h-4 bg-gray-600 rounded mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Description skeleton */}
          <div className="space-y-1 mb-3">
            <motion.div
              className="h-3 bg-gray-600 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="h-3 bg-gray-600 rounded w-3/4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </div>
          
          {/* Bottom info skeleton */}
          <div className="flex items-center justify-between">
            <motion.div
              className="w-12 h-3 bg-gray-600 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            />
            <motion.div
              className="w-16 h-3 bg-gray-600 rounded"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
            />
          </div>
        </div>

        {/* Glow effect skeleton */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-600/0 via-gray-600/10 to-gray-600/0"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.div>
  )
} 