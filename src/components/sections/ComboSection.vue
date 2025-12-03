<script setup lang="ts">
import { computed } from 'vue'
import { Package, ShoppingCart, Plus, ArrowRight } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import type { ComboSummary } from '@/types/combo'
import { useCombos } from '@/composables/useCombos'

const { combos } = useCombos()
const cartStore = useCartStore()

const activeCombos = computed(() => {
  return combos.value.filter(c => c.activo !== false).slice(0, 4)
})

const formatearPrecio = (precio: number) => {
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD'
  }).format(precio)
}

const handleAddToCart = (combo: ComboSummary) => {
  // Adaptar el combo al formato del carrito
  cartStore.addToCart({
    id: combo.id,
    nombre: combo.nombre,
    precio: combo.precio,
    foto: combo.foto,
    version: combo.version,
    selectedAccountType: 'Principal', // Por defecto
    quantity: 1,
    isCombo: true
  })
}
</script>

<template>
  <section v-if="activeCombos.length > 0" class="py-12 bg-slate-900 border-b border-white/5">
    <div class="container mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-purple-600/10 rounded-lg">
            <Package class="text-purple-500" :size="24" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">Combos de Ahorro</h2>
            <p class="text-sm text-gray-400">Paquetes exclusivos con descuento</p>
          </div>
        </div>
        <router-link to="/combos" class="group flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
          Ver todos
          <ArrowRight :size="16" class="group-hover:translate-x-1 transition-transform" />
        </router-link>
      </div>

      <!-- Grid de Combos -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="combo in activeCombos" 
          :key="combo.id"
          class="group relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div class="flex flex-col sm:flex-row h-full">
            <!-- Imagen / Preview -->
            <div class="w-full sm:w-2/5 bg-slate-900 relative min-h-[200px] sm:min-h-0">
              <!-- Placeholder de imagen -->
              <div class="absolute inset-0 flex items-center justify-center">
                <Package :size="48" class="text-slate-700" />
              </div>
              <img 
                v-if="combo.foto"
                :src="combo.foto" 
                :alt="combo.nombre"
                class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
              />
              <!-- Badge Ahorro (si aplica) -->
              <div v-if="combo.isOffert" class="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                Oferta Especial
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 p-5 flex flex-col justify-between">
              <div>
                <h3 class="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{{ combo.nombre }}</h3>
                
                <!-- Lista de juegos -->
                <div class="space-y-2 mb-4">
                  <div v-for="(juego, index) in combo.juegos" :key="index" class="flex items-start gap-2 text-sm text-gray-300">
                    <Plus :size="14" class="mt-1 text-purple-500" />
                    <span class="flex-1">{{ juego.nombre }} ({{ juego.version }})</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div>
                  <div class="text-2xl font-bold text-white">
                    {{ formatearPrecio(combo.precio) }}
                  </div>
                  <div class="text-xs text-gray-400">
                    {{ combo.version }}
                  </div>
                </div>

                <button 
                  @click="handleAddToCart(combo)"
                  class="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white border-none gap-2"
                >
                  <ShoppingCart :size="16" />
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

