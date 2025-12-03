<script setup lang="ts">
import { Gamepad2 } from 'lucide-vue-next'
import logo from '/Images/logo/logo.png'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-slate-950 border-t border-slate-800 pt-12 pb-6">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <img 
              :src="logo" 
              alt="Zona Gamers" 
              class="h-10 w-auto object-contain"
            />
          </div>
          <p class="text-sm text-gray-500 leading-relaxed">
            Tu destino número uno para juegos digitales. Los mejores títulos, los mejores precios, entrega inmediata.
          </p>
        </div>

        <!-- Links 1 -->
        <div>
          <h3 class="text-white font-bold mb-4">Tienda</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="#" class="hover:text-blue-400 transition-colors">Novedades</a></li>
            <li><a href="#" class="hover:text-blue-400 transition-colors">Ofertas</a></li>
            <li><a href="#" class="hover:text-blue-400 transition-colors">PlayStation 5</a></li>
            <li><a href="#" class="hover:text-blue-400 transition-colors">PlayStation 4</a></li>
          </ul>
        </div>

        <!-- Links 2 -->
        <div>
          <h3 class="text-white font-bold mb-4">Soporte</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="#" class="hover:text-blue-400 transition-colors">Ayuda</a></li>
            <li><a href="#" class="hover:text-blue-400 transition-colors">Cómo comprar</a></li>
            <li><a href="#" class="hover:text-blue-400 transition-colors">Garantía</a></li>
            <li><a href="#" class="hover:text-blue-400 transition-colors">Contacto</a></li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h3 class="text-white font-bold mb-4">Legal</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="#" class="hover:text-blue-400 transition-colors">Términos y Condiciones</a></li>
            <li><a href="#" class="hover:text-blue-400 transition-colors">Política de Privacidad</a></li>
            <li><a href="#" class="hover:text-blue-400 transition-colors">Política de Reembolso</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-slate-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-xs text-gray-600">
          &copy; {{ currentYear }} Zona Gamer. Todos los derechos reservados.
        </p>
        <div class="flex gap-4">
          <!-- Payment Icons Placeholder -->
          <div class="h-6 w-10 bg-slate-900 rounded border border-slate-800"></div>
          <div class="h-6 w-10 bg-slate-900 rounded border border-slate-800"></div>
          <div class="h-6 w-10 bg-slate-900 rounded border border-slate-800"></div>
        </div>
      </div>
    </div>
  </footer>
</template>
