/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'default',
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/pages/index.vue'),
        },
        {
          path: '/ingredients',
          name: 'ingredients',
          component: () => import('@/pages/ingredients.vue'),
        },
        {
          path: '/utensils',
          name: 'utensils',
          component: () => import('@/pages/utensils.vue'),
        },
      ],
    },
  ],
})

export default router
