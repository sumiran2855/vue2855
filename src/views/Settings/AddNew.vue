<script setup lang="ts">
import Navbar from '../navbar.vue'
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { fetchOrganisationDetails } from '../../components/organisationService'

const router = useRouter()
const roles = ['admin', 'platform Admin', 'producer', 'manager', 'user']

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

const Add1 = ref({
  firstname: '',
  lastname: '',
  email: '',
  contact: '',
  businessName: '',
  role: '',
  password: 'Ciss@123',
  confirmPassword: 'Ciss@123'
})

const saveUser = async () => {
  try {
    const response = await axios.post('http://localhost:3000/user/register', {
      firstName: Add1.value.firstname,
      lastName: Add1.value.lastname,
      email: Add1.value.email,
      phone: Add1.value.contact,
      businessName: Add1.value.businessName,
      role: Add1.value.role,
      password: Add1.value.password,
      confirmPassword: Add1.value.confirmPassword
    })

    if (response.data) {
      alert('User details saved!')
      router.push('/setting')
    }
  } catch (error) {
    console.error('Error saving user:', error)
    alert('Error saving user details. Please try again.')
  }
}

onMounted(() => {
  fetchOrganisationDetails(organisationDetails)
})
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
            <h1 class="text-h4 font-weight-bold">Add User</h1>
          </v-col>
        </v-row>

        <!-- Form -->
        <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <v-row class="mb-4">
            <v-col>
              <v-text-field
                v-model="Add1.firstname"
                :counter="10"
                label="Firstname"
                hide-details
                required
                variant="outlined"
                class="w-full"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="Add1.lastname"
                :counter="10"
                label="Lastname"
                hide-details
                required
                variant="outlined"
                class="w-full"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mb-4">
            <v-col>
              <v-text-field
                v-model="Add1.email"
                :counter="10"
                label="Email Address"
                hide-details
                required
                variant="outlined"
                class="w-full"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mb-4">
            <v-col>
              <v-text-field
                v-model="Add1.contact"
                :counter="10"
                label="Contact"
                hide-details
                required
                variant="outlined"
                class="w-full"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mb-4">
            <v-col>
              <v-text-field
                v-model="organisationDetails.businessName"
                :counter="10"
                label="Organisation"
                hide-details
                required
                variant="outlined"
                class="w-full"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-select
                v-model="Add1.role"
                :items="roles"
                label="Role"
                required
                variant="outlined"
                class="w-full"
              ></v-select>
            </v-col>
          </v-row>
          <div class="flex justify-end">
            <v-btn @click="saveUser" color="primary">Save</v-btn>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
/* Add any additional styles if needed */
</style>
