import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, User, Star, Video } from 'lucide-react'

interface Person {
  id: number
  name: string
  character?: string
  job?: string
  profile_path?: string
  order?: number
}

interface AvatarGroupProps {
  people: Person[]
  title: string
  type: 'cast' | 'crew'
  maxVisible?: number
  className?: string
}

export default function AvatarGroup({ 
  people, 
  title, 
  type, 
  maxVisible = 8,
  className = ''
}: AvatarGroupProps) {
  const visiblePeople = people.slice(0, maxVisible)
  const remainingCount = people.length - maxVisible

  const getIcon = () => {
    if (type === 'cast') return <User className="w-4 h-4" />
    return <Video className="w-4 h-4" />
  }

  const getRole = (person: Person) => {
    if (type === 'cast') return person.character || 'Actor'
    return person.job || 'Crew'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-4 ${className}`}
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex items-center gap-2"
      >
        <div className="p-2 bg-cineRed/20 rounded-lg">
          {getIcon()}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <span className="text-gray-400 text-sm">({people.length})</span>
      </motion.div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <AnimatePresence>
          {visiblePeople.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.4,
                type: 'spring',
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="group relative"
            >
              <Link href={`/person/${person.id}`} className="block">
                {/* Avatar */}
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <motion.div
                    className="relative w-full h-full rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-cineRed/60 transition-colors cursor-pointer"
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {person.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Hover overlay */}
                    <motion.div
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <Star className="w-4 h-4 text-yellow-400" />
                    </motion.div>
                  </motion.div>

                  {/* Order badge for cast */}
                  {type === 'cast' && person.order && person.order <= 3 && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-6 h-6 bg-cineRed rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-gray-900"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                    >
                      {person.order}
                    </motion.div>
                  )}
                </div>

                {/* Name */}
                <motion.h4
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                  className="text-white text-sm font-medium text-center mb-1 line-clamp-2 group-hover:text-cineRed transition-colors cursor-pointer"
                >
                  {person.name}
                </motion.h4>

                {/* Role */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
                  className="text-gray-400 text-xs text-center line-clamp-2 cursor-pointer"
                >
                  {getRole(person)}
                </motion.p>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Show more indicator */}
        {remainingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: maxVisible * 0.1 + 0.2, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="group cursor-pointer"
          >
            <div className="relative w-16 h-16 mx-auto mb-3">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-cineRed/20 to-cineRed/40 border-2 border-cineRed/30 flex items-center justify-center group-hover:border-cineRed/60 transition-colors">
                <motion.div
                  animate={{ scale: [1, 1.1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                >
                  <Users className="w-6 h-6 text-cineRed" />
                </motion.div>
              </div>
            </div>
            <p className="text-cineRed text-sm font-medium text-center">
              +{remainingCount} más
            </p>
          </motion.div>
        )}
      </div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-700/50"
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>Total: {people.length} {type === 'cast' ? 'actores' : 'miembros del equipo'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>Principales: {people.filter(p => type === 'cast' ? p.order && p.order <= 3 : p.job === 'Director').length}</span>
        </div>
      </motion.div>
    </motion.div>
  )
} 