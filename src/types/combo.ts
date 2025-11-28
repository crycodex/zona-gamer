import type { GamePlatform, AccountOwner, GamePrices, PromocionType, AccountType } from './game'

// Re-exportar tipos necesarios
export type { AccountOwner, AccountType }

// Los combos usan los mismos tipos base que los juegos
export type ComboPlatform = GamePlatform

export interface ComboEmailAccount {
  correo: string // ID del documento
  nombre: string // Nombre del combo (puede ser nombre propio o de juego)
  precios: GamePrices // Objeto con los 4 precios
  version: ComboPlatform
  codigoMaster: string
  codigosGenerados: string[]
  fecha: Date
  codigo: string
  cuentas: AccountOwner[] // Array de dueños de cuentas
  saldo?: number // Saldo del correo (opcional)
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  // Legacy: mantener costo para compatibilidad durante migración
  costo?: number
}

// Información resumida del combo (agrupando todos los correos)
export interface ComboSummary {
  id: string // Nombre del combo normalizado (ej: assassins_creed_combo)
  nombre: string
  precios: GamePrices // Objeto con los 4 precios
  version: ComboPlatform
  foto?: string // URL de la imagen del combo
  isOffert?: boolean // Si el combo está en oferta (legacy - mantener por compatibilidad)
  tipoPromocion?: PromocionType // Tipo de promoción: ninguna, oferta o promocion
  totalCorreos: number
  correos: string[] // Lista de correos asociados
  stockAccounts?: number // Número de cuentas marcadas como stock
  descuento?: number // Porcentaje de descuento (0-100)
  precioOriginal?: number // Precio antes del descuento (legacy)
  rating?: number // Calificación (0-5)
  totalReviews?: number // Número de reseñas
  destacado?: boolean // Si debe aparecer en la sección de ofertas
  // Legacy: mantener costo para compatibilidad durante migración
  costo?: number
  // Campo adicional para indicar si el combo usa un nombre de juego existente
  juegoReferenciado?: string // ID del juego referenciado (opcional)
}

// Datos del documento principal del combo
export interface ComboDocument {
  nombre?: string
  foto?: string
  version?: ComboPlatform // Categoría del combo: PS4, PS5, PS4 & PS5, etc.
  isOffert?: boolean // Legacy - mantener por compatibilidad
  tipoPromocion?: PromocionType
  precios?: GamePrices // Objeto con los 4 precios (actualizado por el último correo)
  ultimaActualizacionPrecio?: Date // Fecha del último correo que actualizó el precio
  // Legacy: mantener costo para compatibilidad durante migración
  costo?: number
  juegoReferenciado?: string // ID del juego referenciado (opcional)
}

export interface ComboFilters {
  plataforma?: ComboPlatform
  precioMin?: number
  precioMax?: number
  busqueda?: string
}

export interface TelefonoComboSearchResult {
  combo: ComboSummary
  correo: ComboEmailAccount
  cuenta: AccountOwner
}

export interface CorreoComboSearchResult {
  combo: ComboSummary
  correo: ComboEmailAccount
}

