"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react'
import Notification, { NotificationType } from '../components/Notification'

interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
}

interface NotificationContextType {
  showNotification: (notification: Omit<NotificationItem, 'id'>) => void
  hideNotification: (id: string) => void
  clearAllNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const notificationIdRef = useRef(0)

  const showNotification = useCallback((notification: Omit<NotificationItem, 'id'>) => {
    const id = `notification-${notificationIdRef.current++}`
    const newNotification = { ...notification, id }
    
    setNotifications(prev => [...prev, newNotification])
  }, [])

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const value = React.useMemo(() => ({
    showNotification,
    hideNotification,
    clearAllNotifications,
  }), [showNotification, hideNotification, clearAllNotifications])

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            isVisible={true}
            onClose={() => hideNotification(notification.id)}
            duration={notification.duration}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
} 