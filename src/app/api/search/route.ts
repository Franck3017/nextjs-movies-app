import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || searchParams.get('q')
  const type = searchParams.get('type') || 'all'
  const page = searchParams.get('page') || '1'

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  const TMDB_API_KEY = process.env.TMDB_API_KEY
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key not configured' }, { status: 500 })
  }

  try {
    let results = []
    let totalResults = 0
    let totalPages = 0

    if (type === 'all') {
      // Search both movies and TV shows
      const [moviesResponse, tvResponse] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=es-ES&include_adult=false`),
        fetch(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=es-ES&include_adult=false`)
      ])

      const [moviesData, tvData] = await Promise.all([
        moviesResponse.json(),
        tvResponse.json()
      ])

      if (!moviesResponse.ok) {
        throw new Error(`TMDB API error: ${moviesData.status_message || 'Unknown error'}`)
      }

      if (!tvResponse.ok) {
        throw new Error(`TMDB API error: ${tvData.status_message || 'Unknown error'}`)
      }

      // Combine and sort results by popularity
      const moviesWithType = moviesData.results.map((item: any) => ({ ...item, media_type: 'movie' }))
      const tvWithType = tvData.results.map((item: any) => ({ ...item, media_type: 'tv' }))
      
      const combinedResults = [...moviesWithType, ...tvWithType]
        .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
        .slice(0, 20) // Limit to 20 results

      // Fetch additional details for each result
      const processedResults = await Promise.all(
        combinedResults.map(async (item: any) => {
          try {
            const detailUrl = `https://api.themoviedb.org/3/${item.media_type}/${item.id}?api_key=${TMDB_API_KEY}&language=es-ES`
            const detailResponse = await fetch(detailUrl)
            const detailData = await detailResponse.json()
            
            return {
              ...item,
              runtime: item.media_type === 'movie' ? detailData.runtime : undefined,
              episode_run_time: item.media_type === 'tv' ? detailData.episode_run_time : undefined,
              genres: detailData.genres
            }
          } catch (error) {
            console.error(`Error fetching details for ${item.media_type} ${item.id}:`, error)
            return item
          }
        })
      )

      results = processedResults
      totalResults = moviesData.total_results + tvData.total_results
      totalPages = Math.max(moviesData.total_pages, tvData.total_pages)
    } else {
      // Search specific type
      const url = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=es-ES&include_adult=false`
      
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(`TMDB API error: ${data.status_message || 'Unknown error'}`)
      }

      const resultsWithType = data.results.map((item: any) => ({ ...item, media_type: type }))

      // Fetch additional details for each result
      const processedResults = await Promise.all(
        resultsWithType.map(async (item: any) => {
          try {
            const detailUrl = `https://api.themoviedb.org/3/${item.media_type}/${item.id}?api_key=${TMDB_API_KEY}&language=es-ES`
            const detailResponse = await fetch(detailUrl)
            const detailData = await detailResponse.json()
            
            return {
              ...item,
              runtime: item.media_type === 'movie' ? detailData.runtime : undefined,
              episode_run_time: item.media_type === 'tv' ? detailData.episode_run_time : undefined,
              genres: detailData.genres
            }
          } catch (error) {
            console.error(`Error fetching details for ${item.media_type} ${item.id}:`, error)
            return item
          }
        })
      )

      results = processedResults
      totalResults = data.total_results
      totalPages = data.total_pages
    }

    return NextResponse.json({
      results,
      total_results: totalResults,
      total_pages: totalPages,
      current_page: parseInt(page),
      query
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Error searching content' },
      { status: 500 }
    )
  }
} 