<template>
  <v-navigation-drawer v-model="sidebarOpen" app temporary>
    <v-list>
      <v-list-item link @click="goBack" v-if="showBackButton" class="mb-4 flex justify-end">
        <v-list-item-icon>
          <v-icon class="text-blue-500">mdi-arrow-left</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="font-semibold pl-10"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link @click="goToDashboard" class="mb-4">
        <v-list-item-icon class="font-semibold ml-9">
          <v-icon class="text-blue-500 mr-2">mdi-view-dashboard</v-icon>Dashboard
        </v-list-item-icon>
      </v-list-item>

      <v-list-item link @click="goToAdminPanel" class="mb-4">
        <v-list-item-icon class="font-semibold ml-9">
          <v-icon class="text-blue-500 mr-2">mdi-shield-account</v-icon>Admin Panel
        </v-list-item-icon>
      </v-list-item>

      <v-list-item link @click="openCreateDialog" class="mb-4">
        <v-list-item-icon class="font-semibold ml-9">
          <v-icon class="text-blue-500 mr-2">mdi-plus-circle-outline</v-icon>create
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar :elevation="2" class="bg-white text-blue-500">
    <v-app-bar-nav-icon @click="toggleSidebar"></v-app-bar-nav-icon>
    <v-app-bar-title class="text-center flex-grow-1 font-bold">
      {{ userProfile.companyName }}
    </v-app-bar-title>
    <v-spacer></v-spacer>

    <v-btn icon @click="openSearchDialog">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-menu v-model="helpDropdownOpen" offset-y>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-help-circle-outline</v-icon>
        </v-btn>
      </template>
      <v-list class="mt-2">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Email for Help</v-list-item-title>
            <v-list-item-subtitle>CIShelpDesk@company.com</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="emitOpenHelpForm">
          <v-list-item-content>
            <v-list-item-title>Submit an Issue</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn icon @click="goToSettings">
      <v-icon>mdi-cog</v-icon>
    </v-btn>

    <v-menu v-model="dropdownOpen" offset-y>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar size="32">
            <v-img
              src="https://img.freepik.com/premium-vector/cute-boy-smiling-cartoon-kawaii-boy-illustration-boy-avatar-happy-kid_1001605-3445.jpg"
            />
          </v-avatar>
        </v-btn>
      </template>
      <v-list class="mt-2">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title
              >{{ userProfile.firstName }} {{ userProfile.lastName }}</v-list-item-title
            >
            <v-list-item-subtitle>{{ userProfile.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="logout">
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>

  <!-- create dialog box -->

  <v-dialog v-model="createDialog" max-width="1000px" persistent>
    <v-card class="rounded-lg">
      <v-card-title>
        <div class="flex justify-between items-center w-full">
          <span class="text-h5 font-sans">Create</span>
          <v-btn icon @click="closeCreateDialog" class="ml-2" small>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-card-subtitle>
        <v-container>
          <v-row>
            <!-- Agreement Option -->
            <v-col cols="18" md="6">
              <v-card
                @click="navigateTo('Agreement')"
                class="d-flex flex-column align-center pa-4 cursor-pointer hover:bg-gray-100"
                outlined
              >
                <v-icon class="text-blue-500 mb-2" large>mdi-file-document-outline</v-icon>
                <v-card-title class="font-bold">Agreement</v-card-title>
                <v-card-subtitle class="text-sm text-gray-600">
                  Create a new premium finance agreement
                  <br />
                  Automated commission to your operational bank account
                  <br />
                  Automated payouts to your wholesalers and carriers
                </v-card-subtitle>
              </v-card>
            </v-col>
            <!-- Subscription Option -->
            <v-col cols="18" md="6">
              <v-card
                @click="navigateTo('Subscription')"
                class="d-flex flex-column align-center pa-4 cursor-pointer hover:bg-gray-100"
                outlined
              >
                <v-icon class="text-blue-500 mb-2" large>mdi-calendar-sync</v-icon>
                <v-card-title class="font-bold">Subscription</v-card-title>
                <v-card-subtitle class="text-sm text-gray-600">
                  Create recurring invoices to collect periodic payments
                  <br />
                  No automated commission and payouts to external suppliers
                  <br />
                  No financing
                </v-card-subtitle>
              </v-card>
            </v-col>
            <!-- Invoice Option -->
            <v-col cols="18" md="6">
              <v-card
                @click="navigateTo('Invoice')"
                class="d-flex flex-column align-center pa-4 cursor-pointer hover:bg-gray-100"
                outlined
              >
                <v-icon class="text-blue-500 mb-2" large>mdi-file-document-outline</v-icon>
                <v-card-title class="font-bold">Invoice</v-card-title>
                <v-card-subtitle class="text-sm text-gray-600">
                  Create a one-time Invoice
                  <br />
                  No automated commission and payouts to external suppliers
                  <br />
                  No financing
                </v-card-subtitle>
              </v-card>
            </v-col>
            <v-col cols="18" md="6">
              <v-card
                @click="navigateTo('Agreement')"
                class="d-flex flex-column align-center pa-4 cursor-pointer hover:bg-gray-100"
                outlined
              >
                <v-icon class="text-blue-500 mb-2" large>mdi-file-document-outline</v-icon>
                <v-card-title class="font-bold">Documents</v-card-title>
                <v-card-subtitle class="text-sm text-gray-600">
                  See your agreement details and documents
                  <br />
                  check your documents and agrement details and edit them
                  <br />
                  Automated payouts to your wholesalers and carriers
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-subtitle>
    </v-card>
  </v-dialog>

  <v-dialog v-model="searchDialog" max-width="600px" persistent>
    <v-card class="rounded-lg">
      <v-card-title>
        <div class="flex justify-between items-center w-full">
          <span class="text-h5 font-sans">Search</span>
          <v-btn icon @click="closeSearchDialog" class="ml-2" small>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-card-subtitle>
        <v-text-field
          v-model="searchQuery"
          label="Search for..."
          variant="outlined"
          clearable
          class="pt-2"
          placeholder=" search "
          dense
          @keyup.enter="performSearch"
        ></v-text-field>
      </v-card-subtitle>
    </v-card>
  </v-dialog>
  <form-dialog ref="formDialog"></form-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import FormDialog from '../views/PopUpDialogs.vue/helpForm.vue'
const sidebarOpen = ref(false)
const dropdownOpen = ref(false)
const helpDropdownOpen = ref(false)
const showBackButton = ref(false)
const searchDialog = ref(false)
const createDialog = ref(false)
const searchQuery = ref('')
const userProfile = ref({ firstName: '', lastName: '', email: '', companyName: '' })
const router = useRouter()

const checkAuth = async () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  if (isAuthenticated) {
    const token = localStorage.getItem('access_token')
    try {
      const response = await axios.get('http://localhost:3000/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      userProfile.value = {
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        companyName: response.data.companyName
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
  showBackButton.value = sidebarOpen.value
}

const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('isAuthenticated')
  router.push('/login')
}

const goToDashboard = () => {
  router.push('/')
}

const goToAdminPanel = () => {
  router.push('/admin-panel')
}

const openCreateDialog = () => {
  createDialog.value = true
}

const closeCreateDialog = () => {
  createDialog.value = false
}

const goToSettings = () => {
  router.push('/setting')
}

const emitOpenHelpForm = () => {
  const event = new Event('open-help-form')
  window.dispatchEvent(event)
}

const goBack = () => {
  showBackButton.value = false
  sidebarOpen.value = false
}

const openSearchDialog = () => {
  searchDialog.value = true
}

const closeSearchDialog = () => {
  searchDialog.value = false
}

const navigateTo = (page) => {
  switch (page) {
    case 'Agreement':
      router.push('/agreement')
      break
    case 'Subscription':
      router.push('/subscription')
      break
    case 'Invoice':
      router.push('/invoice')
      break
  }
  closeCreateDialog()
}

const performSearch = () => {
  if (!searchQuery.value) {
    alert('Please enter a search term')
    return
  }
  console.log('Searching for:', searchQuery.value)
  closeSearchDialog()
}

onMounted(() => {
  checkAuth()
})
</script>

<style>
@import '@mdi/font/css/materialdesignicons.css';
</style>

integrate that dialog box with this navbar which have a create button
