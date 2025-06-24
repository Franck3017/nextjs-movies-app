# 🎬 CineApp - Tu App de Películas y Series

Una aplicación moderna y escalable para descubrir películas y series, construida con Next.js, TypeScript y Tailwind CSS v4.

## ✨ Características Principales

### 🎯 Funcionalidades
- **Búsqueda Avanzada**: Busca películas, series y actores con filtros en tiempo real
- **Categorías Dinámicas**: Explora contenido por géneros (Acción, Comedia, Terror, etc.)
- **Interfaz Moderna**: Diseño responsive con animaciones fluidas
- **Navegación Intuitiva**: Tabs para alternar entre películas y series
- **Notificaciones**: Sistema de notificaciones para feedback del usuario
- **Manejo de Errores**: Error boundaries y estados de carga elegantes

### 🏗️ Arquitectura Mejorada

#### Separación de Responsabilidades
- **Hooks Personalizados**: Lógica reutilizable (`useSearch`, `useCategories`, `useLoadingState`)
- **Servicios API**: Capa de abstracción para llamadas a API (`apiService`)
- **Componentes Modulares**: Componentes pequeños y reutilizables
- **Contextos**: Estado global para notificaciones
- **Configuración Centralizada**: Constantes y configuración en archivos dedicados

#### Componentes Principales
```
src/
├── components/
│   ├── SearchForm.tsx          # Formulario de búsqueda
│   ├── SearchFilters.tsx       # Filtros de búsqueda
│   ├── SearchResults.tsx       # Resultados de búsqueda
│   ├── CategoryRow.tsx         # Fila de categorías
│   ├── MovieCard.tsx           # Tarjeta de película/serie
│   ├── Notification.tsx        # Sistema de notificaciones
│   ├── ErrorBoundary.tsx       # Manejo de errores
│   └── LoadingSpinner.tsx      # Indicador de carga
├── hooks/
│   ├── useSearch.ts            # Hook de búsqueda
│   ├── useCategories.ts        # Hook de categorías
│   └── useLoadingState.ts      # Hook de estados de carga
├── services/
│   └── api.ts                  # Servicio de API
├── contexts/
│   └── NotificationContext.tsx # Contexto de notificaciones
└── config/
    └── constants.ts            # Configuración centralizada
```

## 🚀 Tecnologías Utilizadas

- **Next.js 14**: Framework de React con App Router
- **TypeScript**: Tipado estático para mejor desarrollo
- **Tailwind CSS v4**: Framework CSS utility-first
- **Framer Motion**: Animaciones y transiciones
- **SWR**: Data fetching y cache
- **Lucide React**: Iconos modernos
- **TMDB API**: Base de datos de películas y series

## 📦 Instalación

