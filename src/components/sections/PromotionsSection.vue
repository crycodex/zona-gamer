<script setup lang="ts">
import { computed } from 'vue'
import type { GameSummary } from '@/types/game'
import { Star } from 'lucide-vue-next'
import GameCard from '@/components/ui/GameCard.vue'

interface Props {
  games: GameSummary[]
  title?: string
  subtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Promociones Destacadas',
  subtitle: 'Los mejores juegos en promoción'
})

const hasGames = computed(() => props.games.length > 0)
</script>

<template>
  <section v-if="hasGames" class="mb-16 animate-fadeInUp">
    <div class="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-warning/10 via-base-200/50 to-primary/10 border border-white/10 backdrop-blur-sm">
      <!-- Header de la sección -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <span class="badge badge-lg badge-warning font-bold">
              {{ games.length }} {{ games.length === 1 ? 'Promoción' : 'Promociones' }}
            </span>
          </div>
          <h2 class="text-3xl md:text-5xl font-black text-gradient-promo mb-2">
            {{ title }}
          </h2>
          <p class="text-base md:text-lg text-base-content/70 font-medium">
            {{ subtitle }}
          </p>
        </div>
        
        <!-- Decoración -->
        <div class="hidden lg:flex items-center gap-3">
          <div class="relative">
            <div class="absolute inset-0 bg-warning/20 blur-xl rounded-full"></div>
            <Star :size="64" class="text-warning relative z-10 fill-warning" />
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
.text-gradient-promo {
  background: linear-gradient(90deg, #feca57, #48dbfb, #feca57);
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

