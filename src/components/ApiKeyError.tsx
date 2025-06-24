'use client'
import { motion } from 'framer-motion'
import { AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function ApiKeyError() {
  const [copied, setCopied] = useState(false)

  const copyInstructions = () => {
    const instructions = `TMDB_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.tmdb.org/t/p`
    
    navigator.clipboard.writeText(instructions)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full border border-red-500/30">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-4"
        >
          🔑 API Key No Configurada
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 text-center text-lg mb-8"
        >
          Para que la aplicación funcione correctamente, necesitas configurar la API key de TMDB.
        </motion.p>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">📋 Pasos para configurar:</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-cineRed rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
              <div>
                <p className="text-gray-300">
                  Ve a{' '}
                  <a
                    href="https://www.themoviedb.org/settings/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cineRed hover:text-red-400 underline inline-flex items-center gap-1"
                  >
                    TMDB API Settings
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-cineRed rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
              <p className="text-gray-300">Crea una cuenta gratuita si no tienes una</p>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-cineRed rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
              <p className="text-gray-300">Solicita una API key (API Read Access Token)</p>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-cineRed rounded-full flex items-center justify-center text-white text-sm font-bold">4</span>
              <p className="text-gray-300">Copia la API key</p>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-cineRed rounded-full flex items-center justify-center text-white text-sm font-bold">5</span>
              <p className="text-gray-300">Crea un archivo llamado <code className="bg-gray-700 px-2 py-1 rounded text-sm">.env.local</code> en la raíz del proyecto</p>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-cineRed rounded-full flex items-center justify-center text-white text-sm font-bold">6</span>
              <p className="text-gray-300">Agrega la API key al archivo</p>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-cineRed rounded-full flex items-center justify-center text-white text-sm font-bold">7</span>
              <p className="text-gray-300">Reinicia el servidor de desarrollo</p>
            </div>
          </div>
        </motion.div>

        {/* Example .env.local */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">📁 Ejemplo del archivo .env.local:</h3>
            <button
              onClick={copyInstructions}
              className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar
                </>
              )}
            </button>
          </div>
          
          <pre className="bg-gray-900 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
{`TMDB_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.tmdb.org/t/p`}
          </pre>
        </motion.div>

        {/* Important notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-blue-400 mb-3">💡 Información importante:</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• La API key es <strong>completamente gratuita</strong></li>
            <li>• Te permite hacer hasta <strong>1000 requests por día</strong></li>
            <li>• No necesitas tarjeta de crédito</li>
            <li>• El archivo <code className="bg-gray-700 px-1 rounded text-xs">.env.local</code> no se sube a Git</li>
          </ul>
        </motion.div>

        {/* Reload button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-cineRed text-white rounded-full hover:bg-red-700 transition-colors font-semibold"
          >
            🔄 Recargar después de configurar
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
} 