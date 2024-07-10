<script setup lang="ts">
import { useRouter } from 'vue-router'
import Navbar from '../navbar.vue'
import { ref } from 'vue'

const otp = ref('')
const router = useRouter()
const handleSubmit = () => {
  if (!otp.value) {
    alert('Please fill in all fields.')
    return
  }

  console.log('OTP:', otp.value)

  otp.value = ''
  router.push('/')
}
</script>
<template>
  <Navbar />
  <div class="flex justify-center items-center min-h-screen bg-gray-200">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-8 text-center">Enter OTP</h1>
      <input
        v-model="otp"
        type="otp"
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
