import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Registration from "../views/Registration.vue";
import HomePage from "@/views/HomePage.vue";
import {isAuthenticated, logout, refreshTokens} from "@/modules/auth";
import GatePage from "@/views/GatePage.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { requiresAuth: true}
  },
  {
    path: '/auth/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/auth/registration',
    name: 'registration',
    component: Registration,
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from , next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    let is_auth = await isAuthenticated()
    if (!(is_auth)) { if (!(await refreshTokens())) { logout(); return} }
  }

  next()
})

export default router
