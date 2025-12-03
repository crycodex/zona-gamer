<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useRoles } from '@/composables/useRoles'
import { useCartStore } from '@/stores/cart'
import { Search, ShoppingCart, User, Send, Gamepad2, LayoutDashboard, Menu, X, Trash2, Plus, Minus } from 'lucide-vue-next'
import type { GamePlatform } from '@/types/game'
import logo from '/Images/logo/logo.png'

const router = useRouter()
const { currentUser, signOut } = useAuth()
const { currentUserData, isAdmin, hasEmployeeAccess, loadUserData } = useRoles()
const cartStore = useCartStore()

const searchQuery = ref('')
const selectedPlatform = ref<GamePlatform>('PS4 & PS5')
const isSearchExpanded = ref(false)
const isMobileMenuOpen = ref(false)
const userDropdownRef = ref<HTMLElement | null>(null)
const cartDropdownRef = ref<HTMLElement | null>(null)
const showClearCartConfirm = ref(false)
const itemToDelete = ref<string | null>(null)
const showDeleteConfirm = ref(false)

const emit = defineEmits<{
  openCart: []
  search: [query: string]
  platformChange: [platform: GamePlatform]
}>()

const handleLogout = async (): Promise<void> => {
  await signOut()
  router.push('/')
}

const irALogin = (): void => {
  router.push('/login')
}

const irAlDashboard = (): void => {
  if (isAdmin.value) {
    router.push('/admin')
  } else if (hasEmployeeAccess.value) {
    router.push('/employee')
  }
}


const positionDropdown = (dropdownRef: HTMLElement | null, buttonElement: HTMLElement | null): void => {
  if (!dropdownRef || !buttonElement || window.innerWidth >= 1024) return
  
  const rect = buttonElement.getBoundingClientRect()
  const scrollY = window.scrollY
  const scrollX = window.scrollX
  
  dropdownRef.style.position = 'fixed'
  dropdownRef.style.top = `${rect.bottom + scrollY + 8}px`
  dropdownRef.style.right = `${window.innerWidth - rect.right - scrollX}px`
  dropdownRef.style.left = 'auto'
  dropdownRef.style.transform = 'none'
  dropdownRef.style.marginTop = '0'
}

const openCart = (): void => {
  emit('openCart')
  // Posicionar dropdown del carrito en móvil
  setTimeout(() => {
    if (cartDropdownRef.value) {
      const button = cartDropdownRef.value.closest('.dropdown')?.querySelector('[role="button"]') as HTMLElement
      if (button) {
        positionDropdown(cartDropdownRef.value, button)
      }
    }
  }, 50)
}

const handleUserDropdownToggle = (): void => {
  // Posicionar dropdown de usuario en móvil
  setTimeout(() => {
    if (userDropdownRef.value) {
      const button = userDropdownRef.value.closest('.dropdown')?.querySelector('[role="button"]') as HTMLElement
      if (button) {
        positionDropdown(userDropdownRef.value, button)
      }
    }
  }, 50)
}

// Observar cambios en los dropdowns para reposicionarlos
let userObserver: MutationObserver | null = null
let cartObserver: MutationObserver | null = null
let handleReposition: (() => void) | null = null

const setupDropdownObserver = (dropdownRef: HTMLElement | null, buttonSelector: string): MutationObserver | null => {
  if (!dropdownRef || window.innerWidth >= 1024) return null
  
  const observer = new MutationObserver(() => {
    nextTick(() => {
      const button = dropdownRef.closest('.dropdown')?.querySelector(buttonSelector) as HTMLElement
      if (button && dropdownRef.offsetParent !== null) {
        positionDropdown(dropdownRef, button)
      }
    })
  })
  
  observer.observe(dropdownRef, {
    attributes: true,
    attributeFilter: ['style', 'class'],
    childList: false,
    subtree: false
  })
  
  return observer
}

