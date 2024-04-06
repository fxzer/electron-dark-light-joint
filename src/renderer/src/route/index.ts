import { createRouter, createWebHistory } from 'vue-router'
import Home from '@renderer/views/Home.vue'
console.log('[ Home ]-3', Home)
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/home' },
    { name: 'Home', path: '/home', component: Home },
    { name: 'Cut', path: '/cut', component: () => import('@renderer/views/Cut.vue') }
  ]
})

export default router
