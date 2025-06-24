// API Response Types
export interface TMDBResponse<T = any> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface MovieItem {
  id: number
  title?: string
  name?: string
  poster_path: string
  backdrop_path: string
  overview: string
  vote_average: number
  vote_count: number
  release_date?: string
  first_air_date?: string
  popularity: number
  media_type?: 'movie' | 'tv'
}

export interface SearchResult extends MovieItem {
  media_type: 'movie' | 'tv'
  display_title: string
  release_year: number | null
}

// Movie Details Types
export interface MovieDetails extends MovieItem {
  runtime?: number
  episode_run_time?: number[]
  genres: Array<{ id: number; name: string }>
  production_companies: Array<{ name: string; logo_path?: string }>
  spoken_languages: Array<{ name: string; iso_639_1: string }>
  budget?: number
  revenue?: number
  status: string
  tagline?: string
  homepage?: string
  imdb_id?: string
}

// Credits Types
export interface Person {
  id: number
  name: string
  character?: string
  job?: string
  profile_path?: string
  order?: number
}

export interface Credits {
  cast: Person[]
  crew: Person[]
}

// Search Types
export interface SearchFilters {
  activeFilter: 'all' | 'movie' | 'tv'
  query: string
  page: number
}

// UI Types
export interface NotificationItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export interface Category {
  id: string
  title: string
  fetchUrl: string
  showRating: boolean
}

// Component Props Types
export interface MovieCardProps {
  id: number
  title: string
  posterPath: string
  overview: string
  rating?: number
  mediaType?: 'movie' | 'tv'
  year?: number | null
  priority?: boolean
  release_date?: string
  first_air_date?: string
  runtime?: number
  genres?: string[]
}

export interface SearchFormProps {
  query: string
  onQueryChange: (query: string) => void
  onSubmit: (e: React.FormEvent) => void
  onClear: () => void
  placeholder?: string
  isSearching?: boolean
  isRealTimeSearch?: boolean
  suggestions?: string[]
}

export interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
  error: Error | null
  searchQuery: string
  hasResults: boolean
  totalResults: number
  filteredCount: number
  isRealTimeSearch?: boolean
}

export interface SearchFiltersProps {
  activeFilter: 'all' | 'movie' | 'tv'
  onFilterChange: (filter: 'all' | 'movie' | 'tv') => void
  className?: string
}

export interface CategoryRowProps {
  title: string
  fetchUrl: string
  showRating?: boolean
}

export interface AvatarGroupProps {
  people: Person[]
  title: string
  type: 'cast' | 'crew'
  maxVisible?: number
  className?: string
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'white' | 'red' | 'blue'
  text?: string
}

export interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export interface HeroBannerProps {
  backdropPath: string
  title: string
  overview: string
  rating?: number
}

export interface LayoutProps {
  children: React.ReactNode
}

export interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
} 