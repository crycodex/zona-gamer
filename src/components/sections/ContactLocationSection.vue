<script setup lang="ts">
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-vue-next'
</script>

<template>
  <section class="py-12 bg-slate-900 border-t border-slate-800">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <!-- Información de Contacto -->
        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold text-white mb-4">Visítanos</h2>
            <p class="text-gray-400 leading-relaxed">
              Ven a nuestra tienda física para probar los últimos lanzamientos y recibir asesoramiento personalizado de expertos.
            </p>
          </div>

          <div class="space-y-4">
            <div class="flex items-start gap-4">
              <div class="p-2 bg-slate-800 rounded-lg text-blue-400">
                <MapPin :size="20" />
              </div>
              <div>
                <h3 class="font-medium text-white">Dirección</h3>
                <p class="text-sm text-gray-400">Simón Bolívar 615, Ibarra, Ecuador</p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="p-2 bg-slate-800 rounded-lg text-blue-400">
                <Clock :size="20" />
              </div>
              <div>
                <h3 class="font-medium text-white">Horario</h3>
                <p class="text-sm text-gray-400">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="p-2 bg-slate-800 rounded-lg text-blue-400">
                <Phone :size="20" />
              </div>
              <div>
                <h3 class="font-medium text-white">Contacto</h3>
                <p class="text-sm text-gray-400">+593 99 848 0376</p>
                <p class="text-sm text-gray-400">contacto@zonagamer.com</p>
              </div>
            </div>
          </div>

          <!-- Redes Sociales -->
          <div class="pt-4">
            <h3 class="text-sm font-medium text-white mb-3">Síguenos</h3>
            <div class="flex gap-3">
              <a href="#" class="p-2 bg-slate-800 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-slate-700 transition-all">
                <Facebook :size="20" />
              </a>
              <a href="#" class="p-2 bg-slate-800 rounded-lg text-gray-400 hover:text-pink-500 hover:bg-slate-700 transition-all">
                <Instagram :size="20" />
              </a>
              <a href="#" class="p-2 bg-slate-800 rounded-lg text-gray-400 hover:text-sky-500 hover:bg-slate-700 transition-all">
                <Twitter :size="20" />
              </a>
            </div>
          </div>
        </div>

        <!-- Mapa -->
        <div class="lg:col-span-2 h-[300px] lg:h-auto bg-slate-800 rounded-xl overflow-hidden border border-slate-700 relative group">
          <!-- Placeholder de Mapa -->
          <div class="absolute inset-0 flex items-center justify-center bg-slate-800">
            <div class="text-center">
              <MapPin :size="48" class="mx-auto text-slate-600 mb-2" />
              <p class="text-slate-500">Mapa Interactivo</p>
            </div>
          </div>
          <!-- Aquí iría el iframe de Google Maps -->
          <iframe 
            src="https://maps.google.com/maps?q=Simón+Bolívar+615,+Ibarra,+Ecuador&hl=es&z=16&output=embed" 
            width="100%" 
            height="100%" 
            style="border:0;" 
            allowfullscreen 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade"
            class="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>
