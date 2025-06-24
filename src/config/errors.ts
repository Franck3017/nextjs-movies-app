// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  TIMEOUT = 'TIMEOUT',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN',
}

// Error codes
export enum ErrorCode {
  // Network errors (1000-1999)
  NETWORK_OFFLINE = 1000,
  NETWORK_TIMEOUT = 1001,
  NETWORK_CONNECTION_FAILED = 1002,
  
  // API errors (2000-2999)
  API_INVALID_RESPONSE = 2000,
  API_RATE_LIMITED = 2001,
  API_UNAUTHORIZED = 2002,
  API_FORBIDDEN = 2003,
  API_NOT_FOUND = 2004,
  API_SERVER_ERROR = 2005,
  API_BAD_REQUEST = 2006,
  
  // Validation errors (3000-3999)
  VALIDATION_REQUIRED_FIELD = 3000,
  VALIDATION_INVALID_FORMAT = 3001,
  VALIDATION_TOO_SHORT = 3002,
  VALIDATION_TOO_LONG = 3003,
  VALIDATION_INVALID_CHARACTERS = 3004,
  
  // Authentication errors (4000-4999)
  AUTH_INVALID_CREDENTIALS = 4000,
  AUTH_TOKEN_EXPIRED = 4001,
  AUTH_TOKEN_INVALID = 4002,
  AUTH_USER_NOT_FOUND = 4003,
  
  // Client errors (5000-5999)
  CLIENT_INVALID_INPUT = 5000,
  CLIENT_MISSING_PERMISSIONS = 5001,
  CLIENT_RESOURCE_NOT_FOUND = 5002,
  
  // Server errors (6000-6999)
  SERVER_INTERNAL_ERROR = 6000,
  SERVER_DATABASE_ERROR = 6001,
  SERVER_EXTERNAL_SERVICE_ERROR = 6002,
  
  // Unknown errors (9000-9999)
  UNKNOWN_ERROR = 9000,
}

// Error messages
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // Network errors
  [ErrorCode.NETWORK_OFFLINE]: 'No hay conexión a internet. Verifica tu conexión.',
  [ErrorCode.NETWORK_TIMEOUT]: 'La conexión tardó demasiado. Intenta de nuevo.',
  [ErrorCode.NETWORK_CONNECTION_FAILED]: 'Error de conexión. Verifica tu internet.',
  
  // API errors
  [ErrorCode.API_INVALID_RESPONSE]: 'Respuesta inválida del servidor.',
  [ErrorCode.API_RATE_LIMITED]: 'Demasiadas solicitudes. Intenta más tarde.',
  [ErrorCode.API_UNAUTHORIZED]: 'No tienes permisos para acceder a este recurso.',
  [ErrorCode.API_FORBIDDEN]: 'Acceso denegado.',
  [ErrorCode.API_NOT_FOUND]: 'El recurso solicitado no fue encontrado.',
  [ErrorCode.API_SERVER_ERROR]: 'Error interno del servidor.',
  [ErrorCode.API_BAD_REQUEST]: 'Solicitud incorrecta.',
  
  // Validation errors
  [ErrorCode.VALIDATION_REQUIRED_FIELD]: 'Este campo es requerido.',
  [ErrorCode.VALIDATION_INVALID_FORMAT]: 'Formato inválido.',
  [ErrorCode.VALIDATION_TOO_SHORT]: 'El texto es demasiado corto.',
  [ErrorCode.VALIDATION_TOO_LONG]: 'El texto es demasiado largo.',
  [ErrorCode.VALIDATION_INVALID_CHARACTERS]: 'Caracteres no permitidos.',
  
  // Authentication errors
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'Credenciales inválidas.',
  [ErrorCode.AUTH_TOKEN_EXPIRED]: 'Sesión expirada. Inicia sesión de nuevo.',
  [ErrorCode.AUTH_TOKEN_INVALID]: 'Token inválido.',
  [ErrorCode.AUTH_USER_NOT_FOUND]: 'Usuario no encontrado.',
  
  // Client errors
  [ErrorCode.CLIENT_INVALID_INPUT]: 'Datos de entrada inválidos.',
  [ErrorCode.CLIENT_MISSING_PERMISSIONS]: 'No tienes permisos para realizar esta acción.',
  [ErrorCode.CLIENT_RESOURCE_NOT_FOUND]: 'Recurso no encontrado.',
  
  // Server errors
  [ErrorCode.SERVER_INTERNAL_ERROR]: 'Error interno del servidor.',
  [ErrorCode.SERVER_DATABASE_ERROR]: 'Error de base de datos.',
  [ErrorCode.SERVER_EXTERNAL_SERVICE_ERROR]: 'Error en servicio externo.',
  
  // Unknown errors
  [ErrorCode.UNKNOWN_ERROR]: 'Ha ocurrido un error inesperado.',
}

