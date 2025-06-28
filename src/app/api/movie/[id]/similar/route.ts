import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const apiKey = process.env.TMDB_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key no configurada' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}&language=es-ES&page=1`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Error de TMDB: ${response.status}`)
    }

    const data = await response.json()
    
    // Obtener detalles completos de cada película para incluir runtime y géneros
    const moviesWithDetails = await Promise.all(
      data.results.slice(0, 10).map(async (movie: any) => {
        try {
          const detailResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=es-ES`
          )
          
          if (detailResponse.ok) {
            const detailData = await detailResponse.json()
            return {
              ...movie,
              media_type: 'movie',
              runtime: detailData.runtime,
              genres: detailData.genres
            }
          } else {
            // Si falla la obtención de detalles, devolver solo los datos básicos
            return {
              ...movie,
              media_type: 'movie',
              runtime: undefined,
              genres: []
            }
          }
        } catch (error) {
          console.error(`Error fetching details for movie ${movie.id}:`, error)
          return {
            ...movie,
            media_type: 'movie',
            runtime: undefined,
            genres: []
          }
        }
      })
    )

    return NextResponse.json({
      ...data,
      results: moviesWithDetails
    })
  } catch (error) {
    console.error('Error fetching recomendations movies:', error)
    return NextResponse.json(
      { error: 'Error al obtener películas recomendadas' },
      { status: 500 }
    )
  }
} 