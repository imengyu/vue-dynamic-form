import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import BasicUseage from '../views/BasicUseage.vue'
import NestArray from '../views/NestArray.vue'
import IngrateUI from '../views/IngrateUI.vue'
import CustomRender from '../views/CustomRender.vue'
import CustomControl from '../views/CustomControl.vue'

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
  {
    path: '/CustomRender',
    name: 'CustomRender',
    component: CustomRender,
  },
  {
    path: '/CustomControl',
    name: 'CustomControl',
    component: CustomControl,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
