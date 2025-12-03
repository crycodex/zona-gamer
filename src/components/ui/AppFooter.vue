<script setup lang="ts">
import { Gamepad2, Phone, Mail, Clock, MapPin, MessageCircle } from 'lucide-vue-next'
import logo from '/Images/logo/logo.png'

const currentYear = new Date().getFullYear()

const handleWhatsAppClick = () => {
  window.open('https://wa.me/593992249152', '_blank')
}
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
          <p class="text-sm text-gray-500 leading-relaxed mb-4">
            Tu destino número uno para juegos digitales PS4 y PS5. Los mejores títulos, los mejores precios, entrega inmediata.
          </p>
          <!-- Redes Sociales -->
          <div class="flex gap-3">
            <a 
              href="https://www.facebook.com/profile.php?id=61571106864991" 
              target="_blank"
              class="w-9 h-9 rounded-full bg-slate-900 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
              title="Facebook"
            >
              <svg class="w-4 h-4 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/zonagamer.ec/" 
              target="_blank"
              class="w-9 h-9 rounded-full bg-slate-900 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
              title="Instagram"
            >
              <svg class="w-4 h-4 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a 
              href="https://www.tiktok.com/@zonagamer.ec" 
              target="_blank"
              class="w-9 h-9 rounded-full bg-slate-900 hover:bg-black flex items-center justify-center transition-all duration-300 hover:scale-110"
              title="TikTok"
            >
              <svg class="w-4 h-4 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Navegación -->
        <div>
          <h3 class="text-white font-bold mb-4 flex items-center gap-2">
            <Gamepad2 :size="18" class="text-error" />
            Tienda
          </h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><router-link to="/" class="hover:text-error transition-colors">Inicio</router-link></li>
            <li><router-link to="/juegos" class="hover:text-error transition-colors">Todos los Juegos</router-link></li>
            <li><router-link to="/ofertas" class="hover:text-error transition-colors">Ofertas Especiales</router-link></li>
          </ul>
        </div>

        <!-- Contacto -->
        <div>
          <h3 class="text-white font-bold mb-4 flex items-center gap-2">
            <MessageCircle :size="18" class="text-error" />
            Contacto
          </h3>
          <ul class="space-y-3 text-sm text-gray-400">
            <li class="flex items-start gap-2">
              <Phone :size="16" class="shrink-0 mt-0.5 text-error" />
              <a href="tel:+593992249152" class="hover:text-error transition-colors">
                +593 99 224 9152
              </a>
            </li>
            <li class="flex items-start gap-2">
              <Mail :size="16" class="shrink-0 mt-0.5 text-error" />
              <a href="mailto:zonagamer.ec@gmail.com" class="hover:text-error transition-colors break-all">
                zonagamer.ec@gmail.com
              </a>
            </li>
            <li>
              <button 
                @click="handleWhatsAppClick"
                class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 hover:scale-105 text-sm font-medium"
              >
                <MessageCircle :size="16" />
                Chatea con nosotros
              </button>
            </li>
          </ul>
        </div>

        <!-- Información -->
        <div>
          <h3 class="text-white font-bold mb-4 flex items-center gap-2">
            <Clock :size="18" class="text-error" />
            Información
          </h3>
          <ul class="space-y-3 text-sm text-gray-400">
            <li class="flex items-start gap-2">
              <Clock :size="16" class="shrink-0 mt-0.5 text-error" />
              <div>
                <p class="font-medium text-white">Horario de Atención</p>
                <p>Lun - Dom: 9:00 AM - 10:00 PM</p>
              </div>
            </li>
            <li class="flex items-start gap-2">
              <MapPin :size="16" class="shrink-0 mt-0.5 text-error" />
              <div>
                <p class="font-medium text-white">Ubicación</p>
                <p>Ibarra, Ecuador</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-slate-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-xs text-gray-600 text-center md:text-left">
          &copy; {{ currentYear }} Zona Gamer. Todos los derechos reservados.
        </p>
        <div class="flex items-center gap-2 text-xs text-gray-600">
          <span>Métodos de pago:</span>
          <div class="flex gap-2">
            <!-- PayPal -->
            <div class="h-6 w-10 bg-slate-900 rounded border border-slate-800 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
              </svg>
            </div>
            <!-- Transferencia -->
            <div class="h-6 px-2 bg-slate-900 rounded border border-slate-800 flex items-center justify-center text-[10px] text-gray-500 font-medium">
              TRANSFER
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
