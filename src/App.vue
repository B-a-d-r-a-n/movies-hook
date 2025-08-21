<script setup lang="ts">
import NotificationsToast from './components/NotificationsToast.vue'
</script>

<template>
  <div
    class="bg-zinc-50 dark:bg-zinc-900 min-h-screen text-zinc-900 dark:text-zinc-100 p-4 sm:p-8 transition-colors duration-300"
  >
    <div class="max-w-screen-xl mx-auto">
      <router-view />
      <NotificationsToast />
    </div>
  </div>
</template>
