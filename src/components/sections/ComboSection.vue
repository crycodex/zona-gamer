<script setup lang="ts">
import { computed, watch } from 'vue'
import { useCombos } from '@/composables/useCombos'
import { useCartStore } from '@/stores/cart'
import type { ComboSummary } from '@/types/combo'
import type { AccountType } from '@/types/game'
import { Package, Sparkles } from 'lucide-vue-next'

const { combos, isLoadingCombos } = useCombos()
const cartStore = useCartStore()

// Mostrar todos los combos (no solo los que tienen stock)
// Si quieres filtrar solo los que tienen stock, cambia esto a:
// return combos.value.filter(combo => (combo.stockAccounts ?? 0) > 0)
const combosDisponibles = computed(() => {
  // Mostrar todos los combos que tienen al menos un correo
  return combos.value.filter(combo => (combo.totalCorreos ?? 0) > 0)
})

// Debug: log para ver qué combos se están cargando
watch(combos, (newCombos) => {
  console.log('🔍 Combos cargados en ComboSection:', newCombos.length)
  console.log('📦 Detalles de combos:', newCombos.map(c => ({ 
    id: c.id, 
    nombre: c.nombre, 
    correos: c.totalCorreos, 
    stock: c.stockAccounts 
  })))
}, { immediate: true })

// Obtener el precio mínimo de un combo
const getPrecioMinimo = (combo: ComboSummary): number => {
  return Math.min(
    combo.precios.ps4Principal,
    combo.precios.ps4Secundaria,
    combo.precios.ps5Principal,
    combo.precios.ps5Secundaria
  )
}

// Obtener el precio máximo de un combo (para calcular descuento)
const getPrecioMaximo = (combo: ComboSummary): number => {
  return Math.max(
    combo.precios.ps4Principal,
    combo.precios.ps4Secundaria,
    combo.precios.ps5Principal,
    combo.precios.ps5Secundaria
  )
}

// Calcular descuento basado en la diferencia entre precio máximo y mínimo
const calcularDescuento = (combo: ComboSummary): number => {
  const precioMin = getPrecioMinimo(combo)
  const precioMax = getPrecioMaximo(combo)
  if (precioMax === 0) return 0
  return Math.round(((precioMax - precioMin) / precioMax) * 100)
}

const formatearPrecio = (precio: number): string => {
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD'
  }).format(precio)
}

// Agregar combo al carrito (tratándolo como un juego)
const agregarComboAlCarrito = (combo: ComboSummary, accountType: AccountType = 'Principal PS4'): void => {
  // Convertir el combo a formato GameSummary para el carrito
  const comboAsGame = {
    ...combo,
    // Asegurar que tenga todos los campos necesarios
    id: combo.id,
    nombre: combo.nombre,
    foto: combo.foto,
    version: combo.version,
    precios: combo.precios,
    tipoPromocion: combo.tipoPromocion,
    isOffert: combo.isOffert,
    descuento: calcularDescuento(combo),
    stockAccounts: combo.stockAccounts,
    totalCorreos: combo.totalCorreos
  }
  
  cartStore.addToCart(comboAsGame, 1, accountType)
}
</script>

