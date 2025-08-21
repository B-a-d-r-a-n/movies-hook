import { ref, readonly } from 'vue'

export interface Notification {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

const notifications = ref<Notification[]>([])

const addNotification = (
  message: string,
  type: 'success' | 'error' | 'info' = 'info',
  timeout = 3000,
) => {
  const id = Date.now()
  notifications.value.push({ id, message, type })
  setTimeout(() => removeNotification(id), timeout)
}

const removeNotification = (id: number) => {
  notifications.value = notifications.value.filter((n) => n.id !== id)
}

export function useNotifications() {
  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
  }
}
