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
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const sortBy = searchParams.get('sort_by') || 'popularity.desc'
    const sortOrder = searchParams.get('sort_order') || 'desc'

    // Map sort options to TMDB parameters
    const sortMapping: Record<string, string> = {
      'popularity': 'popularity',
      'rating': 'vote_average',
      'date': type === 'movies' ? 'primary_release_date' : 'first_air_date',
      'title': 'title'
    }

    const tmdbSortBy = sortMapping[sortBy] || 'popularity'
    const tmdbSortOrder = sortOrder === 'asc' ? 'asc' : 'desc'

    const endpoint = type === 'movies' ? 'discover/movie' : 'discover/tv'
    
    const response = await fetch(
      `${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}&language=es-ES&with_genres=${id}&sort_by=${tmdbSortBy}.${tmdbSortOrder}&page=${page}&include_adult=false&include_video=false`,
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

    // Transform the data to include media_type
    const transformedResults = data.results.map((item: any) => ({
      ...item,
      media_type: type === 'movies' ? 'movie' : 'tv'
    }))

    return NextResponse.json({
      ...data,
      results: transformedResults
    })
  } catch (error) {
    console.error('Error en API genre:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 