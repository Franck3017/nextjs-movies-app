import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const TMDB_API_KEY = process.env.TMDB_API_KEY
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key not configured' }, { status: 500 })
  }

  try {
    const url = `https://api.themoviedb.org/3/movie/${params.id}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=credits,videos,similar,recommendations`
    
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(`TMDB API error: ${data.status_message || 'Unknown error'}`)
    }

    // Extraer solo los campos relevantes
    const {
      id,
      title,
      overview,
      poster_path,
      backdrop_path,
      vote_average,
      vote_count,
      release_date,
      runtime,
      genres,
      credits,
      videos,
      similar,
      recommendations,
      popularity,
      production_companies,
      budget,
      revenue
    } = data

    return NextResponse.json({
      id,
      title,
      overview,
      poster_path,
      backdrop_path,
      vote_average,
      vote_count,
      release_date,
      runtime,
      genres,
      credits,
      videos,
      similar,
      recommendations,
      popularity,
      production_companies,
      budget,
      revenue
    })
  } catch (error) {
    console.error('Movie details API error:', error)
    return NextResponse.json(
      { error: 'Error fetching movie details' },
      { status: 500 }
    )
  }
} 