// Custom error class
export class AppError extends Error {
  public readonly type: ErrorType
  public readonly code: ErrorCode
  public readonly statusCode?: number
  public readonly isOperational: boolean
  public readonly timestamp: Date
  public readonly context?: Record<string, unknown>

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    statusCode?: number,
    isOperational: boolean = true,
    context?: Record<string, unknown>
  ) {
    super(message)
    
    this.name = 'AppError'
    this.type = type
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.timestamp = new Date()
    this.context = context
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }

  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      code: this.code,
      statusCode: this.statusCode,
      isOperational: this.isOperational,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      stack: this.stack,
    }
  }

  public getUserMessage(): string {
    return ERROR_MESSAGES[this.code] || this.message
  }
}

// Error factory functions
export const createNetworkError = (message?: string, context?: Record<string, unknown>): AppError => {
  return new AppError(
    message || ERROR_MESSAGES[ErrorCode.NETWORK_CONNECTION_FAILED],
    ErrorType.NETWORK,
    ErrorCode.NETWORK_CONNECTION_FAILED,
    0,
    true,
    context
  )
}

export const createApiError = (
  statusCode: number,
  message?: string,
  context?: Record<string, unknown>
): AppError => {
  let code: ErrorCode
  let type: ErrorType

  switch (statusCode) {
    case 400:
      code = ErrorCode.API_BAD_REQUEST
      type = ErrorType.API
      break
    case 401:
      code = ErrorCode.API_UNAUTHORIZED
      type = ErrorType.AUTHENTICATION
      break
    case 403:
      code = ErrorCode.API_FORBIDDEN
      type = ErrorType.AUTHORIZATION
      break
    case 404:
      code = ErrorCode.API_NOT_FOUND
      type = ErrorType.NOT_FOUND
      break
    case 429:
      code = ErrorCode.API_RATE_LIMITED
      type = ErrorType.RATE_LIMIT
      break
    case 500:
      code = ErrorCode.API_SERVER_ERROR
      type = ErrorType.SERVER
      break
    default:
      code = ErrorCode.API_INVALID_RESPONSE
      type = ErrorType.API
  }

  return new AppError(
    message || ERROR_MESSAGES[code],
    type,
    code,
    statusCode,
    true,
    context
  )
}

export const createValidationError = (
  code: ErrorCode,
  message?: string,
  context?: Record<string, unknown>
): AppError => {
  return new AppError(
    message || ERROR_MESSAGES[code],
    ErrorType.VALIDATION,
    code,
    400,
    true,
    context
  )
}

export const createTimeoutError = (context?: Record<string, unknown>): AppError => {
  return new AppError(
    ERROR_MESSAGES[ErrorCode.NETWORK_TIMEOUT],
    ErrorType.TIMEOUT,
    ErrorCode.NETWORK_TIMEOUT,
    408,
    true,
    context
  )
}

// Error handling utilities
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError
}

export const isOperationalError = (error: unknown): boolean => {
  if (isAppError(error)) {
    return error.isOperational
  }
  return false
}

export const shouldLogError = (error: unknown): boolean => {
  if (isAppError(error)) {
    return !error.isOperational || error.type === ErrorType.SERVER
  }
  return true
}

export const getErrorType = (error: unknown): ErrorType => {
  if (isAppError(error)) {
    return error.type
  }
  
  if (error instanceof TypeError) {
    return ErrorType.CLIENT
  }
  
  if (error instanceof SyntaxError) {
    return ErrorType.CLIENT
  }
  
  return ErrorType.UNKNOWN
}

// Error logging
export const logError = (error: unknown, context?: Record<string, unknown>): void => {
  if (!shouldLogError(error)) {
    return
  }

  const errorInfo = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    type: getErrorType(error),
    timestamp: new Date().toISOString(),
    context,
  }

  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo)
  }
  
  // In production, you would send to an error tracking service
  // Example: Sentry.captureException(error, { extra: context })
} 