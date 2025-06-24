# Configuración de Variables de Entorno

## 🔑 Configuración Requerida

Para que la aplicación funcione correctamente, necesitas crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

### 1. Crear el archivo `.env.local`

Crea un archivo llamado `.env.local` en la raíz del proyecto (al mismo nivel que `package.json`) con el siguiente contenido:

```env
TMDB_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### 2. Obtener la API Key de TMDB

1. Ve a [TMDB API Settings](https://www.themoviedb.org/settings/api)
2. Crea una cuenta gratuita si no tienes una
3. Solicita una API key (API Read Access Token)
4. Copia la API key
5. Reemplaza `tu_api_key_aqui` en el archivo `.env.local` con tu API key real

### 3. Reiniciar el servidor

Después de crear el archivo `.env.local`, reinicia el servidor de desarrollo:

```bash
npm run dev
```

## 📝 Variables de Entorno Explicadas

- `TMDB_API_KEY`: Tu API key de TMDB (requerida para obtener datos de películas y series)
- `NEXT_PUBLIC_APP_URL`: URL base de tu aplicación (usada para SEO y metadatos)
- `NEXT_PUBLIC_IMAGE_BASE_URL`: URL base para las imágenes de TMDB

## ⚠️ Importante

- El archivo `.env.local` no se sube a Git por seguridad
- La API key es completamente gratuita
- Te permite hacer hasta 1000 requests por día
- No necesitas tarjeta de crédito

## 🚨 Error 400

Si ves el error "HTTP error! status: 400", significa que:
1. No has creado el archivo `.env.local`
2. La API key no está configurada correctamente
3. El archivo `.env.local` no está en la ubicación correcta

Sigue los pasos anteriores para resolver el problema. 