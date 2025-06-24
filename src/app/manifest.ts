import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CineApp - Tu app de películas y series',
    short_name: 'CineApp',
    description: 'Descubre las mejores películas y series. Busca, explora y disfruta del mejor contenido cinematográfico.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0f0f',
    theme_color: '#dc2626',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'es',
    categories: ['entertainment', 'movies', 'tv'],
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'CineApp en pantalla completa',
      },
      {
        src: '/screenshot-narrow.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'CineApp en móvil',
      },
    ],
    shortcuts: [
      {
        name: 'Buscar',
        short_name: 'Buscar',
        description: 'Buscar películas y series',
        url: '/search',
        icons: [
          {
            src: '/icon-search.png',
            sizes: '96x96',
          },
        ],
      },
      {
        name: 'Películas',
        short_name: 'Películas',
        description: 'Ver películas populares',
        url: '/?tab=movies',
        icons: [
          {
            src: '/icon-movies.png',
            sizes: '96x96',
          },
        ],
      },
      {
        name: 'Series',
        short_name: 'Series',
        description: 'Ver series populares',
        url: '/?tab=tv',
        icons: [
          {
            src: '/icon-tv.png',
            sizes: '96x96',
          },
        ],
      },
    ],
  }
} 