import { createRouter, createWebHistory, useRouter } from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/login.vue'
import Home from '../views/Home.vue'
import Forget from '../views/basic/forget.vue'
import EmailVerification from '../views/basic/emailVerify.vue'
import LoginOTP from '../views/basic/loginOtp.vue'
import ResetPassword from '../views/basic/resetPassword.vue'
import setting from '../views/Settings/Setting.vue'
import Agreement from '../views/Create/creatAgreement.vue'
import AddNew from '../views/Settings/AddNew.vue'
import Accounting from '../views/Accounting.vue'
import Administration from '../views/admin/Administration.vue'
import addWholesaler from '../views/wholesaler/addNew.vue'
import ShowAgreement from '../views/Create/ViewAgreement.vue'


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
    path: '/verify',
    name: 'EmailVerification',
    component: EmailVerification
  },
  {
    path: '/loginOTP',
    name: 'LoginOTP',
    component: LoginOTP
  },
  {
    path: '/setting',
    name: 'setting',
    component: setting,
    meta: { requiresAuth: true }
  },
  {
    path: '/agreement',
    name: 'agreement',
    component: Agreement
  },
  {
    path: '/addNew',
    name: 'AddNew',
    component: AddNew
  },
  {
    path: '/accounting',
    name: 'accounting',
    component: Accounting
  },
  {
    path: '/admin/setting',
    name: 'adminSetting',
    component: Administration
  },
  {
    path: '/setting/wholesaler/new',
    name: 'addWholesaler',
    component: addWholesaler
  },
  {
    path: `/agreement/:agreementId`,
    name: 'ShowAgreement',
    component: ShowAgreement
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
