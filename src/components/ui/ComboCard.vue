<script setup lang="ts">
import { computed } from 'vue'
import type { ComboSummary } from '@/types/combo'
import { useCartStore } from '@/stores/cart'
import { useCurrency } from '@/composables/useCurrency'
import { ShoppingCart, Check, Info, Package } from 'lucide-vue-next'
import type { GameSummary } from '@/types/game'

interface Props {
  combo: ComboSummary
  showAddToCart?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAddToCart: true
})

const emit = defineEmits<{
  showInfo: [combo: ComboSummary]
}>()

const cartStore = useCartStore()
const { formatPrice, getLowestPrice } = useCurrency()

const formatearPrecio = (precio: number): string => {
  return formatPrice(precio)
}

// Obtener el precio más bajo del combo según la moneda actual
const precioCombo = computed(() => {
  // Si el combo tiene precios diferenciados, usar el más bajo
  const precioBase = props.combo.precios 
    ? getLowestPrice(props.combo.precios)
    : (props.combo.precio || props.combo.costo || 0)
  
  if (props.combo.descuento && props.combo.descuento > 0) {
    return precioBase * (1 - props.combo.descuento / 100)
  }
  return precioBase
})

const precioOriginal = computed(() => {
  return props.combo.precios 
    ? getLowestPrice(props.combo.precios)
    : (props.combo.precio || props.combo.costo || 0)
})

const isInCart = computed(() => cartStore.isInCart(props.combo.id))
const currentQuantity = computed(() => cartStore.getItemQuantity(props.combo.id))

const handleAddToCart = (): void => {
  // Convertir combo a GameSummary para el carrito
  const comboAsGame: GameSummary = {
    id: props.combo.id,
    nombre: props.combo.nombre,
    foto: props.combo.foto,
    version: props.combo.version,
    precios: props.combo.precios || {
      ps4Principal: precioOriginal.value,
      ps4Secundaria: precioOriginal.value,
      ps5Principal: precioOriginal.value,
      ps5Secundaria: precioOriginal.value,
      ps4PrincipalCOP: 0,
      ps4SecundariaCOP: 0,
      ps5PrincipalCOP: 0,
      ps5SecundariaCOP: 0
    },
    tipoPromocion: props.combo.tipoPromocion || 'ninguna',
    isOffert: props.combo.isOffert || false,
    descuento: props.combo.descuento || 0,
    stockAccounts: props.combo.stockAccounts || 0,
    totalCorreos: props.combo.totalCorreos,
    correos: props.combo.correos || [],
    costo: precioOriginal.value,
    activo: props.combo.activo !== false
  }
  
  if (isInCart.value) {
    const nuevaCantidad = currentQuantity.value + 1
    cartStore.updateQuantity(props.combo.id, nuevaCantidad)
  } else {
    cartStore.addToCart(comboAsGame, 1, 'Principal PS4')
  }
}

const handleShowInfo = (): void => {
  emit('showInfo', props.combo)
}
</script>

<template>
  <div 
    class="card bg-base-100 shadow-lg hover:shadow-2xl relative overflow-hidden group border border-white/10 transition-all duration-300 flex flex-col h-full hover:-translate-y-2"
  >
    <!-- Imagen del combo -->
    <div class="relative bg-base-300 overflow-hidden" style="aspect-ratio: 446 / 537;">
      <figure class="relative w-full h-full" style="transform: scale(0.9); transform-origin: center;">
        <img 
          v-if="combo.foto" 
          :src="combo.foto" 
          :alt="combo.nombre"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <Package :size="64" class="opacity-20" />
        </div>
      </figure>

      <!-- Badge de descuento - Esquina superior izquierda -->
      <div 
        v-if="combo.descuento && combo.descuento > 0" 
        class="absolute top-3 left-3 z-20 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black px-3 py-1.5 rounded-lg shadow-xl text-sm"
      >
        -{{ combo.descuento }}%
      </div>

      <!-- Badge de tipo de promoción - Esquina superior derecha -->
      <div 
        v-if="combo.tipoPromocion === 'oferta' || combo.isOffert"
        class="absolute top-3 right-3 z-20 bg-red-600 text-white font-bold px-3 py-1 rounded-lg shadow-xl text-xs uppercase tracking-wider"
      >
        Oferta
      </div>
      <div 
        v-else-if="combo.tipoPromocion === 'promocion'"
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
          {{ combo.version }}
        </div>
        <div v-if="combo.totalCorreos" class="text-xs text-base-content/50">
          {{ combo.totalCorreos }} disponibles
        </div>
      </div>

      <!-- Título del combo -->
      <h3 class="text-base font-bold text-white leading-tight line-clamp-2 min-h-[2.5rem]">
        {{ combo.nombre }}
      </h3>

      <!-- Botón Info (debajo del nombre) -->
      <button 
        @click="handleShowInfo"
        class="btn btn-ghost btn-sm w-full gap-2 border border-white/20 hover:bg-base-300 hover:border-primary/50 transition-all"
      >
        <Info :size="16" />
        <span>Ver Información</span>
      </button>

      <!-- Precio y botón agregar -->
      <div class="space-y-3 pt-2 border-t border-white/10 mt-auto">
        <!-- Precio -->
        <div class="flex flex-col">
          <span class="text-xs text-base-content/50 mb-1">Precio del Combo</span>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-black text-white">
              {{ formatearPrecio(precioCombo) }}
            </span>
            <span 
              v-if="combo.descuento && combo.descuento > 0" 
              class="text-sm text-base-content/40 line-through"
            >
              {{ formatearPrecio(precioOriginal) }}
            </span>
          </div>
          <!-- Indicador de descuento -->
          <div 
            v-if="combo.descuento && combo.descuento > 0" 
            class="text-xs text-success font-semibold mt-1"
          >
            {{ combo.descuento }}% de descuento
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
</style>

