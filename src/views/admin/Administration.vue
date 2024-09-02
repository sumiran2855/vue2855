<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import adminNavbar from '../adminNavbar.vue'
import { jwtDecode } from 'jwt-decode'
import { getUserIdFromToken } from '../../components/utils'

const router = useRouter()
const currentTab = ref('General')
const searchTerm = ref('')
const users = ref<User[]>([])
const Organisations = ref<OrganisationDetails[]>([])
const dialogVisible = ref(false)
const currentPage = ref(1)
const rowsPerPage = ref(5)
const activeTab = ref('Wholesaler')
const totalPages = computed(() => Math.ceil(tableData.value.length / rowsPerPage.value))
const getToken = () => localStorage.getItem('access_token')

interface User {
  id: string
  firstName: string
  lastName: string
  ownerPhone: string
  email: string
  role: string
}

interface OrganisationDetails {
  businessName: string
  phone: string
  email: string
  website: string
  streetAddress: string
  taxId: string
  type: string
  ownerName: string
  ownerJobTitle: string
  ownerDOB: string
  ownerSSN: string
  streetAddress2: string
  ownerPhone: string
  status: string
}

const editingUser = ref<User>({
  id: '',
  firstName: '',
  lastName: '',
  ownerPhone: '',
  email: '',
  role: ''
})

const changeTab = (tab: string) => {
  currentTab.value = tab
}

const editUser = (user: User) => {
  editingUser.value = { ...user }
  dialogVisible.value = true
}

const cancelEdit = () => {
  editingUser.value = { id: '', firstName: '', lastName: '', ownerPhone: '', email: '', role: '' }
  dialogVisible.value = false
}

const addUser = () => {
  router.push('/addNew')
}

const tableData = ref([
  {
    name: 'Inspection Bureau of Massachusetts 99',
    financingStatus: 'Pending',
    commission: '-',
    minEarned: '-',
    paymentMenthod: 'Add Payment method',
    actions: '...'
  },
  {
    name: 'Inspection Bureau of Massachusetts 99',
    financingStatus: 'Pending',
    commission: '-',
    minEarned: '-',
    paymentMenthod: 'Add Payment method',
    actions: '...'
  },
  {
    name: 'Inspection Bureau of Massachusetts 99',
    financingStatus: 'Pending',
    commission: '-',
    minEarned: '-',
    paymentMenthod: 'Add Payment method',
    actions: '...'
  }
])

const tableData2 = ref([
  {
    name: '1234Aman2C',
    financingStatus: 'Pending',
    commission: '-',
    minEarned: '-',
    paymentMenthod: 'Add Payment method',
    actions: '...'
  },
  {
    name: '1234Aman2C',
    financingStatus: 'Pending',
    commission: '-',
    minEarned: '-',
    paymentMenthod: 'Add Payment method',
    actions: '...'
  },
  {
    name: '1234Aman2C',
    financingStatus: 'Pending',
    commission: '-',
    minEarned: '-',
    paymentMenthod: 'Add Payment method',
    actions: '...'
  }
])

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  const end = start + rowsPerPage.value
  return tableData.value.slice(start, end)
})
const paginatedData2 = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  const end = start + rowsPerPage.value
  return tableData2.value.slice(start, end)
})

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

const getUserId = (token) => {
  return getUserIdFromToken(token)
}

const redirectToLogin = () => {
  router.push('/login')
}

const allDetailsFilled = computed(() => {
  return Organisations.value.every(
    (organisation) =>
      organisation.businessName &&
      organisation.phone &&
      organisation.email &&
      organisation.website &&
      organisation.streetAddress &&
      organisation.taxId &&
      organisation.type &&
      organisation.ownerName &&
      organisation.ownerJobTitle &&
      organisation.ownerDOB &&
      organisation.ownerSSN &&
      organisation.streetAddress2 &&
      organisation.ownerPhone &&
      organisation.status
  )
})

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

const filteredOrganisation = computed(() => {
  if (!Array.isArray(Organisations.value)) {
    return []
  }
  return Organisations.value.filter(
    (user) =>
      user.status.toLowerCase() === 'pending' &&
      (user.businessName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.value.toLowerCase()))
  )
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
        ownerPhone: '',
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

const fetchAllOrganisation = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }

    const response = await axios.get('http://localhost:3000/organisation/getAllUsers', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    Organisations.value = response.data
  } catch (error: any) {
    console.error('Error fetching users:', error)

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token')
      router.push('/login')
    }
  }
}

