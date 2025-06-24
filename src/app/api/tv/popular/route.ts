import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const TMDB_API_KEY = process.env.TMDB_API_KEY
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key not configured' }, { status: 500 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const sortBy = searchParams.get('sort_by') || 'popularity.desc'
    const sortOrder = searchParams.get('sort_order') || 'desc'
    
    // Construir el parámetro de ordenamiento para TMDB
    let tmdbSortBy = 'popularity.desc'
    if (sortBy === 'rating') {
      tmdbSortBy = `vote_average.${sortOrder}`
    } else if (sortBy === 'date') {
      tmdbSortBy = `first_air_date.${sortOrder}`
    } else if (sortBy === 'title') {
      tmdbSortBy = `name.${sortOrder}`
    } else {
      tmdbSortBy = `popularity.${sortOrder}`
    }
    
    const url = `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=es-ES&page=${page}&sort_by=${tmdbSortBy}&include_adult=false`
    
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(`TMDB API error: ${data.status_message || 'Unknown error'}`)
    }

    // Procesar los resultados para incluir información adicional
    const processedResults = await Promise.all(
      data.results.map(async (tv: any) => {
        try {
          // Obtener detalles completos de cada serie
          const detailUrl = `https://api.themoviedb.org/3/tv/${tv.id}?api_key=${TMDB_API_KEY}&language=es-ES`
          const detailResponse = await fetch(detailUrl)
          const detailData = await detailResponse.json()
          
          return {
            ...tv,
            episode_run_time: detailData.episode_run_time,
            genres: detailData.genres
          }
        } catch (error) {
          console.error(`Error fetching details for TV show ${tv.id}:`, error)
          return tv
        }
      })
    )

    return NextResponse.json({
      ...data,
      results: processedResults
    })
  } catch (error) {
    console.error('Popular TV shows API error:', error)
    return NextResponse.json(
      { error: 'Error fetching popular TV shows' },
      { status: 500 }
    )
  }
} 