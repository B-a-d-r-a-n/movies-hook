<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
}>()
defineEmits(['update:currentPage'])
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center space-x-2 mt-8">
    <button
      @click="$emit('update:currentPage', currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-4 py-2 text-sm font-medium text-zinc-800 dark:text-white bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>
    <span class="text-zinc-600 dark:text-zinc-400">
      Page {{ currentPage }} of {{ totalPages }}
    </span>
    <button
      @click="$emit('update:currentPage', currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-4 py-2 text-sm font-medium text-zinc-800 dark:text-white bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
</template>
