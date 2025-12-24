import { ref, computed } from 'vue'

export type Currency = 'USD' | 'COP'
export type Country = 'Ecuador' | 'Colombia'

interface CurrencyConfig {
  currency: Currency
  country: Country
  symbol: string
  locale: string
}

const CURRENCY_CONFIGS: Record<Currency, CurrencyConfig> = {
  USD: {
    currency: 'USD',
    country: 'Ecuador',
    symbol: '$',
    locale: 'es-EC'
  },
  COP: {
    currency: 'COP',
    country: 'Colombia',
    symbol: '$',
    locale: 'es-CO'
  }
}

// Estado global compartido
const selectedCurrency = ref<Currency>('USD')

export const useCurrency = () => {
  // Cargar la moneda guardada del localStorage al inicio
  const loadSavedCurrency = (): void => {
    const saved = localStorage.getItem('selectedCurrency') as Currency | null
    if (saved && (saved === 'USD' || saved === 'COP')) {
      selectedCurrency.value = saved
    }
  }

  // Guardar la moneda seleccionada en localStorage
  const saveCurrency = (currency: Currency): void => {
    localStorage.setItem('selectedCurrency', currency)
  }

  // Cambiar la moneda
  const changeCurrency = (currency: Currency): void => {
    selectedCurrency.value = currency
    saveCurrency(currency)
  }

  // Computed para obtener la configuración actual
  const currentConfig = computed(() => CURRENCY_CONFIGS[selectedCurrency.value])

  // Computed para obtener el país actual
  const currentCountry = computed(() => currentConfig.value.country)

  // Computed para obtener el símbolo de la moneda
  const currencySymbol = computed(() => currentConfig.value.symbol)

  // Computed para verificar si es USD
  const isUSD = computed(() => selectedCurrency.value === 'USD')

  // Computed para verificar si es COP
  const isCOP = computed(() => selectedCurrency.value === 'COP')

  // Formatear precio según la moneda seleccionada
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat(currentConfig.value.locale, {
      style: 'currency',
      currency: selectedCurrency.value,
      minimumFractionDigits: selectedCurrency.value === 'COP' ? 0 : 2,
      maximumFractionDigits: selectedCurrency.value === 'COP' ? 0 : 2
    }).format(price)
  }

  // Obtener el precio correcto según la moneda y tipo de cuenta
  const getPrice = (precios: any, accountType: string): number => {
    if (!precios) return 0

    // Normalizar el tipo de cuenta
    const normalizedType = accountType.toLowerCase().replace(/\s+/g, '')

    // Mapeo de tipos de cuenta a campos de precios
    const priceMap: Record<string, { usd: string; cop: string }> = {
      'principalps4': { usd: 'ps4Principal', cop: 'ps4PrincipalCOP' },
      'secundariaps4': { usd: 'ps4Secundaria', cop: 'ps4SecundariaCOP' },
      'principalps5': { usd: 'ps5Principal', cop: 'ps5PrincipalCOP' },
      'secundariaps5': { usd: 'ps5Secundaria', cop: 'ps5SecundariaCOP' }
    }

    const mapping = priceMap[normalizedType]
    if (!mapping) return 0

    // Retornar el precio según la moneda seleccionada
    const priceKey = selectedCurrency.value === 'USD' ? mapping.usd : mapping.cop
    return precios[priceKey] || 0
  }

  // Obtener el precio más bajo del juego en la moneda actual
  const getLowestPrice = (precios: any): number => {
    if (!precios) return 0

    if (selectedCurrency.value === 'USD') {
      const prices = [
        precios.ps4Principal,
        precios.ps4Secundaria,
        precios.ps5Principal,
        precios.ps5Secundaria
      ].filter(p => p !== undefined && p !== null && p > 0)
      return prices.length > 0 ? Math.min(...prices) : 0
    } else {
      const prices = [
        precios.ps4PrincipalCOP,
        precios.ps4SecundariaCOP,
        precios.ps5PrincipalCOP,
        precios.ps5SecundariaCOP
      ].filter(p => p !== undefined && p !== null && p > 0)
      return prices.length > 0 ? Math.min(...prices) : 0
    }
  }

  // Inicializar al cargar
  loadSavedCurrency()

  return {
    selectedCurrency: computed(() => selectedCurrency.value),
    currentCountry,
    currencySymbol,
    isUSD,
    isCOP,
    changeCurrency,
    formatPrice,
    getPrice,
    getLowestPrice
  }
}

