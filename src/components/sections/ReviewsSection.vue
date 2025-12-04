<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Star, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-vue-next'

interface Review {
  id: string
  userName: string
  reviewText: string
  rating: number
  avatar: string
  timeAgo: string
}

// Reseñas basadas en feedback real de Google Business (4.6★ - 227 opiniones)
const reviews: Review[] = [
  {
    id: '1',
    userName: 'Juan A.',
    reviewText: 'Buen servicio, la compra fue muy rápida y fácil. Excelente atención al cliente.',
    rating: 5,
    avatar: 'J',
    timeAgo: 'hace 1 mes'
  },
  {
    id: '2',
    userName: 'María G.',
    reviewText: 'Los precios son muy buenos y competitivos. La entrega fue inmediata, muy recomendado.',
    rating: 5,
    avatar: 'M',
    timeAgo: 'hace 2 semanas'
  },
  {
    id: '3',
    userName: 'Carlos R.',
    reviewText: 'Confiable y seguro. Compré varios juegos y todos llegaron perfectamente.',
    rating: 5,
    avatar: 'C',
    timeAgo: 'hace 3 semanas'
  },
  {
    id: '4',
    userName: 'Andrea T.',
    reviewText: 'Excelente calidad de servicio. El local en Ibarra es muy accesible y el personal muy amable.',
    rating: 5,
    avatar: 'A',
    timeAgo: 'hace 1 mes'
  },
  {
    id: '5',
    userName: 'Luis P.',
    reviewText: 'Muy buenos precios, mejor que otras tiendas. La atención es rápida y profesional.',
    rating: 4,
    avatar: 'L',
    timeAgo: 'hace 2 meses'
  },
  {
    id: '6',
    userName: 'Diana S.',
    reviewText: 'Seguro y confiable para comprar juegos digitales. Ya es mi segunda compra y todo perfecto.',
    rating: 5,
    avatar: 'D',
    timeAgo: 'hace 1 mes'
  },
  {
    id: '7',
    userName: 'Roberto M.',
    reviewText: 'Buena calidad en los productos y precios justos. El proceso de compra es muy sencillo.',
    rating: 4,
    avatar: 'R',
    timeAgo: 'hace 3 semanas'
  },
  {
    id: '8',
    userName: 'Patricia V.',
    reviewText: 'Compré para PS5 y todo funcionó perfecto. Totalmente confiable, los recomiendo.',
    rating: 5,
    avatar: 'P',
    timeAgo: 'hace 2 semanas'
  }
]

const GOOGLE_RATING = 4.6
const TOTAL_REVIEWS = 227

// Carousel state
const currentIndex = ref(0)
const isPlaying = ref(true)
const carouselInterval = ref<ReturnType<typeof setInterval> | null>(null)

// Duplicar las reseñas para loop infinito
const duplicatedReviews = [...reviews, ...reviews]

const startAutoPlay = () => {
  if (carouselInterval.value) return
  
  carouselInterval.value = setInterval(() => {
    nextSlide()
  }, 4000) // Cambia cada 4 segundos
}

const stopAutoPlay = () => {
  if (carouselInterval.value) {
    clearInterval(carouselInterval.value)
    carouselInterval.value = null
  }
}

const toggleAutoPlay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % reviews.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + reviews.length) % reviews.length
}

const goToSlide = (index: number) => {
  currentIndex.value = index
}

