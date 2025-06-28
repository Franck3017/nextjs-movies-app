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
      `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${apiKey}&language=es-ES&page=1`,
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
    
    // Obtener detalles completos de cada serie para incluir episode_run_time y géneros
    const showsWithDetails = await Promise.all(
      data.results.slice(0, 10).map(async (show: any) => {
        try {
          const detailResponse = await fetch(
            `https://api.themoviedb.org/3/tv/${show.id}?api_key=${apiKey}&language=es-ES`
          )
          
          if (detailResponse.ok) {
            const detailData = await detailResponse.json()
            return {
              ...show,
              media_type: 'tv',
              episode_run_time: detailData.episode_run_time,
              genres: detailData.genres
            }
          } else {
            // Si falla la obtención de detalles, devolver solo los datos básicos
            return {
              ...show,
              media_type: 'tv',
              episode_run_time: undefined,
              genres: []
            }
          }
        } catch (error) {
          console.error(`Error fetching details for TV show ${show.id}:`, error)
          return {
            ...show,
            media_type: 'tv',
            episode_run_time: undefined,
            genres: []
          }
        }
      })
    )

    return NextResponse.json({
      ...data,
      results: showsWithDetails
    })
  } catch (error) {
    console.error('Error fetching recomendations TV shows:', error)
    return NextResponse.json(
      { error: 'Error al obtener series recomendadas' },
      { status: 500 }
    )
  }
} 