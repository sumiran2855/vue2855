<template>
  <v-app>
    <Navbar />
    <v-container class="pt-10">
      <div class="container mx-auto px-4 py-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div class="flex items-center justify-center">
            <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
              <h2 class="text-lg font-semibold text-black-600 mb-2">Items need actions</h2>
              <h3 class="text-md font-medium text-gray-600 mb-2">0 Payment</h3>
              <div class="flex space-x-2 text-sm text-red-500 cursor-pointer">
                <span class="backdrop-blur-sm bg-white/30 p-1 rounded">Overdue</span>
                <span class="backdrop-blur-sm bg-white/30 p-1 rounded">Transfer fund</span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-center">
            <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
              <h2 class="text-lg font-semibold text-black-600 mb-2">Incomplete Quotes</h2>
              <h3 class="text-md font-medium text-gray-600 mb-2">0</h3>
              <div
                class="text-sm text-red-500 cursor-pointer backdrop-blur-sm bg-white/30 p-1 rounded"
              >
                Missing Policy Number
              </div>
            </div>
          </div>

          <div class="flex items-center justify-center">
            <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
              <h2 class="text-lg font-semibold text-black-600 mb-2">Unsold Premium</h2>
              <h3 class="text-md font-medium text-gray-600 mb-2">$ 0.00</h3>
              <div
                class="text-sm text-red-500 cursor-pointer backdrop-blur-sm bg-white/30 p-1 rounded"
              >
                Payment Due
              </div>
            </div>
          </div>

          <div class="flex items-center justify-center">
            <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
              <h2 class="text-lg font-semibold text-black-600 mb-2">Total Premium Sold</h2>
              <h3 class="text-md font-medium text-gray-600 mb-2">$ 0.00</h3>
              <div
                class="text-sm text-red-500 cursor-pointer backdrop-blur-sm bg-white/30 p-1 rounded "
              >
                View Report
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </v-app>
</template>

<script setup>
import Navbar from '../views/navbar.vue'
</script>
