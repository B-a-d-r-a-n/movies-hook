<script setup lang="ts">
import { useNotifications } from '@/composables/useNotifications'
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { TransitionRoot } from '@headlessui/vue'

const { notifications, removeNotification } = useNotifications()

const typeClasses = {
  success: 'bg-blue-500 border-green-600',
  error: 'bg-red-500 border-red-600',
  info: 'bg-blue-500 border-blue-600',
}
</script>

<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <TransitionRoot
        v-for="notification in notifications"
        :key="notification.id"
        :show="true"
        as="template"
        enter="transform ease-out duration-300 transition"
        enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 border"
          :class="typeClasses[notification.type]"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <CheckCircleIcon
                  v-if="notification.type === 'success'"
                  class="h-6 w-6 text-white"
                />
                <XCircleIcon v-if="notification.type === 'error'" class="h-6 w-6 text-white" />
                <InformationCircleIcon
                  v-if="notification.type === 'info'"
                  class="h-6 w-6 text-white"
                />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-white">{{ notification.message }}</p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button
                  type="button"
                  @click="removeNotification(notification.id)"
                  class="inline-flex rounded-md text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span class="text-center">X</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionRoot>
    </div>
  </div>
</template>
