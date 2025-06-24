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
    const url = `https://api.themoviedb.org/3/tv/${params.id}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=credits,videos,similar,recommendations`
    
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(`TMDB API error: ${data.status_message || 'Unknown error'}`)
    }

    // Extraer solo los campos relevantes
    const {
      id,
      name,
      overview,
      poster_path,
      backdrop_path,
      vote_average,
      vote_count,
      first_air_date,
      episode_run_time,
      genres,
      credits,
      videos,
      similar,
      recommendations,
      popularity,
      production_companies,
      number_of_seasons,
      number_of_episodes
    } = data

    return NextResponse.json({
      id,
      name,
      overview,
      poster_path,
      backdrop_path,
      vote_average,
      vote_count,
      first_air_date,
      episode_run_time,
      genres,
      credits,
      videos,
      similar,
      recommendations,
      popularity,
      production_companies,
      number_of_seasons,
      number_of_episodes
    })
  } catch (error) {
    console.error('TV details API error:', error)
    return NextResponse.json(
      { error: 'Error fetching TV show details' },
      { status: 500 }
    )
  }
} 