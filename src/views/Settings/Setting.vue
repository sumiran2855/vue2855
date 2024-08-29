<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import navbar from '../navbar.vue'
import { getUserIdFromToken } from '../../components/utils'
import store from '../../stores/index'
import { jwtDecode } from 'jwt-decode'
import {
  fetchBankDetails,
  fetchOrganisationDetails,
  fetchUserss
} from '../../components/organisationService'

interface User {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  role: string
  businessName?: string
}

const user = reactive({
  id: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  role: '',
  businessName: ''
})

const router = useRouter()
const currentTab = ref('User Management')
const searchTerm = ref('')
const users = ref<User[]>([])
const dialogVisible = ref(false)
const editingUser = ref<User>({
  id: '',
  firstName: '',
  lastName: '',
  phone: '',
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
  return users.value.filter((user) => {
    const userBusinessName = user.businessName || ''
    const organisationBusinessName = organisationDetails.businessName || ''

    return (
      userBusinessName.toLowerCase() === organisationBusinessName.toLowerCase() &&
      (user.firstName?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.value.toLowerCase()))
    )
  })
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
        phone: '',
        email: '',
        role: '',
        businessName: ''
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
  editingUser.value = { id: '', firstName: '', lastName: '', phone: '', email: '', role: '' }
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
  businessName: '',
  phone: '',
  website: '',
  streetAddress: '',
  taxId: '',
  type: '',
  ownerName: '',
  ownerJobTitle: '',
  ownerDOB: '',
  ownerSSN: '',
  streetAddress2: '',
  ownerPhone: '',
  status: ''
})

const bankDetails = reactive({
  bankAccountHolderName: '',
  bankAccountNumber: '',
  bankRoutingNumber: '',
  trustAccountHolderName: '',
  trustAccountNumber: '',
  trustRoutingNumber: '',
  Account: '-',
  Document: '-'
})

const sameAsAbove = ref(false)

watch(sameAsAbove, (newValue) => {
  if (newValue) {
    bankDetails.trustAccountHolderName = bankDetails.bankAccountHolderName
    bankDetails.trustAccountNumber = bankDetails.bankAccountNumber
    bankDetails.trustRoutingNumber = bankDetails.bankRoutingNumber
  } else {
    bankDetails.trustAccountHolderName = ''
    bankDetails.trustAccountNumber = ''
    bankDetails.trustRoutingNumber = ''
  }
})

const pdfRule = (value) => {
  if (!value) return true
  return (value && value.type === 'application/pdf') || 'Only PDF files are accepted'
}

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

    const decodedToken = jwtDecode(token)
    const userId = decodedToken.sub

    const organisationDetailsWithUserId = {
      ...organisationDetails,
      userId
    }

    console.log(organisationDetailsWithUserId)

    const response = await axios({
      method: 'POST',
      url: `http://localhost:3000/organisation/save`,
      data: organisationDetailsWithUserId,
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

    const decodedToken = jwtDecode(token)
    const userId = decodedToken.sub

    if (!userId) {
      console.error('UserId is not available in the token.')
      return
    }

    const response = await axios({
      method: 'PUT',
      url: `http://localhost:3000/organisation/update/${userId}`,
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

// const handleSaveOrUpdateOrganisation = async () => {
//   const token = getToken()
//   if (!token) {
//     redirectToLogin()
//     return
//   }
//   const userId = getUserId(token)

//   const checkResponse = await axios.get(`http://localhost:3000/organisation/getUser/${userId}`, {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   })

//   if (checkResponse.data) {
//     await updateOrganisationDetails()
//   } else {
//     await saveOrganisationDetails()
//   }
// }

const file = ref<File | null>(null)

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    file.value = input.files[0]
  } else {
    file.value = null
  }
}

const saveBankDetails = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      redirectToLogin()
      return
    }
    const decodedToken = jwtDecode(token)
    const userId = decodedToken.sub

    if (!file.value) {
      console.error('No file selected')
      return
    }

    const formData = new FormData()
    formData.append('document', file.value)
    formData.append('bankAccountHolderName', bankDetails.bankAccountHolderName)
    formData.append('bankAccountNumber', bankDetails.bankAccountNumber)
    formData.append('bankRoutingNumber', bankDetails.bankRoutingNumber)
    formData.append('trustAccountHolderName', bankDetails.trustAccountHolderName)
    formData.append('trustAccountNumber', bankDetails.trustAccountNumber)
    formData.append('trustRoutingNumber', bankDetails.trustRoutingNumber)
    formData.append('Account', bankDetails.Account)
    formData.append('userId', userId!)

    const response = await axios.post('http://localhost:3000/bank/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('Bank details saved:', response.data)

    console.log('Bank details saved:', response.data)
    alert('Document Uploaded Successfully')
    router.push('/')
  } catch (error) {
    console.error('Error saving bank details:')
  }
}

