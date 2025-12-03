<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGames } from '@/composables/useGames'
import { useCartStore } from '@/stores/cart'
import AppNavbar from '@/components/ui/AppNavbar.vue'
import AppFooter from '@/components/ui/AppFooter.vue'
import CartModal from '@/components/ui/CartModal.vue'
import GameCard from '@/components/ui/GameCard.vue'
import { Percent } from 'lucide-vue-next'

const { games, isLoadingGames, cargarJuegos } = useGames()
const cartStore = useCartStore()
const cartOpen = ref(false)

const offerGames = computed(() => {
  return games.value.filter(g => 
    (g.descuento && g.descuento > 0) || 
    g.tipoPromocion === 'oferta' || 
    g.isOffert
  )
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

onMounted(async () => {
  await cargarJuegos('PS4 & PS5')
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500 selection:text-white">
    <AppNavbar @open-cart="handleOpenCart" />
    
    <main class="py-12">
      <div class="container mx-auto px-4 sm:px-6">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-8">
          <div class="p-2 bg-green-600/10 rounded-lg">
            <Percent class="text-green-500" :size="24" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white">Ofertas Especiales</h1>
            <p class="text-gray-400">Descuentos por tiempo limitado</p>
          </div>
        </div>

        <!-- Grid -->
        <div v-if="isLoadingGames" class="flex justify-center py-20">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
        
        <div v-else-if="offerGames.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          <GameCard
            v-for="game in offerGames"
            :key="game.id"
            :game="game"
            :show-add-to-cart="true"
            class="h-full"
          />
        </div>
        
        <div v-else class="text-center py-20">
          <p class="text-xl text-gray-500">No hay ofertas disponibles en este momento.</p>
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
