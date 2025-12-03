<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import GameCard from '@/components/ui/GameCard.vue'
import type { GameSummary } from '@/types/game'

interface Props {
  results: GameSummary[]
  query: string
}

defineProps<Props>()
</script>

<template>
  <section class="py-8 bg-slate-900 min-h-[50vh]">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="flex items-center gap-3 mb-8 pb-4 border-b border-slate-800">
        <Search class="text-blue-500" :size="24" />
        <h2 class="text-2xl font-bold text-white">
          Resultados para "<span class="text-blue-400">{{ query }}</span>"
        </h2>
        <span class="ml-auto text-sm text-gray-400">{{ results.length }} resultados encontrados</span>
      </div>

      <div v-if="results.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        <GameCard
          v-for="game in results"
          :key="game.id"
          :game="game"
          :show-add-to-cart="true"
          class="h-full"
        />
      </div>

      <div v-else class="text-center py-20">
        <p class="text-gray-400 text-lg">No encontramos juegos que coincidan con tu búsqueda.</p>
        <p class="text-gray-500 text-sm mt-2">Intenta con otros términos o revisa nuestra sección de ofertas.</p>
      </div>
    </div>
  </section>
</template>
