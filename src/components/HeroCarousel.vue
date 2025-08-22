<script setup lang="ts">
import { ref, computed, onUnmounted, watch, type PropType } from 'vue'
import type { Movie } from '@/types/movie'

const props = defineProps({
  movies: {
    type: Array as PropType<Movie[]>,
    required: true,
  },
})

const SLIDE_DURATION = 5000
const currentIndex = ref(0)
const showText = ref(true)
const progress = ref(0)
let intervalId: number | null = null
let animationFrameId: number | null = null
let startTime: number | null = null

const currentMovie = computed(() => props.movies[currentIndex.value])

const nextSlide = () => {
  showText.value = false
  setTimeout(() => {
    currentIndex.value = (currentIndex.value + 1) % props.movies.length
    showText.value = true
    startProgressBarAnimation()
  }, 500)
}

const startProgressBarAnimation = () => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  startTime = performance.now()

  const animate = (currentTime: number) => {
    const elapsedTime = currentTime - (startTime || 0)
    const progressValue = Math.min((elapsedTime / SLIDE_DURATION) * 100, 100)
    progress.value = progressValue

    if (elapsedTime < SLIDE_DURATION) {
      animationFrameId = requestAnimationFrame(animate)
    }
  }
  animationFrameId = requestAnimationFrame(animate)
}

const startAutoplay = () => {
  if (intervalId) clearInterval(intervalId)
  if (props.movies.length > 1) {
    intervalId = window.setInterval(nextSlide, SLIDE_DURATION)
    startProgressBarAnimation()
  }
}

watch(
  () => props.movies,
  (newMovies) => {
    if (newMovies.length > 0) {
      startAutoplay()
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<template>
  <div
    v-if="movies.length > 0"
    class="relative w-full h-[60vh] max-h-[500px] rounded-lg overflow-hidden shadow-2xl mb-8"
  >
    <!-- Progress Bar -->
    <div class="absolute top-0 left-0 w-full h-1.5 z-20">
      <div class="h-full bg-sky-500" :style="{ width: `${progress}%` }"></div>
    </div>

    <!-- Slides Container -->
    <div class="w-full h-full">
      <TransitionGroup name="fade">
        <div
          v-for="(movie, index) in movies"
          :key="movie.id"
          v-show="index === currentIndex"
          class="absolute inset-0 w-full h-full"
        >
          <img :src="movie.image" :alt="movie.name" class="w-full h-full object-cover object-top" />
          <div class="absolute inset-0 bg-black/60"></div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Text Content -->
    <div class="absolute inset-0 z-10 flex flex-col items-start justify-end p-8 md:p-12 text-white">
      <Transition name="fade-up">
        <div v-if="showText && currentMovie" class="max-w-2xl">
          <h1 class="text-4xl md:text-6xl font-bold drop-shadow-lg">{{ currentMovie.name }}</h1>
          <p class="mt-4 text-lg text-zinc-300 drop-shadow-md hidden md:block">
            {{ currentMovie.description }}
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-up-enter-active {
  transition:
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
  transition-delay: 0.2s;
}
.fade-up-leave-active {
  transition: opacity 0.3s ease-in;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
