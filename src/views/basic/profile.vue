<template>
    <Navbar/>
    <div class="min-h-screen bg-gray-200 py-6 flex flex-col justify-center sm:py-12">
      <div class="relative py-3 sm:max-w-xl sm:mx-auto">
        <div class="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-lg"></div>
        <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-lg sm:p-20">
          <div class="max-w-md mx-auto">
            <div>
              <h1 class="text-2xl font-semibold">Profile</h1>
            </div>
            <div class="divide-y divide-gray-200">
              <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p><strong>Username:</strong> {{ profile.username }}</p>
                <p><strong>Email:</strong> {{ profile.email }}</p>
              </div>
              <div class="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <router-link
                  to="/edit-profile"
                  class="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center"
                >Edit Profile</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
import Navbar from '../navbar.vue';
  
  const profile = ref({})
  
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await axios.get('http://localhost:3000/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      profile.value = response.data
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }
  
  onMounted(() => {
    fetchProfile()
  })
  </script>

  