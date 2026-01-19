import { createRouter, createWebHistory } from 'vue-router'
import EmoriaBirthdayDemo from '../views/EmoriaBirthdayDemo.vue'
import SpotifyWrappedDemo from '../views/SpotifyWrappedDemo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: EmoriaBirthdayDemo,
    },
    {
      path: '/spotify',
      name: 'spotify',
      component: SpotifyWrappedDemo,
    },
  ],
})

export default router