const updateOrganisationDetails = async (organisation) => {
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
      url: `http://localhost:3000/organisation/updateStatus/${userId}`,
      data: { status: 'verified' },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    organisation.status = 'verified'
    console.log('Organisation details updated:', response.data)
  } catch (error) {
    console.error('Error updating organisation details:', error)
  }
}

onMounted(fetchUsers)
onMounted(fetchAllOrganisation)
</script>

<template>
  <v-app>
    <adminNavbar />
    <v-main>
      <v-container>
        <v-row class="align-center mb-4">
          <v-col cols="auto">
            <v-btn icon @click="$router.go(-1)">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <h1 class="text-h4 font-weight-bold">Adminstration</h1>
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
          <v-tab @click="changeTab('General')"
            ><span class="mdi mdi-human-child mx-2"></span>General</v-tab
          >
          <v-tab @click="changeTab('User Administration')"
            ><span class="mdi mdi-account-multiple-plus mx-2"></span>User Administration</v-tab
          >

          <v-tab @click="changeTab('Wholesalers')"
            ><span class="mdi mdi-cart mx-2"></span>Wholesalers / Carrier</v-tab
          >
          <v-tab @click="changeTab('Theme')"
            ><span class="mdi mdi-currency-usd mx-2"></span>Financing / fees</v-tab
          >
        </v-tabs>

        <!-- Tab Content -->
        <v-main>
          <div>
            <div v-if="currentTab === 'General'">
              <div class="flex items-center justify-between mt-10">
                <div>
                  <h2 class="text-h5 font-weight-bold">General</h2>
                  <h3 class="text-gray-600">General Administration</h3>
                  <div class="flex space-x-4 items-center mt-6">
                    <v-text-field
                      label="Minimal Approval Limited"
                      class="w-64"
                      variant="outlined"
                      prefix="$"
                      solo
                      dense
                    ></v-text-field>
                    <v-btn color="primary" class="h-64">save</v-btn>
                  </div>
                </div>
              </div>

              <div v-if="allDetailsFilled">
                <div class="overflow-x-auto mt-8">
                  <table class="min-w-full divide-y divide-gray-200 bg-white">
                    <thead class="bg-gray-100">
                      <tr>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Organisation Name
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Owner Name
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Phone
                        </th>
                        <th
                          class="px-16 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody
                      v-for="organisation in filteredOrganisation"
                      :key="organisation.email"
                      class="bg-white divide-y divide-gray-200"
                    >
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {{ organisation.businessName }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ organisation.ownerName }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ organisation.email }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ organisation.ownerPhone }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <v-btn
                            @click="updateOrganisationDetails(organisation)"
                            color="primary"
                            small
                            class="mr-16"
                          >
                            Approve
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div v-if="currentTab === 'User Administration'">
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
                        {{ user.ownerPhone }}
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
                      v-model="editingUser.ownerPhone"
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
                  <v-btn @click="updateUser" color="primary">Add New</v-btn>
                </div>
              </div>

              <div class="bg-gray-200 pa-10 rounded-lg mt-10">
                <h1 class="text-center">Add your first wholesaler or a carrier.</h1>
              </div>

              <div class="pt-8">
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
                      <table
                        class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md"
                      >
                        <thead>
                          <tr class="bg-gray-100 text-gray-700">
                            <th
                              class="p-4 border-b border-gray-200 text-left text-sm font-semibold"
                            >
                              NAME
                            </th>
                            <th
                              class="p-4 border-b border-gray-200 text-left text-sm font-semibold"
                            >
                              FINANCING STATUS
                            </th>
                            <th
                              class="p-4 border-b border-gray-200 text-left text-sm font-semibold"
                            >
                              COMMISSION
                            </th>
                            <th
                              class="p-4 border-b border-gray-200 text-left text-sm font-semibold"
                            >
                              MIN EARNED
                            </th>
                            <th
                              class="p-4 border-b border-gray-200 text-left text-sm font-semibold"
                            >
                              DEFAULT PAYMENT METHOD
                            </th>
                            <th class="p-4 border-b border-gray-200 text-left"></th>
                            <th class="p-4 border-b border-gray-200 text-left"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(row, index) in paginatedData"
                            :key="index"
                            class="hover:bg-gray-50"
                          >
                            <td class="p-4 border-b border-gray-200 text-sm text-gray-800">
                              {{ row.name }}
                            </td>
                            <td class="p-4 border-b border-gray-200 text-sm">
                              <span class="bg-green-500 text-white py-1 px-3 rounded-full">{{
                                row.financingStatus
                              }}</span>
                            </td>
                            <td class="p-4 border-b border-gray-200 text-sm text-gray-800">
                              {{ row.commission }}
                            </td>
                            <td class="p-4 border-b border-gray-200 text-sm text-gray-800">
                              {{ row.minEarned }}
                            </td>
                            <td
                              class="p-4 border-b border-gray-200 cursor-pointer text-gray-600 font-semibold"
                            >
                              {{ row.paymentMenthod }}
                            </td>
                            <td class="p-4 border-b border-gray-200 text-center">
                              <button class="text-blue-500 hover:text-blue-700">
                                <i class="mdi mdi-pencil"></i>
                              </button>
                            </td>
                            <td class="p-4 border-b border-gray-200 text-center">
                              <button class="text-red-500 hover:text-red-700">
                                <i class="mdi mdi-delete"></i>
                              </button>
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
                      <table
                        class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md"
                      >
                        <thead>
                          <tr class="bg-gray-100 text-gray-700">
                            <th
                              class="p-4 border-b border-gray-200 text-left text-sm font-semibold"
                            >
                              NAME
                            </th>
                            <th
                              class="p-4 border-b border-gray-200 text-left text-sm font-semibold"
                            >
                              FINANCING STATUS
                            </th>
                            <th
                              class="p-4 border-b border-gray-200 text-left text-sm font-semibold"
                            >
                              COMMISSION
                            </th>
                            <th
                              class="p-4 border-b border-gray-200 text-left text-sm font-semibold"
                            >
                              MIN EARNED
                            </th>
                            <th
                              class="p-4 border-b border-gray-200 text-left text-sm font-semibold"
                            >
                              DEFAULT PAYMENT METHOD
                            </th>
                            <th class="p-4 border-b border-gray-200 text-left"></th>
                            <th class="p-4 border-b border-gray-200 text-left"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(row, index) in paginatedData2"
                            :key="index"
                            class="hover:bg-gray-50"
                          >
                            <td class="p-4 border-b border-gray-200 text-sm text-gray-800">
                              {{ row.name }}
                            </td>
                            <td class="p-4 border-b border-gray-200 text-sm">
                              <span class="bg-green-500 text-white py-1 px-3 rounded-full">{{
                                row.financingStatus
                              }}</span>
                            </td>
                            <td class="p-4 border-b border-gray-200 text-sm text-gray-800">
                              {{ row.commission }}
                            </td>
                            <td class="p-4 border-b border-gray-200 text-sm text-gray-800">
                              {{ row.minEarned }}
                            </td>
                            <td
                              class="p-4 border-b border-gray-200 cursor-pointer text-gray-600 font-semibold"
                            >
                              {{ row.paymentMenthod }}
                            </td>
                            <td class="p-4 border-b border-gray-200 text-center">
                              <button class="text-blue-500 hover:text-blue-700">
                                <i class="mdi mdi-pencil"></i>
                              </button>
                            </td>
                            <td class="p-4 border-b border-gray-200 text-center">
                              <button class="text-red-500 hover:text-red-700">
                                <i class="mdi mdi-delete"></i>
                              </button>
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
                    <h2 class="text-2xl font-bold text-gray-800">Financing / Fee Administration</h2>
                  </div>
                  <h4 class="text-lg text-gray-600">
                    Set up your company’s take rate for financed policies. This will be added to the
                    base rate for your clients, and will be paid out to your agency monthly on the
                    15th day. Payout will be followed by a detailed report via email.
                  </h4>
                </div>
              </div>

              <div
                class="mt-5 flex rounded-lg border-dashed border-2 bg-green-100 border-green-400 ..."
              >
                <i class="mdi mdi-information my-2 ml-5"></i>
                <span class="m-2">Bank rates are subject to change based on market dynamics.</span>
              </div>

              <div class="mt-5 flex rounded-lg border-dashed border-2 bg-yellow-100 ...">
                <i class="mdi mdi-information my-2 ml-5"></i>
                <span class="m-2"
                  >Take rate regulations differ across states. Some prohibit it, others cap it. Your
                  take rate will be updated accordingly when creating a agreement.</span
                >
              </div>

              <div class="mt-4 flex justify-between space-x-4">
                <div class="flex-1">
                  <div class="text-subtitle-1 text-medium-emphasis">Bank rate</div>
                  <v-text-field density="compact" variant="outlined" class="w-full" value="2.5">
                    <template v-slot:prepend-inner>
                      <span class="text-gray-600">% </span>
                    </template>
                  </v-text-field>
                </div>
                <div class="flex-1">
                  <div class="text-subtitle-1 text-medium-emphasis">Service Fee</div>
                  <v-text-field density="compact" variant="outlined" class="w-full" value="150">
                    <template v-slot:prepend-inner>
                      <span class="text-gray-600">$ </span>
                    </template>
                  </v-text-field>
                </div>
                <div class="flex-1">
                  <div class="text-subtitle-1 text-medium-emphasis">Documentation Fee</div>
                  <v-text-field density="compact" variant="outlined" class="w-full" value="50">
                    <template v-slot:prepend-inner>
                      <span class="text-gray-600">$ </span>
                    </template>
                  </v-text-field>
                </div>
                <div class="flex-1">
                  <div class="text-subtitle-1 text-medium-emphasis">Other Fee</div>
                  <v-text-field density="compact" variant="outlined" class="w-full" value="25">
                    <template v-slot:prepend-inner>
                      <span class="text-gray-600">$ </span>
                    </template>
                  </v-text-field>
                </div>
              </div>

              <div class="mt-10 shadow-xl rounded-lg">
                <div class="flex justify-around ma-5">
                  <span>PREMIUM FINANCE RANGE </span><span>INTEREST RATE </span>
                </div>
                <div
                  class="mt-5 mx-5 flex rounded-lg border-dashed border-2 bg-black-600 ..."
                ></div>
                <div class="flex justify-around items-center mt-3 ml-16">
                  <span>Up to $250.00 </span>
                  <span class="w-1/4">
                    <v-text-field density="compact" variant="outlined" class="w-full" value="0">
                      <template v-slot:prepend-inner>
                        <span class="text-gray-600">% </span>
                      </template>
                    </v-text-field>
                  </span>
                </div>
                <div
                  class="mt-3 mx-5 flex rounded-lg border-dashed border-2 bg-black-600 ..."
                ></div>
                <div class="flex justify-around items-center ma-4 ml-16">
                  <span>$250.00 to $999.99</span>
                  <span class="w-1/4">
                    <v-text-field density="compact" variant="outlined" class="w-full" value="15">
                      <template v-slot:prepend-inner>
                        <span class="text-gray-600">% </span>
                      </template>
                    </v-text-field>
                  </span>
                </div>
                <div
                  class="mt-3 mx-5 flex rounded-lg border-dashed border-2 bg-black-600 ..."
                ></div>
                <div class="flex justify-around items-center ma-4 ml-16">
                  <span>$1,000.00 to $3,999.99</span>
                  <span class="w-1/4">
                    <v-text-field density="compact" variant="outlined" class="w-full" value="20.5">
                      <template v-slot:prepend-inner>
                        <span class="text-gray-600">% </span>
                      </template>
                    </v-text-field>
                  </span>
                </div>
                <div
                  class="mt-3 mx-5 flex rounded-lg border-dashed border-2 bg-black-600 ..."
                ></div>
                <div class="flex justify-around items-center ma-4 ml-16">
                  <span>$4,000.00 to $6,499.99</span>
                  <span class="w-1/4">
                    <v-text-field density="compact" variant="outlined" class="w-full" value="14.9">
                      <template v-slot:prepend-inner>
                        <span class="text-gray-600">% </span>
                      </template>
                    </v-text-field>
                  </span>
                </div>
                <div
                  class="mt-3 mx-5 flex rounded-lg border-dashed border-2 bg-black-600 ..."
                ></div>
                <div class="flex justify-around items-center ma-4 ml-16">
                  <span>$6,500.00 to $7,999.99</span>
                  <span class="w-1/4">
                    <v-text-field density="compact" variant="outlined" class="w-full" value="15.74">
                      <template v-slot:prepend-inner>
                        <span class="text-gray-600">% </span>
                      </template>
                    </v-text-field>
                  </span>
                </div>
                <div
                  class="mt-3 mx-5 flex rounded-lg border-dashed border-2 bg-black-600 ..."
                ></div>
                <div class="flex justify-around items-center ma-4 ml-16">
                  <span>$8,000.00 to $9,999.99</span>
                  <span class="w-1/4">
                    <v-text-field density="compact" variant="outlined" class="w-full" value="15.3">
                      <template v-slot:prepend-inner>
                        <span class="text-gray-600">% </span>
                      </template>
                    </v-text-field>
                  </span>
                </div>
                <div
                  class="mt-3 mx-5 flex rounded-lg border-dashed border-2 bg-black-600 ..."
                ></div>
                <div class="flex justify-around items-center ma-4 ml-16">
                  <span>$10,000.00 to $14,999.99</span>
                  <span class="w-1/4">
                    <v-text-field density="compact" variant="outlined" class="w-full" value="13.89">
                      <template v-slot:prepend-inner>
                        <span class="text-gray-600">% </span>
                      </template>
                    </v-text-field>
                  </span>
                </div>
                <div
                  class="mt-3 mx-5 flex rounded-lg border-dashed border-2 bg-black-600 ..."
                ></div>
                <div class="flex justify-around items-center ma-4 ml-16">
                  <span>$15,000.00 to $29,999.99</span>
                  <span class="w-1/4">
                    <v-text-field density="compact" variant="outlined" class="w-full" value="12.74">
                      <template v-slot:prepend-inner>
                        <span class="text-gray-600">% </span>
                      </template>
                    </v-text-field>
                  </span>
                </div>
                <div
                  class="mt-3 mx-5 flex rounded-lg border-dashed border-2 bg-black-600 ..."
                ></div>
                <div class="flex justify-around items-center ma-4 ml-16">
                  <span>$30,000.00 to $49,999.99 </span>
                  <span class="w-1/4">
                    <v-text-field density="compact" variant="outlined" class="w-full" value="11.31">
                      <template v-slot:prepend-inner>
                        <span class="text-gray-600">% </span>
                      </template>
                    </v-text-field>
                  </span>
                </div>
                <div
                  class="mt-3 mx-5 flex rounded-lg border-dashed border-2 bg-black-600 ..."
                ></div>
                <div class="flex justify-around items-center ma-4 ml-16">
                  <span>$50,000.00 to $74,999.99 </span>
                  <span class="w-1/4">
                    <v-text-field density="compact" variant="outlined" class="w-full" value="10.74">
                      <template v-slot:prepend-inner>
                        <span class="text-gray-600">% </span>
                      </template>
                    </v-text-field>
                  </span>
                </div>
                <div
                  class="mt-3 mx-5 flex rounded-lg border-dashed border-2 bg-black-600 ..."
                ></div>
                <div class="flex justify-around items-center ma-4 ml-16">
                  <span>$75,000.00 to $99,999.99</span>
                  <span class="w-1/4">
                    <v-text-field density="compact" variant="outlined" class="w-full" value="10.78">
                      <template v-slot:prepend-inner>
                        <span class="text-gray-600">% </span>
                      </template>
                    </v-text-field>
                  </span>
                </div>
                <div
                  class="mt-3 mx-5 flex rounded-lg border-dashed border-2 bg-black-600 ..."
                ></div>
                <div class="flex justify-around items-center ma-4 ml-16">
                  <span>$100,000.00 to $149,999.99</span>
                  <span class="w-1/4">
                    <v-text-field density="compact" variant="outlined" class="w-full" value="10.78">
                      <template v-slot:prepend-inner>
                        <span class="text-gray-600">% </span>
                      </template>
                    </v-text-field>
                  </span>
                </div>
                <div
                  class="mt-3 mx-5 flex rounded-lg border-dashed border-2 bg-black-600 ..."
                ></div>
                <div class="flex justify-around items-center ma-4 ml-16">
                  <span>$150,000.00 to above</span>
                  <span class="w-1/4">
                    <v-text-field density="compact" variant="outlined" class="w-full" value="9.9">
                      <template v-slot:prepend-inner>
                        <span class="text-gray-600">% </span>
                      </template>
                    </v-text-field>
                  </span>
                </div>
                <div
                  class="mt-3 mx-5 flex rounded-lg border-dashed border-2 bg-black-600 ..."
                ></div>
                <div class="py-10 flex justify-end pr-16">
                  <v-btn color="primary">Save Changes</v-btn>
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
