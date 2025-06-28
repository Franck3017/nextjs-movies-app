import { NextRequest, NextResponse } from 'next/server'

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!TMDB_API_KEY) {
      return NextResponse.json(
        { error: 'TMDB API key no configurada' },
        { status: 500 }
      )
    }

    const personId = params.id

    // Fetch person details with combined credits and images
    const personResponse = await fetch(
      `${TMDB_BASE_URL}/person/${personId}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=combined_credits,images,external_ids`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!personResponse.ok) {
      throw new Error(`Error al obtener datos de TMDB: ${personResponse.status}`)
    }

    const personData = await personResponse.json()

    // Fetch detailed information for all movies and TV shows in cast
    if (personData.combined_credits?.cast) {
      console.log(`Fetching details for ${personData.combined_credits.cast.length} cast items`)
      
      const detailedResults = await Promise.all(
        personData.combined_credits.cast.map(async (item: any) => {
          try {
            const detailEndpoint = item.media_type === 'movie' ? 'movie' : 'tv'
            const detailUrl = `${TMDB_BASE_URL}/${detailEndpoint}/${item.id}?api_key=${TMDB_API_KEY}&language=es-ES`
            
            const detailResponse = await fetch(detailUrl)
            if (detailResponse.ok) {
              const detailData = await detailResponse.json()
              
              // Log for debugging
              if (item.media_type === 'movie' && detailData.runtime) {
                console.log(`Movie ${item.id} (${item.title}): runtime = ${detailData.runtime}, genres = ${detailData.genres?.length || 0}`)
              } else if (item.media_type === 'tv' && detailData.episode_run_time) {
                console.log(`TV ${item.id} (${item.name}): episode_run_time = ${detailData.episode_run_time}, genres = ${detailData.genres?.length || 0}`)
              }
              
              return {
                ...item,
                runtime: item.media_type === 'movie' ? detailData.runtime : undefined,
                episode_run_time: item.media_type === 'tv' ? detailData.episode_run_time : undefined,
                genres: detailData.genres || []
              }
            } else {
              console.warn(`Failed to fetch details for ${item.media_type} ${item.id}: ${detailResponse.status}`)
              return item
            }
          } catch (error) {
            console.error(`Error fetching details for ${item.media_type} ${item.id}:`, error)
            return item
          }
        })
      )

      // Update the cast with detailed information
      personData.combined_credits.cast = detailedResults
    }

    return NextResponse.json(personData)
  } catch (error) {
    console.error('Error en API person:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 