import { useState, useEffect } from 'react'

export interface FeaturedContent {
  id: number
  title: string
  overview: string
  backdrop_path: string
  poster_path: string
  vote_average: number
  media_type: 'movie' | 'tv'
  release_date?: string
  first_air_date?: string
  runtime?: number
  episode_run_time?: number[]
  genres?: Array<{ id: number; name: string }>
  cast?: Array<{ id: number; name: string; character: string; profile_path?: string }>
  trailerKey?: string
  budget?: number
  revenue?: number
  production_companies?: Array<{ id: number; name: string; logo_path?: string }>
  vote_count?: number
  popularity?: number
}

export const useFeaturedContent = (type: 'movies' | 'tv') => {
  const [content, setContent] = useState<FeaturedContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch popular content
        const response = await fetch(`/api/${type}/popular`)
        if (!response.ok) {
          throw new Error('Failed to fetch featured content')
        }
        
        const data = await response.json()
        
        if (data.results && data.results.length > 0) {
          const featured = data.results[0]
          
          // Fetch detailed information for the featured item
          const detailResponse = await fetch(`/api/${type === 'movies' ? 'movie' : 'tv'}/${featured.id}`)
          const detailData = detailResponse.ok ? await detailResponse.json() : {}
          
          // Fetch credits
          const creditsResponse = await fetch(`/api/${type === 'movies' ? 'movie' : 'tv'}/${featured.id}/credits`)
          const creditsData = creditsResponse.ok ? await creditsResponse.json() : {}
          
          // Fetch trailers (videos)
          const videosResponse = await fetch(`/api/${type === 'movies' ? 'movie' : 'tv'}/${featured.id}`)
          const videosData = videosResponse.ok ? await videosResponse.json() : {}
          
          // Find trailer key
          let trailerKey: string | undefined
          if (videosData.videos?.results) {
            const trailer = videosData.videos.results.find((video: any) => 
              video.type === 'Trailer' && video.site === 'YouTube'
            )
            trailerKey = trailer?.key
          }

          setContent({
            id: featured.id,
            title: featured.title || featured.name || '',
            overview: featured.overview || '',
            backdrop_path: featured.backdrop_path || '',
            poster_path: featured.poster_path || '',
            vote_average: featured.vote_average || 0,
            media_type: type === 'movies' ? 'movie' : 'tv',
            release_date: featured.release_date || detailData.release_date,
            first_air_date: featured.first_air_date || detailData.first_air_date,
            runtime: detailData.runtime || (detailData.episode_run_time?.[0] || undefined),
            episode_run_time: detailData.episode_run_time,
            genres: detailData.genres || [],
            cast: creditsData.cast?.slice(0, 5).map((actor: any) => ({
              id: actor.id,
              name: actor.name,
              character: actor.character,
              profile_path: actor.profile_path
            })) || [],
            trailerKey,
            budget: detailData.budget,
            revenue: detailData.revenue,
            production_companies: detailData.production_companies || [],
            vote_count: featured.vote_count || detailData.vote_count,
            popularity: featured.popularity || detailData.popularity
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching featured content')
        console.error('Error fetching featured content:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedContent()
  }, [type])

  return {
    content,
    loading,
    error
  }
} 