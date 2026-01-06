import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initDatabase } from './database'
import './assets/styles/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize database before mounting
initDatabase().then(() => {
  app.mount('#app')
}).catch((err) => {
  console.error('Failed to initialize database:', err)
  app.mount('#app') // Mount anyway to show error state
})
