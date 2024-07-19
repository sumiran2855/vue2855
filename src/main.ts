// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'vuetify/styles'; 
import '../src/tailwind.css'
import axios from 'axios';

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('isAuthenticated')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

createApp(App)
  .use(router)
  .mount('#app');
