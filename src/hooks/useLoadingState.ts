import { useState, useCallback } from 'react'

interface LoadingState {
  isLoading: boolean
  message?: string
  progress?: number
}

export const useLoadingState = (initialState: LoadingState = { isLoading: false }) => {
  const [state, setState] = useState<LoadingState>(initialState)

  const startLoading = useCallback((message?: string) => {
    setState({ isLoading: true, message, progress: 0 })
  }, [])

  const stopLoading = useCallback(() => {
    setState({ isLoading: false })
  }, [])

  const updateProgress = useCallback((progress: number) => {
    setState(prev => ({ ...prev, progress }))
  }, [])

  const updateMessage = useCallback((message: string) => {
    setState(prev => ({ ...prev, message }))
  }, [])

  return {
    ...state,
    startLoading,
    stopLoading,
    updateProgress,
    updateMessage,
  }
} 