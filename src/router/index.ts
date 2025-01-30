import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import DashboardView from "@/views/DashboardView.vue";
import DetailView from "@/views/DetailView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/detail/:name',
    name: 'Detail',
    component: DetailView,
    props: true
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
