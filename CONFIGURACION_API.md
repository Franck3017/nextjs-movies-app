# 🔑 Configuración de API Key - SOLUCIÓN AL ERROR 400

## ❌ Problema Actual
Estás viendo el error "HTTP error! status: 400" porque **NO tienes configurada la API key de TMDB**.

## ✅ Solución Paso a Paso

### 1. Crear archivo .env.local
Crea un archivo llamado `.env.local` en la raíz del proyecto (al mismo nivel que `package.json`) con este contenido:

```env
TMDB_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### 2. Obtener API Key de TMDB
1. Ve a: https://www.themoviedb.org/settings/api
2. Crea una cuenta gratuita (no necesitas tarjeta de crédito)
3. Solicita una "API Read Access Token"
4. Copia la API key que te dan
5. Reemplaza `tu_api_key_aqui` en el archivo `.env.local` con tu API key real

### 3. Reiniciar el servidor
```bash
npm run dev
```

## 🎯 Resultado
- ✅ El error 400 desaparecerá
- ✅ La búsqueda funcionará correctamente
- ✅ Verás películas y series reales

## 📝 Ejemplo de archivo .env.local
```env
TMDB_API_KEY=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZWI...
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

## ⚠️ Importante
- La API key es **completamente gratuita**
- Te permite **1000 requests por día**
- El archivo `.env.local` **NO se sube a Git** (es seguro)
- **Reinicia el servidor** después de crear el archivo

## 🚨 Si el error persiste
1. Verifica que el archivo `.env.local` esté en la ubicación correcta
2. Verifica que la API key esté correctamente copiada
3. Reinicia completamente el servidor: `Ctrl+C` y luego `npm run dev` 