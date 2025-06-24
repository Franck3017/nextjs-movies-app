export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🧪 Página de Prueba - Tailwind CSS</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Test Card 1 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">Colores Personalizados</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-cineRed rounded"></div>
                <span className="text-gray-300">cineRed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-cineRed-light rounded"></div>
                <span className="text-gray-300">cineRed-light</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-cineRed-dark rounded"></div>
                <span className="text-gray-300">cineRed-dark</span>
              </div>
            </div>
          </div>

          {/* Test Card 2 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">Botones</h2>
            <div className="space-y-3">
              <button className="btn-cine w-full">Botón Principal</button>
              <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Botón Secundario
              </button>
            </div>
          </div>

          {/* Test Card 3 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">Tipografía</h2>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-white">Título Grande</p>
              <p className="text-lg text-gray-300">Texto Normal</p>
              <p className="text-sm text-gray-400">Texto Pequeño</p>
            </div>
          </div>

          {/* Test Card 4 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">Animaciones</h2>
            <div className="space-y-3">
              <div className="animate-pulse bg-gray-600 h-4 rounded"></div>
              <div className="animate-bounce bg-cineRed h-4 rounded"></div>
              <div className="animate-spin bg-blue-500 h-4 rounded"></div>
            </div>
          </div>

          {/* Test Card 5 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">Responsive</h2>
            <div className="text-center">
              <p className="text-sm sm:text-base lg:text-lg text-gray-300">
                Este texto cambia de tamaño según la pantalla
              </p>
            </div>
          </div>

          {/* Test Card 6 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">Gradientes</h2>
            <div className="space-y-2">
              <div className="h-8 bg-gradient-to-r from-cineRed to-red-600 rounded"></div>
              <div className="h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
              <div className="h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded"></div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Si puedes ver todos estos elementos con estilos, Tailwind CSS está funcionando correctamente.
          </p>
        </div>
      </div>
    </div>
  )
} 