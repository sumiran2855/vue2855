<script setup lang="ts">
import { useRouter } from 'vue-router'
import Navbar from '../navbar.vue'
import { ref } from 'vue'
import axios from 'axios'

const otp = ref('')
const router = useRouter()

const handleSubmit = async () => {
  if (!otp.value) {
    alert('Please fill in all fields.')
    return
  }

  try {
    const token = localStorage.getItem('access_token')
    console.log('Token from localStorage:', token)

    if (!token) {
      alert('No token found. Please login again.')
      return
    }

    const response = await axios.post(
      'http://localhost:3000/auth/verify-otp',
      { otp: otp.value },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    console.log('Response:', response)

    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)
      alert('OTP verification successful!')
      router.push('/')
    } else {
      alert('OTP verification failed. Please try again.')
    }
  } catch (error) {
    console.error('Error during OTP verification:', error)
    alert('OTP verification failed. Please try again.')
  } finally {
    otp.value = ''
  }
}
</script>
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
        @click="handleSubmit"
        type="submit"
        class="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </div>
  </div>
</template>
