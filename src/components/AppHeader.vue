<script setup lang="ts">
import { useMovieStore } from '@/stores/movie'

const movieStore = useMovieStore()

defineEmits(['add-movie', 'open-drawer'])
</script>

<template>
  <header class="flex flex-col sm:flex-row justify-between items-center gap-4">
    <div>
      <h1 class="text-xl md:text-2xl font-bold text-zinc-800 dark:text-white">
        Total Movies:
        <span class="text-sky-600 dark:text-sky-400">{{ movieStore.totalMovies }}</span> / Avg
        Rating: <span class="text-sky-600 dark:text-sky-400">{{ movieStore.averageRating }}</span>
      </h1>
    </div>
    <div class="flex items-center gap-2">
      <button
        @click="$emit('open-drawer')"
        class="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-600"
      >
        Looking for something?
      </button>
      <button
        @click="$emit('add-movie')"
        class="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Add Movie
      </button>
    </div>
  </header>
</template>