onMounted(() => {
  if (currentUser.value) {
    loadUserData()
  }
  
  // Configurar observers para los dropdowns después de que se monten
  nextTick(() => {
    if (userDropdownRef.value) {
      userObserver = setupDropdownObserver(userDropdownRef.value, '[role="button"]')
    }
    if (cartDropdownRef.value) {
      cartObserver = setupDropdownObserver(cartDropdownRef.value, '[role="button"]')
    }
  })
  
  // Reposicionar dropdowns al hacer scroll o redimensionar
  handleReposition = (): void => {
    if (userDropdownRef.value && window.innerWidth < 1024) {
      const button = userDropdownRef.value.closest('.dropdown')?.querySelector('[role="button"]') as HTMLElement
      if (button && userDropdownRef.value.offsetParent !== null) {
        positionDropdown(userDropdownRef.value, button)
      }
    }
    if (cartDropdownRef.value && window.innerWidth < 1024) {
      const button = cartDropdownRef.value.closest('.dropdown')?.querySelector('[role="button"]') as HTMLElement
      if (button && cartDropdownRef.value.offsetParent !== null) {
        positionDropdown(cartDropdownRef.value, button)
      }
    }
  }
  
  window.addEventListener('scroll', handleReposition, { passive: true })
  window.addEventListener('resize', handleReposition)
})

onUnmounted(() => {
  if (handleReposition) {
    window.removeEventListener('scroll', handleReposition)
    window.removeEventListener('resize', handleReposition)
  }
  if (userObserver) userObserver.disconnect()
  if (cartObserver) cartObserver.disconnect()
})

const handleSearch = (): void => {
  emit('search', searchQuery.value)
  if (searchQuery.value.trim()) {
    router.push({ path: '/juegos', query: { q: searchQuery.value } })
  }
}

// Búsqueda en tiempo real mientras escribe
const handleSearchInput = (): void => {
  emit('search', searchQuery.value)
}

const toggleSearch = (): void => {
  isSearchExpanded.value = !isSearchExpanded.value
  if (!isSearchExpanded.value) {
    searchQuery.value = ''
    emit('search', '')
  }
}

const handleSearchBlur = (): void => {
  // No cerrar el buscador automáticamente si hay texto
  // Permitir que el usuario vea los resultados
  if (!searchQuery.value) {
    setTimeout(() => {
      isSearchExpanded.value = false
    }, 200)
  }
}

const clearSearch = (): void => {
  searchQuery.value = ''
  emit('search', '')
}

const getItemPrice = (item: typeof cartStore.items[0]): number => {
  return cartStore.getItemPrice(item)
}

