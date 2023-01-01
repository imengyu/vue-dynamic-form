import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import BasicUseage from '../views/BasicUseage.vue'
import NestArray from '../views/NestArray.vue'
import IngrateUI from '../views/IngrateUI.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'BasicUseage',
    component: BasicUseage,
  },
  {
    path: '/NestArray',
    name: 'NestArray',
    component: NestArray,
  },
  {
    path: '/IngrateUI',
    name: 'IngrateUI',
    component: IngrateUI,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
