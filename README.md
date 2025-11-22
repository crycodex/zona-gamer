# zona gamer

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

### 1. Instalar dependencias

```sh
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y completa con tus credenciales de Firebase:

```sh
cp .env.example .env
```

Luego edita el archivo `.env` con tus credenciales de Firebase Console.

### 3. Compile and Hot-Reload for Development

```sh
npm run dev
```

### 4. Type-Check, Compile and Minify for Production

```sh
npm run build
```

## Configuración de Firebase

Este proyecto usa Firebase para autenticación y base de datos. Para configurar tu propio proyecto:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a la configuración del proyecto y copia las credenciales
4. Pega las credenciales en tu archivo `.env`

**⚠️ IMPORTANTE:** Nunca subas el archivo `.env` al repositorio. Este archivo está ignorado en `.gitignore` para proteger tus credenciales.

## Stack Tecnológico

- **Vue 3** - Framework progresivo de JavaScript
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Vue Router** - Enrutamiento
- **Pinia** - State management
- **Firebase** - Backend as a Service
- **VueFire** - Integración de Firebase con Vue
- **Tailwind CSS** - Framework de utilidades CSS
- **daisyUI** - Componentes UI para Tailwind
- **Lucide Icons** - Sistema de iconos SVG moderno

## 🔍 SEO y Optimización

Este proyecto incluye optimizaciones completas de SEO:

- ✅ **Meta tags completos** (Open Graph, Twitter Cards)
- ✅ **Structured Data** (Schema.org JSON-LD)
- ✅ **robots.txt** y **sitemap.xml**
- ✅ **PWA manifest**
- ✅ **SEO dinámico** por ruta
- ✅ **Optimización de rendimiento** (.htaccess)

