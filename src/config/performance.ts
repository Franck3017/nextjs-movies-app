import React from 'react'

// Performance configuration and optimizations
export const PERFORMANCE_CONFIG = {
  // Image optimization
  images: {
    // Lazy loading threshold
    lazyLoadThreshold: 0.1, // 10% of viewport
    
    // Preload critical images
    preloadCritical: true,
    
    // Image sizes for different breakpoints
    sizes: {
      poster: {
        mobile: 'w185',
        tablet: 'w342',
        desktop: 'w500',
        large: 'w780',
      },
      backdrop: {
        mobile: 'w300',
        tablet: 'w780',
        desktop: 'w1280',
        large: 'original',
      },
      profile: {
        small: 'w45',
        medium: 'w185',
        large: 'h632',
      },
    },
    
    // Placeholder images
    placeholders: {
      poster: '/placeholder-poster.jpg',
      backdrop: '/placeholder-backdrop.jpg',
      profile: '/placeholder-profile.jpg',
    },
  },

  // Caching strategies
  cache: {
    // Browser cache
    browser: {
      static: 'public, max-age=31536000, immutable', // 1 year
      dynamic: 'public, max-age=3600, s-maxage=86400', // 1 hour browser, 1 day CDN
      api: 'public, max-age=300, s-maxage=3600', // 5 minutes browser, 1 hour CDN
    },
    
    // SWR cache configuration
    swr: {
      default: {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 300000, // 5 minutes
        keepPreviousData: true,
        errorRetryCount: 3,
        errorRetryInterval: 5000, // 5 seconds
      },
      hero: {
        dedupingInterval: 600000, // 10 minutes
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      },
      search: {
        dedupingInterval: 60000, // 1 minute
        keepPreviousData: true,
      },
      details: {
        dedupingInterval: 1800000, // 30 minutes
        revalidateOnFocus: false,
      },
    },
  },

  // Bundle optimization
  bundle: {
    // Code splitting
    dynamicImports: {
      components: {
        // Simplified imports to avoid webpack issues
        'MovieCard': () => import('../components/MovieCard').then(m => m.default),
        'SearchForm': () => import('../components/SearchForm').then(m => m.default),
        'AvatarGroup': () => import('../components/AvatarGroup').then(m => m.default),
      },
      pages: {
        'MovieDetails': () => import('../app/movie/[id]/page').then(m => m.default),
        'SearchPage': () => import('../app/search/page').then(m => m.default),
      },
    },
    
    // Preload critical resources
    preload: [
      '/api/movies/popular',
      '/api/tv/popular',
    ],
    
    // Prefetch resources
    prefetch: [
      '/search',
      '/api/search',
    ],
  },

  // Animation performance
  animations: {
    // Reduced motion support
    respectReducedMotion: true,
    
    // Animation durations
    durations: {
      fast: 150,
      normal: 300,
      slow: 500,
      verySlow: 1000,
    },
    
    // Stagger delays
    stagger: {
      fast: 50,
      normal: 100,
      slow: 200,
    },
    
    // Performance optimizations
    optimizations: {
      useTransform: true, // Use transform instead of top/left
      useWillChange: true, // Use will-change CSS property
      useBackfaceVisibility: true, // Use backface-visibility: hidden
    },
  },

  // API performance
  api: {
    // Request timeouts
    timeouts: {
      short: 5000, // 5 seconds
      normal: 10000, // 10 seconds
      long: 30000, // 30 seconds
    },
    
    // Retry configuration
    retry: {
      maxAttempts: 3,
      baseDelay: 1000, // 1 second
      maxDelay: 10000, // 10 seconds
      backoffMultiplier: 2,
    },
    
    // Rate limiting
    rateLimit: {
      requests: 100,
      window: 60000, // 1 minute
    },
    
    // Request deduplication
    deduplication: {
      enabled: true,
      window: 5000, // 5 seconds
    },
  },

  // Memory management
  memory: {
    // Virtual scrolling
    virtualScrolling: {
      enabled: true,
      itemHeight: 400, // Estimated item height
      overscan: 5, // Number of items to render outside viewport
    },
    
    // Image cleanup
    imageCleanup: {
      enabled: true,
      interval: 300000, // 5 minutes
      maxAge: 1800000, // 30 minutes
    },
    
    // Event listener cleanup
    eventCleanup: {
      enabled: true,
      checkInterval: 60000, // 1 minute
    },
  },

  // Monitoring
  monitoring: {
    // Performance metrics
    metrics: {
      enabled: process.env.NODE_ENV === 'production',
      sampleRate: 0.1, // 10% of users
      endpoints: {
        webVitals: '/api/metrics/web-vitals',
        errors: '/api/metrics/errors',
        performance: '/api/metrics/performance',
      },
    },
    
    // Error tracking
    errorTracking: {
      enabled: process.env.NODE_ENV === 'production',
      sampleRate: 1.0, // 100% of errors
      ignorePatterns: [
        /ResizeObserver loop limit exceeded/,
        /Script error/,
        /Network request failed/,
      ],
    },
  },
} as const

// Performance utilities
export const performanceUtils = {
  // Debounce function
  debounce: <T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  // Throttle function
  throttle: <T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },

  // Intersection Observer for lazy loading
  createIntersectionObserver: (
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {}
  ): IntersectionObserver => {
    return new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: PERFORMANCE_CONFIG.images.lazyLoadThreshold,
      ...options,
    })
  },

  // Performance measurement
  measure: <T>(name: string, fn: () => T): T => {
    if (typeof performance !== 'undefined' && performance.mark) {
      const startMark = `${name}-start`
      const endMark = `${name}-end`
      
      performance.mark(startMark)
      const result = fn()
      performance.mark(endMark)
      performance.measure(name, startMark, endMark)
      
      return result
    }
    return fn()
  },

  // Async performance measurement
  measureAsync: async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    if (typeof performance !== 'undefined' && performance.mark) {
      const startMark = `${name}-start`
      const endMark = `${name}-end`
      
      performance.mark(startMark)
      const result = await fn()
      performance.mark(endMark)
      performance.measure(name, startMark, endMark)
      
      return result
    }
    return fn()
  },

  // Memory usage check
  getMemoryUsage: (): { used: number; total: number; percentage: number } | null => {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
      }
    }
    return null
  },

  // Check if device is low-end
  isLowEndDevice: (): boolean => {
    if (typeof navigator !== 'undefined') {
      const hardwareConcurrency = navigator.hardwareConcurrency || 1
      const deviceMemory = (navigator as any).deviceMemory || 4
      
      return hardwareConcurrency <= 2 || deviceMemory <= 2
    }
    return false
  },

  // Optimize for low-end devices
  optimizeForLowEnd: () => {
    if (performanceUtils.isLowEndDevice()) {
      // Reduce animation complexity
      document.documentElement.style.setProperty('--animation-duration', '0.1s')
      
      // Disable some heavy features
      // Note: These properties are read-only, so we'll use a different approach
      console.warn('Low-end device detected: Some features may be disabled for performance')
    }
  },
}

// Performance hooks
export const usePerformanceOptimizations = () => {
  // Apply optimizations on mount
  React.useEffect(() => {
    performanceUtils.optimizeForLowEnd()
  }, [])

  // Monitor memory usage in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        const memory = performanceUtils.getMemoryUsage()
        if (memory && memory.percentage > 80) {
          console.warn('High memory usage detected:', memory)
        }
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    }
    return undefined
  }, [])
} 