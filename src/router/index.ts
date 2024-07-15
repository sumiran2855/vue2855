import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/login.vue'
import Home from '../views/Home.vue'
import Forget from '../views/basic/forget.vue'
import RegisterOTP from '../views/basic/registerOtp.vue'
import LoginOTP from '../views/basic/loginOtp.vue'
import ResetPassword from '../views/basic/resetPassword.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  {
    path: '/forget-password',
    name: 'Forget',
    component: Forget
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/registerOTP',
    name: 'RegisterOTP',
    component: RegisterOTP
  },
  {
    path: '/loginOTP',
    name: 'LoginOTP',
    component: LoginOTP
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const isAuthenticated = localStorage.getItem('access_token') !== null

    if (!isAuthenticated) {
      next({ name: 'Login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
