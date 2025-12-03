<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { GameSummary } from '@/types/game'
import { useCartStore } from '@/stores/cart'
import GameQuickAddModal from '@/components/ui/GameQuickAddModal.vue'

const props = defineProps<{
  games?: GameSummary[]
}>()

const cartStore = useCartStore()
const currentSlide = ref(0)
const showQuickAdd = ref(false)
const selectedHeroGame = ref<GameSummary | null>(null)
let autoplayInterval: number | null = null

// Usar los juegos pasados por props, o un array vacío si no hay
const featuredGames = computed(() => props.games || [])

const nextSlide = (): void => {
  if (featuredGames.value.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % featuredGames.value.length
}

const prevSlide = (): void => {
  if (featuredGames.value.length === 0) return
  currentSlide.value = currentSlide.value === 0 ? featuredGames.value.length - 1 : currentSlide.value - 1
}

const goToSlide = (index: number): void => {
  currentSlide.value = index
}

const formatearPrecio = (precio: number): string => {
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD'
  }).format(precio)
}

const startAutoplay = (): void => {
  stopAutoplay()
  if (featuredGames.value.length > 1) {
    autoplayInterval = window.setInterval(() => {
      nextSlide()
    }, 5000)
  }
}

const stopAutoplay = (): void => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

const openQuickAdd = (game: GameSummary) => {
  selectedHeroGame.value = game
  showQuickAdd.value = true
  stopAutoplay() // Pausar autoplay cuando se abre el modal
}

const handleModalClose = () => {
  showQuickAdd.value = false
  selectedHeroGame.value = null
  startAutoplay() // Reanudar autoplay
}

// Calcular precio original ficticio para mostrar descuento (si no existe)
const getPrecioOriginal = (game: GameSummary) => {
  const precio = game.precios?.ps5Principal || game.costo || 0
  if (game.descuento) {
    return precio / (1 - game.descuento / 100)
  }
  return null
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<template>
  <div v-if="featuredGames.length > 0" class="relative w-full bg-slate-900 border-b border-white/5">
    <!-- Carrusel contenedor -->
    <div class="container mx-auto px-4 sm:px-6 py-6">
      <div class="relative h-[400px] md:h-[450px] w-full overflow-hidden rounded-xl shadow-2xl bg-slate-800 group">
        <!-- Slides -->
        <div 
          v-for="(game, index) in featuredGames" 
          :key="game.id"
          class="absolute inset-0 transition-opacity duration-500 ease-in-out"
          :class="currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'"
        >
          <!-- Imagen de Fondo (Blur Effect) -->
          <div class="absolute inset-0 overflow-hidden">
            <img 
              v-if="game.foto"
              :src="game.foto" 
              :alt="game.nombre"
              class="w-full h-full object-cover blur-xl opacity-30 scale-110"
            />
            <!-- Gradiente sólido para asegurar legibilidad -->
            <div class="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/60"></div>
          </div>

          <!-- Contenido Principal -->
          <div class="relative z-20 h-full flex items-center justify-center px-8 md:px-12 gap-8 md:gap-16 lg:gap-20">
            <!-- Info (Izquierda) -->
            <div class="max-w-2xl space-y-6 flex-1 py-8 text-left md:text-right lg:text-left">
              <!-- Plataforma Badge -->
              <div class="flex justify-start md:justify-end lg:justify-start">
                <span class="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded uppercase tracking-wider shadow-lg shadow-blue-900/50">
                  {{ game.version }}
                </span>
              </div>

              <!-- Título -->
              <h2 class="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight line-clamp-2 drop-shadow-lg">
                {{ game.nombre }}
              </h2>

              <!-- Rating & Info -->
              <div class="flex items-center justify-start md:justify-end lg:justify-start gap-4 text-sm text-gray-300">
                <div class="flex items-center gap-1 text-yellow-400">
                  <Star v-for="i in 5" :key="i" :size="16" class="fill-current" />
                </div>
                <span class="font-medium">Juego Destacado</span>
              </div>

              <!-- Precio y Acción -->
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-start md:justify-end lg:justify-start gap-6 pt-4">
                <div class="text-left md:text-right lg:text-left">
                  <div v-if="getPrecioOriginal(game)" class="text-sm text-gray-400 line-through mb-1">
                    {{ formatearPrecio(getPrecioOriginal(game)!) }}
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-4xl font-bold text-white tracking-tight">
                      {{ formatearPrecio(game.precios?.ps5Principal || game.costo || 0) }}
                    </span>
                    <span v-if="game.descuento" class="px-2.5 py-1 bg-green-500 text-slate-900 text-sm font-bold rounded-full">
                      -{{ game.descuento }}%
                    </span>
                  </div>
                </div>
                
                <button 
                  @click="openQuickAdd(game)"
                  class="btn btn-primary btn-lg px-8 text-white gap-2 shadow-xl shadow-blue-600/20 hover:scale-105 transition-transform"
                >
                  <ShoppingCart :size="20" />
                  Comprar Ahora
                </button>
              </div>
            </div>

            <!-- Imagen Box Art (Derecha - Solo Desktop) -->
            <div class="hidden md:block relative w-[280px] h-[380px] shrink-0 transform rotate-3 hover:rotate-0 transition-transform duration-500 ease-out perspective-1000">
              <img 
                v-if="game.foto"
                :src="game.foto" 
                :alt="game.nombre"
                class="w-full h-full object-cover rounded-lg shadow-2xl shadow-black/80 border border-white/10"
              />
              <!-- Reflejo sutil -->
              <div class="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-lg pointer-events-none"></div>
            </div>
          </div>
        </div>

        <!-- Controles de Navegación (Visibles en hover) -->
        <button 
          v-if="featuredGames.length > 1"
          @click="prevSlide"
          class="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronLeft :size="24" />
        </button>

        <button 
          v-if="featuredGames.length > 1"
          @click="nextSlide"
          class="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronRight :size="24" />
        </button>

        <!-- Indicadores -->
        <div v-if="featuredGames.length > 1" class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          <button
            v-for="(game, index) in featuredGames"
            :key="`indicator-${game.id}`"
            @click="goToSlide(index)"
            class="h-1.5 rounded-full transition-all duration-300"
            :class="currentSlide === index ? 'bg-white w-8' : 'bg-white/30 w-4 hover:bg-white/50'"
          ></button>
        </div>
      </div>
    </div>

    <!-- Modal de Vista Rápida -->
    <GameQuickAddModal 
      v-if="selectedHeroGame"
      :open="showQuickAdd" 
      :game="selectedHeroGame" 
      @close="handleModalClose" 
    />
  </div>
</template>


