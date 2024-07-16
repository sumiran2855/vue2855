<script setup lang="ts">
import Navbar from './navbar.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const termsAccepted = ref(false)

const router = useRouter()

const handleSubmit = async () => {
  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    alert('Please fill in all fields.')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }

  if (!termsAccepted.value) {
    alert('Please accept the terms and conditions.')
    return
  }

  try {
    const response = await axios.post('http://localhost:3000/user/register', {
      username: username.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value
    })
    console.log('Registration successful:', response.data)
    localStorage.setItem('email', email.value)

    username.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''

    alert('Registration successful. Please check your email for the verification link.')
    router.push('/login')
  } catch (error) {
    console.error('Error during registration:', error)
    alert('Registration failed. Please try again.')
  }
}
</script>

<template>
  <Navbar />
  <div class="flex justify-center items-center min-h-screen bg-gray-200">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-8 text-center">Registration</h1>
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <label class="flex items-center mb-4">
        <input
          v-model="termsAccepted"
          type="checkbox"
          class="form-checkbox h-5 w-5 text-blue-500"
        />
        <span class="ml-2 text-gray-700"
          >I accept the <a href="#" class="text-blue-500">terms and conditions</a></span
        >
      </label>
      <button
        @click="handleSubmit"
        type="button"
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
