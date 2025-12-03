<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useRoles } from '@/composables/useRoles'
import { BarChart3, Users, Gamepad2, Home, Phone, Mail, FileText, Package } from 'lucide-vue-next'

// Importar componentes refactorizados
import StatsOverview from '@/components/admin/StatsOverview.vue'
import UsersManagement from '@/components/admin/UsersManagement.vue'
import TelefonoSearch from '@/components/admin/TelefonoSearch.vue'
import CorreoSearch from '@/components/admin/CorreoSearch.vue'
import GamesManagementSection from '@/components/admin/GamesManagementSection.vue'
import CombosManagementSection from '@/components/admin/CombosManagementSection.vue'
import ReportesSection from '@/components/admin/ReportesSection.vue'

import type { GameSummary } from '@/types/game'

const router = useRouter()
const { signOut } = useAuth()
const { currentUserData, loadUserData } = useRoles()

// Estado para el tab activo
const activeTab = ref<'stats' | 'users' | 'telefono' | 'correo' | 'games' | 'combos' | 'reportes'>('stats')

// Referencias a componentes
const gamesManagementRef = ref<InstanceType<typeof GamesManagementSection> | null>(null)
const combosManagementRef = ref<InstanceType<typeof CombosManagementSection> | null>(null)

const handleLogout = async (): Promise<void> => {
  await signOut()
  router.push('/login')
}

const irAHome = (): void => {
  router.push('/')
}

const handleVerDetallesJuego = (juegoId: string): void => {
  // Cambiar al tab de juegos
  activeTab.value = 'games'
  
  // TODO: Implementar lógica para abrir juego específico en GamesManagementSection
  // Necesitaríamos exponer una función desde GamesManagementSection para navegar a un juego específico
}

const handleGameClickFromStats = async (juego: GameSummary): Promise<void> => {
  // Cambiar al tab de juegos
  activeTab.value = 'games'
  
  // Pequeño delay para asegurar que el componente se monte
  setTimeout(() => {
    if (gamesManagementRef.value) {
      gamesManagementRef.value.verCorreosJuego(juego)
    }
  }, 100)
}

