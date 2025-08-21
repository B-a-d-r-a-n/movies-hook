import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './main.css'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
// import Aura from '@primeuix/themes/aura'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
  unstyled: true,
})
app.use(router)

app.mount('#app')
