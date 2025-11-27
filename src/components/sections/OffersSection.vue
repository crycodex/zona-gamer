<script setup lang="ts">
import { computed } from 'vue'
import type { GameSummary } from '@/types/game'
import { Sparkles } from 'lucide-vue-next'
import GameCard from '@/components/ui/GameCard.vue'

interface Props {
  games: GameSummary[]
  title?: string
  subtitle?: string
  variant?: 'primary' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Ofertas Especiales',
  subtitle: 'Aprovecha estos precios increíbles',
  variant: 'primary'
})

const hasGames = computed(() => props.games.length > 0)

const sectionClasses = computed(() => {
  return props.variant === 'primary' 
    ? 'bg-gradient-to-br from-error/10 via-base-200/50 to-warning/10'
    : 'bg-gradient-to-br from-success/10 via-base-200/50 to-info/10'
})

const badgeClasses = computed(() => {
  return props.variant === 'primary'
    ? 'badge-error'
    : 'badge-success'
})
</script>

<template>
  <section v-if="hasGames" class="mb-16 animate-fadeInUp">
    <div :class="['rounded-3xl p-6 md:p-8 border border-white/10 backdrop-blur-sm', sectionClasses]">
      <!-- Header de la sección -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <span :class="['badge badge-lg font-bold', badgeClasses]">
              {{ games.length }} {{ games.length === 1 ? 'Oferta' : 'Ofertas' }}
            </span>
          </div>
          <h2 class="text-3xl md:text-5xl font-black text-gradient-animated mb-2">
            {{ title }}
          </h2>
          <p class="text-base md:text-lg text-base-content/70 font-medium">
            {{ subtitle }}
          </p>
        </div>
        
        <!-- Decoración -->
        <div class="hidden lg:flex items-center gap-3">
          <div class="relative">
            <div class="absolute inset-0 bg-error/20 blur-xl rounded-full"></div>
            <Sparkles :size="64" class="text-error relative z-10" />
          </div>
        </div>
      </div>

      <!-- Grid de juegos en fila horizontal -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <GameCard
          v-for="game in games"
              :key="game.id"
          :game="game"
          :show-add-to-cart="true"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.text-gradient-animated {
  background: linear-gradient(90deg, #ff6b6b, #feca57, #ff6b6b);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% center;
  }
  50% {
    background-position: 100% center;
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-effect:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Mejoras para los controles del carrusel */
@media (max-width: 768px) {
  .btn-circle.btn-lg {
    width: 3rem;
    height: 3rem;
  }
}

/* Animación para el badge del contador */
@keyframes pulse-soft {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.badge-ghost {
  animation: pulse-soft 2s ease-in-out infinite;
}

/* Mejora de visibilidad de botones en dispositivos táctiles */
@media (hover: none) and (pointer: coarse) {
  .absolute.btn-circle {
    opacity: 0.95;
  }
}
</style>

