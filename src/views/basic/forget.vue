<script setup lang="ts">
import { useRouter } from 'vue-router'
import Navbar from '../navbar.vue'
import { ref } from 'vue'

const email = ref('')
const router = useRouter()
const handleSubmit = () => {
  if (!email.value) {
    alert('Please fill in all fields.')
    return
  }

  console.log('Email:', email.value)

  email.value = ''
  router.push('/reset-password')
}
</script>
<template>
  <Navbar />
  <div class="flex justify-center items-center min-h-screen bg-gray-200">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-8 text-center">Forget Password</h1>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <button
      @click="handleSubmit"
        type="submit"
        class="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
      <div class="text-center mb-4 mt-2">
        <span class="text-gray-600">Already registered?</span>
        <router-link to="/login" class="text-blue-500 ml-1 hover:underline">Login</router-link>
      </div>
    </div>
  </div>
</template>
