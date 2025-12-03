<script setup lang="ts">
import { Tag, ArrowRight } from 'lucide-vue-next'
import GameCard from '@/components/ui/GameCard.vue'
import type { GameSummary } from '@/types/game'

interface Props {
  games: GameSummary[]
}

defineProps<Props>()
</script>

<template>
  <section class="py-12 bg-slate-900 border-b border-white/5">
    <div class="container mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-green-600/10 rounded-lg">
            <Tag class="text-green-500" :size="24" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">Promociones de Temporada</h2>
            <p class="text-sm text-gray-400">Precios increíbles en grandes títulos</p>
          </div>
        </div>
        <router-link to="/promociones" class="group flex items-center gap-2 text-sm font-medium text-green-400 hover:text-green-300 transition-colors">
          Ver todas las promos
          <ArrowRight :size="16" class="group-hover:translate-x-1 transition-transform" />
        </router-link>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        <GameCard
          v-for="game in games"
          :key="game.id"
          :game="game"
          :show-add-to-cart="true"
          class="h-full"
        />
      </div>
    </div>
  </section>
</template>
