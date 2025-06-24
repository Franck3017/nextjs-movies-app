const API_BASE = '/api'

interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          error: errorData.message || `HTTP error! status: ${response.status}`,
          status: response.status,
        }
      }

      const data = await response.json()
      return {
        data,
        status: response.status,
      }
    } catch (error) {
      console.error('API request failed:', error)
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 500,
      }
    }
  }

  // Search methods
  async search(query: string, page: number = 1) {
    return this.request(`/search?query=${encodeURIComponent(query)}&page=${page}`)
  }

  // Movie methods
  async getPopularMovies() {
    return this.request('/movies/popular')
  }

  async getTopRatedMovies() {
    return this.request('/movies/top_rated')
  }

  async getMoviesByGenre(genreId: string) {
    return this.request(`/movies/genre/${genreId}`)
  }

  // TV methods
  async getPopularTVShows() {
    return this.request('/tv/popular')
  }

  async getTopRatedTVShows() {
    return this.request('/tv/top_rated')
  }

  async getTVShowsByGenre(genreId: string) {
    return this.request(`/tv/genre/${genreId}`)
  }
}

export const apiService = new ApiService() 