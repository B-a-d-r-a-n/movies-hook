import { ref, onMounted, watch } from 'vue'

export function useTheme() {
  const theme = ref(localStorage.getItem('theme') || 'dark')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  })

  onMounted(() => {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark')
    }
  })

  return {
    theme,
    toggleTheme,
  }
}
