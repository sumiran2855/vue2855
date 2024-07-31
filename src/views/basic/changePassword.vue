<template>
    <!-- <Navbar /> -->
    <div class="min-h-screen bg-gray-200 py-6 flex flex-col justify-center sm:py-12">
      <div class="relative py-3 sm:max-w-xl sm:mx-auto">
        <div class="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-lg"></div>
        <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-lg sm:p-20">
          <button
          @click="cancelEdit"
          class="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
          <div class="max-w-md mx-auto">
            <div>
              <h1 class="text-2xl font-semibold">Change Password</h1>
            </div>
            <div class="divide-y divide-gray-200">
              <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <input
                  v-model="oldPassword"
                  type="password"
                  placeholder="Old Password"
                  class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <input
                  v-model="newPassword"
                  type="password"
                  placeholder="New Password"
                  class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <input
                  v-model="confirmNewPassword"
                  type="password"
                  placeholder="Confirm New Password"
                  class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <button
                  @click="handleChangePassword"
                  class="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import Navbar from '../navbar.vue'
  import { useRouter } from 'vue-router';
  
  const oldPassword = ref('');
  const newPassword = ref('');
  const confirmNewPassword = ref('');
  const router = useRouter();
  
  const handleChangePassword = async () => {
    if (newPassword.value !== confirmNewPassword.value) {
      alert('New passwords do not match.');
      return;
    }
  
    try {
      const token = localStorage.getItem('access_token');
      await axios.put('http://localhost:3000/auth/change-password', {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      alert('Password changed successfully.');
      oldPassword.value = '';
      newPassword.value = '';
      confirmNewPassword.value = '';

      router.push('/profile');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    }
  };

  const cancelEdit = () => {
  router.push('/profile')
}
  </script>
  