const handleQuickCheckout = (): void => {
  if (cartStore.isEmpty) return
  
  // Generar mensaje para WhatsApp
  let mensaje = '¡Hola! Me gustaría realizar el siguiente pedido:%0A%0A'
  
  cartStore.items.forEach((item, index) => {
    const precioUnitario = getItemPrice(item)
    const subtotal = precioUnitario * item.quantity
    
    mensaje += `${index + 1}. ${item.nombre}%0A`
    mensaje += `   Plataforma: ${item.version}%0A`
    mensaje += `   Cantidad: ${item.quantity}%0A`
    
    const precioBase = cartStore.getItemPrice(item) / (item.descuento && item.descuento > 0 ? (1 - item.descuento / 100) : 1)
    if (item.descuento && item.descuento > 0) {
      mensaje += `   Tipo de cuenta: ${item.selectedAccountType}%0A`
      mensaje += `   Precio original: $${precioBase.toFixed(2)}%0A`
      mensaje += `   Descuento: ${item.descuento}%%0A`
      mensaje += `   Precio con descuento: $${precioUnitario.toFixed(2)} c/u%0A`
    } else {
      mensaje += `   Tipo de cuenta: ${item.selectedAccountType}%0A`
      mensaje += `   Precio: $${precioUnitario.toFixed(2)} c/u%0A`
    }
    
    mensaje += `   Subtotal: $${subtotal.toFixed(2)}%0A%0A`
  })
  
  mensaje += `*TOTAL: $${cartStore.totalPrice.toFixed(2)}*%0A%0A`
  mensaje += 'Espero su confirmación. ¡Gracias!'
  
  // Número de WhatsApp (formato internacional sin +)
  const numeroWhatsApp = '593992249152'
  
  // Abrir WhatsApp en nueva pestaña
  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`
  window.open(urlWhatsApp, '_blank')
}

const handlePlatformChange = (platform: GamePlatform): void => {
  selectedPlatform.value = platform
  emit('platformChange', platform)
  // Cerrar menú móvil después de seleccionar plataforma
  isMobileMenuOpen.value = false
}

const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = (): void => {
  isMobileMenuOpen.value = false
}

const formatearPrecio = (precio: number): string => {
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD'
  }).format(precio)
}

const incrementCartQuantity = (gameId: string, currentQuantity: number): void => {
  cartStore.updateQuantity(gameId, currentQuantity + 1)
}

const decrementCartQuantity = (gameId: string, currentQuantity: number): void => {
  if (currentQuantity > 1) {
    cartStore.updateQuantity(gameId, currentQuantity - 1)
  } else {
    iniciarEliminacionItem(gameId)
  }
}

const iniciarEliminacionItem = (gameId: string): void => {
  itemToDelete.value = gameId
  showDeleteConfirm.value = true
}

const confirmarEliminacionItem = (): void => {
  if (itemToDelete.value) {
    cartStore.removeFromCart(itemToDelete.value)
    itemToDelete.value = null
    showDeleteConfirm.value = false
  }
}

const cancelarEliminacionItem = (): void => {
  itemToDelete.value = null
  showDeleteConfirm.value = false
}

const iniciarVaciarCarrito = (): void => {
  showClearCartConfirm.value = true
}

const confirmarVaciarCarrito = (): void => {
  cartStore.clearCart()
  showClearCartConfirm.value = false
}

const cancelarVaciarCarrito = (): void => {
  showClearCartConfirm.value = false
}

const getItemName = (gameId: string): string => {
  const item = cartStore.items.find(i => i.id === gameId)
  return item?.nombre || 'este juego'
}

const platforms: { id: GamePlatform; label: string; icon: string }[] = [
  { id: 'PS4 & PS5', label: 'Todos', icon: 'ALL' },
  { id: 'PS4', label: 'PS4', icon: 'PS4' },
  { id: 'PS5', label: 'PS5', icon: 'PS5' }
]
</script>

<template>
  <!-- Navbar Profesional Compacto -->
  <header class="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-white/5 shadow-lg">
    <nav class="w-full">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="flex items-center h-16 gap-8">
          
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-2 shrink-0 group">
            <img 
              :src="logo" 
              alt="Zona Gamers" 
              class="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </router-link>

          <!-- Navegación Izquierda (Desktop) -->
          <div class="hidden lg:flex items-center gap-6">
            <router-link to="/" class="text-sm font-medium text-gray-300 hover:text-white transition-colors" active-class="text-blue-500 font-bold">Inicio</router-link>
            <router-link to="/juegos" class="text-sm font-medium text-gray-300 hover:text-white transition-colors" active-class="text-blue-500 font-bold">Juegos</router-link>
            <router-link to="/promociones" class="text-sm font-medium text-gray-300 hover:text-white transition-colors" active-class="text-blue-500 font-bold">Promociones</router-link>
            <router-link to="/combos" class="text-sm font-medium text-gray-300 hover:text-white transition-colors" active-class="text-blue-500 font-bold">Combos</router-link>
            <router-link to="/ofertas" class="text-sm font-medium text-gray-300 hover:text-white transition-colors" active-class="text-blue-500 font-bold">Ofertas</router-link>
          </div>

          <!-- Spacer -->
          <div class="flex-1"></div>

          <!-- Acciones Derecha -->
          <div class="flex items-center gap-4 shrink-0">
            <!-- Buscador (Desktop) -->
            <div class="hidden lg:block relative w-64 group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search :size="16" class="text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar..."
                class="block w-full pl-10 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                @input="handleSearchInput"
                @keyup.enter="handleSearch"
              />
              <button 
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
              >
                <X :size="14" />
              </button>
            </div>

            <!-- Carrito -->
            <div class="dropdown dropdown-end">
              <div 
                tabindex="0" 
                role="button" 
                class="btn btn-ghost btn-sm btn-circle relative hover:bg-white/10"
                @click="openCart"
              >
                <ShoppingCart :size="20" class="text-gray-300" />
                <span 
                  v-if="cartStore.totalItems > 0" 
                  class="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full border-2 border-slate-900"
                >
                  {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
                </span>
              </div>
              
              <!-- Dropdown Carrito -->
              <div
                ref="cartDropdownRef"
                tabindex="0"
                class="mt-3 z-[9999] card card-compact dropdown-content w-80 bg-slate-800 border border-slate-700 shadow-xl"
              >
                <div class="card-body p-4">
                  <div class="flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
                    <span class="font-bold text-white">Carrito</span>
                    <span class="text-xs text-gray-400">{{ cartStore.totalItems }} items</span>
                  </div>
                  
                  <div v-if="!cartStore.isEmpty" class="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                    <div 
                      v-for="item in cartStore.items" 
                      :key="item.id"
                      class="flex gap-3 items-start group"
                    >
                      <img 
                        v-if="item.foto" 
                        :src="item.foto" 
                        :alt="item.nombre"
                        class="w-12 h-16 object-cover rounded bg-slate-900"
                      />
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-white truncate">{{ item.nombre }}</p>
                        <p class="text-xs text-gray-500">{{ item.version }}</p>
                        <div class="flex items-center justify-between mt-1">
                          <span class="text-sm font-bold text-blue-400">
                            {{ formatearPrecio(getItemPrice(item) * item.quantity) }}
                          </span>
                          <div class="flex items-center gap-2 bg-slate-900 rounded px-1">
                            <button 
                              @click.stop="decrementCartQuantity(item.id, item.quantity)"
                              class="text-gray-400 hover:text-white px-1"
                            >
                              -
                            </button>
                            <span class="text-xs text-white w-4 text-center">{{ item.quantity }}</span>
                            <button 
                              @click.stop="incrementCartQuantity(item.id, item.quantity)"
                              class="text-gray-400 hover:text-white px-1"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <button 
                        @click="iniciarEliminacionItem(item.id)"
                        class="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 :size="14" />
                      </button>
                    </div>
                  </div>
                  
                  <div v-else class="text-center py-6">
                    <p class="text-sm text-gray-500">Tu carrito está vacío</p>
                  </div>
                  
                  <div v-if="!cartStore.isEmpty" class="border-t border-slate-700 pt-3 mt-2">
                    <div class="flex justify-between items-center mb-3">
                      <span class="text-sm font-medium text-gray-400">Total:</span>
                      <span class="text-lg font-bold text-white">{{ formatearPrecio(cartStore.totalPrice) }}</span>
                    </div>
                    <button 
                      @click="handleQuickCheckout"
                      class="btn btn-primary btn-sm btn-block text-white"
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Usuario (Solo visible si hay sesión) -->
            <div v-if="currentUser" class="dropdown dropdown-end">
              <div 
                tabindex="0" 
                role="button" 
                class="btn btn-ghost btn-sm btn-circle avatar placeholder hover:bg-white/10"
                @click="handleUserDropdownToggle"
              >
                <div class="bg-slate-700 text-neutral-content rounded-full w-8">
                  <User :size="16" class="text-gray-300" />
                </div>
              </div>
              <ul
                ref="userDropdownRef"
                tabindex="0"
                class="mt-3 z-[9999] p-2 shadow-xl menu menu-sm dropdown-content bg-slate-800 border border-slate-700 rounded-box w-52"
              >
                <li class="menu-title px-2 py-1 text-xs text-gray-500">
                  {{ currentUser.email }}
                </li>
                <li v-if="isAdmin || hasEmployeeAccess">
                  <a @click="irAlDashboard" class="text-gray-300 hover:text-white hover:bg-slate-700">
                    <LayoutDashboard :size="16" />
                    Panel de Control
                  </a>
                </li>
                <li>
                  <a @click="handleLogout" class="text-red-400 hover:text-red-300 hover:bg-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                  </a>
                </li>
              </ul>
            </div>
            <!-- Botón de Login eliminado para clientes -->

            <!-- Menú Móvil Toggle -->
            <button 
              @click="toggleMobileMenu"
              class="lg:hidden btn btn-ghost btn-sm btn-circle text-gray-300"
            >
              <Menu v-if="!isMobileMenuOpen" :size="20" />
              <X v-else :size="20" />
            </button>
          </div>
        </div>

        <!-- Menú Móvil -->
        <div v-if="isMobileMenuOpen" class="lg:hidden py-4 border-t border-slate-800">
          <div class="space-y-4">
            <div class="flex flex-col gap-2">
              <router-link to="/" class="px-4 py-2 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white" active-class="bg-blue-600/10 text-blue-500" @click="closeMobileMenu">Inicio</router-link>
              <router-link to="/juegos" class="px-4 py-2 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white" active-class="bg-blue-600/10 text-blue-500" @click="closeMobileMenu">Juegos</router-link>
              <router-link to="/promociones" class="px-4 py-2 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white" active-class="bg-blue-600/10 text-blue-500" @click="closeMobileMenu">Promociones</router-link>
              <router-link to="/combos" class="px-4 py-2 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white" active-class="bg-blue-600/10 text-blue-500" @click="closeMobileMenu">Combos</router-link>
              <router-link to="/ofertas" class="px-4 py-2 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white" active-class="bg-blue-600/10 text-blue-500" @click="closeMobileMenu">Ofertas</router-link>
            </div>
            
            <div class="px-4">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Buscar juegos..."
                  class="input input-sm w-full bg-slate-800 border-slate-700 text-white pl-10"
                  @input="handleSearchInput"
                  @keyup.enter="handleSearch"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search :size="16" class="text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <!-- Modales (mantenidos igual pero con estilos actualizados) -->
  <dialog :class="['modal', { 'modal-open': showDeleteConfirm }]">
    <div class="modal-box bg-slate-800 border border-slate-700">
      <h3 class="font-bold text-lg text-white mb-4">¿Eliminar del carrito?</h3>
      <p class="text-gray-300 mb-6">
        ¿Deseas eliminar <strong>{{ itemToDelete ? getItemName(itemToDelete) : 'este juego' }}</strong>?
      </p>
      <div class="modal-action">
        <button @click="cancelarEliminacionItem" class="btn btn-ghost text-gray-400 hover:text-white">Cancelar</button>
        <button @click="confirmarEliminacionItem" class="btn btn-error text-white">Eliminar</button>
      </div>
    </div>
  </dialog>

  <dialog :class="['modal', { 'modal-open': showClearCartConfirm }]">
    <div class="modal-box bg-slate-800 border border-slate-700">
      <h3 class="font-bold text-lg text-white mb-4">¿Vaciar carrito?</h3>
      <p class="text-gray-300 mb-6">Esta acción no se puede deshacer.</p>
      <div class="modal-action">
        <button @click="cancelarVaciarCarrito" class="btn btn-ghost text-gray-400 hover:text-white">Cancelar</button>
        <button @click="confirmarVaciarCarrito" class="btn btn-error text-white">Vaciar Todo</button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
/* Scrollbar personalizado */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5); /* Blue-500 */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.7);
}

/* Posicionamiento de dropdowns en móvil */
@media (max-width: 1023px) {
  .dropdown.dropdown-end .dropdown-content {
    position: fixed !important;
    left: auto !important;
    transform: none !important;
    margin-top: 0 !important;
  }
  
  .dropdown.dropdown-end .dropdown-content {
    z-index: 9999 !important;
  }
  
  .dropdown.dropdown-end .dropdown-content.card {
    max-width: calc(100vw - 2rem);
    min-width: 280px;
  }
}
</style>

