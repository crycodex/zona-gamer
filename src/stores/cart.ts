import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type { GameSummary } from '@/types/game'

export interface CartItem extends GameSummary {
  quantity: number
}

const CART_STORAGE_KEY = 'zona_gamer_cart'

// Funciones de localStorage
const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as CartItem[]
    }
  } catch (error) {
    console.error('Error cargando carrito desde localStorage:', error)
  }
  return []
}

const saveCartToStorage = (cartItems: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  } catch (error) {
    console.error('Error guardando carrito en localStorage:', error)
  }
}

export const useCartStore = defineStore('cart', () => {
  // Cargar carrito desde localStorage al inicializar
  const items = ref<CartItem[]>(loadCartFromStorage())

  // Computed
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      // Calcular precio con descuento si aplica
      const precioUnitario = item.descuento && item.descuento > 0
        ? item.costo * (1 - item.descuento / 100)
        : item.costo
      return total + (precioUnitario * item.quantity)
    }, 0)
  })

  const isEmpty = computed(() => items.value.length === 0)

  // Watcher para guardar automáticamente en localStorage cuando cambie el carrito
  watch(
    items,
    (newItems) => {
      saveCartToStorage(newItems)
    },
    { deep: true }
  )

  // Actions
  const addToCart = (game: GameSummary, quantity: number = 1): void => {
    const existingItem = items.value.find(item => item.id === game.id)
    
    if (existingItem) {
      // Si el juego ya está en el carrito, aumentar cantidad (sin límite)
      existingItem.quantity += quantity
    } else {
      // Si es nuevo, agregarlo con la cantidad especificada (sin límite)
      items.value.push({
        ...game,
        quantity: quantity
      })
    }
  }

  const removeFromCart = (gameId: string): void => {
    const index = items.value.findIndex(item => item.id === gameId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  const updateQuantity = (gameId: string, quantity: number): void => {
    const item = items.value.find(item => item.id === gameId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(gameId)
      } else {
        // Sin límite de cantidad
        item.quantity = quantity
      }
    }
  }

  const clearCart = (): void => {
    items.value = []
    // El watcher se encargará de limpiar localStorage automáticamente
  }

  const isInCart = (gameId: string): boolean => {
    return items.value.some(item => item.id === gameId)
  }

  const getItemQuantity = (gameId: string): number => {
    const item = items.value.find(item => item.id === gameId)
    return item?.quantity || 0
  }

  return {
    items,
    totalItems,
    totalPrice,
    isEmpty,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity
  }
})

