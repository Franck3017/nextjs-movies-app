# 🚨 SOLUCIÓN AL ERROR 400

## ❌ Problema
```
Search error: Error: HTTP error! status: 400
```

## ✅ Causa del Error
El error 400 ocurre porque **NO tienes configurada la API key de TMDB** en el archivo `.env.local`.

## 🔧 Solución Inmediata

### Paso 1: Crear archivo .env.local
En la raíz del proyecto (donde está `package.json`), crea un archivo llamado `.env.local` con este contenido:

```env
TMDB_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### Paso 2: Obtener API Key
1. Ve a: https://www.themoviedb.org/settings/api
2. Crea cuenta gratuita
3. Solicita "API Read Access Token"
4. Copia la API key
5. Reemplaza `tu_api_key_aqui` con tu API key real

### Paso 3: Reiniciar servidor
```bash
npm run dev
```

## 🎯 Resultado
- ✅ Error 400 desaparece
- ✅ Búsqueda funciona
- ✅ Películas y series se cargan

## 📍 Ubicación del archivo
```
nextjs-movies-app/
├── package.json
├── .env.local  ← CREAR AQUÍ
├── src/
└── ...
```

## ⚡ API Key Ejemplo
```env
TMDB_API_KEY=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZWI...
```

**¡Después de esto, el error 400 se resolverá completamente!** 