import { ReactNode } from 'react'
import Navbar from './Navbar'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main id="main-content" className="flex-1 mt-16 sm:mt-20" role="main">
        {children}
      </main>
      <footer className="text-center py-6 sm:py-8 text-gray-400 text-sm px-4 border-t border-white/10 bg-black/20 backdrop-blur-sm" role="contentinfo">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} CinemApp. Todos los derechos reservados.</p>
          <p className="text-xs mt-2 text-gray-500">
            Desarrollado con ❤️ usando Next.js y Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  )
}