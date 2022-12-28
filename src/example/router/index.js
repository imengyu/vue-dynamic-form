import { createRouter, createWebHashHistory } from 'vue-router';
import BasicUseage from '../views/BasicUseage.vue';
import NestArray from '../views/NestArray.vue';
const routes = [
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
];
const router = createRouter({
    history: createWebHashHistory(),
    routes
});
export default router;
//# sourceMappingURL=index.js.map