1. **Clona el repositorio**
   ```bash
   git clone <repository-url>
   cd nextjs-movies-app
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Añade tu API key de TMDB:
   ```
   TMDB_API_KEY=tu_api_key_aqui
   ```

4. **Ejecuta el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abre [http://localhost:3000](http://localhost:3000)**

## 🔧 Configuración

### Variables de Entorno
- `TMDB_API_KEY`: Tu API key de The Movie Database
- `NEXT_PUBLIC_APP_URL`: URL de tu aplicación (opcional)

### Configuración de Tailwind CSS v4
El proyecto utiliza Tailwind CSS v4 con configuración optimizada:
- PostCSS configurado correctamente
- Componentes CSS con `@theme` y `@layer`
- Variables CSS personalizadas

## 🎨 Características de Diseño

### Componentes Modernos
- **Tarjetas con Efectos**: Glow effects, hover animations, floating elements
- **Gradientes Dinámicos**: Fondos con gradientes animados
- **Responsive Design**: Optimizado para móviles, tablets y desktop
- **Dark Theme**: Tema oscuro por defecto con colores cinematográficos

### Animaciones
- **Framer Motion**: Transiciones suaves entre estados
- **Staggered Animations**: Animaciones escalonadas para listas
- **Loading States**: Estados de carga elegantes
- **Micro-interacciones**: Feedback visual en hover y click

## 🔍 Funcionalidades de Búsqueda

### Búsqueda Inteligente
- **Búsqueda en Tiempo Real**: Resultados instantáneos
- **Filtros Dinámicos**: Filtrar por películas, series o ambos
- **Resultados Combinados**: Películas y series en una sola vista
- **Ordenamiento Inteligente**: Por popularidad y rating

### API Endpoints
- `GET /api/search?query=<term>&page=<number>`: Búsqueda combinada
- `GET /api/movies/popular`: Películas populares
- `GET /api/movies/top_rated`: Películas mejor valoradas
- `GET /api/movies/genre/<id>`: Películas por género
- `GET /api/tv/popular`: Series populares
- `GET /api/tv/top_rated`: Series mejor valoradas
- `GET /api/tv/genre/<id>`: Series por género

## 🏗️ Arquitectura del Código

### Principios de Diseño
1. **Separación de Responsabilidades**: Cada componente tiene una función específica
2. **Reutilización**: Hooks y componentes reutilizables
3. **Escalabilidad**: Estructura preparada para crecimiento
4. **Mantenibilidad**: Código limpio y bien documentado
5. **Performance**: Optimizaciones de renderizado y cache

### Patrones Utilizados
- **Custom Hooks**: Lógica de estado reutilizable
- **Service Layer**: Abstracción de API calls
- **Context API**: Estado global para notificaciones
- **Error Boundaries**: Manejo de errores en componentes
- **Component Composition**: Composición de componentes pequeños

## 🚀 Optimizaciones de Performance

### Data Fetching
- **SWR**: Cache inteligente y revalidación automática
- **Deduplication**: Evita requests duplicados
- **Background Updates**: Actualizaciones en segundo plano
- **Error Handling**: Manejo robusto de errores

### Rendering
- **Lazy Loading**: Carga diferida de componentes
- **Memoization**: Optimización de re-renders
- **Virtual Scrolling**: Para listas largas (preparado)
- **Image Optimization**: Optimización automática de imágenes

## 🧪 Testing y Calidad

### Linting y Formateo
- **ESLint**: Reglas de calidad de código
- **TypeScript**: Tipado estático
- **Prettier**: Formateo automático

### Estructura de Archivos
```
src/
├── app/                    # App Router (Next.js 14)
├── components/             # Componentes reutilizables
├── hooks/                  # Custom hooks
├── services/               # Servicios y API
├── contexts/               # Contextos de React
├── config/                 # Configuración
├── styles/                 # Estilos globales
└── pages/                  # API routes
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Características
- **Mobile-First**: Diseño optimizado para móviles
- **Touch-Friendly**: Interacciones táctiles optimizadas
- **Adaptive Layout**: Layout que se adapta al dispositivo
- **Performance**: Optimizado para conexiones lentas

## 🔮 Próximas Mejoras

### Funcionalidades Planificadas
- [ ] **Paginación**: Navegación entre páginas de resultados
- [ ] **Favoritos**: Sistema de favoritos con localStorage
- [ ] **Detalles**: Páginas de detalles de películas/series
- [ ] **Trailers**: Integración con YouTube para trailers
- [ ] **Recomendaciones**: Sistema de recomendaciones personalizadas
- [ ] **Filtros Avanzados**: Filtros por año, rating, idioma
- [ ] **Modo Offline**: Funcionalidad offline con Service Workers

### Mejoras Técnicas
- [ ] **Testing**: Tests unitarios y de integración
- [ ] **PWA**: Progressive Web App
- [ ] **SEO**: Optimización para motores de búsqueda
- [ ] **Analytics**: Tracking de uso
- [ ] **Performance**: Más optimizaciones de rendimiento

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **TMDB**: Por proporcionar la API de películas y series
- **Next.js Team**: Por el increíble framework
- **Tailwind CSS**: Por el sistema de diseño utility-first
- **Framer Motion**: Por las animaciones fluidas

---

**¡Disfruta explorando el mundo del cine! 🎬✨**
