<template>
  <div class="bg-gray-800 py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex justify-between items-center">
        <div class="flex space-x-4">
          <router-link to="/" class="text-gray-300 hover:text-white px-2 py-2 text-sm font-medium"
            >Home</router-link
          >
          <router-link
            v-if="isAuthenticated"
            to="/UserCard"
            class="text-gray-300 hover:text-white px-2 py-2 text-sm font-medium"
            >User</router-link
          >
          <router-link
            v-if="!isAuthenticated"
            to="/register"
            class="text-gray-300 hover:text-white px-2 py-2 text-sm font-medium"
            >Register</router-link
          >
          <router-link
            v-if="!isAuthenticated"
            to="/login"
            class="text-gray-300 hover:text-white px-2 py-2 text-sm font-medium"
            >Login</router-link
          >
        </div>
        <div v-if="isAuthenticated">
          <button
            @click="logout"
            class="text-gray-300 hover:text-white px-2 py-2 text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const isAuthenticated = ref(false)
const router = useRouter()

const checkAuth = () => {
  isAuthenticated.value = localStorage.getItem('access_token') !== null
}

const logout = () => {
  localStorage.removeItem('access_token')
  isAuthenticated.value = false
  router.push('/login')
}

onMounted(() => {
  checkAuth()
})
</script>
