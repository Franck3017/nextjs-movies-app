# 🚀 CONFIGURACIÓN RÁPIDA - API KEY TMDB

## ⚠️ PROBLEMA ACTUAL
La aplicación no muestra películas porque falta la API key de TMDB.

## ✅ SOLUCIÓN EN 3 PASOS

### 1️⃣ Obtener API Key Gratuita
- Ve a: https://www.themoviedb.org/settings/api
- Crea cuenta gratuita
- Solicita API key (API Read Access Token)
- Copia la API key

### 2️⃣ Crear Archivo .env.local
En la raíz del proyecto, crea un archivo llamado `.env.local` con:

```env
TMDB_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### 3️⃣ Reiniciar Servidor
```bash
# Detener servidor (Ctrl+C)
# Luego ejecutar:
npm run dev
```

## 🎯 RESULTADO
Después de estos pasos verás:
- ✅ Películas y series cargando
- ✅ Hero banner funcional
- ✅ Búsqueda funcionando
- ✅ Páginas de detalles

## 💡 IMPORTANTE
- La API key es **100% gratuita**
- No necesitas tarjeta de crédito
- 1000 requests por día incluidos

---

**¡Listo! Tu app de películas funcionará perfectamente 🎬** 