<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import GameCard from '@/components/ui/GameCard.vue'
import Pagination from '@/components/ui/Pagination.vue'
import type { GameSummary } from '@/types/game'

interface Props {
  games: GameSummary[]
  currentPage: number
  itemsPerPage: number
}

interface Emits {
  (e: 'page-change', page: number): void
  (e: 'next'): void
  (e: 'prev'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

const paginatedGames = computed(() => {
  const start = (props.currentPage - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return props.games.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(props.games.length / props.itemsPerPage)
})

const handleVerTodos = () => {
  router.push({ 
    name: 'VerMas', 
    query: { 
      tipo: 'juegos'
    } 
  })
}
</script>


<style scoped>
.text-gradient {
  background: linear-gradient(90deg, #ff6b6b, #feca57);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>
