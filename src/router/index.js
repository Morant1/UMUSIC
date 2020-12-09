import Vue from 'vue'
import VueRouter from 'vue-router'
import MainApp from '../views/MainApp.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/:path?',
    component: MainApp
  }
]

const router = new VueRouter({
  routes
})

export default router
