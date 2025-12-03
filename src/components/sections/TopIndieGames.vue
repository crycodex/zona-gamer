<script setup lang="ts">
import { Trophy, ArrowRight } from 'lucide-vue-next'
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
          <div class="p-2 bg-yellow-600/10 rounded-lg">
            <Trophy class="text-yellow-500" :size="24" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">Joyas Indie</h2>
            <p class="text-sm text-gray-400">Los mejores juegos independientes</p>
          </div>
        </div>
        <button class="group flex items-center gap-2 text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors">
          Ver todos
          <ArrowRight :size="16" class="group-hover:translate-x-1 transition-transform" />
        </button>
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
