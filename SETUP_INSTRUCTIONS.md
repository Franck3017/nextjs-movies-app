# 🚀 Configuración de la API de TMDB

## ❌ Problema Actual
La aplicación no puede cargar películas y series porque falta la API key de TMDB.

## ✅ Solución: Configurar API Key de TMDB

### Paso 1: Obtener API Key Gratuita
1. 🌐 Ve a [TMDB API Settings](https://www.themoviedb.org/settings/api)
2. 📝 Crea una cuenta gratuita si no tienes una
3. 🔑 Solicita una API key (API Read Access Token)
4. 📋 Copia la API key (será algo como: `1234567890abcdef1234567890abcdef`)

### Paso 2: Crear Archivo de Variables de Entorno
1. 📁 En la raíz del proyecto, crea un archivo llamado `.env.local`
2. ✏️ Agrega el siguiente contenido al archivo:

```env
TMDB_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

**Ejemplo:**
```env
TMDB_API_KEY=1234567890abcdef1234567890abcdef
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### Paso 3: Reiniciar el Servidor
1. 🔄 Detén el servidor de desarrollo (Ctrl+C)
2. 🚀 Reinicia el servidor: `npm run dev`
3. 🌐 Abre http://localhost:3001

## 💡 Información Importante

- ✅ **La API key es completamente gratuita**
- ✅ **No necesitas tarjeta de crédito**
- ✅ **Te permite hacer hasta 1000 requests por día**
- ✅ **El archivo `.env.local` no se sube a Git (está en .gitignore)**

## 🔧 Verificación

Después de configurar la API key, deberías ver:
- ✅ La página principal cargando películas y series
- ✅ Hero banner con película destacada
- ✅ Categorías de películas y series
- ✅ Funcionalidad de búsqueda
- ✅ Páginas de detalles de películas/series

## 🆘 Si sigues teniendo problemas

1. **Verifica que el archivo `.env.local` esté en la raíz del proyecto**
2. **Asegúrate de que la API key esté correctamente copiada**
3. **Reinicia completamente el servidor de desarrollo**
4. **Limpia la caché del navegador**

## 📞 Soporte

Si necesitas ayuda adicional:
- 📧 Revisa la documentación de TMDB: https://developers.themoviedb.org/
- 🐛 Verifica que la API key esté activa en tu cuenta de TMDB
- 🔄 Asegúrate de que el servidor esté corriendo en el puerto correcto

---

**¡Con estos pasos tu aplicación de películas estará completamente funcional! 🎬✨** 