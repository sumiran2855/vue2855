<template>
    <Navbar/>
    <div class="min-h-screen bg-gray-200 py-6 flex flex-col justify-center sm:py-12">
      <div class="relative py-3 sm:max-w-xl sm:mx-auto">
        <div class="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-lg"></div>
        <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-lg sm:p-20">
          <div class="max-w-md mx-auto">
            <div>
              <h1 class="text-2xl font-semibold">Edit Profile</h1>
            </div>
            <div class="divide-y divide-gray-200">
              <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div class="relative">
                  <input
                    v-model="username"
                    type="text"
                    class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Username"
                  />
                  <label
                    for="username"
                    class="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >Username</label>
                </div>
                <div class="relative">
                  <input
                    v-model="email"
                    type="email"
                    class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Email"
                  />
                  <label
                    for="email"
                    class="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >Email</label>
                </div>
              </div>
              <div class="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <button
                  @click="updateProfile"
                  class="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center"
                >Save Changes</button>
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
  import { useRouter } from 'vue-router'
import Navbar from '../navbar.vue';
  
  const username = ref('')
  const email = ref('')
  const router = useRouter()
  
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await axios.get('http://localhost:3000/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      username.value = response.data.username
      email.value = response.data.email
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }
  
  const updateProfile = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await axios.put('http://localhost:3000/user/updateProfile', {
        username: username.value,
        email: email.value,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      router.push('/profile')
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }
  
  onMounted(() => {
    fetchProfile()
  })
  </script>
  

  