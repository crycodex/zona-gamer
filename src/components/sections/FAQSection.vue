<script setup lang="ts">
import { ref } from 'vue'
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-vue-next'

const faqs = [
  {
    question: '¿Cómo recibo mi juego?',
    answer: 'Una vez confirmado el pago, recibirás un correo electrónico con los datos de acceso de la cuenta (usuario y contraseña) junto con un instructivo paso a paso para la instalación en tu consola.'
  },
  {
    question: '¿Cuál es la diferencia entre Cuenta Principal y Secundaria?',
    answer: 'La Cuenta Principal te permite jugar desde tu propio usuario personal y ganar trofeos en tu cuenta. La Cuenta Secundaria requiere que juegues desde el usuario que te enviamos y necesitas conexión a internet permanente para jugar.'
  },
  {
    question: '¿Tienen garantía los juegos?',
    answer: 'Sí, todos nuestros juegos cuentan con garantía de por vida ante candado, siempre y cuando se respeten los términos y condiciones de uso (no cambiar datos de la cuenta enviada, no compartirla, etc.).'
  },
  {
    question: '¿Cuánto tarda el envío?',
    answer: 'El envío es automático e inmediato las 24 horas del día. En casos excepcionales puede demorar hasta 30 minutos.'
  },
  {
    question: '¿Qué medios de pago aceptan?',
    answer: 'Aceptamos transferencias bancarias, Yape, Plin y tarjetas de crédito/débito a través de nuestra pasarela de pagos segura.'
  },
  {
    question: '¿Qué hago si tengo problemas con la instalación?',
    answer: 'Contamos con un equipo de soporte técnico disponible para ayudarte. Si tienes algún inconveniente, contáctanos por WhatsApp y te guiaremos paso a paso hasta que el juego esté funcionando correctamente.'
  }
]

const activeIndex = ref<number | null>(0)

const toggleFaq = (index: number) => {
  activeIndex.value = activeIndex.value === index ? null : index
}
</script>

<template>
  <section class="py-16 bg-slate-900 border-t border-slate-800">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="text-center mb-12">
        <div class="inline-flex p-3 bg-slate-800 rounded-full mb-4">
          <HelpCircle class="text-blue-500" :size="32" />
        </div>
        <h2 class="text-3xl font-bold text-white mb-4">Preguntas Frecuentes</h2>
        <p class="text-gray-400 max-w-2xl mx-auto">
          Resolvemos tus dudas sobre el proceso de compra e instalación.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="(faq, index) in faqs" 
          :key="index"
          class="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 transition-all duration-300 h-fit"
          :class="{ 'border-blue-500/50 shadow-lg shadow-blue-900/10': activeIndex === index }"
        >
          <button 
            @click="toggleFaq(index)"
            class="w-full flex items-center justify-between p-5 text-left focus:outline-none"
          >
            <span class="font-bold text-white" :class="{ 'text-blue-400': activeIndex === index }">
              {{ faq.question }}
            </span>
            <component 
              :is="activeIndex === index ? ChevronUp : ChevronDown" 
              class="text-gray-400 transition-transform duration-300"
              :class="{ 'text-blue-400': activeIndex === index }"
              :size="20"
            />
          </button>
          
          <div 
            v-show="activeIndex === index"
            class="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-slate-700/50 pt-4"
          >
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
