<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, ShoppingCart, Check, Info } from 'lucide-vue-next'
import type { GameSummary, AccountType } from '@/types/game'
import { useCartStore } from '@/stores/cart'

const props = defineProps<{
  open: boolean
  game: GameSummary
}>()

const emit = defineEmits<{
  close: []
}>()

const cartStore = useCartStore()
const selectedPlatform = ref<'PS4' | 'PS5'>('PS4')
const selectedType = ref<'Principal' | 'Secundaria'>('Principal')

// Inicializar selección basada en la versión del juego
watch(() => props.game, (newGame) => {
  if (newGame.version === 'PS5') {
    selectedPlatform.value = 'PS5'
  } else {
    selectedPlatform.value = 'PS4'
  }
}, { immediate: true })

// Determinar qué plataformas están disponibles
const availablePlatforms = computed(() => {
  if (props.game.version === 'PS4') return ['PS4']
  if (props.game.version === 'PS5') return ['PS5']
  return ['PS4', 'PS5']
})

// Construir el tipo de cuenta completo (ej: 'Principal PS4')
const fullAccountType = computed<AccountType>(() => {
  return `${selectedType.value} ${selectedPlatform.value}` as AccountType
})

// Obtener precio actual
const currentPrice = computed(() => {
  const type = fullAccountType.value
  switch (type) {
    case 'Principal PS4': return props.game.precios.ps4Principal
    case 'Secundaria PS4': return props.game.precios.ps4Secundaria
    case 'Principal PS5': return props.game.precios.ps5Principal
    case 'Secundaria PS5': return props.game.precios.ps5Secundaria
    default: return 0
  }
})

const formatearPrecio = (precio: number): string => {
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD'
  }).format(precio)
}

const handleAddToCart = () => {
  cartStore.addToCart(props.game, 1, fullAccountType.value)
  emit('close')
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="handleClose"></div>

      <!-- Modal Content -->
      <div class="relative w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col md:flex-row animate-scaleIn">
        
        <!-- Close Button (Mobile) -->
        <button @click="handleClose" class="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white md:hidden">
          <X :size="20" />
        </button>

        <!-- Image Section -->
        <div class="w-full md:w-2/5 h-48 md:h-auto relative bg-slate-800">
          <img 
            v-if="game.foto"
            :src="game.foto" 
            :alt="game.nombre"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-slate-600">
            <span class="text-4xl font-bold">?</span>
          </div>
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r"></div>
        </div>

        <!-- Details Section -->
        <div class="w-full md:w-3/5 p-6 flex flex-col">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-2xl font-bold text-white leading-tight mb-1">{{ game.nombre }}</h2>
              <span class="inline-block px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs font-bold rounded uppercase tracking-wider">
                {{ game.version }}
              </span>
            </div>
            <button @click="handleClose" class="hidden md:block p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
              <X :size="20" />
            </button>
          </div>

          <div class="space-y-6 flex-1">
            <!-- Platform Selection -->
            <div v-if="availablePlatforms.length > 1">
              <label class="text-sm text-gray-400 font-medium mb-2 block">Plataforma</label>
              <div class="flex gap-3">
                <button
                  v-for="platform in availablePlatforms"
                  :key="platform"
                  @click="selectedPlatform = platform as 'PS4' | 'PS5'"
                  class="flex-1 py-2 px-4 rounded-lg font-bold transition-all border-2"
                  :class="selectedPlatform === platform 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'bg-slate-800 border-slate-700 text-gray-400 hover:border-gray-500'"
                >
                  {{ platform }}
                </button>
              </div>
            </div>

            <!-- Account Type Selection -->
            <div>
              <label class="text-sm text-gray-400 font-medium mb-2 block">Tipo de Cuenta</label>
              <div class="grid grid-cols-1 gap-3">
                <!-- Principal -->
                <button
                  @click="selectedType = 'Principal'"
                  class="relative p-3 rounded-xl border-2 text-left transition-all group"
                  :class="selectedType === 'Principal'
                    ? 'bg-blue-600/10 border-blue-500'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600'"
                >
                  <div class="flex justify-between items-center mb-1">
                    <span class="font-bold" :class="selectedType === 'Principal' ? 'text-blue-400' : 'text-white'">Principal</span>
                    <div v-if="selectedType === 'Principal'" class="bg-blue-500 rounded-full p-0.5">
                      <Check :size="12" class="text-white" />
                    </div>
                  </div>
                  <p class="text-xs text-gray-400">Juegas desde tu usuario personal. Trofeos en tu cuenta.</p>
                </button>

                <!-- Secundaria -->
                <button
                  @click="selectedType = 'Secundaria'"
                  class="relative p-3 rounded-xl border-2 text-left transition-all group"
                  :class="selectedType === 'Secundaria'
                    ? 'bg-purple-600/10 border-purple-500'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600'"
                >
                  <div class="flex justify-between items-center mb-1">
                    <span class="font-bold" :class="selectedType === 'Secundaria' ? 'text-purple-400' : 'text-white'">Secundaria</span>
                    <div v-if="selectedType === 'Secundaria'" class="bg-purple-500 rounded-full p-0.5">
                      <Check :size="12" class="text-white" />
                    </div>
                  </div>
                  <p class="text-xs text-gray-400">Juegas desde un usuario nuevo que te entregamos.</p>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer Action -->
          <div class="mt-8 pt-4 border-t border-white/5 flex items-center justify-between gap-4">
            <div class="flex flex-col">
              <span class="text-sm text-gray-400">Precio Total</span>
              <span class="text-3xl font-black text-white">{{ formatearPrecio(currentPrice) }}</span>
            </div>
            
            <button 
              @click="handleAddToCart"
              class="flex-1 btn btn-primary btn-lg gap-2 shadow-xl shadow-blue-600/20 hover:scale-105 transition-transform"
            >
              <ShoppingCart :size="20" />
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scaleIn {
  animation: scaleIn 0.2s ease-out forwards;
}
</style>
