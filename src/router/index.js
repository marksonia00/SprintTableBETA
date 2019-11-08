import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import vuetifyTest from '@/components/vuetifyTest'
import HelloWorld from '@/components/HelloWorld'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/vuetifytest',
    name: 'vuetifyTest',
    component: vuetifyTest
  },
  {
    path: '/helloworld',
    name: 'HelloWorld',
    component: HelloWorld
  },

]

const router = new VueRouter({
  routes
})

export default router
