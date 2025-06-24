// Validation schemas and rules
export const VALIDATION_RULES = {
  // Search validation
  search: {
    minLength: 2,
    maxLength: 100,
    allowedCharacters: /^[a-zA-Z0-9\s\-_.,!?()]+$/,
  },
  
  // API validation
  api: {
    maxRetries: 3,
    timeout: 10000,
    rateLimit: {
      requests: 100,
      window: 60000, // 1 minute
    },
  },
  
  // Image validation
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxDimensions: {
      width: 1920,
      height: 1080,
    },
  },
  
  // Form validation
  form: {
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      maxLength: 254,
    },
    password: {
      minLength: 8,
      maxLength: 128,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    },
    username: {
      minLength: 3,
      maxLength: 30,
      pattern: /^[a-zA-Z0-9_-]+$/,
    },
  },
} as const

// Validation functions
export const validateSearchQuery = (query: string): { isValid: boolean; error?: string } => {
  if (!query || query.trim().length === 0) {
    return { isValid: false, error: 'La búsqueda no puede estar vacía' }
  }
  
  if (query.trim().length < VALIDATION_RULES.search.minLength) {
    return { 
      isValid: false, 
      error: `La búsqueda debe tener al menos ${VALIDATION_RULES.search.minLength} caracteres` 
    }
  }
  
  if (query.length > VALIDATION_RULES.search.maxLength) {
    return { 
      isValid: false, 
      error: `La búsqueda no puede tener más de ${VALIDATION_RULES.search.maxLength} caracteres` 
    }
  }
  
  if (!VALIDATION_RULES.search.allowedCharacters.test(query)) {
    return { 
      isValid: false, 
      error: 'La búsqueda contiene caracteres no permitidos' 
    }
  }
  
  return { isValid: true }
}

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'El email es requerido' }
  }
  
  if (email.length > VALIDATION_RULES.form.email.maxLength) {
    return { 
      isValid: false, 
      error: `El email no puede tener más de ${VALIDATION_RULES.form.email.maxLength} caracteres` 
    }
  }
  
  if (!VALIDATION_RULES.form.email.pattern.test(email)) {
    return { isValid: false, error: 'El formato del email no es válido' }
  }
  
  return { isValid: true }
}

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password || password.length === 0) {
    return { isValid: false, error: 'La contraseña es requerida' }
  }
  
  if (password.length < VALIDATION_RULES.form.password.minLength) {
    return { 
      isValid: false, 
      error: `La contraseña debe tener al menos ${VALIDATION_RULES.form.password.minLength} caracteres` 
    }
  }
  
  if (password.length > VALIDATION_RULES.form.password.maxLength) {
    return { 
      isValid: false, 
      error: `La contraseña no puede tener más de ${VALIDATION_RULES.form.password.maxLength} caracteres` 
    }
  }
  
  if (!VALIDATION_RULES.form.password.pattern.test(password)) {
    return { 
      isValid: false, 
      error: 'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial' 
    }
  }
  
  return { isValid: true }
}

export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (!username || username.trim().length === 0) {
    return { isValid: false, error: 'El nombre de usuario es requerido' }
  }
  
  if (username.length < VALIDATION_RULES.form.username.minLength) {
    return { 
      isValid: false, 
      error: `El nombre de usuario debe tener al menos ${VALIDATION_RULES.form.username.minLength} caracteres` 
    }
  }
  
  if (username.length > VALIDATION_RULES.form.username.maxLength) {
    return { 
      isValid: false, 
      error: `El nombre de usuario no puede tener más de ${VALIDATION_RULES.form.username.maxLength} caracteres` 
    }
  }
  
  if (!VALIDATION_RULES.form.username.pattern.test(username)) {
    return { 
      isValid: false, 
      error: 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos' 
    }
  }
  
  return { isValid: true }
}

export const validateImage = (file: File): { isValid: boolean; error?: string } => {
  if (!file) {
    return { isValid: false, error: 'No se seleccionó ningún archivo' }
  }
  
  if (file.size > VALIDATION_RULES.image.maxSize) {
    return { 
      isValid: false, 
      error: `El archivo no puede ser mayor a ${VALIDATION_RULES.image.maxSize / (1024 * 1024)}MB` 
    }
  }
  
  if (!VALIDATION_RULES.image.allowedTypes.includes(file.type as 'image/jpeg' | 'image/png' | 'image/webp')) {
    return { 
      isValid: false, 
      error: 'Solo se permiten archivos de imagen (JPEG, PNG, WebP)' 
    }
  }
  
  return { isValid: true }
}

export const validateApiResponse = (response: Response): { isValid: boolean; error?: string } => {
  if (!response.ok) {
    switch (response.status) {
      case 400:
        return { isValid: false, error: 'Solicitud incorrecta' }
      case 401:
        return { isValid: false, error: 'No autorizado' }
      case 403:
        return { isValid: false, error: 'Acceso denegado' }
      case 404:
        return { isValid: false, error: 'Recurso no encontrado' }
      case 429:
        return { isValid: false, error: 'Demasiadas solicitudes' }
      case 500:
        return { isValid: false, error: 'Error interno del servidor' }
      default:
        return { isValid: false, error: `Error ${response.status}: ${response.statusText}` }
    }
  }
  
  return { isValid: true }
}

// Sanitization functions
export const sanitizeSearchQuery = (query: string): string => {
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[&]/g, '&amp;') // Escape ampersands
    .slice(0, VALIDATION_RULES.search.maxLength) // Limit length
}

export const sanitizeEmail = (email: string): string => {
  return email
    .trim()
    .toLowerCase()
    .slice(0, VALIDATION_RULES.form.email.maxLength)
}

export const sanitizeUsername = (username: string): string => {
  return username
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9_-]/g, '') // Remove invalid characters
    .slice(0, VALIDATION_RULES.form.username.maxLength)
}

// Rate limiting utilities
export class RateLimiter {
  private requests: number[] = []
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  canMakeRequest(): boolean {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.windowMs)
    
    if (this.requests.length >= this.maxRequests) {
      return false
    }
    
    this.requests.push(now)
    return true
  }

  getRemainingRequests(): number {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.windowMs)
    return Math.max(0, this.maxRequests - this.requests.length)
  }

  getTimeUntilReset(): number {
    if (this.requests.length === 0) return 0
    const oldestRequest = Math.min(...this.requests)
    return Math.max(0, this.windowMs - (Date.now() - oldestRequest))
  }
} 