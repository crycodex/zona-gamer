<script setup lang="ts">
import { Star, Quote, User } from 'lucide-vue-next'

const reviews = [
  {
    id: 1,
    user: 'Carlos M.',
    avatar: null,
    rating: 5,
    game: 'FC 24',
    comment: 'Excelente servicio, la entrega fue inmediata y el soporte me ayudó con la instalación. Muy recomendado.',
    date: 'Hace 2 días'
  },
  {
    id: 2,
    user: 'Ana P.',
    avatar: null,
    rating: 5,
    game: 'Spider-Man 2',
    comment: 'Los mejores precios que he encontrado. Compré la cuenta secundaria y funciona perfecto en mi PS5.',
    date: 'Hace 1 semana'
  },
  {
    id: 3,
    user: 'David R.',
    avatar: null,
    rating: 4,
    game: 'God of War Ragnarök',
    comment: 'Todo bien, aunque demoró unos 15 minutos en llegar el correo. Fuera de eso, el juego va de maravilla.',
    date: 'Hace 3 días'
  },
  {
    id: 4,
    user: 'Sofia L.',
    avatar: null,
    rating: 5,
    game: 'Hogwarts Legacy',
    comment: 'Increíble atención al cliente. Tenía dudas sobre las cuentas primarias y me explicaron todo con paciencia.',
    date: 'Hace 5 días'
  }
]
</script>

<template>
  <section class="py-16 bg-slate-900 border-b border-white/5">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-white mb-4">Lo que dicen nuestros gamers</h2>
        <p class="text-gray-400 max-w-2xl mx-auto">
          Más de 10,000 clientes satisfechos confían en Zona Gamer para sus juegos digitales.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="review in reviews" 
          :key="review.id"
          class="bg-slate-800 p-6 rounded-xl border border-slate-700 relative hover:-translate-y-1 transition-transform duration-300"
        >
          <Quote class="absolute top-4 right-4 text-slate-700" :size="24" />
          
          <div class="flex items-center gap-1 text-yellow-500 mb-4">
            <Star v-for="i in 5" :key="i" :size="16" :class="i <= review.rating ? 'fill-current' : 'text-slate-600'" />
          </div>

          <p class="text-gray-300 text-sm mb-6 leading-relaxed">
            "{{ review.comment }}"
          </p>

          <div class="flex items-center gap-3 mt-auto">
            <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-gray-400">
              <User :size="20" />
            </div>
            <div>
              <h4 class="text-white font-bold text-sm">{{ review.user }}</h4>
              <p class="text-xs text-blue-400">{{ review.game }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
