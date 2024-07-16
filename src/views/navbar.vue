<template>
  <div class="bg-gray-800 py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex justify-between items-center">
        <div class="flex space-x-4">
          <router-link to="/" class="text-gray-300 hover:text-white px-2 py-2 text-sm font-medium"
            >Home</router-link
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
        <div class="relative" v-if="isAuthenticated">
          <button
            @click="toggleProfileDropdown"
            class="flex items-center text-gray-300 hover:text-white px-2 py-2 text-sm font-medium"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5.121 18.364A9 9 0 0012 21a9 9 0 006.879-2.636M12 3a9 9 0 016.364 2.636A9 9 0 0121 12c0 2.271-.845 4.35-2.236 5.879M3 12a9 9 0 012.636-6.364A9 9 0 0112 3m0 18a9 9 0 006.364-2.636M15 15l-3-3-3 3m6-6l-3-3-3 3"
              />
            </svg>
          </button>
          <div
            v-if="showProfileDropdown"
            class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1"
          >
            <router-link
              to="/profile"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >View Profile</router-link
            >
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const isAuthenticated = ref(false)
const showProfileDropdown = ref(false)
const router = useRouter()

const checkAuth = () => {
  isAuthenticated.value = localStorage.getItem('access_token') !== null
}

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value
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