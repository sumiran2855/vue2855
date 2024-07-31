<script setup lang="ts">
import { useRouter } from 'vue-router';
import Navbar from '../navbar.vue'
import { ref, computed } from 'vue'
const router = useRouter()

interface User {
  firstName: string
  lastName: string
  contact: string
  email: string
  role: string
}

const currentTab = ref('User Management')

const changeTab = (tab: string) => {
  currentTab.value = tab
}

const users = ref<User[]>([
  {
    firstName: 'John',
    lastName: 'Doe',
    contact: '123-456-7890',
    email: 'john.doe@example.com',
    role: 'Admin'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    contact: '234-567-8901',
    email: 'jane.smith@example.com',
    role: 'User'
  },
  {
    firstName: 'Vardhan',
    lastName: 'Jain',
    contact: '334-223-8890',
    email: 'vardhan.jain@example.com',
    role: 'User'
  }
])

const editUser = (user: User) => {
  alert(`Edit user: ${user.firstName} ${user.lastName}`)
}

const searchTerm = ref('')
const filteredUsers = computed(() =>
  users.value.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
)

const addUser = () => {
  router.push('/addNew')
}
</script>

<template>
  <v-app>
    <Navbar />
    <v-main>
      <v-container>
        <v-row class="align-center mb-4">
          <v-col cols="auto">
            <v-btn icon @click="$router.go(-1)">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <h1 class="text-h4 font-weight-bold">Settings</h1>
          </v-col>
        </v-row>

        <!-- Tabs -->
        <v-tabs
          background-color="#f5f5f5"
          dark
          class="elevation-1"
          color="primary"
          slider-color="primary"
        >
          <v-tab @click="changeTab('User Management')">User Management</v-tab>
          <v-tab @click="changeTab('Organisation details')">Organisation details</v-tab>
          <v-tab @click="changeTab('Wholesalers')">Wholesalers</v-tab>
          <v-tab @click="changeTab('Theme')">Theme</v-tab>
        </v-tabs>

        <!-- Tab Content -->
        <v-main>
          <div>
            <div v-if="currentTab === 'User Management'">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="text-h5 font-weight-bold">Users</h2>
                  <h3 class="text-gray-600">Manage users across divisions you are an admin of</h3>
                </div>
                <div class="flex space-x-4 items-center">
                  <v-text-field
                    v-model="searchTerm"
                    label="Search"
                    class="w-64"
                    variant="outlined"
                    solo
                    dense
                  ></v-text-field>
                  <v-btn @click="addUser" color="primary" class="h-12">Add New</v-btn>
                </div>
              </div>

              <!-- User Table -->
              <div class="overflow-x-auto mt-8">
                <table class="min-w-full divide-y divide-gray-200 bg-white">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="user in filteredUsers" :key="user.email">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.firstName }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.lastName }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.contact }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.role }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <v-btn @click="editUser(user)" color="primary" small>Edit</v-btn>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-if="currentTab === 'Organisation details'">
              <h2>Organisation details Content</h2>
            </div>

            <div v-if="currentTab === 'Wholesalers'">
              <h2>Wholesalers Content</h2>
            </div>

            <div v-if="currentTab === 'Theme'">
              <h2>Theme Content</h2>
            </div>
          </div>
        </v-main>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

thead th {
  background-color: #f9fafb;
}

tbody tr:nth-child(even) {
  background-color: #f3f4f6;
}

tbody tr:hover {
  background-color: #e5e7eb;
}

.v-text-field {
  height: 52px; 
}

.v-btn {
  height: 48px;
}
</style>
