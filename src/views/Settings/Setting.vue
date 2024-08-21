<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import navbar from '../navbar.vue'
import { getUserIdFromToken } from '../../components/utils'
import store from '../../stores/index'

interface User {
  id: string
  firstName: string
  lastName: string
  mobileNumber: string
  email: string
  role: string
}

const router = useRouter()
const currentTab = ref('User Management')
const searchTerm = ref('')
const users = ref<User[]>([])
const dialogVisible = ref(false)
const editingUser = ref<User>({
  id: '',
  firstName: '',
  lastName: '',
  mobileNumber: '',
  email: '',
  role: ''
})

const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }

    const response = await axios.get('http://localhost:3000/user/getAllUsers', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    users.value = response.data
  } catch (error: any) {
    console.error('Error fetching users:', error)

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token')
      router.push('/login')
    }
  }
}

onMounted(fetchUsers)

const changeTab = (tab: string) => {
  currentTab.value = tab
}

const filteredUsers = computed(() => {
  if (!Array.isArray(users.value)) {
    return []
  }
  return users.value.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const editUser = (user: User) => {
  editingUser.value = { ...user }
  dialogVisible.value = true
}

const updateUser = async () => {
  if (editingUser.value) {
    try {
      await axios.put('http://localhost:3000/user/updateProfile', editingUser.value, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      fetchUsers()
      editingUser.value = {
        id: '',
        firstName: '',
        lastName: '',
        mobileNumber: '',
        email: '',
        role: ''
      }
      dialogVisible.value = false
    } catch (error) {
      console.error('Error updating user:', error)
    }
  } else {
    console.error('No user data to update')
  }
}

const cancelEdit = () => {
  editingUser.value = { id: '', firstName: '', lastName: '', mobileNumber: '', email: '', role: '' }
  dialogVisible.value = false
}

const deleteUser = async (userId: string) => {
  try {
    await axios.delete(`http://localhost:3000/user/deleteUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    fetchUsers()
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

const addUser = () => {
  router.push('/addNew')
}

const organisationDetails = reactive({
  businessName: '-',
  phone: '-',
  website: '-',
  address: '-',
  taxId: '-',
  type: '-',
  ownerName: '-',
  ownerJobTitle: '-',
  ownerDOB: '-',
  ownerSSN: '-',
  ownerAddress: '-',
  ownerPhone: '-'
})

const bankDetails = reactive({
  bankAccountHolderName: '-',
  bankAccountNumber: '-',
  bankRoutingNumber: '-',
  trustAccountHolderName: '-',
  trustAccountNumber: '-',
  trustRoutingNumber: '-',
  Account: '-'
})

const editOrgDialogVisible = ref(false)
const editBankDialogVisible = ref(false)

const openEditOrgDialog = () => {
  editOrgDialogVisible.value = true
}

const openEditBankDialog = () => {
  editBankDialogVisible.value = true
}

const cancelEditBank = () => {
  editBankDialogVisible.value = false
}

const cancelEditOrg = () => {
  editOrgDialogVisible.value = false
}

const getToken = () => localStorage.getItem('access_token')

const getUserId = (token) => {
  return getUserIdFromToken(token)
}
console.log(getUserId)

const redirectToLogin = () => {
  router.push('/login')
}

const saveOrganisationDetails = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      redirectToLogin()
      return
    }

    const response = await axios({
      method: 'POST',
      url: `http://localhost:3000/organisation/save`,
      data: organisationDetails,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const { OrganisationId } = response.data

    store.dispatch('setOrganisationId', OrganisationId)

    console.log('Organisation details saved:', response.data)
    editOrgDialogVisible.value = false
  } catch (error) {
    console.error('Error saving organisation details:', error)
  }
}

const updateOrganisationDetails = async () => {
  try {
    const token = getToken()
    if (!token) {
      redirectToLogin()
      return
    }

    const OrganisationId = store.getters.organisationId

    if (!OrganisationId) {
      console.error('OrganisationId is not available in the store.')
      return
    }

    const response = await axios({
      method: 'PUT',
      url: `http://localhost:3000/organisation/update/${OrganisationId}`,
      data: organisationDetails,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    Object.assign(organisationDetails, response.data)
    console.log('Organisation details updated:', response.data)
    editOrgDialogVisible.value = false
  } catch (error) {
    console.error('Error updating organisation details:', error)
  }
}

const handleSaveOrUpdate = async () => {
  const token = getToken()
  if (!token) {
    redirectToLogin()
    return
  }
  const userId = getUserId(token)

  const checkResponse = await axios.get(`http://localhost:3000/organisation/getUser/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (checkResponse.data) {
    await updateOrganisationDetails()
  } else {
    await saveOrganisationDetails()
  }
}

const fetchOrganisationDetails = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }

    const userId = getUserIdFromToken(token)

    const response = await axios.get(`http://localhost:3000/organisation/getUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    Object.assign(organisationDetails, response.data)
  } catch (error) {
    console.error('Error fetching organisation details:', error)
  }
}

const saveBankDetails = async () => {
  try {
    const token = localStorage.getItem('access_token')
    console.log(token)
    if (!token) {
      router.push('/login')
      return
    }

    const userId = getUserIdFromToken(token)
    console.log(userId)

    const checkResponse = await axios.get(`http://localhost:3000/bank/getUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const endpoint = checkResponse.data
      ? `http://localhost:3000/bank/update/${userId}`
      : `http://localhost:3000/bank/create`
    const method = checkResponse.data ? 'PUT' : 'POST'

    console.log(`Using ${method} method for endpoint: ${endpoint}`)

    const response = await axios({
      method,
      url: endpoint,
      data: bankDetails,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    console.log('Bank details saved or updated:', response.data)
    Object.assign(bankDetails, response.data)
    editBankDialogVisible.value = false
  } catch (error) {
    console.error('Error saving bank details:', error)
  }
}

const fetchBankDetails = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }

    const userId = getUserIdFromToken(token)

    const response = await axios.get(`http://localhost:3000/bank/getUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    Object.assign(bankDetails, response.data)
  } catch (error) {
    console.error('Error fetching bank details:', error)
  }
}

onMounted(() => {
  fetchOrganisationDetails()
  fetchBankDetails()
})
</script>

<template>
  <v-app>
    <navbar />
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
          <v-tab @click="changeTab('User Management')"
            ><span class="mdi mdi-account mx-2"></span>User Management</v-tab
          >
          <v-tab @click="changeTab('Organisation details')"
            ><span class="mdi mdi-home-variant mx-2"></span>Organisation details</v-tab
          >
          <v-tab @click="changeTab('Wholesalers')"
            ><span class="mdi mdi-cart mx-2"></span>Wholesalers</v-tab
          >
          <v-tab @click="changeTab('Theme')"
            ><span class="mdi mdi-theme-light-dark mx-2"></span>Theme</v-tab
          >
        </v-tabs>

        <!-- Tab Content -->
        <v-main>
          <div>
            <div v-if="currentTab === 'User Management'">
              <div class="flex items-center justify-between mt-10">
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
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        First Name
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Last Name
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Contact
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Role
                      </th>
                      <th
                        class="px-16 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="user in filteredUsers" :key="user.id">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ user.firstName }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ user.lastName }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ user.mobileNumber }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ user.email }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ user.role }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <v-btn @click="editUser(user)" color="primary" small class="mr-4">
                          <span class="mdi mdi-pencil"></span>
                        </v-btn>
                        <v-btn @click="deleteUser(user.id)" color="error" small>
                          <span class="mdi mdi-delete"></span>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Edit User Modal -->
              <v-dialog v-model="dialogVisible" max-width="600px">
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Edit User</span>
                  </v-card-title>
                  <v-card-subtitle>
                    <v-text-field
                      v-model="editingUser.firstName"
                      label="First Name"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="editingUser.lastName"
                      label="Last Name"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="editingUser.mobileNumber"
                      label="Mobile Number"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="editingUser.email"
                      label="Email"
                      type="email"
                      required
                    ></v-text-field>
                    <v-select
                      v-model="editingUser.role"
                      :items="['admin', 'user', 'platform Admin', 'Producer', 'Manager']"
                      label="Role"
                      required
                    ></v-select>
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="updateUser" color="primary">Save</v-btn>
                    <v-btn @click="cancelEdit" color="secondary">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>

            <div v-if="currentTab === 'Organisation details'">
              <div class="flex items-center justify-between mt-10">
                <div class="flex flex-col">
                  <div class="flex items-center space-x-4 mb-2">
                    <h2 class="text-2xl font-bold text-gray-800">Business and bank details</h2>
                    <span
                      class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold cursor-pointer"
                    >
                      Pending
                    </span>
                  </div>
                  <h4 class="text-lg text-gray-600">
                    Business and bank details should go where you have Test Insurance
                  </h4>
                </div>
              </div>

              <div class="bg-white shadow-md rounded-lg p-14 relative mt-6">
                <button
                  class="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-3xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  @click="openEditOrgDialog"
                >
                  <span class="mdi mdi-pencil"></span>
                </button>
                <h3 class="my-6 font-semibold">LIC Insurance</h3>
                <!-- Display details -->
                <div class="grid grid-cols-1 gap-4 ml-6">
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Business Name</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        organisationDetails.businessName
                      }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Phone</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        organisationDetails.phone
                      }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Website</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        organisationDetails.website
                      }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Address</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        organisationDetails.address
                      }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Tax ID</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        organisationDetails.taxId
                      }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Type</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        organisationDetails.type
                      }}</span>
                    </div>
                  </div>
                </div>
                <h3 class="my-6 font-semibold">Business owner 1</h3>
                <div class="grid grid-cols-1 gap-4 ml-6">
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Owner Name</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        organisationDetails.ownerName
                      }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Job Title</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        organisationDetails.ownerJobTitle
                      }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Date of Birth</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        organisationDetails.ownerDOB
                      }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Social Security Number</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        organisationDetails.ownerSSN
                      }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Owner Address</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        organisationDetails.ownerAddress
                      }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Contact</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        organisationDetails.ownerPhone
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Bank Details -->
              <div class="p-5"></div>
              <div class="bg-white shadow-md rounded-lg p-14 relative">
                <h1 class="pt-5 text-2xl font-semibold">Bank Details</h1>
                <h3 class="font-semibold mt-6">Operational account</h3>
                <button
                  class="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-3xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  @click="openEditBankDialog"
                >
                  <span class="mdi mdi-pencil"></span>
                </button>
                <!-- Display bank details -->
                <div class="grid grid-cols-1 gap-4 mt-4 ml-6">
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Account Holder Name</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        bankDetails.bankAccountHolderName
                      }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Account Number</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        bankDetails.bankAccountNumber
                      }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Routing Number</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        bankDetails.bankRoutingNumber
                      }}</span>
                    </div>
                  </div>
                </div>
                <h3 class="my-6 font-semibold">Trust Account</h3>
                <div class="grid grid-cols-1 gap-4 mt-4 ml-6">
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Trust Account Holder Name</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        bankDetails.trustAccountHolderName
                      }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Trust Account Number</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        bankDetails.trustAccountNumber
                      }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Trust Routing Number</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        bankDetails.trustRoutingNumber
                      }}</span>
                    </div>
                  </div>
                  <div class="mt-6 ml-[-2rem]">
                    <h3 class="font-semibold">One-time payments</h3>
                    <h4>
                      The account where Link finance will transfer all funds received for one-time
                      payments.
                    </h4>
                  </div>

                  <div class="flex items-center space-x-2">
                    <h3 class="font-semibold text-gray-700">Account</h3>
                    <div class="flex-1 border-b border-gray-300">
                      <span class="text-gray-500 flex justify-center">{{
                        bankDetails.Account
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Edit Organisation Details Modal -->
              <v-dialog v-model="editOrgDialogVisible" max-width="800px">
                <v-card>
                  <v-card-title>
                    <span class="text-h5 flex justify-center py-2">Edit Organisation Details</span>
                  </v-card-title>
                  <v-card-subtitle>
                    <v-text-field
                      v-model="organisationDetails.businessName"
                      label="Business Name"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="organisationDetails.phone"
                      label="Phone"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="organisationDetails.website"
                      label="Website"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="organisationDetails.address"
                      label="Address"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="organisationDetails.taxId"
                      label="Tax ID"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="organisationDetails.type"
                      label="Type"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="organisationDetails.ownerName"
                      label="Owner Name"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="organisationDetails.ownerJobTitle"
                      label="Job Title"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="organisationDetails.ownerDOB"
                      label="Date of Birth"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="organisationDetails.ownerSSN"
                      label="Social Security Number"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="organisationDetails.ownerAddress"
                      label="Owner Address"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="organisationDetails.ownerPhone"
                      label="Contact"
                      required
                    ></v-text-field>
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="handleSaveOrUpdate" color="primary">Save</v-btn>
                    <v-btn @click="cancelEditOrg" color="secondary">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <!-- edit bank details  -->
              <v-dialog v-model="editBankDialogVisible" max-width="800px">
                <v-card>
                  <v-card-title>
                    <span class="text-h5 flex justify-center py-2">Edit Bank Details</span>
                  </v-card-title>
                  <v-card-subtitle>
                    <v-text-field
                      v-model="bankDetails.bankAccountHolderName"
                      label="Account Holder Name"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="bankDetails.bankAccountNumber"
                      label="Account Number"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="bankDetails.bankRoutingNumber"
                      label="Routing Number"
                      required
                    ></v-text-field>
                    <div class="my-5 ml-4">
                      <h3 class="font-semibold">Trust account</h3>
                      <h4>
                        The account you use to hold funds on behalf of other partners (e.g.
                        carriers, wholesalers, etc).
                      </h4>
                    </div>
                    <v-text-field
                      v-model="bankDetails.trustAccountHolderName"
                      label="Account Holder Name"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="bankDetails.trustAccountNumber"
                      label="Account Number"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="bankDetails.trustRoutingNumber"
                      label="Routing Number"
                      required
                    ></v-text-field>
                    <div class="my-5 ml-4">
                      <h3 class="font-semibold">One-time payment account</h3>
                      <h4>
                        The account where Link-finance will transfer all funds received for one-time
                        payments.
                      </h4>
                    </div>
                    <v-radio-group v-model="bankDetails.Account" label="one-time-Payment" required>
                      <v-radio label="Trust Account" value="Trust Account"></v-radio>
                      <v-radio label="Operational Account" value="Operational Account"></v-radio>
                    </v-radio-group>
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="saveBankDetails" color="primary">Save</v-btn>
                    <v-btn @click="cancelEditBank" color="secondary">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
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
