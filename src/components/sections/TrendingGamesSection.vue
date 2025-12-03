<script setup lang="ts">
import { computed } from 'vue'
import { Flame, ArrowRight } from 'lucide-vue-next'
import GameCard from '@/components/ui/GameCard.vue'
import type { GameSummary } from '@/types/game'
import { useGames } from '@/composables/useGames'

// Usar composable si no se pasan props, o aceptar props
const props = defineProps<{
  games?: GameSummary[]
}>()

const { games: allGames } = useGames()

// Si se pasan juegos por props, usarlos. Si no, usar los del composable (filtrando por destacados/tendencias)
const displayGames = computed(() => {
  if (props.games && props.games.length > 0) {
    return props.games
  }
  
  // Lógica por defecto: juegos destacados o aleatorios si no hay destacados
  // Aquí asumimos que "destacado" o "oferta" son buenos candidatos para tendencias
  return allGames.value
    .filter(g => g.destacado || g.tipoPromocion === 'oferta')
    .slice(0, 6)
})
</script>

<template>
  <section v-if="displayGames.length > 0" class="py-12 bg-slate-900 border-b border-white/5">
    <div class="container mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-orange-600/10 rounded-lg">
            <Flame class="text-orange-500" :size="24" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">Tendencias</h2>
            <p class="text-sm text-gray-400">Lo más popular esta semana</p>
          </div>
        </div>
        <router-link to="/juegos" class="group flex items-center gap-2 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors">
          Ver todo
          <ArrowRight :size="16" class="group-hover:translate-x-1 transition-transform" />
        </router-link>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        <GameCard
          v-for="game in displayGames"
          :key="game.id"
          :game="game"
          :show-add-to-cart="true"
          class="h-full"
        />
      </div>
    </div>
  </section>
</template>

