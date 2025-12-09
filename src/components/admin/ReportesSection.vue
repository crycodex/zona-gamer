<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useReportes } from '@/composables/useReportes'
import ReportesCharts from './ReportesCharts.vue'
import Pagination from '@/components/ui/Pagination.vue'
import { FileText, RefreshCw, Calendar, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-vue-next'

const {
  reportes,
  isLoadingReportes,
  cargarReportes,
  obtenerEstadisticas
} = useReportes()

// Estados para filtros
const filtroUsuarioReporte = ref<string>('')
const filtroRolReporte = ref<'admin' | 'employee' | ''>('')
const busquedaReporte = ref('')
const limiteReportes = ref(100)
const fechaInicio = ref('')
const fechaFin = ref('')
const mostrarGraficos = ref(true)

// Estados para ordenamiento
const ordenarPor = ref<'fecha' | 'usuario' | 'juego' | 'rol'>('fecha')
const ordenDireccion = ref<'asc' | 'desc'>('desc') // Por defecto descendente (más recientes primero)

// Estados para paginación
const paginaActual = ref(1)
const itemsPorPagina = 10

// Computed para reportes filtrados y ordenados
const reportesFiltrados = computed(() => {
  let resultado = reportes.value
  
  // Filtrar por usuario
  if (filtroUsuarioReporte.value) {
    resultado = resultado.filter(r => r.uid === filtroUsuarioReporte.value)
  }
  
  // Filtrar por rol
  if (filtroRolReporte.value) {
    resultado = resultado.filter(r => r.rol === filtroRolReporte.value)
  }
  
  // Filtrar por búsqueda
  if (busquedaReporte.value && busquedaReporte.value.trim()) {
    const busqueda = busquedaReporte.value.toLowerCase().trim()
    resultado = resultado.filter(r =>
      r.juegoNombre.toLowerCase().includes(busqueda) ||
      r.correoUtilizado.toLowerCase().includes(busqueda) ||
      (r.nombreUsuario && r.nombreUsuario.toLowerCase().includes(busqueda)) ||
      r.email.toLowerCase().includes(busqueda)
    )
  }
  
  // Filtrar por fecha inicio
  if (fechaInicio.value) {
    const fechaInicioDate = new Date(fechaInicio.value)
    fechaInicioDate.setHours(0, 0, 0, 0)
    resultado = resultado.filter(r => {
      const fechaReporte = new Date(r.fechaGeneracion)
      fechaReporte.setHours(0, 0, 0, 0)
      return fechaReporte >= fechaInicioDate
    })
  }
  
  // Filtrar por fecha fin
  if (fechaFin.value) {
    const fechaFinDate = new Date(fechaFin.value)
    fechaFinDate.setHours(23, 59, 59, 999)
    resultado = resultado.filter(r => {
      const fechaReporte = new Date(r.fechaGeneracion)
      return fechaReporte <= fechaFinDate
    })
  }
  
  // Ordenar resultados
  resultado = [...resultado].sort((a, b) => {
    let comparacion = 0
    
    switch (ordenarPor.value) {
      case 'fecha':
        comparacion = new Date(a.fechaGeneracion).getTime() - new Date(b.fechaGeneracion).getTime()
        break
      case 'usuario':
        comparacion = (a.nombreUsuario || a.email).localeCompare(b.nombreUsuario || b.email)
        break
      case 'juego':
        comparacion = a.juegoNombre.localeCompare(b.juegoNombre)
        break
      case 'rol':
        comparacion = a.rol.localeCompare(b.rol)
        break
    }
    
    return ordenDireccion.value === 'asc' ? comparacion : -comparacion
  })
  
  return resultado
})

// Computed para reportes paginados
const reportesPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina
  const fin = inicio + itemsPorPagina
  return reportesFiltrados.value.slice(inicio, fin)
})

// Computed para total de páginas
const totalPaginas = computed(() => {
  return Math.ceil(reportesFiltrados.value.length / itemsPorPagina)
})

// Función para cambiar de página
const cambiarPagina = (nuevaPagina: number): void => {
  paginaActual.value = nuevaPagina
}

// Función para ir a la página siguiente
const siguientePagina = (): void => {
  if (paginaActual.value < totalPaginas.value) {
    paginaActual.value++
  }
}

// Función para ir a la página anterior
const anteriorPagina = (): void => {
  if (paginaActual.value > 1) {
    paginaActual.value--
  }
}

