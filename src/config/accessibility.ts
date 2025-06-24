// Accessibility configuration and utilities
export const ACCESSIBILITY_CONFIG = {
  // Skip link configuration
  skipLinks: {
    main: 'Ir al contenido principal',
    navigation: 'Ir a la navegación',
    search: 'Ir a la búsqueda',
  },
  
  // ARIA labels
  ariaLabels: {
    navigation: 'Navegación principal',
    mobileMenu: 'Menú móvil',
    searchForm: 'Formulario de búsqueda',
    searchInput: 'Buscar películas y series',
    searchButton: 'Buscar',
    clearButton: 'Limpiar búsqueda',
    filterButton: 'Filtrar resultados',
    sortButton: 'Ordenar resultados',
    pagination: 'Navegación de páginas',
    previousPage: 'Página anterior',
    nextPage: 'Página siguiente',
    closeButton: 'Cerrar',
    playButton: 'Reproducir',
    favoriteButton: 'Agregar a favoritos',
    detailsButton: 'Ver detalles',
  },
  
  // Focus management
  focusManagement: {
    trapFocus: true,
    restoreFocus: true,
    focusVisible: true,
  },
  
  // Keyboard navigation
  keyboardNavigation: {
    enableArrowKeys: true,
    enableTabNavigation: true,
    enableEscapeKey: true,
    enableEnterKey: true,
    enableSpaceKey: true,
  },
  
  // Screen reader support
  screenReader: {
    announceChanges: true,
    announceLoading: true,
    announceErrors: true,
    announceSuccess: true,
  },
  
  // High contrast support
  highContrast: {
    enabled: true,
    borderWidth: '2px',
    borderColor: '#ffffff',
  },
  
  // Reduced motion support
  reducedMotion: {
    enabled: true,
    disableAnimations: true,
    disableTransitions: true,
  },
} as const

// Accessibility utility functions
export const accessibilityUtils = {
  // Generate unique ID for ARIA attributes
  generateId: (prefix: string): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  },
  
  // Check if user prefers reduced motion
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },
  
  // Check if user prefers high contrast
  prefersHighContrast: (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-contrast: high)').matches
  },
  
  // Announce message to screen readers
  announceToScreenReader: (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    if (typeof window === 'undefined') return
    
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  },
  
  // Focus trap for modals and dropdowns
  createFocusTrap: (container: HTMLElement): (() => void) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }
    
    container.addEventListener('keydown', handleTabKey)
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  },
  
  // Validate ARIA attributes
  validateAriaAttributes: (element: HTMLElement): string[] => {
    const errors: string[] = []
    
    // Check for required ARIA attributes
    if (element.hasAttribute('aria-expanded') && !element.hasAttribute('aria-controls')) {
      errors.push('aria-expanded requires aria-controls')
    }
    
    if (element.hasAttribute('aria-controls') && !element.hasAttribute('aria-expanded')) {
      errors.push('aria-controls requires aria-expanded')
    }
    
    if (element.hasAttribute('aria-labelledby') && !element.hasAttribute('aria-label')) {
      const labelledby = element.getAttribute('aria-labelledby')
      const labelElement = document.getElementById(labelledby!)
      if (!labelElement) {
        errors.push(`aria-labelledby references non-existent element: ${labelledby}`)
      }
    }
    
    return errors
  },
}

// Accessibility hooks for React components
export const useAccessibility = () => {
  const generateId = (prefix: string): string => {
    return accessibilityUtils.generateId(prefix)
  }
  
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    accessibilityUtils.announceToScreenReader(message, priority)
  }
  
  const prefersReducedMotion = (): boolean => {
    return accessibilityUtils.prefersReducedMotion()
  }
  
  const prefersHighContrast = (): boolean => {
    return accessibilityUtils.prefersHighContrast()
  }
  
  return {
    generateId,
    announce,
    prefersReducedMotion,
    prefersHighContrast,
  }
}

// Accessibility constants for common use cases
export const ACCESSIBILITY_CONSTANTS = {
  // Common ARIA roles
  roles: {
    button: 'button',
    link: 'link',
    navigation: 'navigation',
    main: 'main',
    banner: 'banner',
    contentinfo: 'contentinfo',
    search: 'search',
    form: 'form',
    list: 'list',
    listitem: 'listitem',
    article: 'article',
    section: 'section',
    heading: 'heading',
    dialog: 'dialog',
    alert: 'alert',
    status: 'status',
    progressbar: 'progressbar',
    tab: 'tab',
    tablist: 'tablist',
    tabpanel: 'tabpanel',
  },
  
  // Common ARIA states
  states: {
    expanded: 'aria-expanded',
    pressed: 'aria-pressed',
    selected: 'aria-selected',
    checked: 'aria-checked',
    disabled: 'aria-disabled',
    hidden: 'aria-hidden',
    invalid: 'aria-invalid',
    required: 'aria-required',
    busy: 'aria-busy',
    live: 'aria-live',
    atomic: 'aria-atomic',
    relevant: 'aria-relevant',
  },
  
  // Common ARIA properties
  properties: {
    label: 'aria-label',
    labelledby: 'aria-labelledby',
    describedby: 'aria-describedby',
    controls: 'aria-controls',
    owns: 'aria-owns',
    activedescendant: 'aria-activedescendant',
    current: 'aria-current',
    posinset: 'aria-posinset',
    setsize: 'aria-setsize',
    level: 'aria-level',
    placeholder: 'aria-placeholder',
    valuemin: 'aria-valuemin',
    valuemax: 'aria-valuemax',
    valuenow: 'aria-valuenow',
    valuetext: 'aria-valuetext',
  },
} as const 