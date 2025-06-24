// Testing configuration
export const TEST_CONFIG = {
  // Test data
  mockData: {
    movies: [
      {
        id: 1,
        title: 'Test Movie 1',
        poster_path: '/test-poster-1.jpg',
        overview: 'This is a test movie overview',
        vote_average: 8.5,
        release_date: '2023-01-01',
        media_type: 'movie' as const,
      },
      {
        id: 2,
        title: 'Test Movie 2',
        poster_path: '/test-poster-2.jpg',
        overview: 'This is another test movie overview',
        vote_average: 7.2,
        release_date: '2023-02-01',
        media_type: 'movie' as const,
      },
    ],
    tvShows: [
      {
        id: 101,
        name: 'Test TV Show 1',
        poster_path: '/test-tv-poster-1.jpg',
        overview: 'This is a test TV show overview',
        vote_average: 9.1,
        first_air_date: '2023-01-01',
        media_type: 'tv' as const,
      },
      {
        id: 102,
        name: 'Test TV Show 2',
        poster_path: '/test-tv-poster-2.jpg',
        overview: 'This is another test TV show overview',
        vote_average: 8.7,
        first_air_date: '2023-02-01',
        media_type: 'tv' as const,
      },
    ],
    searchResults: [
      {
        id: 1,
        title: 'Test Search Result 1',
        poster_path: '/test-search-1.jpg',
        overview: 'Test search result overview',
        vote_average: 8.0,
        media_type: 'movie' as const,
        display_title: 'Test Search Result 1',
        release_year: 2023,
      },
      {
        id: 101,
        name: 'Test Search Result 2',
        poster_path: '/test-search-2.jpg',
        overview: 'Another test search result overview',
        vote_average: 7.5,
        media_type: 'tv' as const,
        display_title: 'Test Search Result 2',
        release_year: 2023,
      },
    ],
    movieDetails: {
      id: 1,
      title: 'Test Movie Details',
      poster_path: '/test-movie-details.jpg',
      backdrop_path: '/test-backdrop.jpg',
      overview: 'This is a detailed test movie overview',
      vote_average: 8.5,
      vote_count: 1000,
      release_date: '2023-01-01',
      runtime: 120,
      genres: [
        { id: 28, name: 'Acción' },
        { id: 12, name: 'Aventura' },
      ],
      production_companies: [
        { name: 'Test Studio', logo_path: '/test-logo.jpg' },
      ],
      spoken_languages: [
        { name: 'English', iso_639_1: 'en' },
        { name: 'Spanish', iso_639_1: 'es' },
      ],
      budget: 1000000,
      revenue: 5000000,
      status: 'Released',
      tagline: 'Test tagline',
      homepage: 'https://test-movie.com',
      imdb_id: 'tt1234567',
    },
    credits: {
      cast: [
        {
          id: 1,
          name: 'Test Actor 1',
          character: 'Test Character 1',
          profile_path: '/test-actor-1.jpg',
          order: 0,
        },
        {
          id: 2,
          name: 'Test Actor 2',
          character: 'Test Character 2',
          profile_path: '/test-actor-2.jpg',
          order: 1,
        },
      ],
      crew: [
        {
          id: 101,
          name: 'Test Director',
          job: 'Director',
          department: 'Directing',
          profile_path: '/test-director.jpg',
        },
        {
          id: 102,
          name: 'Test Producer',
          job: 'Producer',
          department: 'Production',
          profile_path: '/test-producer.jpg',
        },
      ],
    },
  },

  // Test utilities
  utilities: {
    // Mock fetch function
    mockFetch: (response: unknown, status: number = 200, delay: number = 100) => {
      return new Promise<Response>((resolve) => {
        setTimeout(() => {
          resolve({
            ok: status >= 200 && status < 300,
            status,
            json: () => Promise.resolve(response),
            text: () => Promise.resolve(JSON.stringify(response)),
          } as Response)
        }, delay)
      })
    },

    // Mock SWR response
    mockSWRResponse: <T>(data: T, error: Error | null = null, isLoading = false) => {
      return {
        data,
        error,
        isLoading,
        mutate: () => Promise.resolve(),
        isValidating: false,
      }
    },

    // Test user interactions
    userInteractions: {
      click: (element: HTMLElement) => {
        element.click()
      },
      type: (element: HTMLInputElement, text: string) => {
        element.value = text
        element.dispatchEvent(new Event('input', { bubbles: true }))
      },
      submit: (form: HTMLFormElement) => {
        form.dispatchEvent(new Event('submit', { bubbles: true }))
      },
    },

    // Test environment helpers
    environment: {
      isTest: () => process.env.NODE_ENV === 'test',
      isDevelopment: () => process.env.NODE_ENV === 'development',
      isProduction: () => process.env.NODE_ENV === 'production',
    },
  },

  // Test constants
  constants: {
    TEST_TIMEOUT: 5000,
    ANIMATION_DELAY: 100,
    API_DELAY: 200,
    DEBOUNCE_DELAY: 300,
  },
} as const

// Development helpers
export const DEV_CONFIG = {
  // Debug flags
  debug: {
    showPerformanceMetrics: process.env.NODE_ENV === 'development',
    logApiCalls: process.env.NODE_ENV === 'development',
    logStateChanges: process.env.NODE_ENV === 'development',
    logErrors: true,
  },

  // Development utilities
  utilities: {
    // Performance measurement
    measurePerformance: <T>(name: string, fn: () => T): T => {
      if (process.env.NODE_ENV === 'development') {
        const start = performance.now()
        const result = fn()
        const end = performance.now()
        console.log(`${name} took ${end - start}ms`)
        return result
      }
      return fn()
    },

    // Async performance measurement
    measureAsyncPerformance: async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
      if (process.env.NODE_ENV === 'development') {
        const start = performance.now()
        const result = await fn()
        const end = performance.now()
        console.log(`${name} took ${end - start}ms`)
        return result
      }
      return fn()
    },

    // Debug logging
    log: (message: string, data?: unknown) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEBUG] ${message}`, data)
      }
    },

    // Error logging
    logError: (error: unknown, context?: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.error(`[ERROR] ${context || 'Unknown context'}:`, error)
      }
    },

    // API call logging
    logApiCall: (endpoint: string, method: string, data?: unknown) => {
      if (process.env.NODE_ENV === 'development' && DEV_CONFIG.debug.logApiCalls) {
        console.log(`[API] ${method} ${endpoint}`, data)
      }
    },

    // State change logging
    logStateChange: (component: string, prevState: unknown, nextState: unknown) => {
      if (process.env.NODE_ENV === 'development' && DEV_CONFIG.debug.logStateChanges) {
        console.log(`[STATE] ${component}:`, { prev: prevState, next: nextState })
      }
    },
  },

  // Mock data for development
  mockData: {
    // Use test data in development
    ...TEST_CONFIG.mockData,
  },
} as const

// Export combined configuration
export const CONFIG = {
  test: TEST_CONFIG,
  dev: DEV_CONFIG,
} as const 