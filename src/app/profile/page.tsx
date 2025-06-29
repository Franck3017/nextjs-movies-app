'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Settings, 
  Heart, 
  Eye, 
  Star, 
  Film, 
  Tv, 
  Users, 
  Edit3, 
  Bell, 
  Shield, 
  LogOut,
  X,
  Check,
  Database,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useFavorites } from '../../contexts/FavoritesContext'
import { useNotifications } from '../../contexts/NotificationContext'
import { useUser } from '../../contexts/UserContext'
import { useTMDBIntegration } from '../../hooks/useTMDBIntegration'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'friends' | 'activity' | 'reviews' | 'preferences' | 'privacy' | 'settings' | 'integrations'>('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<{ username: string; bio: string; avatar?: string }>({ username: '', bio: '', avatar: undefined })
  const [avatarFile, setAvatarFile] = useState<string | undefined>(undefined)
  const [bannerFile, setBannerFile] = useState<string | undefined>(undefined)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)
  
  const { favorites, totalFavorites } = useFavorites()
  const { showNotification } = useNotifications()
  const { user, isLoading, logout, updateProfile, updatePreferences, login, register, loginDemo } = useUser()
  const {
    isConnected,
    isLoading: tmdbLoading,
    error: tmdbError,
    recommendations,
    stats,
    importedContent,
    connectToTMDB,
    disconnectFromTMDB,
    fetchRecommendations,
    importHistory,
    fetchStats,
    syncFavorites
  } = useTMDBIntegration()

  useEffect(() => {
    if (user) {
      setEditForm({
        username: user.username,
        bio: user.bio || '',
        avatar: user.avatar || undefined
      })
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!user) return

    const success = await updateProfile({
      username: editForm.username,
      bio: editForm.bio,
      avatar: avatarFile
    })

    if (success) {
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    if (user) {
      setEditForm({
        username: user.username,
        bio: user.bio || '',
        avatar: user.avatar || undefined
      })
    }
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
  }

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  // Mock data for badges, friends, activity, reviews, etc.
  // const friends = [
  //   { id: 1, username: 'amigo1', avatar: '', isFollowing: true },
  //   { id: 2, username: 'amigo2', avatar: '', isFollowing: false },
  // ]
  const reviews = [
    { id: 1, title: 'Inception', content: '¡Excelente película!', rating: 5, date: '2024-05-01' },
    { id: 2, title: 'Matrix', content: 'Un clásico de la ciencia ficción.', rating: 4, date: '2024-04-20' },
  ]

  // Avatar/Banner upload handlers (mock)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0])
      setAvatarFile(url)
      setEditForm(prev => ({ ...prev, avatar: url }))
    }
  }
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0])
      setBannerFile(url)
      setEditForm(prev => ({ ...prev, banner: url }))
    }
  }

  // TMDB Integration handlers
  const handleConnectTMDB = async () => {
    const success = await connectToTMDB()
    if (success) {
      showNotification({
        type: 'success',
        title: 'Conectado a TMDB',
        message: 'Tu cuenta se ha conectado exitosamente con TMDB'
      })
    } else {
      showNotification({
        type: 'error',
        title: 'Error de conexión',
        message: tmdbError || 'No se pudo conectar con TMDB'
      })
    }
  }

  const handleDisconnectTMDB = () => {
    disconnectFromTMDB()
    showNotification({
      type: 'success',
      title: 'Desconectado',
      message: 'Tu cuenta se ha desconectado de TMDB'
    })
  }

  const handleSyncFavorites = async () => {
    const movieTvFavorites = favorites
      .filter(f => f.media_type === 'movie' || f.media_type === 'tv')
      .map(f => ({ id: f.id, media_type: f.media_type as 'movie' | 'tv' }))
    
    const success = await syncFavorites(movieTvFavorites)
    if (success) {
      showNotification({
        type: 'success',
        title: 'Sincronización exitosa',
        message: 'Tus favoritos se han sincronizado con TMDB'
      })
    } else {
      showNotification({
        type: 'error',
        title: 'Error de sincronización',
        message: 'No se pudieron sincronizar los favoritos'
      })
    }
  }

  const handleImportHistory = async () => {
    const imported = await importHistory()
    if (imported && imported.length > 0) {
      showNotification({
        type: 'success',
        title: 'Historial importado',
        message: `Se importaron ${imported.length} elementos desde TMDB`
      })
    } else {
      showNotification({
        type: 'error',
        title: 'Error de importación',
        message: 'No se pudo importar el historial'
      })
    }
  }

  const handleFetchRecommendations = async () => {
    const movieTvFavorites = favorites
      .filter(f => f.media_type === 'movie' || f.media_type === 'tv')
      .map(f => ({ id: f.id, media_type: f.media_type as 'movie' | 'tv' }))
    
    await fetchRecommendations(movieTvFavorites)
  }

  const handleFetchStats = async () => {
    const movieTvFavorites = favorites
      .filter(f => f.media_type === 'movie' || f.media_type === 'tv')
      .map(f => ({ id: f.id, media_type: f.media_type as 'movie' | 'tv' }))
    
    await fetchStats(movieTvFavorites)
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner text="Cargando perfil..." />
        </div>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md w-full">
            <div className="mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cineRed to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Acceso al Perfil</h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Necesitas iniciar sesión para ver y gestionar tu perfil
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* Demo Account Button */}
              <button 
                onClick={async () => {
                  const demoSuccess = await loginDemo()
                  if (demoSuccess) {
                    showNotification({
                      type: 'success',
                      title: '¡Bienvenido!',
                      message: 'Has iniciado sesión con la cuenta de demostración'
                    })
                  }
                }}
                className="w-full bg-gradient-to-r from-cineRed to-red-600 text-white py-3 px-4 sm:px-6 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                🎬 Usar Cuenta de Demostración
              </button>

              {/* Register Button */}
              <button 
                onClick={async () => {
                  const registerSuccess = await register('UsuarioDemo', 'demo@cineapp.com', 'demo123')
                  if (registerSuccess) {
                    showNotification({
                      type: 'success',
                      title: '¡Cuenta creada!',
                      message: 'Tu cuenta de demostración se ha creado correctamente'
                    })
                  }
                }}
                className="w-full bg-white/10 backdrop-blur-sm text-white py-3 px-4 sm:px-6 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 text-sm sm:text-base"
              >
                📝 Crear Nueva Cuenta
              </button>

              {/* Back to Home */}
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full text-gray-400 hover:text-white transition-colors py-2 text-sm sm:text-base"
              >
                ← Volver al Inicio
              </button>
            </div>

            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <h3 className="text-xs sm:text-sm font-semibold text-white mb-2">💡 Información</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Esta es una aplicación de demostración. Puedes usar la cuenta de demostración para explorar todas las funcionalidades del perfil, incluyendo gestión de favoritos, preferencias, y más.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Banner de perfil */}
        <div className="relative pt-16 pb-4 sm:pb-8">
          <div className="w-full h-32 sm:h-40 md:h-48 lg:h-64 bg-gray-800/60 rounded-b-3xl overflow-hidden flex items-center justify-center">
            <span className="text-gray-500 text-sm sm:text-base">Banner de perfil</span>
            {isEditing && (
              <button
                className="absolute top-2 right-2 bg-cineRed text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs"
                onClick={() => bannerInputRef.current?.click()}
              >Cambiar Banner</button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={bannerInputRef}
              className="hidden"
              onChange={handleBannerChange}
            />
          </div>
        </div>
        
        {/* Header Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-cineRed to-red-600 rounded-full flex items-center justify-center border-4 border-gray-900">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.username} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-lg sm:text-xl md:text-2xl">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {isEditing && (
                <button
                  className="absolute -bottom-1 -right-1 bg-cineRed text-white p-1 sm:p-2 rounded-full text-xs sm:text-sm"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                ref={avatarInputRef}
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-2 sm:space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2 truncate">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                        className="bg-gray-800/50 border border-gray-600 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-white focus:outline-none focus:border-cineRed text-lg sm:text-xl md:text-2xl w-full"
                      />
                    ) : (
                      user.username
                    )}
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
                    Miembro desde {formatJoinDate(user.joinDate || user.createdAt)}
                  </p>
                  {user.bio && (
                    <p className="text-gray-300 mt-1 sm:mt-2 text-sm sm:text-base max-w-2xl">{user.bio}</p>
                  )}
                </div>
                
                <div className="flex gap-1 sm:gap-2 ml-2 sm:ml-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        className="p-1 sm:p-2 bg-green-600 rounded-full hover:bg-green-700 transition-colors"
                        aria-label="Guardar cambios"
                      >
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 sm:p-2 bg-gray-600 rounded-full hover:bg-gray-700 transition-colors"
                        aria-label="Cancelar edición"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 sm:p-2 bg-cineRed rounded-full hover:bg-red-700 transition-colors"
                      aria-label="Editar perfil"
                    >
                      <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
          <div className="flex justify-center">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-full p-1 sm:p-2 border border-gray-700/50 w-full max-w-4xl">
              <div className="overflow-x-auto">
                <div className="flex gap-1 sm:gap-2 min-w-max">
                  {([
                    { key: 'overview', label: 'Resumen', icon: Eye },
                    // { key: 'friends', label: 'Amigos', icon: Users },
                    { key: 'activity', label: 'Actividad', icon: Film },
                    { key: 'reviews', label: 'Reseñas', icon: Edit3 },
                    { key: 'preferences', label: 'Preferencias', icon: Settings },
                    { key: 'privacy', label: 'Privacidad', icon: Shield },
                    { key: 'integrations', label: 'TMDB', icon: Database },
                    { key: 'settings', label: 'Configuración', icon: Shield }
                  ] as const).map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 text-xs sm:text-sm whitespace-nowrap ${
                        activeTab === key
                          ? 'bg-cineRed text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">{label}</span>
                      <span className="sm:hidden">{label.charAt(0)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { icon: Heart, label: 'Favoritos', value: user.statistics?.totalFavorites || 0, color: 'text-red-400' },
                    { icon: Film, label: 'Películas', value: user.statistics?.moviesWatched || 0, color: 'text-blue-400' },
                    { icon: Tv, label: 'Series', value: user.statistics?.tvShowsWatched || 0, color: 'text-purple-400' },
                    { icon: Star, label: 'Valoración', value: (user.statistics?.averageRating || 0).toFixed(1), color: 'text-yellow-400' }
                  ].map(({ icon: Icon, label, value, color }) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 text-center"
                    >
                      <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${color} mx-auto mb-2 sm:mb-3`} />
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">{value}</div>
                      <div className="text-gray-400 text-xs sm:text-sm">{label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Actividad Reciente</h2>
                  <div className="space-y-3 sm:space-y-4">
                    {favorites.slice(0, 5).map((favorite, index) => (
                      <motion.div
                        key={`${favorite.id}-${favorite.media_type}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          {favorite.media_type === 'movie' ? (
                            <img src={`https://image.tmdb.org/t/p/w500${favorite.poster_path}`} alt={favorite.title} className="w-full h-full object-cover rounded-lg" />
                          ) : favorite.media_type === 'tv' ? (
                            <img src={`https://image.tmdb.org/t/p/w500${favorite.poster_path}`} alt={favorite.title} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <img src={`https://image.tmdb.org/t/p/w500${favorite.poster_path}`} alt={favorite.title} className="w-full h-full object-cover rounded-lg" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm sm:text-base truncate">{favorite.title}</h3>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            {favorite.media_type === 'movie' ? 'Película' : 
                             favorite.media_type === 'tv' ? 'Serie' : 'Persona'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                          <span className="text-white text-xs sm:text-sm">{favorite.vote_average?.toFixed(1)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* {activeTab === 'friends' && (
              <motion.div
                key="friends"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Amigos</h2>
                  <div className="space-y-3 sm:space-y-4">
                    {friends.map(({ id, username, avatar, isFollowing }) => (
                      <div key={id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                            {avatar ? (
                              <img src={avatar} alt={username} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <User className="w-full h-full text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-white font-semibold text-sm sm:text-base truncate">{username}</div>
                            <div className="text-gray-400 text-xs sm:text-sm">{isFollowing ? 'Siguiendo' : 'No seguido'}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )} */}

            {activeTab === 'activity' && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Actividad</h2>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm sm:text-base">Tiempo de visualización:</span>
                      <span className="text-white font-semibold text-sm sm:text-base">{formatWatchTime(user.statistics?.totalWatchTime || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm sm:text-base">Películas vistas:</span>
                      <span className="text-white font-semibold text-sm sm:text-base">{user.statistics?.moviesWatched || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm sm:text-base">Series vistas:</span>
                      <span className="text-white font-semibold text-sm sm:text-base">{user.statistics?.tvShowsWatched || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Gráfica de Actividad</h2>
                  <div className="h-32 sm:h-40 flex items-center justify-center text-gray-400 bg-gray-800/30 rounded-lg text-sm sm:text-base">[Gráfica de actividad aquí]</div>
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Reseñas</h2>
                  <div className="space-y-3 sm:space-y-4">
                    {reviews.map(({ id, title, content, rating, date }) => (
                      <div key={id} className="flex items-start justify-between p-3 sm:p-4 bg-gray-800/30 rounded-lg">
                        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                            {rating >= 4 ? (
                              <Star className="w-full h-full text-yellow-400" />
                            ) : (
                              <Star className="w-full h-full text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-semibold text-sm sm:text-base truncate">{title}</div>
                            <div className="text-gray-400 text-xs sm:text-sm mt-1">{content}</div>
                          </div>
                        </div>
                        <div className="text-gray-400 text-xs sm:text-sm flex-shrink-0 ml-2">{date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Preferencias</h2>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Tema</label>
                      <select
                        value={user.preferences?.theme || 'dark'}
                        onChange={(e) => updatePreferences({ theme: e.target.value as 'light' | 'dark' | 'auto' })}
                        className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cineRed text-sm sm:text-base"
                      >
                        <option value="dark">Oscuro</option>
                        <option value="light">Claro</option>
                        <option value="auto">Automático</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Idioma</label>
                      <select
                        value={user.preferences?.language || 'es'}
                        onChange={(e) => updatePreferences({ language: e.target.value as 'es' | 'en' })}
                        className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cineRed text-sm sm:text-base"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Notificaciones</h2>
                  <div className="space-y-4 sm:space-y-6">
                    {Object.entries(user.preferences?.notifications || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <label className="text-white font-semibold text-sm sm:text-base">
                            {key === 'email' && 'Notificaciones por email'}
                            {key === 'push' && 'Notificaciones push'}
                            {key === 'favorites' && 'Actualizaciones de favoritos'}
                            {key === 'recommendations' && 'Recomendaciones personalizadas'}
                          </label>
                          <p className="text-gray-400 text-xs sm:text-sm mt-1">
                            {key === 'email' && 'Recibe notificaciones por correo electrónico'}
                            {key === 'push' && 'Recibe notificaciones en tiempo real'}
                            {key === 'favorites' && 'Te avisamos cuando tus favoritos tienen novedades'}
                            {key === 'recommendations' && 'Recibe recomendaciones basadas en tus gustos'}
                          </p>
                        </div>
                        <button
                          onClick={() => updatePreferences({
                            notifications: {
                              ...(user.preferences?.notifications || {}),
                              [key]: !value
                            }
                          })}
                          className={`w-10 h-6 sm:w-12 sm:h-6 rounded-full transition-colors ml-3 flex-shrink-0 ${
                            value ? 'bg-cineRed' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full transition-transform ${
                            value ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Privacidad</h2>
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Visibilidad del perfil</label>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        Configura la visibilidad de tu perfil y actividad
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'integrations' && (
              <motion.div
                key="integrations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 sm:space-y-6"
              >
                {/* TMDB Connection Status */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Integración con TMDB</h2>
                    <div className={`flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                      isConnected 
                        ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                        : 'bg-gray-700/30 text-gray-400 border border-gray-600/30'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-400'}`} />
                      {isConnected ? 'Conectado' : 'Desconectado'}
                    </div>
                  </div>

                  {!isConnected ? (
                    <div className="text-center py-6 sm:py-8">
                      <Database className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Conecta tu cuenta con TMDB</h3>
                      <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                        Sincroniza tus favoritos, importa tu historial y obtén recomendaciones personalizadas
                      </p>
                      <button
                        onClick={handleConnectTMDB}
                        disabled={tmdbLoading}
                        className="btn-cine flex items-center gap-2 mx-auto text-sm sm:text-base"
                      >
                        {tmdbLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <ExternalLink className="w-4 h-4" />
                        )}
                        {tmdbLoading ? 'Conectando...' : 'Conectar con TMDB'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {/* Connection Actions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <button
                          onClick={handleSyncFavorites}
                          disabled={tmdbLoading}
                          className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors border border-gray-700/50"
                        >
                          <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                          <div className="text-left min-w-0">
                            <div className="text-white font-semibold text-sm sm:text-base">Sincronizar Favoritos</div>
                            <div className="text-gray-400 text-xs sm:text-sm">Subir favoritos a TMDB</div>
                          </div>
                        </button>

                        <button
                          onClick={handleImportHistory}
                          disabled={tmdbLoading}
                          className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors border border-gray-700/50"
                        >
                          <Download className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                          <div className="text-left min-w-0">
                            <div className="text-white font-semibold text-sm sm:text-base">Importar Historial</div>
                            <div className="text-gray-400 text-xs sm:text-sm">Descargar desde TMDB</div>
                          </div>
                        </button>
                      </div>

                      {/* Recommendations */}
                      <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <h3 className="text-base sm:text-lg font-semibold text-white">Recomendaciones Personalizadas</h3>
                          <button
                            onClick={handleFetchRecommendations}
                            disabled={tmdbLoading}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-cineRed text-white rounded-full text-xs sm:text-sm hover:bg-red-700 transition-colors"
                          >
                            <RefreshCw className={`w-3 h-3 ${tmdbLoading ? 'animate-spin' : ''}`} />
                            Actualizar
                          </button>
                        </div>
                        
                        {recommendations.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                            {recommendations.slice(0, 4).map((rec) => (
                              <div key={rec.id} className="bg-gray-700/30 rounded-lg p-2">
                                <img
                                  src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`}
                                  alt={rec.title || rec.name}
                                  className="w-full h-24 sm:h-32 object-cover rounded mb-2"
                                />
                                <div className="text-xs text-white font-medium truncate">
                                  {rec.title || rec.name}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <Star className="w-3 h-3 text-yellow-400" />
                                  {rec.vote_average.toFixed(1)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 sm:py-8 text-gray-400">
                            <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" />
                            <p className="text-sm sm:text-base">No hay recomendaciones disponibles</p>
                            <button
                              onClick={handleFetchRecommendations}
                              className="text-cineRed hover:text-red-400 mt-2 text-sm sm:text-base"
                            >
                              Obtener recomendaciones
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Statistics */}
                      <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <h3 className="text-base sm:text-lg font-semibold text-white">Estadísticas de TMDB</h3>
                          <button
                            onClick={handleFetchStats}
                            disabled={tmdbLoading}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-cineRed text-white rounded-full text-xs sm:text-sm hover:bg-red-700 transition-colors"
                          >
                            <BarChart3 className={`w-3 h-3 ${tmdbLoading ? 'animate-spin' : ''}`} />
                            Actualizar
                          </button>
                        </div>
                        
                        {stats && stats.totalMovies > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            <div className="text-center">
                              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{stats.totalMovies}</div>
                              <div className="text-gray-400 text-xs sm:text-sm">Películas</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{stats.totalSeries}</div>
                              <div className="text-gray-400 text-xs sm:text-sm">Series</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{stats.averageRating.toFixed(1)}</div>
                              <div className="text-gray-400 text-xs sm:text-sm">Rating Promedio</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{Math.floor(stats.watchTime / 60)}h</div>
                              <div className="text-gray-400 text-xs sm:text-sm">Tiempo Total</div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6 sm:py-8 text-gray-400">
                            <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" />
                            <p className="text-sm sm:text-base">No hay estadísticas disponibles</p>
                            <button
                              onClick={handleFetchStats}
                              className="text-cineRed hover:text-red-400 mt-2 text-sm sm:text-base"
                            >
                              Obtener estadísticas
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Disconnect Button */}
                      <div className="text-center pt-4">
                        <button
                          onClick={handleDisconnectTMDB}
                          className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                        >
                          Desconectar de TMDB
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Configuración de Cuenta</h2>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-white">Acciones de Cuenta</h3>
                      
                      <button className="w-full flex items-center justify-between p-3 sm:p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                          <div className="text-left min-w-0">
                            <div className="text-white font-semibold text-sm sm:text-base">Gestionar Notificaciones</div>
                            <div className="text-gray-400 text-xs sm:text-sm">Configurar preferencias de notificaciones</div>
                          </div>
                        </div>
                      </button>

                      <button className="w-full flex items-center justify-between p-3 sm:p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                          <div className="text-left min-w-0">
                            <div className="text-white font-semibold text-sm sm:text-base">Privacidad y Seguridad</div>
                            <div className="text-gray-400 text-xs sm:text-sm">Gestionar configuración de privacidad</div>
                          </div>
                        </div>
                      </button>

                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between p-3 sm:p-4 bg-red-900/30 rounded-lg hover:bg-red-900/50 transition-colors border border-red-500/30"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                          <div className="text-left min-w-0">
                            <div className="text-white font-semibold text-sm sm:text-base">Cerrar Sesión</div>
                            <div className="text-gray-400 text-xs sm:text-sm">Salir de tu cuenta</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  )
}
