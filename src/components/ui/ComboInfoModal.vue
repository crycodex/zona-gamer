<script setup lang="ts">
import { computed } from 'vue'
import type { ComboSummary } from '@/types/combo'
import { X, Package } from 'lucide-vue-next'

interface Props {
  combo: ComboSummary | null
  show: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const formatearPrecio = (precio: number): string => {
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(precio)
}

const precioCombo = computed(() => {
  if (!props.combo) return 0
  const precioBase = props.combo.precio || props.combo.costo || 0
  if (props.combo.descuento && props.combo.descuento > 0) {
    return precioBase * (1 - props.combo.descuento / 100)
  }
  return precioBase
})

const precioOriginal = computed(() => {
  if (!props.combo) return 0
  return props.combo.precio || props.combo.costo || 0
})

const handleClose = (): void => {
  emit('close')
}

const handleBackdropClick = (event: MouseEvent): void => {
  if ((event.target as HTMLElement).classList.contains('modal')) {
    handleClose()
  }
}
</script>

<template>
  <dialog 
    v-if="show && combo" 
    class="modal modal-open"
    @click="handleBackdropClick"
  >
    <div class="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <h3 class="text-2xl font-black text-white flex items-center gap-3">
          <Package :size="28" class="text-error" />
          <span>{{ combo.nombre }}</span>
        </h3>
        <button 
          @click="handleClose"
          class="btn btn-sm btn-circle btn-ghost hover:bg-base-300"
        >
          <X :size="20" />
        </button>
      </div>

      <!-- Contenido -->
      <div class="space-y-6">
        <!-- Imagen y precio principal -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Imagen -->
          <div class="relative bg-base-300 rounded-lg overflow-hidden" style="aspect-ratio: 446 / 537;">
            <img 
              v-if="combo.foto" 
              :src="combo.foto" 
              :alt="combo.nombre"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Package :size="80" class="opacity-20" />
            </div>
          </div>

          <!-- Información principal -->
          <div class="space-y-4">
            <!-- Plataforma y disponibilidad -->
            <div class="flex items-center gap-3">
              <div class="badge badge-lg bg-primary/20 text-primary border-primary/30 font-semibold">
                {{ combo.version }}
              </div>
              <div v-if="combo.totalCorreos" class="badge badge-lg bg-success/20 text-success border-success/30">
                {{ combo.totalCorreos }} disponibles
              </div>
            </div>

            <!-- Precio -->
            <div class="bg-base-300 rounded-lg p-4">
              <p class="text-sm text-base-content/60 mb-2">Precio del Combo</p>
              <div class="flex items-baseline gap-3">
                <span class="text-3xl font-black text-error">
                  {{ formatearPrecio(precioCombo) }}
                </span>
                <span 
                  v-if="combo.descuento && combo.descuento > 0" 
                  class="text-lg text-base-content/40 line-through"
                >
                  {{ formatearPrecio(precioOriginal) }}
                </span>
              </div>
              <div 
                v-if="combo.descuento && combo.descuento > 0" 
                class="mt-2 text-sm text-success font-semibold"
              >
                {{ combo.descuento }}% de descuento
              </div>
            </div>

            <!-- Promoción -->
            <div v-if="combo.tipoPromocion === 'oferta' || combo.tipoPromocion === 'promocion' || combo.isOffert" class="flex items-center gap-2">
              <div 
                :class="[
                  'badge badge-lg',
                  combo.tipoPromocion === 'oferta' || combo.isOffert 
                    ? 'badge-error' 
                    : 'badge-warning'
                ]"
              >
                {{ combo.tipoPromocion === 'oferta' || combo.isOffert ? 'Oferta' : 'Promoción' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Juegos incluidos -->
        <div class="bg-base-300 rounded-lg p-6">
          <h4 class="text-xl font-black text-white mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>{{ combo.juegos?.length || 0 }} Juego{{ (combo.juegos?.length || 0) !== 1 ? 's' : '' }} Incluido{{ (combo.juegos?.length || 0) !== 1 ? 's' : '' }}</span>
          </h4>
          
          <div v-if="combo.juegos && combo.juegos.length > 0" class="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            <div
              v-for="(juego, index) in combo.juegos"
              :key="index"
              class="flex items-center gap-3 bg-base-200 px-4 py-3 rounded-lg"
            >
              <div class="shrink-0 w-2 h-2 rounded-full bg-error"></div>
              <span class="flex-1 font-medium text-base-content">{{ juego.nombre }}</span>
              <div v-if="juego.tipo === 'catalogo'" class="badge badge-sm badge-primary">
                Catálogo
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-base-content/50">
            <Package :size="48" class="mx-auto mb-2 opacity-30" />
            <p>Sin juegos especificados</p>
          </div>
        </div>

        <!-- Información adicional -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="combo.stockAccounts" class="bg-base-300 rounded-lg p-4">
            <p class="text-sm text-base-content/60 mb-1">Cuentas con Stock</p>
            <p class="text-2xl font-black text-success">{{ combo.stockAccounts }}</p>
          </div>
          <div v-if="combo.totalCorreos" class="bg-base-300 rounded-lg p-4">
            <p class="text-sm text-base-content/60 mb-1">Total de Correos</p>
            <p class="text-2xl font-black text-primary">{{ combo.totalCorreos }}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-action mt-6">
        <button @click="handleClose" class="btn btn-primary">
          Cerrar
        </button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(239, 68, 68, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(239, 68, 68, 0.5);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(239, 68, 68, 0.7);
}
</style>

