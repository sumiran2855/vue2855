<script setup lang="ts">
import { useRouter } from 'vue-router'
import Navbar from './navbar.vue'
import { ref } from 'vue'
import axios from 'axios'

const username = ref('')
const password = ref('')
const rememberMe = ref(false)

const router = useRouter()

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

const handleLogin = async () => {
  if (!username.value || !password.value) {
    alert('Please fill in all fields.')
    return
  }

  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      username: username.value,
      password: password.value
    })

    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)

      alert(response.data.message)
      router.push('/loginOTP')
    } else {
      alert('Login failed. Please try again.')
    }
  } catch (error) {
    console.error('Error during login:', error)
    alert('Login failed. Please try again.')
  } finally {
    username.value = ''
    password.value = ''
  }
}
</script>

<template>
  <Navbar />
  <div class="flex justify-center items-center min-h-screen bg-gray-200">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-8 text-center">Login</h1>
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <label class="flex items-center mb-4">
        <input v-model="rememberMe" type="checkbox" class="form-checkbox h-5 w-5 text-blue-500" />
        <span class="ml-2 text-gray-700">Remember me</span>
      </label>
      <div class="text-right mb-4">
        <router-link to="/forget-password" class="text-blue-500 hover:underline"
          >Forgot Password?</router-link
        >
      </div>
      <button
        @click="handleLogin"
        type="submit"
        class="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
      <div class="text-center mb-4 mt-2">
        <span class="text-gray-600">Not registered?</span>
        <router-link to="/register" class="text-blue-500 ml-1 hover:underline"
          >Register</router-link
        >
      </div>
    </div>
  </div>
</template>
