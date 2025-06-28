# Configuración de Variables de Entorno

## Problema Identificado

El problema con la visualización de runtime, episode_run_time y géneros en las páginas `/movie/[id]` y `/tv/[id]` se debe a que la API key de TMDB no está configurada correctamente.

## Solución

### 1. Crear archivo .env.local

Crea un archivo llamado `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
# TMDB API Configuration
# Obtén tu API key gratuita en: https://www.themoviedb.org/settings/api
TMDB_API_KEY=tu_api_key_aqui

# Configuración opcional para el cliente (si necesitas acceder desde el frontend)
NEXT_PUBLIC_TMDB_API_KEY=tu_api_key_aqui

# URLs de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### 2. Obtener API Key de TMDB

1. Ve a https://www.themoviedb.org/settings/api
2. Crea una cuenta gratuita si no tienes una
3. Solicita una API key (API Read Access Token)
4. Copia la API key
5. Reemplaza `tu_api_key_aqui` en el archivo `.env.local` con tu API key real

### 3. Reiniciar el servidor

Después de crear el archivo `.env.local`, reinicia el servidor de desarrollo:

```bash
npm run dev
```

## Verificación

Para verificar que todo funciona correctamente, visita:

- http://localhost:3000/test-api - Página de prueba de APIs
- http://localhost:3000/movie/550 - Detalles de Fight Club
- http://localhost:3000/tv/1399 - Detalles de Game of Thrones

## Campos que se deben mostrar

### En Películas (/movie/[id]):
- ✅ **Runtime**: Duración en minutos
- ✅ **Géneros**: Lista de géneros de la película

### En Series de TV (/tv/[id]):
- ✅ **Episode_run_time**: Duración de episodios en minutos
- ✅ **Géneros**: Lista de géneros de la serie

## Notas Importantes

- La API key de TMDB es completamente gratuita
- Permite hasta 1000 requests por día
- No se requiere configuración adicional
- Los datos se cargan automáticamente una vez configurada la API key

## Troubleshooting

Si después de configurar la API key sigues sin ver los datos:

1. Verifica que el archivo `.env.local` esté en la raíz del proyecto
2. Asegúrate de que la API key sea válida
3. Reinicia el servidor de desarrollo
4. Limpia la caché del navegador
5. Verifica la consola del navegador para errores 