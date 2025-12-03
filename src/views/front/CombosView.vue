<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCombos } from '@/composables/useCombos'
import { useCartStore } from '@/stores/cart'
import AppNavbar from '@/components/ui/AppNavbar.vue'
import AppFooter from '@/components/ui/AppFooter.vue'
import CartModal from '@/components/ui/CartModal.vue'
import { Package, ShoppingCart, Plus } from 'lucide-vue-next'
import type { ComboSummary } from '@/types/combo'

const { combos, isLoadingCombos, cargarCombos } = useCombos()
const cartStore = useCartStore()
const cartOpen = ref(false)

const activeCombos = computed(() => {
  return combos.value.filter(c => c.activo !== false)
})

const handleOpenCart = () => cartOpen.value = true
const handleCloseCart = () => cartOpen.value = false

const handleCheckout = () => {
  if (cartStore.isEmpty) return
  
  let mensaje = '¡Hola! Me gustaría realizar el siguiente pedido:%0A%0A'
  cartStore.items.forEach((item, index) => {
    const precioUnitario = cartStore.getItemPrice(item)
    mensaje += `${index + 1}. ${item.nombre} (${item.version}) - ${item.selectedAccountType}%0A`
    mensaje += `   Cantidad: ${item.quantity} - $${(precioUnitario * item.quantity).toFixed(2)}%0A`
  })
  mensaje += `%0A*TOTAL: $${cartStore.totalPrice.toFixed(2)}*%0A`
  
  window.open(`https://wa.me/593992249152?text=${mensaje}`, '_blank')
  handleCloseCart()
}

const formatearPrecio = (precio: number) => {
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD'
  }).format(precio)
}

const handleAddToCart = (combo: ComboSummary) => {
  cartStore.addToCart({
    id: combo.id,
    nombre: combo.nombre,
    precio: combo.precio,
    foto: combo.foto,
    version: combo.version,
    selectedAccountType: 'Principal',
    quantity: 1,
    isCombo: true
  })
}

onMounted(async () => {
  await cargarCombos('PS4 & PS5')
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500 selection:text-white">
    <AppNavbar @open-cart="handleOpenCart" />
    
    <main class="py-12">
      <div class="container mx-auto px-4 sm:px-6">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-8">
          <div class="p-2 bg-purple-600/10 rounded-lg">
            <Package class="text-purple-500" :size="24" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white">Combos de Ahorro</h1>
            <p class="text-gray-400">Paquetes exclusivos con descuento</p>
          </div>
        </div>

        <!-- Grid -->
        <div v-if="isLoadingCombos" class="flex justify-center py-20">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
        
        <div v-else-if="activeCombos.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="combo in activeCombos" 
            :key="combo.id"
            class="group relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div class="flex flex-col sm:flex-row h-full">
              <!-- Imagen / Preview -->
              <div class="w-full sm:w-2/5 bg-slate-900 relative min-h-[200px] sm:min-h-0">
                <div class="absolute inset-0 flex items-center justify-center">
                  <Package :size="48" class="text-slate-700" />
                </div>
                <img 
                  v-if="combo.foto"
                  :src="combo.foto" 
                  :alt="combo.nombre"
                  class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
                <div v-if="combo.isOffert" class="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                  Oferta Especial
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <h3 class="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{{ combo.nombre }}</h3>
                  
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
        
        <div v-else class="text-center py-20">
          <p class="text-xl text-gray-500">No hay combos disponibles en este momento.</p>
        </div>
      </div>
    </main>

    <AppFooter />

    <CartModal 
      :open="cartOpen" 
      @close="handleCloseCart"
      @checkout="handleCheckout"
    />
  </div>
</template>
