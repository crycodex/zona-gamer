import { watch } from 'vue'
import { useRoute } from 'vue-router'

export interface SEOMetaData {
  title?: string
  description?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  canonical?: string
  robots?: string
}

const defaultMeta: SEOMetaData = {
  title: 'Zona Gamer - Juegos PS4 y PS5 Digital | Los Mejores Precios de Ecuador',
  description: 'Compra juegos digitales para PS4 y PS5 en Ecuador. Ofertas exclusivas, entrega inmediata y los mejores precios. Catálogo completo de juegos, DLCs y más.',
  keywords: 'juegos ps4, juegos ps5, juegos digitales, playstation, ecuador, ofertas, precios bajos, zona gamer',
  ogTitle: 'Zona Gamer - Juegos PS4 y PS5 Digital | Los Mejores Precios de Ecuador',
  ogDescription: 'Compra juegos digitales para PS4 y PS5 en Ecuador. Ofertas exclusivas, entrega inmediata y los mejores precios.',
  ogImage: 'https://zonagamer.com/Images/logo/logo.png',
  ogUrl: 'https://zonagamer.com/',
  twitterTitle: 'Zona Gamer - Juegos PS4 y PS5 Digital',
  twitterDescription: 'Compra juegos digitales para PS4 y PS5 en Ecuador. Ofertas exclusivas, entrega inmediata y los mejores precios.',
  twitterImage: 'https://zonagamer.com/Images/logo/logo.png',
  canonical: 'https://zonagamer.com/',
  robots: 'index, follow'
}

const actualizarMetaTag = (selector: string, attribute: string, value: string): void => {
  let element = document.querySelector(selector) as HTMLMetaElement | null
  
  if (!element) {
    element = document.createElement('meta')
    if (attribute === 'name') {
      element.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''))
    } else if (attribute === 'property') {
      element.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''))
    }
    document.head.appendChild(element)
  }
  
  element.setAttribute('content', value)
}

const actualizarLinkTag = (rel: string, href: string): void => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  
  element.setAttribute('href', href)
}

export const useSEO = (customMeta?: SEOMetaData): void => {
  const route = useRoute()
  
  const actualizarSEO = (): void => {
    const meta = { ...defaultMeta, ...customMeta }
    
    // Título de la página
    if (meta.title) {
      document.title = meta.title
    }
    
    // Meta tags básicos
    if (meta.description) {
      actualizarMetaTag('meta[name="description"]', 'name', meta.description)
    }
    
    if (meta.keywords) {
      actualizarMetaTag('meta[name="keywords"]', 'name', meta.keywords)
    }
    
    if (meta.robots) {
      actualizarMetaTag('meta[name="robots"]', 'name', meta.robots)
    }
    
    // Open Graph tags
    if (meta.ogTitle) {
      actualizarMetaTag('meta[property="og:title"]', 'property', meta.ogTitle)
    }
    
    if (meta.ogDescription) {
      actualizarMetaTag('meta[property="og:description"]', 'property', meta.ogDescription)
    }
    
    if (meta.ogImage) {
      actualizarMetaTag('meta[property="og:image"]', 'property', meta.ogImage)
    }
    
    if (meta.ogUrl) {
      actualizarMetaTag('meta[property="og:url"]', 'property', meta.ogUrl)
    }
    
    // Twitter Card tags
    if (meta.twitterTitle) {
      actualizarMetaTag('meta[name="twitter:title"]', 'name', meta.twitterTitle)
    }
    
    if (meta.twitterDescription) {
      actualizarMetaTag('meta[name="twitter:description"]', 'name', meta.twitterDescription)
    }
    
    if (meta.twitterImage) {
      actualizarMetaTag('meta[name="twitter:image"]', 'name', meta.twitterImage)
    }
    
    // Canonical URL
    if (meta.canonical) {
      actualizarLinkTag('canonical', meta.canonical)
    }
  }
  
  // Actualizar SEO cuando cambia la ruta
  watch(() => route.fullPath, actualizarSEO, { immediate: true })
}

export const generarStructuredData = (type: 'Product' | 'BreadcrumbList' | 'FAQPage', data: any): void => {
  const scriptId = `structured-data-${type.toLowerCase()}`
  
  // Eliminar script existente si lo hay
  const existingScript = document.getElementById(scriptId)
  if (existingScript) {
    existingScript.remove()
  }
  
  // Crear nuevo script
  const script = document.createElement('script')
  script.id = scriptId
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

export const eliminarStructuredData = (type: 'Product' | 'BreadcrumbList' | 'FAQPage'): void => {
  const scriptId = `structured-data-${type.toLowerCase()}`
  const existingScript = document.getElementById(scriptId)
  if (existingScript) {
    existingScript.remove()
  }
}

