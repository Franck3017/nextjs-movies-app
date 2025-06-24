'use client'
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { useNotifications } from './NotificationContext'

interface User {
  id: string
  username: string
  email: string
  avatar?: string | null
  bio?: string
  joinDate: string
  isGuest?: boolean
  isDemo?: boolean
  createdAt: string
  lastLogin?: string
  preferences?: {
    theme?: 'light' | 'dark' | 'auto'
    notifications?: {
      email?: boolean
      push?: boolean
      favorites?: boolean
      recommendations?: boolean
    }
    language?: string
  }
  statistics: {
    totalFavorites: number
    moviesWatched: number
    tvShowsWatched: number
    totalWatchTime: number
    averageRating: number
    reviewsCount: number
  }
}

interface UserContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  loginDemo: () => Promise<boolean>
  loginGuest: () => Promise<boolean>
  updateUser: (updates: Partial<User>) => void
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  updatePreferences: (preferences: Partial<User['preferences']>) => void
  validateEmail: (email: string) => boolean
  validatePassword: (password: string) => { isValid: boolean; errors: string[] }
  resetPassword: (email: string) => Promise<boolean>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showNotification } = useNotifications()

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }, [])

  const validatePassword = useCallback((password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []
    
    if (password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una mayúscula')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una minúscula')
    }
    
    if (!/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Validate inputs
      if (!validateEmail(email)) {
        throw new Error('Email inválido')
      }
      
      if (password.length < 6) {
        throw new Error('Contraseña demasiado corta')
      }
      
      // Simulate successful login
      const newUser: User = {
        id: `user-${Date.now()}`,
        username: email.split('@')[0] || 'Usuario',
        email,
        avatar: null,
        bio: '',
        joinDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            push: true,
            favorites: true,
            recommendations: false
          },
          language: 'es'
        },
        statistics: {
          totalFavorites: 0,
          moviesWatched: 0,
          tvShowsWatched: 0,
          totalWatchTime: 0,
          averageRating: 0,
          reviewsCount: 0
        }
      }
      
      setUser(newUser)
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [validateEmail])

  const register = useCallback(async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Validate inputs
      if (username.length < 3) {
        throw new Error('El nombre de usuario debe tener al menos 3 caracteres')
      }
      
      if (!validateEmail(email)) {
        throw new Error('Email inválido')
      }
      
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors[0])
      }
      
      // Simulate successful registration
      const newUser: User = {
        id: `user-${Date.now()}`,
        username,
        email,
        avatar: null,
        bio: '',
        joinDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            push: true,
            favorites: true,
            recommendations: false
          },
          language: 'es'
        },
        statistics: {
          totalFavorites: 0,
          moviesWatched: 0,
          tvShowsWatched: 0,
          totalWatchTime: 0,
          averageRating: 0,
          reviewsCount: 0
        }
      }
      
      setUser(newUser)
      return true
    } catch (error) {
      console.error('Registration error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [validateEmail, validatePassword])

  const loginDemo = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const demoUser: User = {
        id: 'demo-user',
        username: 'Usuario Demo',
        email: 'demo@cineapp.com',
        avatar: null,
        bio: '¡Hola! Soy un usuario de demostración. Puedes explorar todas las funcionalidades de la aplicación con esta cuenta.',
        joinDate: new Date().toISOString(),
        isDemo: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            push: true,
            favorites: true,
            recommendations: false
          },
          language: 'es'
        },
        statistics: {
          totalFavorites: 15,
          moviesWatched: 247,
          tvShowsWatched: 89,
          totalWatchTime: 1247,
          averageRating: 4.2,
          reviewsCount: 23
        }
      }
      
      setUser(demoUser)
      return true
    } catch (error) {
      console.error('Demo login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loginGuest = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const guestUser: User = {
        id: `guest-${Date.now()}`,
        username: 'Invitado',
        email: 'guest@cineapp.com',
        avatar: null,
        bio: '',
        joinDate: new Date().toISOString(),
        isGuest: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'dark',
          notifications: {
            email: false,
            push: false,
            favorites: false,
            recommendations: false
          },
          language: 'es'
        },
        statistics: {
          totalFavorites: 0,
          moviesWatched: 0,
          tvShowsWatched: 0,
          totalWatchTime: 0,
          averageRating: 0,
          reviewsCount: 0
        }
      }
      
      setUser(guestUser)
      return true
    } catch (error) {
      console.error('Guest login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    if (user) {
      setUser(prev => prev ? { ...prev, ...updates } : null)
    }
  }, [user])

  const updatePreferences = useCallback((preferences: Partial<User['preferences']>) => {
    if (user) {
      setUser(prev => prev ? {
        ...prev,
        preferences: { ...prev.preferences, ...preferences }
      } : null)
    }
  }, [user])

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (!validateEmail(email)) {
        throw new Error('Email inválido')
      }
      
      // Simulate password reset email sent
      console.log(`Password reset email sent to ${email}`)
      return true
    } catch (error) {
      console.error('Password reset error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [validateEmail])

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false
      
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      return true
    } catch (error) {
      console.error('Profile update error:', error)
      return false
    }
  }, [user])

  const value = React.useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    loginDemo,
    loginGuest,
    updateUser,
    updateProfile,
    updatePreferences,
    validateEmail,
    validatePassword,
    resetPassword
  }), [
    user,
    isLoading,
    login,
    register,
    logout,
    loginDemo,
    loginGuest,
    updateUser,
    updateProfile,
    updatePreferences,
    validateEmail,
    validatePassword,
    resetPassword
  ])

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
} 