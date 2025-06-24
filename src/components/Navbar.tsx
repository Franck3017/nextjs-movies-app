'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Heart, 
  User, 
  Menu, 
  X, 
  Home, 
  Film, 
  Tv, 
  Star,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  UserPlus,
  LogIn,
  Zap
} from 'lucide-react'
import { useFavorites } from '../contexts/FavoritesContext'
import { useUser } from '../contexts/UserContext'
import { useNotifications } from '@/contexts/NotificationContext'
import AuthModal from './AuthModal'

// Simple Search Form for Navbar
function NavbarSearchForm({ onSearch }: { onSearch: () => void }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Navigate to search page with query
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
      onSearch()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
        <Search className="absolute left-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar películas, series..."
          className="w-full pl-10 pr-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2 p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  )
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const pathname = usePathname()
  const { favorites } = useFavorites()
  const { user, logout, loginDemo, loginGuest } = useUser()
  const { showNotification } = useNotifications()

  const favoritesCount = favorites.length

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/category/movies/28', label: 'Películas', icon: Film },
    { href: '/category/tv/10759', label: 'Series', icon: Tv },
    { href: '/favorites', label: 'Favoritos', icon: Heart, badge: favoritesCount },
    { href: '/profile', label: 'Perfil', icon: User }
  ]

  const handleQuickLogin = async (type: 'demo' | 'guest') => {
    try {
      if (type === 'demo') {
        await loginDemo()
        showNotification({
          type: 'success',
          title: '¡Bienvenido!',
          message: 'Has iniciado sesión con la cuenta demo'
        })
      } else {
        await loginGuest()
        showNotification({
          type: 'info',
          title: 'Modo invitado',
          message: 'Modo invitado activado'
        })
      }
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al iniciar sesión'
      })
    }
  }

  const userMenuItems = [
    {
      label: 'Mi Perfil',
      icon: User,
      href: '/profile'
    },
    {
      label: 'Favoritos',
      icon: Heart,
      href: '/favorites',
      badge: favorites.length
    },
    {
      label: 'Configuración',
      icon: Settings,
      href: '/profile?tab=settings'
    },
    {
      label: 'Cerrar Sesión',
      icon: LogOut,
      onClick: () => {
        logout()
        showNotification({
          type: 'success',
          title: 'Sesión cerrada',
          message: 'Sesión cerrada correctamente'
        })
      }
    }
  ]

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (isUserMenuOpen) setIsUserMenuOpen(false)
  }

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
    if (isMobileMenuOpen) setIsMobileMenuOpen(false)
  }

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false)
    setIsUserMenuOpen(false)
    setIsSearchOpen(false)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 group"
              onClick={closeAllMenus}
            >
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cineRed to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Film className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full animate-pulse" />
              </div>
              <span className="text-white font-bold text-lg sm:text-xl lg:text-2xl tracking-tight">
                CineApp
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 group ${
                      isActive 
                        ? 'bg-cineRed text-white shadow-lg' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 sm:p-3 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 group"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              </button>
              
              {user ? (
                <div className="relative">
                  <button
                    onClick={handleUserMenuToggle}
                    className="flex items-center space-x-2 p-2 sm:p-3 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-cineRed to-red-600 flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden xl:block text-sm font-medium">{user.username}</span>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        className="absolute right-0 top-full mt-2 w-64 bg-gray-900/95 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-xl overflow-hidden"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-4 border-b border-gray-700/50">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cineRed to-red-600 flex items-center justify-center">
                              <span className="text-white font-bold">{user.username.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="text-white font-semibold">{user.username}</p>
                              <p className="text-gray-400 text-sm">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="py-2">
                          {userMenuItems.map((item, index) => {
                            const Icon = item.icon
                            return (
                              <button
                                key={index}
                                onClick={() => {
                                  if (item.onClick) {
                                    item.onClick()
                                  } else if (item.href) {
                                    window.location.href = item.href
                                  }
                                  setIsUserMenuOpen(false)
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                              >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm">{item.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {/* Quick Login Button */}
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg bg-cineRed text-white hover:bg-red-700 transition-all duration-300"
                  >
                    <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">Iniciar Sesión</span>
                  </button>
                  
                  {/* Quick Demo Login */}
                  <button
                    onClick={() => handleQuickLogin('demo')}
                    className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
                    title="Iniciar sesión con cuenta demo"
                  >
                    <Zap className="w-4 h-4" />
                    <span className="font-medium text-sm">Demo</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleMobileMenuToggle}
                className="p-2 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-700/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 sm:px-6 py-4">
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeAllMenus}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                          isActive 
                            ? 'bg-cineRed text-white' 
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.badge && item.badge > 0 && (
                          <span className="bg-yellow-400 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                  
                  {/* User Section in Mobile Menu */}
                  {user ? (
                    <div className="pt-4 border-t border-gray-700/50">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cineRed to-red-600 flex items-center justify-center">
                          <span className="text-white font-bold">{user.username.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold">{user.username}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        {userMenuItems.slice(0, -1).map((item, index) => {
                          const Icon = item.icon
                          return (
                            <Link
                              key={index}
                              href={item.href || '#'}
                              onClick={closeAllMenus}
                              className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <Icon className="w-4 h-4" />
                              <span className="text-sm">{item.label}</span>
                            </Link>
                          )
                        })}
                        
                        <button
                          onClick={() => {
                            logout()
                            closeAllMenus()
                          }}
                          className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-gray-700/50 space-y-2">
                      <Link
                        href="/profile"
                        onClick={closeAllMenus}
                        className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-cineRed text-white hover:bg-red-700 transition-all duration-300"
                      >
                        <LogIn className="w-5 h-5" />
                        <span className="font-medium">Iniciar Sesión</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          handleQuickLogin('demo')
                          closeAllMenus()
                        }}
                        className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
                      >
                        <Zap className="w-5 h-5" />
                        <span className="font-medium">Modo Demo</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          handleQuickLogin('guest')
                          closeAllMenus()
                        }}
                        className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-all duration-300"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Modo Invitado</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              className="bg-gray-900/95 backdrop-blur-md border-t border-gray-700/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 sm:px-6 py-4">
                <NavbarSearchForm onSearch={() => setIsSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAllMenus}
          />
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  )
}