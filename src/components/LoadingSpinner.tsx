import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'white' | 'red' | 'blue'
  text?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'white',
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const colorClasses = {
    white: 'border-white',
    red: 'border-cineRed',
    blue: 'border-blue-500'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className={`${sizeClasses[size]} border-2 border-gray-600 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        
        {/* Inner ring */}
        <motion.div
          className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full absolute inset-0`}
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        
        {/* Center dot */}
        <motion.div
          className={`absolute inset-0 flex items-center justify-center`}
          animate={{ scale: [1, 1.2] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: 'easeInOut'
          }}
        >
          <div className={`w-1 h-1 ${color === 'white' ? 'bg-white' : color === 'red' ? 'bg-cineRed' : 'bg-blue-500'} rounded-full`} />
        </motion.div>
      </div>

      {/* Loading text */}
      {text && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`text-gray-400 ${textSizeClasses[size]} font-medium`}
        >
          {text}
        </motion.div>
      )}

      {/* Animated dots */}
      <motion.div
        className="flex space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 ${color === 'white' ? 'bg-white' : color === 'red' ? 'bg-cineRed' : 'bg-blue-500'} rounded-full`}
            animate={{
              scale: [1, 1.5],
              opacity: [0.5, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.2,
              ease: 'easeInOut'
            }}
          />
        ))}
      </motion.div>
    </div>
  )
} 