// Computed para el rango de items mostrados
const rangoItems = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina + 1
  const fin = Math.min(paginaActual.value * itemsPorPagina, reportesFiltrados.value.length)
  return { inicio, fin }
})

// Resetear a la primera página cuando cambian los filtros
const resetearPaginacion = (): void => {
  paginaActual.value = 1
}

// Watch para resetear paginación cuando cambian los filtros
watch([filtroUsuarioReporte, filtroRolReporte, busquedaReporte, fechaInicio, fechaFin, ordenarPor, ordenDireccion], () => {
  resetearPaginacion()
})

const estadisticasReportes = computed(() => {
  return obtenerEstadisticas()
})

// Computed para contar filtros activos
const filtrosActivos = computed(() => {
  let count = 0
  if (filtroUsuarioReporte.value) count++
  if (filtroRolReporte.value) count++
  if (busquedaReporte.value) count++
  if (fechaInicio.value) count++
  if (fechaFin.value) count++
  return count
})

const usuariosUnicos = computed(() => {
  const usuarios = new Map<string, { email: string; nombre: string; uid: string }>()
  reportes.value.forEach(r => {
    if (!usuarios.has(r.uid)) {
      usuarios.set(r.uid, {
        uid: r.uid,
        email: r.email,
        nombre: r.nombreUsuario || r.email
      })
    }
  })
  return Array.from(usuarios.values())
})

const cargarReportesConFiltros = async (): Promise<void> => {
  await cargarReportes({}, limiteReportes.value)
  
  console.log('📊 Reportes cargados:', reportes.value.length)
  console.log('🔍 Filtros activos:', filtrosActivos.value)
  console.log('📋 Reportes filtrados:', reportesFiltrados.value.length)
}

const limpiarFiltrosReportes = (): void => {
  filtroUsuarioReporte.value = ''
  filtroRolReporte.value = ''
  busquedaReporte.value = ''
  fechaInicio.value = ''
  fechaFin.value = ''
  resetearPaginacion()
}

// Función para cambiar ordenamiento
const cambiarOrdenamiento = (campo: 'fecha' | 'usuario' | 'juego' | 'rol'): void => {
  if (ordenarPor.value === campo) {
    // Si ya está ordenando por este campo, cambiar dirección
    ordenDireccion.value = ordenDireccion.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Si es un campo nuevo, ordenar por él (descendente por defecto)
    ordenarPor.value = campo
    ordenDireccion.value = 'desc'
  }
}

const aplicarFiltroRapido = (dias: number): void => {
  const hoy = new Date()
  const inicio = new Date()
  inicio.setDate(hoy.getDate() - dias)
  
  fechaInicio.value = inicio.toISOString().split('T')[0] as string
  fechaFin.value = hoy.toISOString().split('T')[0] as string
}

const formatearFechaReporte = (fecha: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(fecha)
}

// Cargar reportes al montar
cargarReportesConFiltros()

