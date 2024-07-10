import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/login.vue'
import Home  from '../views/Home.vue'
import Forget from '../views/basic/forget.vue'
import OTP from '../views/basic/otp.vue'
import ResetPassword from '../views/basic/resetPassword.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
    path: '/otp',
    name: 'OTP',
    component: OTP
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
