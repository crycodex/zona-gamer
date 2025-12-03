<script setup lang="ts">
import { ref, computed } from 'vue'
import { Gamepad2, Search } from 'lucide-vue-next'
import GameCard from '@/components/ui/GameCard.vue'
import type { GameSummary } from '@/types/game'

// Props para recibir juegos si es necesario, o usar store
// Por ahora simulamos datos o usamos un store si estuviera disponible globalmente
// Asumimos que este componente se usa en una página que le pasa los juegos o los carga
// Para el ejemplo, usaré una prop
interface Props {
  games?: GameSummary[]
}

const props = withDefaults(defineProps<Props>(), {
  games: () => []
})

const searchQuery = ref('')
const selectedPlatform = ref('Todos')

const filteredGames = computed(() => {
  let result = props.games

  if (selectedPlatform.value !== 'Todos') {
    result = result.filter(g => g.version.includes(selectedPlatform.value))
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(g => g.nombre.toLowerCase().includes(query))
  }

  return result
})

const platforms = ['Todos', 'PS5', 'PS4']
</script>

<template>
  <section class="py-12 bg-slate-900 border-b border-white/5">
    <div class="container mx-auto px-4 sm:px-6">
      <!-- Header & Filters -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-slate-800 rounded-lg text-white">
            <Gamepad2 :size="24" />
          </div>
          <h2 class="text-2xl font-bold text-white">Catálogo Completo</h2>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Search -->
          <div class="relative">
            <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Buscar juego..." 
              class="input input-sm bg-slate-800 border-slate-700 text-white pl-9 w-full sm:w-64 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <!-- Platform Filter -->
          <div class="flex bg-slate-800 rounded-lg p-1">
            <button 
              v-for="platform in platforms" 
              :key="platform"
              @click="selectedPlatform = platform"
              class="px-4 py-1 text-sm font-medium rounded-md transition-all"
              :class="selectedPlatform === platform ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'"
            >
              {{ platform }}
            </button>
          </div>
        </div>
      </div>

      <!-- Grid -->
      <div v-if="filteredGames.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        <GameCard
          v-for="game in filteredGames"
          :key="game.id"
          :game="game"
          :show-add-to-cart="true"
          class="h-full"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <Gamepad2 :size="48" class="mx-auto text-slate-700 mb-4" />
        <p class="text-gray-400 text-lg">No se encontraron juegos</p>
        <button 
          @click="selectedPlatform = 'Todos'; searchQuery = ''"
          class="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  </section>
</template>
