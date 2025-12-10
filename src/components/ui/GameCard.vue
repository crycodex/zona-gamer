<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { GameSummary, AccountType } from '@/types/game'
import { useCartStore } from '@/stores/cart'
import { ShoppingCart, Check } from 'lucide-vue-next'

interface Props {
  game: GameSummary
  showAddToCart?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAddToCart: true
})

const cartStore = useCartStore()
const selectedAccountType = ref<AccountType>('Principal PS4')

const formatearPrecio = (precio: number): string => {
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(precio)
}

// Obtener el precio según el tipo de cuenta seleccionado
const precioActual = computed(() => {
  let precio = 0
  switch (selectedAccountType.value) {
    case 'Principal PS4':
      precio = props.game.precios.ps4Principal
      break
    case 'Secundaria PS4':
      precio = props.game.precios.ps4Secundaria
      break
    case 'Principal PS5':
      precio = props.game.precios.ps5Principal
      break
    case 'Secundaria PS5':
      precio = props.game.precios.ps5Secundaria
      break
  }
  return precio
})

const precioConDescuento = computed(() => {
  if (props.game.descuento && props.game.descuento > 0) {
    return precioActual.value * (1 - props.game.descuento / 100)
  }
  return precioActual.value
})

// Determinar qué tipos de cuenta están disponibles según la versión del juego
const availableAccountTypes = computed<AccountType[]>(() => {
  const types: AccountType[] = []
  if (props.game.version === 'PS4' || props.game.version === 'PS4 & PS5') {
    types.push('Principal PS4', 'Secundaria PS4')
  }
  if (props.game.version === 'PS5' || props.game.version === 'PS4 & PS5') {
    types.push('Principal PS5', 'Secundaria PS5')
  }
  return types.length > 0 ? types : ['Principal PS4', 'Secundaria PS4', 'Principal PS5', 'Secundaria PS5']
})

// Asegurar que el tipo seleccionado esté disponible
watch(() => props.game.version, () => {
  if (availableAccountTypes.value.length > 0 && !availableAccountTypes.value.includes(selectedAccountType.value)) {
    selectedAccountType.value = availableAccountTypes.value[0] || 'Principal PS4'
  }
}, { immediate: true })

const isInCart = computed(() => cartStore.isInCart(props.game.id, selectedAccountType.value))
const currentQuantity = computed(() => cartStore.getItemQuantity(props.game.id, selectedAccountType.value))

const handleAddToCart = (): void => {
  // Siempre agregar 1 unidad al carrito
  if (isInCart.value) {
    const nuevaCantidad = currentQuantity.value + 1
    cartStore.updateQuantity(props.game.id, nuevaCantidad, selectedAccountType.value)
  } else {
    cartStore.addToCart(props.game, 1, selectedAccountType.value)
  }
}

// Obtener versión corta para los botones
const getVersionLabel = (type: AccountType): string => {
  const labels: Record<AccountType, string> = {
    'Principal PS4': '1° PS4',
    'Secundaria PS4': '2° PS4',
    'Principal PS5': '1° PS5',
    'Secundaria PS5': '2° PS5'
  }
  return labels[type]
}

// Obtener descripción completa
const getVersionDescription = (type: AccountType): string => {
  const descriptions: Record<AccountType, string> = {
    'Principal PS4': 'Principal PS4',
    'Secundaria PS4': 'Secundaria PS4',
    'Principal PS5': 'Principal PS5',
    'Secundaria PS5': 'Secundaria PS5'
  }
  return descriptions[type]
}
</script>

