import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '../src/tailwind.css'
import axios from 'axios'
// import store from './stores/store'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import store from './stores'

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('isAuthenticated')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
const vuetify = createVuetify({
  components,
  directives,
})

createApp(App).use(router).use(store).use(vuetify).mount('#app')