onMounted(async () => {
  await loadUserData()
  
  // Si hay un juego para abrir desde el state del router
  const openGame = window.history.state?.openGame as GameSummary | undefined
  
  if (openGame) {
    handleGameClickFromStats(openGame)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <!-- Navbar Mejorado -->
    <div class="navbar-glass sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between py-4">
          <!-- Brand -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-error to-error/80 flex items-center justify-center shadow-lg shadow-error/20">
              <BarChart3 :size="20" class="text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-white">Panel de Administración</h1>
              <p class="text-xs text-gray-400">Gestión completa del sistema</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button 
              @click="irAHome" 
              class="btn btn-ghost gap-2 hover:bg-white/10 transition-all duration-300"
            >
              <Home :size="18" />
              <span class="hidden md:inline">Ir a la Tienda</span>
            </button>
            
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button" class="btn btn-ghost gap-2 hover:bg-white/10">
                <div class="avatar placeholder">
                  <div class="bg-gradient-to-br from-error to-error/80 text-white rounded-full w-9 h-9 ring-2 ring-error/30">
                    <span class="text-sm font-bold">{{ currentUserData?.email?.charAt(0).toUpperCase() }}</span>
                  </div>
                </div>
                <span class="hidden md:inline text-sm">{{ currentUserData?.email }}</span>
              </div>
              <ul
                tabindex="0"
                class="mt-3 z-[100] p-2 shadow-2xl menu menu-sm dropdown-content glass-effect rounded-xl w-56 border border-white/10"
              >
                <li class="menu-title px-3 py-2">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                    <span class="text-xs font-semibold">Administrador</span>
                  </div>
                </li>
                <div class="divider my-1"></div>
                <li>
                  <a @click="handleLogout" class="text-error hover:bg-error/20 gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs de Navegación Mejorados -->
    <div class="bg-slate-900/50 border-b border-white/5 sticky top-[73px] z-40 backdrop-blur-sm">
      <div class="container mx-auto px-4">
        <div class="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
          <button 
            @click="activeTab = 'stats'" 
            :class="[
              'tab-modern',
              activeTab === 'stats' ? 'tab-modern-active' : ''
            ]"
          >
            <BarChart3 :size="18" />
            <span>Estadísticas</span>
          </button>
          <button 
            @click="activeTab = 'users'" 
            :class="[
              'tab-modern',
              activeTab === 'users' ? 'tab-modern-active' : ''
            ]"
          >
            <Users :size="18" />
            <span>Usuarios</span>
          </button>
          <button 
            @click="activeTab = 'telefono'" 
            :class="[
              'tab-modern',
              activeTab === 'telefono' ? 'tab-modern-active' : ''
            ]"
          >
            <Phone :size="18" />
            <span class="hidden sm:inline">Búsqueda por</span> Teléfono
          </button>
          <button 
            @click="activeTab = 'correo'" 
            :class="[
              'tab-modern',
              activeTab === 'correo' ? 'tab-modern-active' : ''
            ]"
          >
            <Mail :size="18" />
            <span class="hidden sm:inline">Búsqueda por</span> Correo
          </button>
          <button 
            @click="activeTab = 'games'" 
            :class="[
              'tab-modern',
              activeTab === 'games' ? 'tab-modern-active' : ''
            ]"
          >
            <Gamepad2 :size="18" />
            <span>Juegos</span>
          </button>
          <button 
            @click="activeTab = 'combos'" 
            :class="[
              'tab-modern',
              activeTab === 'combos' ? 'tab-modern-active' : ''
            ]"
          >
            <Package :size="18" />
            <span>Combos</span>
          </button>
          <button 
            @click="activeTab = 'reportes'" 
            :class="[
              'tab-modern',
              activeTab === 'reportes' ? 'tab-modern-active' : ''
            ]"
          >
            <FileText :size="18" />
            <span>Reportes</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido por Tab -->
    <div class="container mx-auto p-4 sm:p-6 animate-fadeInUp">
      <!-- Tab: Estadísticas -->
      <div v-if="activeTab === 'stats'">
        <StatsOverview 
          :read-only="false" 
          :on-game-click="handleGameClickFromStats"
        />
      </div>

      <!-- Tab: Gestión de Usuarios -->
      <div v-if="activeTab === 'users'">
        <UsersManagement />
      </div>

      <!-- Tab: Búsqueda por Teléfono -->
      <div v-if="activeTab === 'telefono'">
        <TelefonoSearch @ver-detalles-juego="handleVerDetallesJuego" />
      </div>

      <!-- Tab: Búsqueda por Correo -->
      <div v-if="activeTab === 'correo'">
        <CorreoSearch @ver-detalles-juego="handleVerDetallesJuego" />
      </div>

      <!-- Tab: Gestión de Juegos -->
      <div v-if="activeTab === 'games'">
        <GamesManagementSection ref="gamesManagementRef" />
      </div>

      <!-- Tab: Gestión de Combos -->
      <div v-if="activeTab === 'combos'">
        <CombosManagementSection ref="combosManagementRef" />
      </div>

      <!-- Tab: Reportes -->
      <div v-if="activeTab === 'reportes'">
        <ReportesSection />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Navbar Glass Effect */
.navbar-glass {
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.8) 0%,
    rgba(30, 41, 59, 0.7) 100%
  );
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 
    0 4px 24px 0 rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

/* Tabs Modernos */
.tab-modern {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  color: rgb(156 163 175);
  border: 1px solid transparent;
  white-space: nowrap;
}

.tab-modern:hover {
  color: rgb(255 255 255);
  background-color: rgba(255, 255, 255, 0.05);
  transform: translateY(-1px);
}

.tab-modern-active {
  color: rgb(255 255 255);
  background-image: linear-gradient(to right, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1));
  border-color: rgba(239, 68, 68, 0.3);
  box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.1), 0 4px 6px -4px rgba(239, 68, 68, 0.1);
}

.tab-modern-active:hover {
  transform: translateY(0);
}

/* Glass Effect para dropdowns */
:deep(.glass-effect) {
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.95) 0%,
    rgba(30, 41, 59, 0.9) 100%
  );
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
}

/* Ocultar scrollbar pero mantener funcionalidad */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Animación de entrada */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.4s ease-out;
}
</style>