onMounted(() => {
  if (isPlaying.value) {
    startAutoPlay()
  }
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <div class="w-full bg-base-300 py-12 md:py-16">
    <!-- Banner Promocional con Calificación Real de Google -->
    <div class="container mx-auto px-4 md:px-6 mb-12">
      <div class="bg-base-200 rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <!-- Logo/Imagen -->
        <div class="shrink-0">
          <div class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-linear-gradient(to bottom, #9333ea, #f59e0b) flex items-center justify-center">
            <img src="/Images/logo/logo.png" alt="Zona Gamers Ecuador"/>
          </div>
        </div>

        <!-- Contenido -->
        <div class="flex-1 text-center md:text-left">
          <!-- Calificación de Google -->
          <div class="flex items-center justify-center md:justify-start gap-3 mb-3">
            <div class="flex gap-1">
              <!-- Mostrar 4 estrellas completas y 1 media estrella -->
              <Star 
                v-for="i in 4" 
                :key="`full-${i}`"
                :size="24"
                class="text-yellow-500 fill-yellow-500"
              />
              <div class="relative">
                <Star :size="24" class="text-gray-400" />
                <Star 
                  :size="24" 
                  class="text-yellow-500 fill-yellow-500 absolute top-0 left-0"
                  style="clip-path: inset(0 40% 0 0);"
                />
              </div>
            </div>
            <div class="flex flex-col items-start">
              <span class="text-2xl font-bold text-white">{{ GOOGLE_RATING }}</span>
              <span class="text-xs text-base-content/60">{{ TOTAL_REVIEWS }} reseñas</span>
            </div>
          </div>

          <!-- Texto promocional -->
          <p class="text-white text-sm md:text-base mb-4 leading-relaxed">
            Zona Gamers es tu tienda de confianza para comprar juegos de PC, PlayStation, Xbox y Nintendo Switch en Ecuador. ¡Entrega inmediata 24/7 y los mejores precios del mercado!
          </p>

          <!-- Botón de Google Reviews -->
          <a 
            href="https://www.google.com/search?q=zonagamersecuador&sourceid=chrome&ie=UTF-8#lrd=0x91d59aa3d25cdce3:0x610fcd511e7ccd49,1,,,," 
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-error btn-outline"
          >
            Ver todas las reseñas en Google
          </a>
        </div>
      </div>
    </div>

    <!-- Sección de Reseñas con Carrusel -->
    <div class="container mx-auto px-4 md:px-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl md:text-3xl font-bold text-white">Lo que dicen nuestros clientes</h2>
        
        <!-- Controles del carrusel -->
        <div class="flex items-center gap-2">
          <!-- Botón Play/Pause -->
          <button 
            @click="toggleAutoPlay"
            class="btn btn-sm btn-circle btn-ghost text-white hover:bg-base-200"
            :title="isPlaying ? 'Pausar' : 'Reproducir'"
          >
            <Pause v-if="isPlaying" :size="16" />
            <Play v-else :size="16" />
          </button>
          
          <!-- Botones de navegación -->
          <button 
            @click="prevSlide"
            class="btn btn-sm btn-circle btn-ghost text-white hover:bg-base-200"
            title="Anterior"
          >
            <ChevronLeft :size="20" />
          </button>
          <button 
            @click="nextSlide"
            class="btn btn-sm btn-circle btn-ghost text-white hover:bg-base-200"
            title="Siguiente"
          >
            <ChevronRight :size="20" />
          </button>
        </div>
      </div>
      
      <!-- Contenedor del carrusel -->
      <div class="relative overflow-hidden">
        <!-- Carrusel de reseñas -->
        <div 
          class="flex transition-transform duration-700 ease-in-out"
          :style="{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }"
        >
          <div
            v-for="(review, index) in duplicatedReviews"
            :key="`${review.id}-${index}`"
            class="w-full md:w-1/2 lg:w-1/3 shrink-0 px-2"
          >
            <div class="bg-base-200 rounded-lg p-5 h-full shadow-lg hover:shadow-xl transition-all duration-300">
              <!-- Header de la reseña -->
              <div class="flex items-start gap-3 mb-4">
                <!-- Avatar con inicial -->
                <div class="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                  <span class="text-white font-bold text-lg">{{ review.avatar }}</span>
                </div>

                <!-- Información del usuario -->
                <div class="flex-1 min-w-0">
                  <!-- Nombre del usuario -->
                  <h3 class="text-sm font-semibold text-white mb-1">
                    {{ review.userName }}
                  </h3>
                  <!-- Estrellas -->
                  <div class="flex gap-0.5">
                    <Star 
                      v-for="i in 5" 
                      :key="i"
                      :size="14"
                      :class="i <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'"
                    />
                  </div>
                </div>
              </div>

              <!-- Texto de la reseña -->
              <p class="text-sm text-base-content/80 mb-4 leading-relaxed">
                {{ review.reviewText }}
              </p>

              <!-- Footer con fecha -->
              <div class="flex items-center justify-between text-xs text-base-content/60">
                <span>{{ review.timeAgo }}</span>
                <span class="text-blue-500 font-medium">Google</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Indicadores de posición -->
      <div class="flex justify-center gap-2 mt-6">
        <button
          v-for="(review, index) in reviews"
          :key="review.id"
          @click="goToSlide(index)"
          class="w-2 h-2 rounded-full transition-all duration-300"
          :class="currentIndex === index ? 'bg-blue-500 w-8' : 'bg-base-content/30 hover:bg-base-content/50'"
          :title="`Ir a reseña ${index + 1}`"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Responsive carousel adjustments */
@media (max-width: 768px) {
  .flex[style*="transform"] > div {
    width: 100% !important;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .flex[style*="transform"] > div {
    width: 50% !important;
  }
}

/* Smooth transitions */
.transition-transform {
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Indicator animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>

