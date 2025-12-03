<template>
  <div class="group relative bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border border-white/5">
    <!-- Imagen del Juego -->
    <div 
      class="relative aspect-[3/4] overflow-hidden bg-slate-900 cursor-pointer"
      @click="openQuickAdd"
    >
      <img 
        v-if="game.foto" 
        :src="game.foto" 
        :alt="game.nombre"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-slate-700">
        <Gamepad2 :size="48" />
      </div>

      <!-- Badges (Oferta/Nuevo) -->
      <div class="absolute top-2 left-2 flex flex-col gap-1 z-10">
        <span v-if="game.descuento" class="px-2 py-1 bg-green-500 text-slate-900 text-xs font-bold rounded shadow-sm">
          -{{ game.descuento }}%
        </span>
        <span v-if="game.version" class="px-2 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold rounded shadow-sm uppercase tracking-wider">
          {{ game.version }}
        </span>
      </div>

      <!-- Overlay Hover (Opcional, para feedback visual) -->
      <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

    <!-- Información -->
    <div class="p-4 flex flex-col flex-1">
      <!-- Título -->
      <h3 
        class="text-base font-bold text-white leading-tight mb-2 line-clamp-2 cursor-pointer hover:text-blue-400 transition-colors" 
        :title="game.nombre"
        @click="openQuickAdd"
      >
        {{ game.nombre }}
      </h3>

      <div class="mt-auto pt-3 flex items-end justify-between gap-2">
        <!-- Precio -->
        <div class="flex flex-col">
          <span class="text-xs text-gray-400 font-medium">Desde</span>
          <div class="flex items-baseline gap-2">
            <span class="text-xl font-black text-white">
              {{ formatearPrecio(minPrice) }}
            </span>
            <span v-if="game.precioOriginal" class="text-xs text-gray-500 line-through">
              {{ formatearPrecio(game.precioOriginal) }}
            </span>
          </div>
        </div>

        <!-- Botón de Acción -->
        <button 
          @click.stop="openQuickAdd"
          class="btn btn-primary btn-sm px-4 shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform"
        >
          <ShoppingCart :size="16" />
          <span class="hidden sm:inline">Agregar</span>
        </button>
      </div>
    </div>

    <!-- Modal de Vista Rápida -->
    <GameQuickAddModal 
      :open="showQuickAdd" 
      :game="game" 
      @close="showQuickAdd = false" 
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GameSummary } from '@/types/game'
import { ShoppingCart, Gamepad2 } from 'lucide-vue-next'
import GameQuickAddModal from '@/components/ui/GameQuickAddModal.vue'

interface Props {
  game: GameSummary
  showAddToCart?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAddToCart: true
})

const showQuickAdd = ref(false)

const formatearPrecio = (precio: number): string => {
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD'
  }).format(precio)
}

// Calcular el precio mínimo para mostrar "Desde $X"
const minPrice = computed(() => {
  const prices = [
    props.game.precios.ps4Principal,
    props.game.precios.ps4Secundaria,
    props.game.precios.ps5Principal,
    props.game.precios.ps5Secundaria
  ].filter(p => p > 0)
  
  return prices.length > 0 ? Math.min(...prices) : (props.game.costo || 0)
})

const openQuickAdd = () => {
  showQuickAdd.value = true
}
</script>

