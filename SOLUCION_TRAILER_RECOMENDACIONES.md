# Solución: Trailer en Contenido Similar del HeroBanner

## Problema Identificado

En el componente `HeroBanner`, en la sección "Contenido Similar", al hacer clic en el botón de trailer de una película recomendada, no se mostraba el trailer real de la película. En su lugar, solo se mostraba una notificación de que no había trailer disponible.

## Causa del Problema

La función `handleRecommendationTrailer` estaba implementada de manera incorrecta:

1. **No obtenía datos reales**: La función solo mostraba una notificación sin intentar obtener el trailer real de la película recomendada
2. **Falta de llamada a la API**: No se hacía una llamada a la API para obtener los videos de la película recomendada
3. **Modal incorrecto**: El modal del trailer estaba configurado para mostrar solo el trailer del HeroBanner principal

## Solución Implementada

### 1. Modificación de la función `handleRecommendationTrailer`

**Archivo**: `src/components/HeroBanner.tsx`

**Cambios realizados**:
- Convertí la función en asíncrona para poder hacer llamadas a la API
- Agregué una llamada a la API para obtener los detalles de la película recomendada
- Implementé la búsqueda del trailer en los videos disponibles
- Agregué manejo de errores robusto

```typescript
const handleRecommendationTrailer = async (e: React.MouseEvent, item: Recommendation) => {
  e.stopPropagation() // Evitar que se active la navegación
  
  try {
    // Obtener los videos de la película/serie recomendada
    const response = await fetch(`/api/${item.media_type}/${item.id}`)
    
    if (response.ok) {
      const data = await response.json()
      
      // Buscar el trailer en los videos disponibles
      const trailer = data.videos?.results?.find(
        (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
      )
      
      if (trailer) {
        // Mostrar el trailer en un modal
        setRecommendationTrailerKey(trailer.key)
        setShowRecommendationTrailer(true)
      } else {
        showNotification({
          type: 'info',
          title: 'Trailer no disponible',
          message: `No hay trailer disponible para ${item.title}`,
        })
      }
    } else {
      showNotification({
        type: 'error',
        title: 'Error',
        message: `No se pudo obtener información de ${item.title}`,
      })
    }
  } catch (error) {
    console.error('Error fetching recommendation trailer:', error)
    showNotification({
      type: 'error',
      title: 'Error',
      message: `Error al obtener el trailer de ${item.title}`,
    })
  }
}
```

### 2. Agregado de estados para manejar trailers de recomendaciones

**Estados agregados**:
```typescript
const [recommendationTrailerKey, setRecommendationTrailerKey] = useState<string | null>(null)
const [showRecommendationTrailer, setShowRecommendationTrailer] = useState(false)
```

### 3. Creación de modal separado para trailers de recomendaciones

**Modal agregado**:
```typescript
{/* Recommendation Trailer Modal - Responsive */}
<AnimatePresence>
  {showRecommendationTrailer && recommendationTrailerKey && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => {
        setShowRecommendationTrailer(false)
        setRecommendationTrailerKey(null)
      }}
    >
      <motion.div
        className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${recommendationTrailerKey}?autoplay=1&mute=0&controls=1&rel=0`}
          title="Trailer de recomendación"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <button
          onClick={() => {
            setShowRecommendationTrailer(false)
            setRecommendationTrailerKey(null)
          }}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1 sm:p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

## Verificación de la Solución

### Funcionalidad Implementada

1. **✅ Obtención de trailers reales**: Ahora se obtienen los trailers reales de las películas recomendadas
2. **✅ Modal separado**: Se creó un modal específico para trailers de recomendaciones
3. **✅ Manejo de errores**: Se implementó manejo robusto de errores
4. **✅ Notificaciones informativas**: Se muestran notificaciones apropiadas cuando no hay trailer disponible

### Flujo de Funcionamiento

1. Usuario hace clic en el botón de trailer de una película recomendada
2. Se hace una llamada a la API para obtener los detalles de la película
3. Se busca el trailer en los videos disponibles
4. Si se encuentra un trailer:
   - Se muestra en un modal dedicado
   - Se reproduce automáticamente
5. Si no se encuentra un trailer:
   - Se muestra una notificación informativa

## Archivos Modificados

1. `src/components/HeroBanner.tsx` - Componente principal del HeroBanner

## Pruebas

Para verificar que la solución funciona:

1. Visita cualquier página que use el HeroBanner (página principal, categorías, etc.)
2. Desplázate hacia abajo hasta la sección "Contenido Similar"
3. Haz clic en el botón de trailer (ícono de play) de cualquier película recomendada
4. Verifica que:
   - Se abra un modal con el trailer de la película recomendada
   - El trailer se reproduzca correctamente
   - Se pueda cerrar el modal
   - Si no hay trailer, se muestre una notificación apropiada

## Consideraciones Técnicas

- **Rendimiento**: Las llamadas a la API se hacen solo cuando el usuario hace clic en el botón de trailer
- **UX**: Se mantiene la experiencia de usuario fluida con animaciones y transiciones
- **Accesibilidad**: Los modales son accesibles y se pueden cerrar con el botón X o haciendo clic fuera del modal
- **Responsive**: Los modales son completamente responsivos y funcionan en todos los tamaños de pantalla

## Notas Importantes

- La solución requiere que la API key de TMDB esté configurada correctamente
- Solo se obtienen trailers de YouTube (site === 'YouTube')
- Se priorizan los trailers (type === 'Trailer') sobre otros tipos de videos
- El modal se cierra automáticamente al hacer clic fuera de él o en el botón de cerrar 