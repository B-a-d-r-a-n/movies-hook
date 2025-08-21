<script setup lang="ts">
import { ref } from 'vue'
import type { Movie } from '@/types/movie'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { StarIcon as StarIconSolid } from '@heroicons/vue/24/solid'
import { StarIcon as StarIconOutline } from '@heroicons/vue/24/outline'

defineProps<{ movie: Movie }>()
defineEmits(['edit', 'delete', 'update-rating'])

const hoverRating = ref(0)
</script>

<template>
  <div
    class="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-2xl"
  >
    <div class="relative">
      <img :src="movie.image" :alt="movie.name" class="w-full h-64 object-cover object-top" />
      <div
        class="absolute top-2 right-2 bg-yellow-400 text-black rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-md"
      >
        <StarIconSolid class="w-6 h-6 text-yellow-800" v-if="!movie.rating" />
        <span v-else>{{ movie.rating }}</span>
      </div>
    </div>
    <div class="p-6 flex flex-col gap-4 flex-grow">
      <h2 class="text-2xl font-bold text-zinc-900 dark:text-white">{{ movie.name }}</h2>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="genre in movie.genres"
          :key="genre"
          class="px-3 py-1 text-xs font-semibold text-sky-800 dark:text-sky-200 bg-sky-100 dark:bg-sky-800/50 rounded-full"
          >{{ genre }}</span
        >
      </div>
      <p class="text-zinc-600 dark:text-zinc-400 text-sm flex-grow">
        {{ movie.description || 'NO DESCRIPTION' }}
      </p>
      <div class="flex items-center justify-between mt-auto pt-4">
        <div class="flex items-center" @mouseleave="hoverRating = 0">
          <button
            v-for="star in 5"
            :key="star"
            @click="$emit('update-rating', star)"
            @mouseenter="hoverRating = star"
            class="focus:outline-none"
          >
            <StarIconSolid
              v-if="hoverRating > 0 ? star <= hoverRating : star <= movie.rating"
              class="w-6 h-6 text-yellow-400"
              aria-hidden="true"
            />
            <StarIconOutline
              v-else
              class="w-6 h-6 text-zinc-400 dark:text-zinc-500"
              aria-hidden="true"
            />
          </button>
        </div>
        <div class="flex gap-2">
          <button
            @click="$emit('edit')"
            class="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full"
          >
            <PencilIcon class="w-5 h-5" />
          </button>
          <button
            @click="$emit('delete')"
            class="p-2 text-zinc-500 dark:text-zinc-400 hover:text-white hover:bg-red-500 rounded-full"
          >
            <TrashIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
