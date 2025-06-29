# Uso del Componente ApiKeyError

## Descripción

El componente `ApiKeyError` es una página de error especializada que se muestra cuando la API key de TMDB no está configurada correctamente. Proporciona instrucciones detalladas para que los usuarios puedan configurar la API key y hacer funcionar la aplicación.

## Características del Componente

### 🎨 Diseño
- **Interfaz moderna**: Diseño con gradientes y efectos de blur
- **Animaciones**: Utiliza Framer Motion para transiciones suaves
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Tema oscuro**: Consistente con el diseño de la aplicación

### 📋 Funcionalidades
- **Instrucciones paso a paso**: Guía completa para obtener y configurar la API key
- **Enlaces directos**: Link directo a TMDB API Settings
- **Código copiable**: Botón para copiar la configuración del archivo .env.local
- **Información importante**: Detalles sobre la API gratuita y límites
- **Botón de recarga**: Para recargar la página después de configurar

## Implementación en las Páginas

### 1. Página Principal (`src/app/page.tsx`)
```typescript
// Verificación de API key
useEffect(() => {
  const checkApiKey = async () => {
    try {
      const response = await fetch('/api/test-env')
      if (response.ok) {
        const data = await response.json()
        setApiKeyConfigured(!!data.tmdb)
      } else {
        setApiKeyConfigured(false)
      }
    } catch (error) {
      setApiKeyConfigured(false)
    }
  }
  checkApiKey()
}, [])

// Mostrar ApiKeyError si no está configurada
if (apiKeyConfigured === false) {
  return <ApiKeyError />
}
```

### 2. Página de Películas (`src/app/movie/[id]/page.tsx`)
- ✅ Verificación automática de API key
- ✅ Mostrar ApiKeyError si no está configurada
- ✅ Loading state mientras se verifica

### 3. Página de Series (`src/app/tv/[id]/page.tsx`)
- ✅ Verificación automática de API key
- ✅ Mostrar ApiKeyError si no está configurada
- ✅ Loading state mientras se verifica

### 4. Página de Búsqueda (`src/app/search/page.tsx`)
- ✅ Verificación automática de API key
- ✅ Mostrar ApiKeyError si no está configurada
- ✅ Loading state mientras se verifica

## API de Verificación

### Endpoint: `/api/test-env`
```typescript
// Verifica si la API key está configurada y funciona
export async function GET() {
  const apiKey = process.env.TMDB_API_KEY
  
  if (!apiKey) {
    return NextResponse.json({ tmdb: false, message: 'API key no configurada' })
  }
  
  try {
    // Hacer una llamada de prueba a TMDB
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/550?api_key=${apiKey}`
    )
    
    if (response.ok) {
      return NextResponse.json({ tmdb: true, message: 'API key válida' })
    } else {
      return NextResponse.json({ tmdb: false, message: 'API key inválida' })
    }
  } catch (error) {
    return NextResponse.json({ tmdb: false, message: 'Error de conexión' })
  }
}
```

## Flujo de Verificación

1. **Carga inicial**: La página verifica la API key al cargar
2. **Llamada a `/api/test-env`**: Endpoint que verifica la configuración
3. **Estados posibles**:
   - `null`: Verificando (muestra loading)
   - `true`: API key configurada (muestra contenido normal)
   - `false`: API key no configurada (muestra ApiKeyError)

## Beneficios

### Para el Usuario
- **Instrucciones claras**: Guía paso a paso para configurar la API
- **Sin confusión**: No se muestran errores técnicos confusos
- **Solución rápida**: Enlaces directos y código copiable
- **Información completa**: Detalles sobre la API gratuita

### Para el Desarrollador
- **Manejo centralizado**: Un solo componente para todos los errores de API key
- **Fácil mantenimiento**: Cambios en un solo lugar
- **Experiencia consistente**: Mismo comportamiento en todas las páginas
- **Debugging mejorado**: Estados claros para identificar problemas

## Personalización

El componente se puede personalizar fácilmente:

```typescript
// Cambiar el texto de las instrucciones
const instructions = `TMDB_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.tmdb.org/t/p`

// Agregar más información
const additionalInfo = [
  '• La API key es completamente gratuita',
  '• Te permite hacer hasta 1000 requests por día',
  '• No necesitas tarjeta de crédito'
]
```

## Archivos Relacionados

- `src/components/ApiKeyError.tsx` - Componente principal
- `src/app/api/test-env/route.ts` - API de verificación
- `src/utils/index.ts` - Funciones utilitarias
- `src/app/page.tsx` - Página principal
- `src/app/movie/[id]/page.tsx` - Página de películas
- `src/app/tv/[id]/page.tsx` - Página de series
- `src/app/search/page.tsx` - Página de búsqueda 