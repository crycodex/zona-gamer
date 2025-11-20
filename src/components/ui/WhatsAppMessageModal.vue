<script setup lang="ts">
import { ref, computed } from 'vue'
import { MessageCircle, Copy, CheckCircle, X } from 'lucide-vue-next'
import type { WhatsAppMessage } from '@/composables/useWhatsAppMessages'

interface Props {
  mensaje: WhatsAppMessage | null
  mostrar: boolean
  codigosRestantes?: number
}

interface Emits {
  (e: 'cerrar'): void
  (e: 'copiar', mensaje: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const copiado = ref(false)

const badgeVersionClass = computed(() => {
  if (props.mensaje?.version === 'PS4') {
    return 'badge-primary'
  }
  return 'badge-secondary'
})

const handleCopiar = async (): Promise<void> => {
  if (!props.mensaje) return
  
  emit('copiar', props.mensaje.mensajeCompleto)
  copiado.value = true
  
  // Resetear el estado de copiado después de 2 segundos
  setTimeout(() => {
    copiado.value = false
  }, 2000)
}

const handleCerrar = (): void => {
  copiado.value = false
  emit('cerrar')
}
</script>

<template>
  <dialog v-if="mostrar && mensaje" class="modal modal-open">
    <div class="modal-box max-w-3xl">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="avatar placeholder">
            <div class="bg-success text-success-content rounded-full w-12">
              <MessageCircle :size="24" />
            </div>
          </div>
          <div>
            <h3 class="font-bold text-xl">Mensaje para WhatsApp</h3>
            <p class="text-sm text-base-content/60">Listo para copiar y enviar</p>
          </div>
        </div>
        <button @click="handleCerrar" class="btn btn-sm btn-circle btn-ghost">
          <X :size="20" />
        </button>
      </div>

      <!-- Información de la cuenta -->
      <div class="card bg-base-200 mb-4">
        <div class="card-body p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span class="font-semibold">Correo:</span>
              <p class="text-base-content/80 break-all">{{ mensaje.correo }}</p>
            </div>
            <div>
              <span class="font-semibold">Plataforma:</span>
              <div class="mt-1">
                <span :class="['badge', badgeVersionClass]">{{ mensaje.version }}</span>
              </div>
            </div>
          </div>

          <!-- Códigos usados -->
          <div class="divider my-2"></div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span class="font-semibold">Código 1:</span>
              <p class="font-mono text-warning">{{ mensaje.codigoVerificacion1 }}</p>
            </div>
            <div>
              <span class="font-semibold">Código 2:</span>
              <p class="font-mono text-warning">{{ mensaje.codigoVerificacion2 }}</p>
            </div>
          </div>

          <!-- Códigos restantes -->
          <div v-if="codigosRestantes !== undefined" class="mt-2">
            <div class="alert alert-info py-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-xs">
                <strong>Códigos restantes después de usar estos:</strong> {{ codigosRestantes }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje completo -->
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text font-semibold">Mensaje completo:</span>
          <span class="label-text-alt text-base-content/60">
            Haz clic en copiar para enviarlo por WhatsApp
          </span>
        </label>
        <textarea
          :value="mensaje.mensajeCompleto"
          readonly
          class="textarea textarea-bordered font-mono text-sm h-72 resize-none"
        />
      </div>

      <!-- Acciones -->
      <div class="modal-action">
        <button @click="handleCerrar" class="btn btn-ghost">
          Cerrar
        </button>
        <button 
          @click="handleCopiar" 
          :class="['btn', copiado ? 'btn-success' : 'btn-primary']"
          class="gap-2"
        >
          <CheckCircle v-if="copiado" :size="20" />
          <Copy v-else :size="20" />
          {{ copiado ? '¡Copiado!' : 'Copiar Mensaje' }}
        </button>
      </div>

      <!-- Nota importante -->
      <div class="alert alert-warning mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <div class="text-sm">
          <p class="font-semibold">Importante:</p>
          <p>Los códigos utilizados ya han sido eliminados de la base de datos automáticamente.</p>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="handleCerrar">close</button>
    </form>
  </dialog>
</template>

