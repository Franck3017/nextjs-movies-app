import { NextRequest, NextResponse } from 'next/server'

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  try {
    if (!TMDB_API_KEY) {
      return NextResponse.json(
        { error: 'TMDB API key no configurada' },
        { status: 500 }
      )
    }

    const { type, id } = params

    // Fetch all genres to find the one with matching ID
    const endpoint = type === 'movies' ? 'genre/movie/list' : 'genre/tv/list'
    
    const response = await fetch(
      `${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}&language=es-ES`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Error al obtener datos de TMDB: ${response.status}`)
    }

    const data = await response.json()
    const genre = data.genres.find((g: any) => g.id.toString() === id)

    if (!genre) {
      return NextResponse.json(
        { error: 'Género no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(genre)
  } catch (error) {
    console.error('Error en API genre info:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 