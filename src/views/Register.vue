<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const businessName = ref('')
const phone = ref('')
const website = ref('')
const streetAddress = ref('')
const streetAddress2 = ref('')
const city = ref('')
const state = ref('')
const zipCode = ref('')
const firstName = ref('')
const lastName = ref('')
const ownerPhone = ref('')
const termsAccepted = ref(false)

const router = useRouter()

const handleSubmit = async () => {
  if (
    !email.value ||
    !password.value ||
    !confirmPassword.value ||
    !businessName.value ||
    !phone.value ||
    !website.value ||
    !streetAddress.value ||
    !city.value ||
    !state.value ||
    !zipCode.value ||
    !firstName.value ||
    !lastName.value ||
    !ownerPhone.value
  ) {
    alert('Please fill in all fields.')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }

  if (!termsAccepted.value) {
    alert('Please accept the terms and conditions.')
    return
  }

  try {
    const response = await axios.post('http://localhost:3000/user/register', {
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      businessName: businessName.value,
      phone: phone.value,
      website: website.value,
      streetAddress: streetAddress.value,
      streetAddress2: streetAddress2.value,
      city: city.value,
      state: state.value,
      zipCode: zipCode.value,
      firstName: firstName.value,
      lastName: lastName.value,
      ownerPhone: ownerPhone.value
    })
    console.log('Registration successful:', response.data)
    localStorage.setItem('email', email.value)

    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    businessName.value = ''
    phone.value = ''
    website.value = ''
    streetAddress.value = ''
    streetAddress2.value = ''
    city.value = ''
    state.value = ''
    zipCode.value = ''
    firstName.value = ''
    lastName.value = ''
    ownerPhone.value = ''

    alert('Registration successful. Please check your email for the verification link.')
    router.push('/login')
  } catch (error) {
    console.error('Error during registration:', error)
    alert('Registration failed. Please try again.')
  }
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-200 pt-10">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
      <h1 class="text-2xl font-bold mb-8 text-center">Create a Account</h1>
      <div class="mb-4 text-gray-700 text-sm font-bold">Tell us about your Insurance agency:</div>
      <input
        v-model="businessName"
        type="text"
        placeholder="Company Name"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
      />
      <input
        v-model="phone"
        type="text"
        placeholder="Mobile Number"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
      />
      <input
        v-model="website"
        type="text"
        placeholder="Website"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
      />
      <input
        v-model="streetAddress"
        type="text"
        placeholder="Street Address"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
      />
      <input
        v-model="streetAddress2"
        type="text"
        placeholder="Street Address 2 (Optional)"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
      />
      <div class="flex space-x-4">
        <input
          v-model="city"
          type="text"
          placeholder="City"
          class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
        />
        <input
          v-model="state"
          type="text"
          placeholder="State"
          class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
        />
      </div>
      <input
        v-model="zipCode"
        type="text"
        placeholder="Zip Code"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
      />
      <div class="mb-4 text-gray-700 text-sm font-bold">Tell us about yourself:</div>
      <div class="flex space-x-4">
        <input
          v-model="firstName"
          type="text"
          placeholder="First Name"
          class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
        />
        <input
          v-model="lastName"
          type="text"
          placeholder="Last Name"
          class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
        />
      </div>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
      />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
      />
      <input
        v-model="ownerPhone"
        type="text"
        placeholder="Phone Number"
        class="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
      />
      <label class="flex items-center mb-4">
        <input
          v-model="termsAccepted"
          type="checkbox"
          class="form-checkbox h-5 w-5 text-blue-500"
        />
        <span class="ml-2 text-gray-700"
          >I accept the <a href="#" class="text-blue-500">terms and conditions</a></span
        >
      </label>
      <button
        @click="handleSubmit"
        type="button"
        class="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
      <div class="text-center mb-4 mt-2">
        <span class="text-gray-600">Already registered?</span>
        <router-link to="/login" class="text-blue-500 ml-1 hover:underline">Login</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 640px) {
  .max-w-2xl {
    max-width: 42rem;
  }
}
</style>
