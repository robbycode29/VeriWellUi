import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import DashboardView from "@/views/DashboardView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