const updateBankDetails = async () => {
  try {
    const token = getToken()
    if (!token) {
      redirectToLogin()
      return
    }

    const decodedToken = jwtDecode(token)
    const userId = decodedToken.sub

    if (!userId) {
      console.error('UserId is not available in the token.')
      return
    }

    const formData = new FormData()
    formData.append('bankAccountHolderName', bankDetails.bankAccountHolderName)
    formData.append('bankAccountNumber', bankDetails.bankAccountNumber)
    formData.append('bankRoutingNumber', bankDetails.bankRoutingNumber)
    formData.append('trustAccountHolderName', bankDetails.trustAccountHolderName)
    formData.append('trustAccountNumber', bankDetails.trustAccountNumber)
    formData.append('trustRoutingNumber', bankDetails.trustRoutingNumber)
    formData.append('Account', bankDetails.Account)
    formData.append('userId', userId!)

    const response = await axios({
      method: 'PUT',
      url: `http://localhost:3000/bank/update/${userId}`,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    Object.assign(bankDetails, response.data)
    console.log('Bank details updated:', response.data)
    editBankDialogVisible.value = false
  } catch (error) {
    console.error('Error updating bank details:', error)
  }
}

const handleSaveOrUpdateBankDetails = async () => {
  const token = getToken()
  if (!token) {
    redirectToLogin()
    return
  }
  const decodedToken = jwtDecode(token)
  const userId = decodedToken.sub

  const checkResponse = await axios.get(`http://localhost:3000/bank/getUser/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (checkResponse.data) {
    await updateBankDetails()
  } else {
    await saveBankDetails()
  }
}

onMounted(() => {
  fetchOrganisationDetails(organisationDetails)
  fetchBankDetails(bankDetails)
  fetchUserss(user)
})

const activeTab = ref('Wholesaler')
const activeTab2 = ref('Branding')

const tableData = ref([
  {
    name: 'Vardhan Jain',
    financingStatus: 'American Empire Insurance Company',
    commission: 'Jul 25, 2024',
    minEarned: '$12,300.00',
    paymentMenthod: 'Active',
    actions: '...'
  }
])

const currentPage = ref(1)
const rowsPerPage = ref(5)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  const end = start + rowsPerPage.value
  return tableData.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(tableData.value.length / rowsPerPage.value))

const changeRowsPerPage = (event) => {
  rowsPerPage.value = parseInt(event.target.value, 10)
  currentPage.value = 1
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
const addNewWholesaler = () => {
  router.push('/setting/wholesaler/new')
}
const Organisations = ref<[]>([])
const IsCompany = computed(() => {
  return Organisations.value.some((organisation) => organisationDetails.status === 'pending')
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
            ><span class="mdi mdi-cart mx-2"></span>Wholesalers / Carrier</v-tab
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
                        {{ user.phone }}
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
                      v-model="editingUser.phone"
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
                      {{ organisationDetails.status }}
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
                <h3 class="my-6 font-semibold">{{ organisationDetails.businessName }}</h3>
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
                        organisationDetails.streetAddress
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
                        organisationDetails.streetAddress2
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
                  <div v-if="organisationDetails.status == 'pending'">
                    <div class="mt-6 ml-[-2rem]">
                      <h3 class="font-semibold">Proof of bank account</h3>
                      <h4>
                        Can you please provide a legal document (e.g., SS-4 confirmation letter,
                        Letter 147C) that provides confirmation of the entity's legal name and TIN?
                        We will need this document in order for you to transact with Link-Finance.
                      </h4>
                    </div>

                    <div
                      class="flex flex-col items-center justify-center w-full p-6 bg-white border rounded-lg shadow-md"
                    >
                      <v-file-input
                        accept="application/pdf"
                        label="File input"
                        prepend-icon="mdi-file-document-outline"
                        class="w-full file-input-custom"
                        hide-details
                        @click="handleFileChange"
                        v-model="file"
                        :rules="[pdfRule]"
                        >{{ bankDetails.Document }}</v-file-input
                      >
                      <p class="mt-2 text-sm text-gray-500">Only PDF files are accepted.</p>
                    </div>
                    <v-btn
                      @click="handleSaveOrUpdateBankDetails"
                      color="primary"
                      class="w-full mt-5"
                      small
                    >
                      Upload
                    </v-btn>
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
                      v-model="organisationDetails.streetAddress"
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
                      v-model="organisationDetails.streetAddress2"
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
                    <v-btn @click="updateOrganisationDetails" color="primary">Save</v-btn>
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
                    <v-checkbox v-model="sameAsAbove" label="Same as Above Details"></v-checkbox>
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
                    <v-btn @click="handleSaveOrUpdateBankDetails" color="primary">Save</v-btn>
                    <v-btn @click="cancelEditBank" color="secondary">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>

            <div v-if="currentTab === 'Wholesalers'">
              <div class="flex items-center justify-between mt-10">
                <div class="flex flex-col">
                  <div class="flex items-center space-x-4 mb-2">
                    <h2 class="text-2xl font-bold text-gray-800">Wholesalers / Carriers</h2>
                  </div>
                  <h4 class="text-lg text-gray-600">
                    Add your agency’s wholesalers and carriers. This will ensure funds go to the
                    right place in a timely manner.
                  </h4>
                  <h4 class="text-lg text-gray-600">
                    We’ll also highlight them whenever you’re creating a new agreement.
                  </h4>
                </div>
                <div>
                  <v-btn @click="addNewWholesaler" color="primary">Add New</v-btn>
                </div>
              </div>

              <div class="bg-gray-200 pa-10 rounded-lg mt-10">
                <h1 class="text-center">Add your first wholesaler or a carrier.</h1>
              </div>

              <div class="p-16">
                <div class="bg-white rounded-lg shadow-md p-5">
                  <div class="flex gap-5 mb-4">
                    <button
                      @click="activeTab = 'Wholesaler'"
                      :class="[
                        'py-2 px-4 font-semibold',
                        activeTab === 'Wholesaler'
                          ? 'border-b-2 border-teal-500 text-teal-500'
                          : 'text-gray-600 hover:border-b-2 hover:border-gray-300'
                      ]"
                    >
                      Wholesaler
                    </button>
                    <button
                      @click="activeTab = 'Carriers'"
                      :class="[
                        'py-2 px-4 font-semibold',
                        activeTab === 'Carriers'
                          ? 'border-b-2 border-teal-500 text-teal-500'
                          : 'text-gray-600 hover:border-b-2 hover:border-gray-300'
                      ]"
                    >
                      Carriers
                    </button>
                  </div>

                  <div v-if="activeTab === 'Wholesaler'">
                    <div class="overflow-x-auto">
                      <table class="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr class="bg-gray-400 text-black">
                            <th class="p-2 border-b border-gray-200 text-left">NAME AND ADDRESS</th>
                            <th class="p-2 border-b border-gray-200 text-left">FINANCING STATUS</th>
                            <th class="p-2 border-b border-gray-200 text-left">COMMISSION</th>
                            <th class="p-2 border-b border-gray-200 text-left">MIN EARNED</th>
                            <th class="p-2 border-b border-gray-200 text-left">
                              DEFAULT PAYMENT METHOD
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(row, index) in paginatedData" :key="index">
                            <td class="p-2 border-b border-gray-200">{{ row.name }}</td>
                            <td class="p-2 border-b border-gray-200">{{ row.financingStatus }}</td>
                            <td class="p-2 border-b border-gray-200">{{ row.commission }}</td>
                            <td class="p-2 border-b border-gray-200">{{ row.minEarned }}</td>
                            <td class="p-2 border-b border-gray-200">
                              <span class="bg-green-500 text-white py-1 px-5 ml-10 rounded">
                                {{ row.paymentMenthod }}</span
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-b-lg">
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700">Rows per page:</span>
                        <select
                          v-model="rowsPerPage"
                          @change="changeRowsPerPage"
                          class="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                        </select>
                      </div>
                      <span class="text-sm text-gray-700"
                        >{{ (currentPage - 1) * rowsPerPage + 1 }}-{{
                          Math.min(currentPage * rowsPerPage, tableData.length)
                        }}
                        of {{ tableData.length }}</span
                      >
                      <div class="flex items-center gap-1">
                        <button
                          @click="goToPreviousPage"
                          class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
                          :disabled="currentPage === 1"
                          aria-label="Previous page"
                        >
                          &lt;
                        </button>
                        <button
                          @click="goToNextPage"
                          class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
                          aria-label="Next page"
                          :disabled="currentPage === totalPages"
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-if="activeTab === 'Carriers'">
                    <div class="overflow-x-auto">
                      <table class="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr class="bg-gray-400 text-black">
                            <th class="p-2 border-b border-gray-200 text-left">NAME AND ADDRESS</th>
                            <th class="p-2 border-b border-gray-200 text-left">FINANCING STATUS</th>
                            <th class="p-2 border-b border-gray-200 text-left">COMMISSION</th>
                            <th class="p-2 border-b border-gray-200 text-left">MIN EARNED</th>
                            <th class="p-2 border-b border-gray-200 text-left">
                              DEFAULT PAYMENT METHOD
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(row, index) in paginatedData" :key="index">
                            <td class="p-2 border-b border-gray-200">{{ row.name }}</td>
                            <td class="p-2 border-b border-gray-200">{{ row.financingStatus }}</td>
                            <td class="p-2 border-b border-gray-200">{{ row.commission }}</td>
                            <td class="p-2 border-b border-gray-200">{{ row.minEarned }}</td>
                            <td class="p-2 border-b border-gray-200">
                              <span class="bg-green-500 text-white py-1 px-5 ml-10 rounded">
                                {{ row.paymentMenthod }}</span
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-b-lg">
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700">Rows per page:</span>
                        <select
                          v-model="rowsPerPage"
                          @change="changeRowsPerPage"
                          class="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                        </select>
                      </div>
                      <span class="text-sm text-gray-700"
                        >{{ (currentPage - 1) * rowsPerPage + 1 }}-{{
                          Math.min(currentPage * rowsPerPage, tableData.length)
                        }}
                        of {{ tableData.length }}</span
                      >
                      <div class="flex items-center gap-1">
                        <button
                          @click="goToPreviousPage"
                          class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
                          :disabled="currentPage === 1"
                          aria-label="Previous page"
                        >
                          &lt;
                        </button>
                        <button
                          @click="goToNextPage"
                          class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
                          aria-label="Next page"
                          :disabled="currentPage === totalPages"
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentTab === 'Theme'">
              <div class="flex items-center justify-between mt-10">
                <div class="flex flex-col">
                  <div class="flex items-center space-x-4 mb-2">
                    <h2 class="text-2xl font-bold text-gray-800">Customer Experience</h2>
                  </div>
                  <h4 class="text-lg text-gray-600">
                    Configure your logo, color, and wholesalers and carriers for the customer
                    portal. Learn more.
                    <span class="text-green-600 cursor-pointer"
                      >Learn more <i class="mdi mdi-arrow-right"></i
                    ></span>
                  </h4>
                </div>
              </div>

              <div class="p-16">
                <div class="bg-white rounded-lg shadow-md p-5">
                  <div class="flex gap-5 mb-4">
                    <button
                      @click="activeTab2 = 'Branding'"
                      :class="[
                        'py-2 px-4 font-semibold',
                        activeTab2 === 'Branding'
                          ? 'border-b-2 border-teal-500 text-teal-500'
                          : 'text-gray-600 hover:border-b-2 hover:border-gray-300'
                      ]"
                    >
                      Branding
                    </button>
                    <button
                      @click="activeTab2 = 'Customer Portal'"
                      :class="[
                        'py-2 px-4 font-semibold',
                        activeTab2 === 'Customer Portal'
                          ? 'border-b-2 border-teal-500 text-teal-500'
                          : 'text-gray-600 hover:border-b-2 hover:border-gray-300'
                      ]"
                    >
                      Customer Portal
                    </button>
                  </div>

                  <div v-if="activeTab2 === 'Branding'">
                    <div class="overflow-x-auto">
                      <div class="ma-5">
                        <h1 class="font-semibold text-xl">Branding</h1>
                        <h1 class="mt-2">
                          Set up your primary color and logo. These will be visible at checkout,
                          emails and the customer portal. For best results, upload a horizontal logo
                          with a transparent background in SVG, PNG, or JPG.
                        </h1>
                      </div>
                    </div>
                    <div
                      class="flex flex-col items-center justify-center w-full p-6 bg-white border rounded-lg shadow-md"
                    >
                      <v-file-input
                        accept="application/pdf"
                        label="File input"
                        prepend-icon="mdi-file-document-outline"
                        class="w-full file-input-custom m-8"
                        hide-details
                        v-model="file"
                        :rules="[pdfRule]"
                      ></v-file-input>
                      <p class="mt-2 text-sm text-gray-500">Only PDF files are accepted.</p>
                    </div>

                    <h1 class="m-4">Primary color (hex code)</h1>
                    <div class="flex justify-between">
                      <v-responsive class="mx-auto py-2" max-width="894">
                        <v-text-field
                          hide-details="auto"
                          label="colour"
                          prefix="#"
                          class="w-full"
                          variant="outlined"
                        ></v-text-field>
                      </v-responsive>
                      <v-btn color="primary" class="mt-5">Save</v-btn>
                    </div>
                    <div class="bg-gray-100 rounded-lg p-8 shadow-lg mt-4">
                      <div class="flex justify-between items-center mb-6">
                        <div class="rounded-full bg-white text-black p-3 cursor-pointer">
                          <i class="flex items-center justify-center">
                            <img
                              src="https://www.svgrepo.com/show/532034/cloud-arrow-down.svg"
                              alt="Download"
                              class="w-6 h-6"
                            />
                          </i>
                        </div>
                        <div
                          class="flex items-center border border-gray-300 rounded-lg p-3 shadow-md"
                        >
                          <div
                            class="rounded-full bg-white text-black p-3 cursor-pointer border border-gray-300"
                          >
                            <h1 class="font-bold text-lg">SB</h1>
                          </div>
                          <div class="ml-3">
                            <h1 class="text-gray-800 text-lg font-semibold">
                              Agent : Sumiran Biswas
                            </h1>
                            <h1 class="text-gray-800 text-lg font-medium ml-5">+91-9845001136</h1>
                          </div>
                        </div>
                      </div>

                      <div class="px-6">
                        <h1 class="text-2xl font-semibold text-gray-800">Hi, Ujjwal</h1>
                        <p class="mt-4 text-gray-700">
                          Payment for your policy is due on
                          <span class="font-semibold">[Date]</span>.
                        </p>
                        <p class="text-gray-700">
                          You can pay in full <span class="font-semibold">$5,200.00</span> or pay
                          over time <span class="font-semibold">$600.00 per month</span>.
                        </p>
                      </div>
                      <v-btn color="primary" class="mt-5 w-full">Submit payment</v-btn>
                      <p class="text-gray-600 mt-5 ml-5">
                        Here are the details of your insurance policy (or policies):
                      </p>
                    </div>
                  </div>

                  <div v-if="activeTab2 === 'Customer Portal'">
                    <div class="overflow-x-auto">
                      <div class="ma-5 flex items-center justify-between">
                        <div>
                          <h1 class="font-semibold text-xl">Customer Portal</h1>
                          <h1 class="mt-1">
                            Customers can use this portal to stay on top of their payments.
                          </h1>
                        </div>
                        <div class="flex space-x-4">
                          <v-btn
                            class="border border-black text-black font-medium py-2 px-4 rounded"
                          >
                            Copy Link
                          </v-btn>
                          <v-btn
                            color="primary"
                            class="bg-black text-white font-medium py-2 px-4 rounded"
                          >
                            Visit Customer Portal
                          </v-btn>
                        </div>
                      </div>
                      <h1 class="border"></h1>
                      <div class="ma-5 flex items-center justify-between">
                        <div>
                          <h1 class="font-semibold text-xl">
                            Wholesalers and carriers for Customer Portal
                          </h1>
                          <h1 class="mt-1">
                            Customers will see their wholesalers and carriers’ payment portals at
                            login and can pay through their sites directly.
                          </h1>
                        </div>
                        <div class="flex space-x-4">
                          <v-btn
                            class="border border-black text-black font-medium py-2 px-4 rounded"
                          >
                            Add Wholesaler or carrier
                          </v-btn>
                        </div>
                      </div>

                      <!-- table -->
                      <table
                        class="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm"
                      >
                        <thead>
                          <tr class="bg-gray-100 text-gray-700">
                            <th class="p-4 border-b border-gray-200 text-left font-semibold">
                              NAME
                            </th>
                            <th class="p-4 border-b border-gray-200 text-left font-semibold">
                              TYPE
                            </th>
                            <th class="p-4 border-b border-gray-200 text-left font-semibold">
                              PHONE
                            </th>
                            <th class="p-4 border-b border-gray-200 text-left font-semibold">
                              LINK
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colspan="4" class="p-10 text-center text-gray-500">
                              No data available right now
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
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

.file-input-custom .v-input__slot {
  padding-left: 16px;
  padding-right: 16px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
}
</style>
