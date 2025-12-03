<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGames } from '@/composables/useGames'
import { useCartStore } from '@/stores/cart'
import AppNavbar from '@/components/ui/AppNavbar.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import TrendingGamesSection from '@/components/sections/TrendingGamesSection.vue'
import ReviewsSection from '@/components/sections/ReviewsSection.vue'
import FAQSection from '@/components/sections/FAQSection.vue'
import ContactLocationSection from '@/components/sections/ContactLocationSection.vue'
import FeaturesBanner from '@/components/sections/FeaturesBanner.vue'
import AppFooter from '@/components/ui/AppFooter.vue'
import CartModal from '@/components/ui/CartModal.vue'
import GameGridSection from '@/components/sections/GameGridSection.vue'
import { Percent } from 'lucide-vue-next'

const { games, isLoadingGames, cargarJuegos } = useGames()
const cartStore = useCartStore()
const cartOpen = ref(false)

// Computed properties para distribuir los juegos
const featuredGames = computed(() => games.value.slice(0, 5))

// Ofertas: juegos con descuento o marcados como oferta
const offerGames = computed(() => {
  return games.value.filter(g => 
    (g.descuento && g.descuento > 0) || 
    g.tipoPromocion === 'oferta' || 
    g.isOffert
  ).slice(0, 8)
})



// Tendencias: juegos destacados que no son necesariamente ofertas
const trendingGames = computed(() => {
  return games.value.filter(g => g.destacado && g.tipoPromocion !== 'oferta').slice(0, 8)
})

const ps5Games = computed(() => games.value.filter(g => g.version.includes('PS5')).slice(0, 8))

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
    
    <main>
      <HeroSection :games="featuredGames" />
      


      <!-- Sección de Ofertas -->
      <GameGridSection
        v-if="offerGames.length > 0"
        title="Ofertas Especiales"
        subtitle="Descuentos increíbles en tus juegos favoritos"
        :icon="Percent"
        :games="offerGames"
        view-all-route="/ofertas"
        view-all-text="Ver todas las ofertas"
        icon-color-class="text-rose-500"
        icon-bg-class="bg-rose-600/10"
      />
      
      <FeaturesBanner />
      
      <!-- Sección de Tendencias (Preview) -->
      <TrendingGamesSection 
        v-if="trendingGames.length > 0"
        :games="trendingGames" 
      />
      
      <ReviewsSection />
      
      <FAQSection />
      
      <ContactLocationSection />
    </main>

    <AppFooter />

    <CartModal 
      :open="cartOpen" 
      @close="handleCloseCart"
      @checkout="handleCheckout"
    />
  </div>
</template>



