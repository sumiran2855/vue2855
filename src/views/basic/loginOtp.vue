<template>
  <Navbar />
  <div class="flex justify-center items-center min-h-screen bg-gray-200">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-8 text-center">Enter OTP</h1>
      <input
        v-model="otp"
        type="text"
        placeholder="Enter OTP"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <button
        @click="handleVerifyOtp"
        type="submit"
        class="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../navbar.vue'
import axios from 'axios'

const otp = ref('')
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

const handleVerifyOtp = async () => {
  try {
    const response = await axios.post(
      'http://localhost:3000/auth/verify-otp',
      { otp: otp.value },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }
    )
    const { access_token } = response.data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('isAuthenticated', 'true')
    router.push('/')
  } catch (error) {
    console.error('Error during OTP verification:', error)
  }
}
</script>

