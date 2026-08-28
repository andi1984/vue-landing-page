import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import SectionView from '@/views/SectionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: () => {
        return { name: 'dashboard', params: { section: 'private' } }
      }
    },
    {
      path: '/:section',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/old/:section',
      name: 'section',
      component: SectionView,
    },
  ],
})

export default router
