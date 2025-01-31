import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import DashboardView from "@/views/DashboardView.vue";
import DetailView from "@/views/DetailView.vue";
import AnalysisView from "@/views/AnalysisView.vue";

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
    {
        path: '/analysis',
        name: 'Analysis',
        component: AnalysisView
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
