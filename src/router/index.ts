import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { tab: true, icon: 'home', order: 0 }
  },
  {
    path: '/habits',
    name: 'Habits',
    component: () => import('@/views/HabitsView.vue'),
    meta: { tab: true, icon: 'check-circle', order: 1 }
  },
  {
    path: '/checklists',
    name: 'Lists',
    component: () => import('@/views/ChecklistsView.vue'),
    meta: { tab: true, icon: 'list-checks', order: 2 }
  },
  {
    path: '/meals',
    name: 'Meals',
    component: () => import('@/views/MealsView.vue'),
    meta: { tab: true, icon: 'utensils', order: 3 }
  },
  {
    path: '/exercise',
    name: 'Exercise',
    component: () => import('@/views/ExerciseView.vue'),
    meta: { tab: true, icon: 'dumbbell', order: 4 }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { tab: true, icon: 'settings', order: 5 }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export const tabRoutes = routes
  .filter(r => r.meta?.tab)
  .sort((a, b) => ((a.meta?.order as number) ?? 0) - ((b.meta?.order as number) ?? 0))

export default router
