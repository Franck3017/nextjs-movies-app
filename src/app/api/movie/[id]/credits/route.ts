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
    const url = `https://api.themoviedb.org/3/movie/${params.id}/credits?api_key=${TMDB_API_KEY}&language=es-ES`
    
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(`TMDB API error: ${data.status_message || 'Unknown error'}`)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Movie credits API error:', error)
    return NextResponse.json(
      { error: 'Error fetching movie credits' },
      { status: 500 }
    )
  }
} 