<template>
  <div 
    class="card bg-base-100 shadow-lg hover:shadow-2xl relative overflow-hidden group border border-white/10 transition-all duration-300 flex flex-col h-full hover:-translate-y-2"
  >
    <!-- Imagen del juego -->
    <div class="relative bg-base-300 overflow-hidden" style="aspect-ratio: 446 / 537;">
      <figure class="relative w-full h-full" style="transform: scale(0.9); transform-origin: center;">
        <img 
          v-if="game.foto" 
          :src="game.foto" 
          :alt="game.nombre"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-16 w-16 opacity-20" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" 
            />
          </svg>
        </div>
      </figure>

      <!-- Badge de descuento - Esquina superior izquierda -->
      <div 
        v-if="game.descuento && game.descuento > 0" 
        class="absolute top-3 left-3 z-20 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black px-3 py-1.5 rounded-lg shadow-xl text-sm"
      >
        -{{ game.descuento }}%
      </div>

      <!-- Badge de tipo de promoción - Esquina superior derecha -->
      <div 
        v-if="game.tipoPromocion === 'oferta' || game.isOffert"
        class="absolute top-3 right-3 z-20 bg-red-600 text-white font-bold px-3 py-1 rounded-lg shadow-xl text-xs uppercase tracking-wider"
      >
        Oferta
      </div>
      <div 
        v-else-if="game.tipoPromocion === 'promocion'"
        class="absolute top-3 right-3 z-20 bg-yellow-500 text-black font-bold px-3 py-1 rounded-lg shadow-xl text-xs uppercase tracking-wider"
      >
        Promo
      </div>

      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

    <!-- Contenido de la card -->
    <div class="card-body p-4 space-y-3 flex-grow flex flex-col">
      <!-- Plataforma -->
      <div class="flex items-center gap-2">
        <div class="badge badge-sm bg-primary/20 text-primary border-primary/30 font-semibold">
          {{ game.version }}
        </div>
        <div v-if="game.totalCorreos" class="text-xs text-base-content/50">
          {{ game.totalCorreos }} disponibles
        </div>
      </div>

      <!-- Título del juego -->
      <h3 class="text-base font-bold text-white leading-tight line-clamp-2 min-h-[2.5rem] flex-grow">
        {{ game.nombre }}
      </h3>

      <!-- Selector de tipo de cuenta - Compacto -->
      <div v-if="showAddToCart && availableAccountTypes.length > 1" class="space-y-1">
        <div class="grid grid-cols-2 gap-1">
          <button
            v-for="type in availableAccountTypes"
            :key="type"
            @click="selectedAccountType = type"
            :class="[
              'px-2 py-1.5 rounded-md text-xs font-bold transition-all duration-200 border',
              selectedAccountType === type 
                ? 'bg-primary text-white border-primary shadow-md scale-105' 
                : 'bg-base-200 text-base-content/60 border-base-300 hover:bg-base-300 hover:border-primary/30'
            ]"
            :title="getVersionDescription(type)"
          >
            {{ getVersionLabel(type) }}
          </button>
        </div>
      </div>

      <!-- Precio y botón -->
      <div class="space-y-3 pt-2 border-t border-white/10">
        <!-- Precio -->
        <div class="flex flex-col">
          <span class="text-xs text-base-content/50 mb-1">Desde</span>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-black text-white">
              {{ formatearPrecio(precioConDescuento) }}
            </span>
            <span 
              v-if="game.descuento && game.descuento > 0" 
              class="text-sm text-base-content/40 line-through"
            >
              {{ formatearPrecio(precioActual) }}
            </span>
          </div>
          <!-- Indicador de cashback o descuento -->
          <div 
            v-if="game.descuento && game.descuento > 0" 
            class="text-xs text-success font-semibold mt-1"
          >
            {{ game.descuento }}% de descuento
          </div>
        </div>

        <!-- Indicador de carrito (si está en el carrito) -->
        <div 
          v-if="isInCart" 
          class="flex items-center gap-2 text-xs bg-success/10 text-success px-3 py-2 rounded-lg border border-success/30"
        >
          <Check :size="14" :stroke-width="3" />
          <span class="font-bold">{{ currentQuantity }} en el carrito</span>
        </div>

        <!-- Botón agregar al carrito -->
        <button 
          v-if="showAddToCart"
          @click="handleAddToCart"
          :class="[
            'group relative w-full font-bold text-sm h-12 border-none shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden flex items-center justify-center gap-2',
            isInCart 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:scale-[1.02]' 
              : 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black hover:scale-[1.02]'
          ]"
        >
          <!-- Efecto de brillo -->
          <div 
            :class="[
              'absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700',
              isInCart ? 'via-white/20' : 'via-white/40'
            ]"
          ></div>
          
          <ShoppingCart :size="18" :stroke-width="2.5" class="relative z-10" />
          <span class="relative z-10">{{ isInCart ? 'Agregar otra' : 'Añadir al carrito' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animación suave para el hover */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>
