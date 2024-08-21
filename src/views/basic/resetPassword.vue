<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import axios from 'axios'

const newPassword = ref('')
const router = useRouter()
const route = useRoute()
const handleSubmit = async () => {
  if (!newPassword.value) {
    alert('Please fill in all fields.')
    return
  }

  const token = route.query.token

  try {
    const response = await axios.post('http://localhost:3000/auth/reset-password', {
      token,
      newPassword: newPassword.value
    })

    alert(response.data.message)
    router.push('/login')
  } catch (error) {
    console.error('Error during password reset:', error)
    alert('Failed to reset password. Please try again.')
  } finally {
    newPassword.value = ''
  }
}
</script>
<template>
  <!-- <Navbar /> -->
  <div class="flex justify-center items-center min-h-screen bg-gray-200">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-8 text-center">Reset Password</h1>
      <input
        v-model="newPassword"
        type="password"
        placeholder="Enter new Password"
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
