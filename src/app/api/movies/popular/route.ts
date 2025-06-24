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
      tmdbSortBy = `release_date.${sortOrder}`
    } else if (sortBy === 'title') {
      tmdbSortBy = `title.${sortOrder}`
    } else {
      tmdbSortBy = `popularity.${sortOrder}`
    }
    
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=es-ES&page=${page}&sort_by=${tmdbSortBy}&include_adult=false`
    
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(`TMDB API error: ${data.status_message || 'Unknown error'}`)
    }

    // Procesar los resultados para incluir información adicional
    const processedResults = await Promise.all(
      data.results.map(async (movie: any) => {
        try {
          // Obtener detalles completos de cada película
          const detailUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=es-ES`
          const detailResponse = await fetch(detailUrl)
          const detailData = await detailResponse.json()
          
          return {
            ...movie,
            runtime: detailData.runtime,
            genres: detailData.genres
          }
        } catch (error) {
          console.error(`Error fetching details for movie ${movie.id}:`, error)
          return movie
        }
      })
    )

    return NextResponse.json({
      ...data,
      results: processedResults
    })
  } catch (error) {
    console.error('Popular movies API error:', error)
    return NextResponse.json(
      { error: 'Error fetching popular movies' },
      { status: 500 }
    )
  }
} 