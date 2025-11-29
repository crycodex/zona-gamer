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

// Obtener el precio del combo
const getPrecioCombo = (combo: ComboSummary): number => {
  return combo.precio || combo.costo || 0
}

// Calcular descuento si está en promoción
const calcularDescuento = (combo: ComboSummary): number => {
  // Si hay descuento configurado, usarlo
  if (combo.descuento) return combo.descuento
  // Si está en oferta, mostrar un descuento por defecto
  if (combo.tipoPromocion === 'oferta' || combo.isOffert) return 15
  if (combo.tipoPromocion === 'promocion') return 10
  return 0
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

            <!-- Juegos incluidos -->
            <div class="mb-4 pt-4 border-t border-white/10">
              <div class="mb-3">
                <h4 class="font-bold text-sm text-base-content/80 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Juegos Incluidos ({{ combo.juegos?.length || 0 }})
                </h4>
              </div>
              
              <div v-if="combo.juegos && combo.juegos.length > 0" class="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                <div
                  v-for="(juego, index) in combo.juegos"
                  :key="index"
                  class="flex items-center gap-2 bg-base-200 px-3 py-2 rounded-lg text-sm"
                >
                  <div class="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-error"></div>
                  <span class="flex-1 line-clamp-1">{{ juego.nombre }}</span>
                  <span 
                    v-if="juego.tipo === 'catalogo'" 
                    class="badge badge-xs badge-primary opacity-60"
                  >
                    Catálogo
                  </span>
                </div>
              </div>
              
              <div v-else class="text-center py-4 text-sm text-base-content/50">
                No hay juegos especificados
              </div>
              
              <!-- Precio del combo -->
              <div class="mt-4 pt-4 border-t border-white/10">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs text-base-content/60">Precio del Combo</p>
                    <p class="text-2xl font-black text-error">
                      {{ formatearPrecio(getPrecioCombo(combo)) }}
                    </p>
                  </div>
                  <div v-if="calcularDescuento(combo) > 0" class="badge badge-success badge-lg">
                    -{{ calcularDescuento(combo) }}%
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
.line-clamp-1 {
  display: -webkit-box;
  line-clamp: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(239, 68, 68, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(239, 68, 68, 0.5);
  border-radius: 20px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(239, 68, 68, 0.7);
}
</style>

