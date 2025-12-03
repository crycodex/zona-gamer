<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useGames } from '@/composables/useGames'
import { useCartStore } from '@/stores/cart'
import AppNavbar from '@/components/ui/AppNavbar.vue'
import AppFooter from '@/components/ui/AppFooter.vue'
import CartModal from '@/components/ui/CartModal.vue'
import GameCard from '@/components/ui/GameCard.vue'
import { Gamepad2, Search } from 'lucide-vue-next'

const route = useRoute()
const { games, isLoadingGames, cargarJuegos } = useGames()
const cartStore = useCartStore()
const cartOpen = ref(false)
const searchQuery = ref('')

const filteredGames = computed(() => {
  if (!searchQuery.value) return games.value
  const query = searchQuery.value.toLowerCase()
  return games.value.filter(g => g.nombre.toLowerCase().includes(query))
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

// Sincronizar búsqueda con URL
watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    searchQuery.value = newQuery as string
  }
})

onMounted(async () => {
  await cargarJuegos('PS4 & PS5')
  
  // Inicializar búsqueda desde URL si existe
  if (route.query.q) {
    searchQuery.value = route.query.q as string
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500 selection:text-white">
    <AppNavbar 
      @open-cart="handleOpenCart" 
      @search="(q) => searchQuery = q"
    />
    
    <main class="py-12">
      <div class="container mx-auto px-4 sm:px-6">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-600/10 rounded-lg">
              <Gamepad2 class="text-blue-500" :size="24" />
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white">Todos los Juegos</h1>
              <p class="text-gray-400">Explora nuestro catálogo completo</p>
            </div>
          </div>
          
          <!-- Buscador local -->
          <div class="relative w-full md:w-64">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search :size="16" class="text-gray-500" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Filtrar juegos..."
              class="block w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <!-- Grid -->
        <div v-if="isLoadingGames" class="flex justify-center py-20">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
        
        <div v-else-if="filteredGames.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          <GameCard
            v-for="game in filteredGames"
            :key="game.id"
            :game="game"
            :show-add-to-cart="true"
            class="h-full"
          />
        </div>
        
        <div v-else class="text-center py-20">
          <p class="text-xl text-gray-500">No se encontraron juegos.</p>
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
