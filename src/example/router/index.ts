import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import BasicUseage from '../views/BasicUseage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'BasicUseage',
    component: BasicUseage,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
