import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from "@/views/RegisterView.vue";
import LoginView from "@/views/LoginView.vue";
import SneakerView from "@/views/SneakerView.vue";
import QAView from "@/views/Q&AView.vue";
import BoughtSneakersView from "@/views/BoughtSneakersView.vue";

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
      component: RegisterView
    },
    {
      path:'/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/sneaker/:id',
      name: 'sneaker',
      component: SneakerView
    },
    {
      path: '/Q&A',
      name: 'Q&A',
      component: QAView
    },
    {
      path: '/bought',
      name: 'bought',
      component: BoughtSneakersView
    }
  ]
})

export default router