<template>
  <div class="w-full bg-base-200 py-12 md:py-16">
    <div class="container mx-auto px-4 md:px-6">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8 animate-fadeInUp">
        <div class="relative">
          <Package :size="48" class="text-error animate-float" :stroke-width="2" />
          <div class="absolute inset-0 blur-xl bg-error/30"></div>
        </div>
        <div class="flex-1">
          <h2 class="text-4xl font-black text-gradient-animated mb-1">Combos Especiales</h2>
          <p class="text-base-content/70 text-lg">Ahorra más comprando paquetes de juegos</p>
        </div>
        <div class="flex items-center gap-2">
          <Sparkles :size="24" class="text-warning animate-pulse" />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoadingCombos" class="flex justify-center items-center py-20">
        <span class="loading loading-spinner loading-lg text-error"></span>
      </div>

      <!-- Grid de Combos -->
      <div v-else-if="combosDisponibles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="combo in combosDisponibles"
          :key="combo.id"
          class="card bg-base-100 shadow-xl hover:shadow-2xl border border-white/10 overflow-hidden group transition-all duration-300 hover:scale-105"
        >
          <!-- Imagen del combo -->
          <figure class="relative h-48 bg-gradient-to-br from-error/20 via-primary/20 to-warning/20 overflow-hidden">
            <img 
              v-if="combo.foto" 
              :src="combo.foto" 
              :alt="combo.nombre"
              class="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Package :size="64" class="text-base-content/30" />
            </div>
            
            <!-- Badge de descuento (si tiene promoción) -->
            <div 
              v-if="combo.tipoPromocion === 'oferta' || combo.tipoPromocion === 'promocion' || combo.isOffert"
              class="absolute top-4 left-4 bg-error text-white font-black px-4 py-2 rounded-lg shadow-lg text-lg"
            >
              -{{ calcularDescuento(combo) }}%
            </div>
            
            <!-- Badge de stock -->
            <div 
              v-if="combo.stockAccounts && combo.stockAccounts > 0"
              class="absolute top-4 right-4 bg-success text-white font-bold px-3 py-1 rounded-lg shadow-lg text-sm"
            >
              {{ combo.stockAccounts }} disponible{{ combo.stockAccounts > 1 ? 's' : '' }}
            </div>
            
            <!-- Overlay con gradiente -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </figure>

          <!-- Contenido del combo -->
          <div class="card-body p-6">
            <h3 class="card-title text-xl font-bold mb-3 line-clamp-2">
              {{ combo.nombre }}
            </h3>

            <!-- Información del combo -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center gap-2 text-sm text-base-content/70">
                <Package :size="16" />
                <span>{{ combo.version }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-base-content/70">
                <span>📧 {{ combo.totalCorreos }} correo{{ combo.totalCorreos > 1 ? 's' : '' }} disponible{{ combo.totalCorreos > 1 ? 's' : '' }}</span>
              </div>
            </div>

            <!-- Precios -->
            <div class="mb-4 pt-4 border-t border-white/10">
              <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-base-content/60">PS4 Principal:</span>
                  <span class="text-sm font-semibold">{{ formatearPrecio(combo.precios.ps4Principal) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-base-content/60">PS4 Secundaria:</span>
                  <span class="text-sm font-semibold">{{ formatearPrecio(combo.precios.ps4Secundaria) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-base-content/60">PS5 Principal:</span>
                  <span class="text-sm font-semibold">{{ formatearPrecio(combo.precios.ps5Principal) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-base-content/60">PS5 Secundaria:</span>
                  <span class="text-sm font-semibold">{{ formatearPrecio(combo.precios.ps5Secundaria) }}</span>
                </div>
              </div>
              
              <!-- Precio destacado (mínimo) -->
              <div class="mt-4 pt-4 border-t border-white/10">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs text-base-content/60">Desde</p>
                    <p class="text-2xl font-black text-error">
                      {{ formatearPrecio(getPrecioMinimo(combo)) }}
                    </p>
                  </div>
                  <div v-if="calcularDescuento(combo) > 0" class="badge badge-success badge-lg">
                    Ahorra {{ calcularDescuento(combo) }}%
                  </div>
                </div>
              </div>
            </div>

            <!-- Botón agregar -->
            <button
              @click="agregarComboAlCarrito(combo)"
              class="btn btn-error w-full text-white font-bold gap-2 shadow-glow hover:shadow-glow"
              :disabled="!combo.stockAccounts || combo.stockAccounts === 0"
            >
              <Package :size="20" />
              {{ combo.stockAccounts && combo.stockAccounts > 0 ? 'Agregar Combo al Carrito' : 'Sin Stock' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Mensaje si no hay combos -->
      <div v-else class="text-center py-20 animate-fadeInUp">
        <div class="flex justify-center mb-6 relative">
          <Package :size="120" class="text-error/20 animate-float" :stroke-width="1.5" />
          <div class="absolute inset-0 blur-2xl bg-error/10"></div>
        </div>
        <h3 class="text-3xl font-black text-gradient mb-3">No hay combos disponibles</h3>
        <p class="text-base-content/60 text-lg mb-4">Los combos aparecerán cuando estén disponibles en la tienda</p>
        <!-- Debug info -->
        <div class="mt-4 text-sm text-base-content/40">
          <p>Total de combos cargados: {{ combos.length }}</p>
          <p>Combos con correos: {{ combosDisponibles.length }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

