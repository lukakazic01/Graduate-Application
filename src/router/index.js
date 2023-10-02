import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from "@/views/RegisterView.vue";
import Login from "@/views/LoginView.vue";
import SneakerView from "@/views/SneakerView.vue";
import QA from "@/views/Q&AView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      alias: '/home',
      component: HomeView
    },
    {
      path:'/register',
      name: 'register',
      component: Register
    },
    {
      path:'/login',
      name: 'login',
      component: Login
    },
    {
      path: '/sneaker/:id',
      name: 'sneaker',
      component: SneakerView
    },
    {
      path: '/Q&A',
      name: 'Q&A',
      component: QA
    }
  ]
})

export default router
