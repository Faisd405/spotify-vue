import { createApp } from 'vue';
import App from './App.vue';
import { initGSAP } from './utils/gsapHelpers';

// Initialize GSAP optimizations
initGSAP();

const app = createApp(App);
app.mount('#app');
