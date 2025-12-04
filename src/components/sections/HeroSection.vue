<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { MessageCircle, Gamepad2, TrendingUp, Star } from 'lucide-vue-next'
import type { GameSummary } from '@/types/game'

interface Props {
  games: GameSummary[]
}

const props = defineProps<Props>()

const currentGameIndex = ref(0)
const isAnimating = ref(false)
let intervalId: number | null = null

// Obtener juegos destacados para el hero
const featuredGames = computed(() => {
  return props.games
    .filter(game => game.activo !== false && game.foto)
    .slice(0, 6)
})

const currentGame = computed(() => {
  return featuredGames.value[currentGameIndex.value]
})

const nextGames = computed(() => {
  const games = featuredGames.value
  const next1 = games[(currentGameIndex.value + 1) % games.length]
  const next2 = games[(currentGameIndex.value + 2) % games.length]
  return [next1, next2]
})

const nextGame = () => {
  if (featuredGames.value.length === 0) return
  isAnimating.value = true
  setTimeout(() => {
    currentGameIndex.value = (currentGameIndex.value + 1) % featuredGames.value.length
    isAnimating.value = false
  }, 500)
}

const prevGame = () => {
  if (featuredGames.value.length === 0) return
  isAnimating.value = true
  setTimeout(() => {
    currentGameIndex.value = currentGameIndex.value === 0 
      ? featuredGames.value.length - 1 
      : currentGameIndex.value - 1
    isAnimating.value = false
  }, 500)
}

const handleWhatsApp = () => {
  const mensaje = '¡Hola! Me gustaría obtener información sobre sus juegos disponibles.'
  const numeroWhatsApp = '593992249152'
  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`
  window.open(urlWhatsApp, '_blank')
}

const handleExploreCatalog = () => {
  window.location.href = '/ver-mas'
}

onMounted(() => {
  // Auto-rotate cada 5 segundos
  intervalId = window.setInterval(() => {
    nextGame()
  }, 5000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <section class="relative min-h-[calc(100vh-6rem)] flex items-center overflow-hidden bg-gradient-to-br from-base-300 via-base-200 to-base-300">
    <!-- Efectos de fondo -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 bg-error/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-error/5 to-transparent"></div>
    </div>

    <div class="container mx-auto px-4 md:px-6 relative z-10">
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <!-- Lado Izquierdo: Contenido -->
        <div class="space-y-8 animate-fadeInLeft">
         

          <!-- Título Principal -->
          <div class="space-y-4">
            <h1 class="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
              <span class="text-white">Tu Tienda</span>
              <br />
              <span class="text-gradient-hero">Gamer</span>
              <br />
              <span class="text-white">De Confianza</span>
            </h1>
            <p class="text-lg md:text-xl text-base-content/70 max-w-xl">
              Encuentra los mejores juegos para PlayStation 4 y PlayStation 5. 
              Cuentas verificadas, entrega inmediata y los mejores precios del mercado.
            </p>
          </div>

          <!-- Estadísticas -->
          <div class="flex flex-wrap gap-6">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center">
                <Gamepad2 :size="24" class="text-error" />
              </div>
              <div>
                <p class="text-2xl font-bold text-white">{{ games.length }}+</p>
                <p class="text-sm text-base-content/60">Juegos Disponibles</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                <Star :size="24" class="text-warning" />
              </div>
              <div>
                <p class="text-2xl font-bold text-white">100%</p>
                <p class="text-sm text-base-content/60">Verificado</p>
              </div>
            </div>
          </div>

          <!-- CTAs -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button 
              @click="handleWhatsApp"
              class="btn btn-error btn-lg gap-3 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <MessageCircle :size="24" />
              <span>Contactar por WhatsApp</span>
            </button>
            <button 
              @click="handleExploreCatalog"
              class="btn btn-outline btn-lg gap-3 hover:btn-error transition-all duration-300"
            >
              <Gamepad2 :size="24" />
              <span>Explorar Catálogo</span>
            </button>
          </div>
        </div>

        <!-- Lado Derecho: Carrusel de Juegos -->
        <div class="relative h-[500px] lg:h-[600px] animate-fadeInRight" v-if="featuredGames.length > 0">
          <!-- Juego Principal -->
          <div 
            class="absolute inset-0 flex items-center justify-center transition-all duration-500"
            :class="{ 'opacity-0 scale-95': isAnimating, 'opacity-100 scale-100': !isAnimating }"
          >
            <div class="relative w-full max-w-md">
              <!-- Glow effect -->
              <div class="absolute inset-0 bg-error/20 blur-3xl rounded-3xl"></div>
              
              <!-- Card principal -->
              <div class="relative bg-base-100/50 backdrop-blur-xl rounded-3xl p-2 shadow-2xl border border-white/10 overflow-hidden">
                <!-- Badge de oferta -->
                <div 
                  v-if="currentGame?.descuento && currentGame.descuento > 0"
                  class="absolute top-6 right-6 z-10 bg-error text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg"
                >
                  -{{ currentGame.descuento }}%
                </div>

                <!-- Imagen -->
                <div class="relative aspect-[3/4] overflow-hidden rounded-2xl">
                  <img 
                    v-if="currentGame?.foto"
                    :src="currentGame.foto" 
                    :alt="currentGame.nombre"
                    class="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-base-300 via-transparent to-transparent"></div>
                  
                  <!-- Información superpuesta -->
                  <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 class="text-2xl font-bold mb-2 line-clamp-2">{{ currentGame?.nombre }}</h3>
                    <div class="flex items-center gap-2">
                      <span class="badge badge-error">{{ currentGame?.version }}</span>
                      <span v-if="currentGame?.tipoPromocion && currentGame.tipoPromocion !== 'ninguna'" class="badge badge-warning">
                        {{ currentGame.tipoPromocion }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Juegos secundarios (stack) -->
          <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 space-y-4 hidden lg:block">
            <div 
              v-for="(game, index) in nextGames" 
              :key="game?.id"
              class="w-32 h-44 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-white/20"
              :style="{ transform: `translateX(-${index * 20}px) scale(${1 - index * 0.1})`, opacity: 1 - index * 0.3 }"
              @click="nextGame"
            >
              <img 
                v-if="game?.foto"
                :src="game.foto" 
                :alt="game.nombre"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- Controles de navegación -->
          <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-base-100/80 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-white/10">
            <button 
              @click="prevGame"
              class="btn btn-circle btn-sm btn-ghost hover:btn-error transition-all"
              :disabled="featuredGames.length <= 1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <!-- Indicadores -->
            <div class="flex gap-2">
              <button 
                v-for="(game, index) in featuredGames" 
                :key="game.id"
                @click="currentGameIndex = index"
                class="w-2 h-2 rounded-full transition-all duration-300"
                :class="index === currentGameIndex ? 'bg-error w-6' : 'bg-base-content/30'"
              />
            </div>
            
            <button 
              @click="nextGame"
              class="btn btn-circle btn-sm btn-ghost hover:btn-error transition-all"
              :disabled="featuredGames.length <= 1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.text-gradient-hero {
  background: linear-gradient(135deg, #ef4444 0%, #f97316 50%, #eab308 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-fadeInLeft {
  animation: fadeInLeft 0.8s ease-out;
}

.animate-fadeInRight {
  animation: fadeInRight 0.8s ease-out;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