defineExpose({
  cargarReportesConFiltros
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold flex items-center gap-3">
          <FileText :size="32" class="text-primary" />
          Reportes 
        </h1>
        <p class="text-base-content/60 mt-1">Historial de mensajes generados por usuarios</p>
      </div>
      <button @click="cargarReportesConFiltros" class="btn btn-primary gap-2" :disabled="isLoadingReportes">
        <RefreshCw :size="18" :class="{ 'animate-spin': isLoadingReportes }" />
        Actualizar
      </button>
    </div>

    <!-- Estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="stat bg-base-100 rounded-lg shadow">
        <div class="stat-title">Total Reportes</div>
        <div class="stat-value text-primary">{{ estadisticasReportes.totalReportes }}</div>
      </div>
      <div class="stat bg-base-100 rounded-lg shadow">
        <div class="stat-title">Mensajes PS4</div>
        <div class="stat-value text-info">{{ estadisticasReportes.porPlataforma.PS4 || 0 }}</div>
      </div>
      <div class="stat bg-base-100 rounded-lg shadow">
        <div class="stat-title">Mensajes PS5</div>
        <div class="stat-value text-secondary">{{ estadisticasReportes.porPlataforma.PS5 || 0 }}</div>
      </div>
      <div class="stat bg-base-100 rounded-lg shadow">
        <div class="stat-title">Por Admins</div>
        <div class="stat-value text-success">{{ estadisticasReportes.porRol.admin || 0 }}</div>
      </div>
    </div>

    <!-- Filtros Rápidos -->
    <div class="flex gap-2 mb-4 flex-wrap">
      <button @click="aplicarFiltroRapido(1)" class="btn btn-sm btn-outline">
        <Calendar :size="16" />
        Hoy
      </button>
      <button @click="aplicarFiltroRapido(7)" class="btn btn-sm btn-outline">
        <Calendar :size="16" />
        Últimos 7 días
      </button>
      <button @click="aplicarFiltroRapido(30)" class="btn btn-sm btn-outline">
        <Calendar :size="16" />
        Últimos 30 días
      </button>
      <button @click="aplicarFiltroRapido(90)" class="btn btn-sm btn-outline">
        <Calendar :size="16" />
        Últimos 3 meses
      </button>
      <div class="ml-auto">
        <button @click="mostrarGraficos = !mostrarGraficos" class="btn btn-sm btn-outline gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {{ mostrarGraficos ? 'Ocultar' : 'Mostrar' }} Gráficos
        </button>
      </div>
    </div>

    <!-- Gráficos -->
    <div v-if="mostrarGraficos && reportesFiltrados.length > 0" class="mb-6">
      <ReportesCharts :reportes="reportesFiltrados" />
    </div>

    <!-- Filtros Detallados -->
    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <h3 class="card-title text-lg">
            🔍 Filtros Detallados
            <span v-if="filtrosActivos > 0" class="badge badge-primary ml-2">
              {{ filtrosActivos }} activo{{ filtrosActivos > 1 ? 's' : '' }}
            </span>
          </h3>
          <div class="text-sm text-base-content/60">
            Filtros dinámicos - Se actualizan automáticamente
          </div>
        </div>
        
        <!-- Primera fila -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">📅 Fecha Inicio</span>
            </label>
            <input
              v-model="fechaInicio"
              type="date"
              class="input input-bordered"
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">📅 Fecha Fin</span>
            </label>
            <input
              v-model="fechaFin"
              type="date"
              class="input input-bordered"
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">👤 Usuario</span>
            </label>
            <select v-model="filtroUsuarioReporte" class="select select-bordered">
              <option value="">Todos los usuarios</option>
              <option v-for="usuario in usuariosUnicos" :key="usuario.uid" :value="usuario.uid">
                {{ usuario.nombre }}
              </option>
            </select>
          </div>
        </div>

        <!-- Segunda fila -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">🎭 Rol</span>
            </label>
            <select v-model="filtroRolReporte" class="select select-bordered">
              <option value="">Todos los roles</option>
              <option value="admin">Admin</option>
              <option value="employee">Empleado</option>
            </select>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">
                🔎 Buscar
                <span v-if="busquedaReporte && busquedaReporte.length > 0" class="badge badge-sm badge-primary ml-2">
                  Filtrando
                </span>
              </span>
            </label>
            <input
              v-model="busquedaReporte"
              type="text"
              placeholder="Juego, correo, usuario..."
              class="input input-bordered"
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text opacity-0">Acciones</span>
            </label>
            <button @click="limpiarFiltrosReportes" class="btn btn-ghost btn-block">
              <RefreshCw :size="16" />
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de Reportes -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <!-- Indicador de ordenamiento activo -->
        <div v-if="!isLoadingReportes && reportesFiltrados.length > 0" class="alert alert-info mb-4 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <div class="text-sm">
            <span class="font-semibold">Ordenando por:</span> 
            <span class="badge badge-primary ml-2">
              {{ ordenarPor === 'fecha' ? 'Fecha' : ordenarPor === 'usuario' ? 'Usuario' : ordenarPor === 'juego' ? 'Juego' : 'Rol' }}
            </span>
            <span class="ml-2">
              {{ ordenDireccion === 'desc' ? '(Mayor a menor)' : '(Menor a mayor)' }}
            </span>
          </div>
          <span class="text-xs opacity-70 ml-2">Haz clic en cualquier columna para cambiar el ordenamiento</span>
        </div>

        <div v-if="isLoadingReportes" class="flex justify-center p-8">
          <span class="loading loading-spinner loading-lg"></span>
        </div>

        <div v-else-if="reportesFiltrados.length === 0" class="text-center p-8">
          <FileText :size="48" class="mx-auto text-base-content/30 mb-4" />
          <p class="text-base-content/60">No hay reportes disponibles</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th>#</th>
                <th>
                  <button 
                    @click="cambiarOrdenamiento('fecha')" 
                    class="btn btn-ghost btn-sm gap-2 hover:bg-base-200"
                    :class="ordenarPor === 'fecha' ? 'font-bold text-primary' : ''"
                  >
                    Fecha
                    <ArrowDown v-if="ordenarPor === 'fecha' && ordenDireccion === 'desc'" :size="16" />
                    <ArrowUp v-else-if="ordenarPor === 'fecha' && ordenDireccion === 'asc'" :size="16" />
                    <ArrowUpDown v-else :size="16" class="opacity-30" />
                  </button>
                </th>
                <th>
                  <button 
                    @click="cambiarOrdenamiento('usuario')" 
                    class="btn btn-ghost btn-sm gap-2 hover:bg-base-200"
                    :class="ordenarPor === 'usuario' ? 'font-bold text-primary' : ''"
                  >
                    Usuario
                    <ArrowDown v-if="ordenarPor === 'usuario' && ordenDireccion === 'desc'" :size="16" />
                    <ArrowUp v-else-if="ordenarPor === 'usuario' && ordenDireccion === 'asc'" :size="16" />
                    <ArrowUpDown v-else :size="16" class="opacity-30" />
                  </button>
                </th>
                <th>
                  <button 
                    @click="cambiarOrdenamiento('rol')" 
                    class="btn btn-ghost btn-sm gap-2 hover:bg-base-200"
                    :class="ordenarPor === 'rol' ? 'font-bold text-primary' : ''"
                  >
                    Rol
                    <ArrowDown v-if="ordenarPor === 'rol' && ordenDireccion === 'desc'" :size="16" />
                    <ArrowUp v-else-if="ordenarPor === 'rol' && ordenDireccion === 'asc'" :size="16" />
                    <ArrowUpDown v-else :size="16" class="opacity-30" />
                  </button>
                </th>
                <th>
                  <button 
                    @click="cambiarOrdenamiento('juego')" 
                    class="btn btn-ghost btn-sm gap-2 hover:bg-base-200"
                    :class="ordenarPor === 'juego' ? 'font-bold text-primary' : ''"
                  >
                    Juego
                    <ArrowDown v-if="ordenarPor === 'juego' && ordenDireccion === 'desc'" :size="16" />
                    <ArrowUp v-else-if="ordenarPor === 'juego' && ordenDireccion === 'asc'" :size="16" />
                    <ArrowUpDown v-else :size="16" class="opacity-30" />
                  </button>
                </th>
                <th>Correo</th>
                <th>Plataforma</th>
                <th>Códigos Usados</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(reporte, index) in reportesPaginados" :key="reporte.id">
                <td>{{ rangoItems.inicio + index }}</td>
                <td class="text-sm">{{ formatearFechaReporte(reporte.fechaGeneracion) }}</td>
                <td>
                  <div class="font-medium">{{ reporte.nombreUsuario }}</div>
                  <div class="text-xs opacity-60">{{ reporte.email }}</div>
                </td>
                <td>
                  <span :class="['badge badge-sm', reporte.rol === 'admin' ? 'badge-primary' : 'badge-secondary']">
                    {{ reporte.rol === 'admin' ? 'Admin' : 'Empleado' }}
                  </span>
                </td>
                <td>
                  <div class="font-medium">{{ reporte.juegoNombre }}</div>
                  <div class="text-xs opacity-60">{{ reporte.plataforma }}</div>
                </td>
                <td class="font-mono text-xs">{{ reporte.correoUtilizado }}</td>
                <td>
                  <span :class="['badge', reporte.plataformaMensaje === 'PS4' ? 'badge-info' : 'badge-secondary']">
                    {{ reporte.plataformaMensaje }}
                  </span>
                </td>
                <td>
                  <div class="flex flex-col gap-1">
                    <span class="badge badge-outline badge-sm">{{ reporte.codigosUsados.codigo1 }}</span>
                    <span class="badge badge-outline badge-sm">{{ reporte.codigosUsados.codigo2 }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div v-if="reportesFiltrados.length > 0" class="mt-6">
          <Pagination
            :current-page="paginaActual"
            :total-pages="totalPaginas"
            @page-change="cambiarPagina"
            @next="siguientePagina"
            @prev="anteriorPagina"
          />
        </div>

        <div v-if="reportesFiltrados.length > 0" class="mt-4 text-sm text-base-content/60 text-center">
          Mostrando {{ rangoItems.inicio }}-{{ rangoItems.fin }} de {{ reportesFiltrados.length }} reporte(s)
        </div>
      </div>
    </div>
  </div>
</template>

