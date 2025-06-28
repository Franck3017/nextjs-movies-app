# Solución: Runtime y Géneros en Películas Relacionadas

## Problema Identificado

En la sección "Películas Relacionadas" de la página `/movie/[id]`, no se visualizaban correctamente:
- **Runtime**: Duración de las películas
- **Episode_run_time**: Duración de episodios (para series)
- **Géneros**: Lista de géneros de cada película/serie

## Causa del Problema

El problema se debía a que las APIs de películas similares (`/api/movie/[id]/similar` y `/api/tv/[id]/similar`) solo devolvían datos básicos de las películas/series, sin incluir los campos `runtime`, `episode_run_time` y `genres`.

La API de TMDB para recomendaciones no incluye estos campos por defecto, por lo que era necesario hacer llamadas adicionales para obtener los detalles completos de cada película/serie.

## Solución Implementada

### 1. Modificación de la API de Películas Similares

**Archivo**: `src/app/api/movie/[id]/similar/route.ts`

**Cambios realizados**:
- Agregué llamadas adicionales a la API de TMDB para obtener los detalles completos de cada película
- Incluí los campos `runtime` y `genres` en la respuesta
- Implementé manejo de errores para casos donde no se puedan obtener los detalles

```typescript
// Obtener detalles completos de cada película para incluir runtime y géneros
const moviesWithDetails = await Promise.all(
  data.results.slice(0, 10).map(async (movie: any) => {
    try {
      const detailResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=es-ES`
      )
      
      if (detailResponse.ok) {
        const detailData = await detailResponse.json()
        return {
          ...movie,
          media_type: 'movie',
          runtime: detailData.runtime,
          genres: detailData.genres
        }
      } else {
        return {
          ...movie,
          media_type: 'movie',
          runtime: undefined,
          genres: []
        }
      }
    } catch (error) {
      console.error(`Error fetching details for movie ${movie.id}:`, error)
      return {
        ...movie,
        media_type: 'movie',
        runtime: undefined,
        genres: []
      }
    }
  })
)
```

### 2. Modificación de la API de Series Similares

**Archivo**: `src/app/api/tv/[id]/similar/route.ts`

**Cambios realizados**:
- Agregué llamadas adicionales a la API de TMDB para obtener los detalles completos de cada serie
- Incluí los campos `episode_run_time` y `genres` en la respuesta
- Implementé manejo de errores similar al de películas

```typescript
// Obtener detalles completos de cada serie para incluir episode_run_time y géneros
const showsWithDetails = await Promise.all(
  data.results.slice(0, 10).map(async (show: any) => {
    try {
      const detailResponse = await fetch(
        `https://api.themoviedb.org/3/tv/${show.id}?api_key=${apiKey}&language=es-ES`
      )
      
      if (detailResponse.ok) {
        const detailData = await detailResponse.json()
        return {
          ...show,
          media_type: 'tv',
          episode_run_time: detailData.episode_run_time,
          genres: detailData.genres
        }
      } else {
        return {
          ...show,
          media_type: 'tv',
          episode_run_time: undefined,
          genres: []
        }
      }
    } catch (error) {
      console.error(`Error fetching details for TV show ${show.id}:`, error)
      return {
        ...show,
        media_type: 'tv',
        episode_run_time: undefined,
        genres: []
      }
    }
  })
)
```

## Verificación de la Solución

### 1. En Películas (`/movie/[id]`)
- ✅ **Runtime**: Se muestra la duración en minutos en las tarjetas de películas relacionadas
- ✅ **Géneros**: Se muestran los géneros de cada película relacionada

### 2. En Series de TV (`/tv/[id]`)
- ✅ **Episode_run_time**: Se muestra la duración de episodios en las tarjetas de series relacionadas
- ✅ **Géneros**: Se muestran los géneros de cada serie relacionada

## Consideraciones de Rendimiento

- **Limitación**: Solo se obtienen detalles de las primeras 10 películas/series para evitar demasiadas llamadas a la API
- **Caché**: Las respuestas se pueden cachear para mejorar el rendimiento
- **Manejo de errores**: Si falla la obtención de detalles de una película/serie específica, se devuelven los datos básicos

## Archivos Modificados

1. `src/app/api/movie/[id]/similar/route.ts` - API de películas similares
2. `src/app/api/tv/[id]/similar/route.ts` - API de series similares

## Pruebas

Para verificar que la solución funciona:

1. Visita una página de película: `http://localhost:3000/movie/550` (Fight Club)
2. Desplázate hacia abajo hasta la sección "Películas Relacionadas"
3. Verifica que cada tarjeta muestre:
   - Duración (runtime) en minutos
   - Géneros de la película

4. Visita una página de serie: `http://localhost:3000/tv/1399` (Game of Thrones)
5. Desplázate hacia abajo hasta la sección "Series Relacionadas"
6. Verifica que cada tarjeta muestre:
   - Duración de episodios (episode_run_time)
   - Géneros de la serie

## Notas Importantes

- La solución requiere que la API key de TMDB esté configurada correctamente
- Las llamadas adicionales pueden aumentar ligeramente el tiempo de carga
- Se implementó manejo de errores robusto para evitar fallos en la aplicación 