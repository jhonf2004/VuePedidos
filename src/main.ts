// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// IMPORTANTE: importar tu CSS con Tailwind
import './index.css'

createApp(App).use(router).mount('#app')
