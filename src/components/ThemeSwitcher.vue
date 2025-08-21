<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

const { theme, toggleTheme } = useTheme()
</script>
<template>
  <button
    @click="toggleTheme"
    class="p-2 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-600"
  >
    <SunIcon v-if="theme === 'dark'" class="w-5 h-5" />
    <MoonIcon v-else class="w-5 h-5" />
  </button>
</template>
