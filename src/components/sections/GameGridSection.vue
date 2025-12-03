<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import GameCard from '@/components/ui/GameCard.vue'
import type { GameSummary } from '@/types/game'

// Definir props
const props = defineProps<{
  title: string
  subtitle?: string
  icon?: any // Componente de icono
  games: any[] // Puede ser GameSummary o ComboSummary
  viewAllRoute?: string
  viewAllText?: string
  iconColorClass?: string
  iconBgClass?: string
}>()

// Computed para asegurar que solo mostramos 6 items
const displayGames = computed(() => {
  return props.games.slice(0, 6)
})
</script>

<template>
  <section v-if="displayGames.length > 0" class="py-12 bg-slate-900 border-b border-white/5">
    <div class="container mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <div v-if="icon" class="p-2 rounded-lg" :class="iconBgClass || 'bg-blue-600/10'">
            <component :is="icon" :size="24" :class="iconColorClass || 'text-blue-500'" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">{{ title }}</h2>
            <p v-if="subtitle" class="text-sm text-gray-400">{{ subtitle }}</p>
          </div>
        </div>
        
        <router-link 
          v-if="viewAllRoute" 
          :to="viewAllRoute" 
          class="group flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          {{ viewAllText || 'Ver más' }}
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
