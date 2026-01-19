// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { initGSAP } from './utils/gsapHelpers'

// Initialize GSAP optimizations
initGSAP()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
