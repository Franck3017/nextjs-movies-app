'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoKey?: string
  title?: string
}

export default function VideoModal({ isOpen, onClose, videoKey, title }: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  // Handle fullscreen toggle
  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        iframeRef.current.requestFullscreen()
      }
    }
  }

  if (!videoKey) {
    return null
  }

  const youtubeUrl = `https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1&fs=1&enablejsapi=1&origin=${window.location.origin}`

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleBackdropClick}
        >
          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-4xl lg:max-w-6xl bg-black rounded-xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
              <h3 className="text-white font-semibold text-sm sm:text-base truncate max-w-xs sm:max-w-md">
                {title || 'Trailer'}
              </h3>
              <div className="flex items-center gap-2">
                {/* Fullscreen Button */}
                <motion.button
                  onClick={handleFullscreen}
                  className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Pantalla completa"
                >
                  <Maximize2 className="w-4 h-4 text-white" />
                </motion.button>
                
                {/* Close Button */}
                <motion.button
                  onClick={onClose}
                  className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Cerrar"
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative w-full aspect-video">
              <iframe
                ref={iframeRef}
                src={youtubeUrl}
                title={title || 'Trailer'}
                className="w-full h-full rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                frameBorder="0"
              />
            </div>

            {/* Mobile Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-between text-white text-sm">
                <span className="font-medium">Reproduciendo trailer</span>
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  <span>YouTube</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Close on mobile swipe down */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full" />
        </motion.div>
      )}
    </AnimatePresence>
  )
} 