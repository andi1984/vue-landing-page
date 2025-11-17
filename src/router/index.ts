import { createRouter, createWebHistory } from 'vue-router'
import SectionView from '@/views/SectionView.vue'
import BlackWeekView from '@/views/BlackWeekView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        // This will be handled by App.vue after navigation data is loaded
        return { name: 'section', params: { section: 'private' } }
      }
    },
    {
      path: '/black-week',
      name: 'black-week',
      component: BlackWeekView,
    },
    {
      path: '/:section',
      name: 'section',
      component: SectionView,
    },
  ],
})

export default router
