<script setup lang="ts">
import { ref, onMounted } from 'vue'
import navbar from '../navbar.vue'
import { fetchAgreement } from '../../components/agreementService'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'vue-router'
import axios from 'axios'

const dropdownOpen = ref(false)
const activeTab = ref('customer')
const activeTab2 = ref('Customer2')
const agreementData = ref<Agreement[]>([])

interface Business {
  id: number
  Buisness: string
  Address: string
  Address2: string
  city: string
  state: string
  Zip: string
}

interface Quote {
  id: number
  quoteNumber: string
  policyNumber: string
  carrierCompany: string
  wholesaler: string
  coverage: string
  effectiveDate: Date
  expirationDate: Date
  minDaysToCancel: number
  minEarnedRate: number
  premium: number
  taxes: number
  otherFees: number
  brokerFee: number
  policyFee: number
  commission: number
  AgencyFess: number
  totalCost: number
}

interface Agreement {
  id: string
  firstname: string
  lastname: string
  email: string
  contact: string
  Address: string
  city: string
  state: string
  zipcode: string
  customerType: string
  businesses: Business[]
  quotes: Quote[]
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

function copyToClipboard() {
  const input = document.querySelector('input')
  if (input) {
    input.select()
    document.execCommand('copy')
  }
}

const switchTab = (tabName: string) => {
  activeTab.value = tabName
}

const setActiveTab = (tabIndex: string) => {
  activeTab2.value = tabIndex
}

onMounted(() => {
  fetchAgreement(agreementData)
})
const router = useRouter()

const redirectToLogin = () => {
  router.push('/login')
}

const SendMail = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      redirectToLogin()
      return
    }

    const decodedToken: any = jwtDecode(token)
    const userId = decodedToken.sub

    const response = await axios.get(`http://localhost:3000/agreement/${userId}/send-email`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const message = response.data
    console.log(message)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

const openPDF = async () => {
  const token = localStorage.getItem('access_token')

  const response = await axios.get('http://localhost:3000/pdf/generate', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    responseType: 'blob'
  })

  const blob = new Blob([response.data], { type: 'application/pdf' })
  const url = window.URL.createObjectURL(blob)
  const newTab = window.open(url)
  if (newTab) {
    newTab.focus()
  } else {
    alert('Please allow popups for this website')
  }
}
</script>

<template>
  <v-app>
    <navbar />
    <v-main>
      <v-container>
        <v-row class="align-center my-4">
          <v-col cols="auto">
            <v-btn icon @click="$router.go(-1)">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-col>
          <v-col class="flex items-center mb-6 space-x-2 mt-4">
            <h1
              v-if="agreementData.length > 0"
              v-for="agreement in agreementData"
              :key="agreement.id"
              class="text-h5 font-weight-bold"
            >
              {{ agreement.firstname }} {{ agreementData[0].lastname }}
            </h1>
            <span
              v-if="agreementData.length > 0"
              class="bg-blue-100 text-blue-700 text-sm font-semibold px-2.5 py-0.5 rounded"
            >
              Payment Due
            </span>
          </v-col>
          <v-col class="text-right">
            <div class="relative inline-block text-left">
              <button
                @click="toggleDropdown"
                class="inline-flex justify-center w-32 py-2 bg-white text-sm font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
              >
                Actions
                <svg
                  class="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <div
                v-if="dropdownOpen"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
              >
                <div class="py-1">
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >Add Quote</a
                  >
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >Edit Payment Info</a
                  >
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >Pay Off Loan Early</a
                  >
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >Reinstate Program</a
                  >
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >Return Refund</a
                  >
                  <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                    >Cancel</a
                  >
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
        <div
          v-if="agreementData.length > 0"
          class="flex justify-between items-center p-4 bg-gray-50 rounded shadow"
        >
          <div class="flex flex-col">
            <span class="text-sm font-semibold"
              >Email payment link to {{ agreementData[0].firstname }}
              {{ agreementData[0].lastname }}</span
            >
            <span class="text-sm text-gray-600">
              <v-icon class="text-black-500 mr-2">mdi-email</v-icon>{{ agreementData[0].email }}
            </span>
          </div>

          <div class="flex space-x-2 items-center">
            <input
              type="text"
              value="https://payment-link.com"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800"
              readonly
            />
            <button
              class="px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 focus:outline-none"
              @click="copyToClipboard"
            >
              Copy
            </button>
            <button
              class="px-3 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 focus:outline-none"
              @click="SendMail"
            >
              Send Mail
            </button>
          </div>
        </div>
        <div v-if="agreementData.length > 0" class="flex flex-col">
          <span class="mt-2 font-sans">Gross premium</span>
          <span
            v-for="quote in agreementData[0].quotes"
            :key="quote.id"
            class="text-2xl font-semibold"
          >
            $ {{ quote.totalCost.toFixed(2) }}</span
          >
        </div>

        <div
          v-if="agreementData.length > 0"
          class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 mt-4"
        >
          <div
            v-for="quote in agreementData[0].quotes"
            :key="quote.id"
            class="col-span-2 bg-white p-6 border border-gray-300 rounded-md shadow"
          >
            <div class="flex justify-start my-4">
              <h1 class="font-sans text-xl">Financed</h1>
              <h1
                class="font-semibold text-xs ml-3 bg-blue-200 border-spacing-0 rounded-lg p-1 text-blue-600 mb-1 cursor-pointer"
              >
                Available until {{ quote.effectiveDate.toLocaleDateString() }}
              </h1>
            </div>

            <div class="flex justify-between items-center mb-4">
              <div class="text-gray-500">
                <p>
                  Date: <span>{{ quote.effectiveDate.toLocaleDateString() }}</span>
                </p>
                <p>
                  Total: <span>$ {{ quote.totalCost }}.00</span>
                </p>
                <p>
                  Down payment: <span>$ {{ (quote.totalCost * 0.25).toFixed(2) }} </span>
                </p>
                <p>
                  APR: <span>{{ quote.minEarnedRate }} % ($ {{ quote.brokerFee.toFixed(2) }})</span>
                </p>
                <p>
                  Agreement duration:
                  <span
                    >{{ quote.minDaysToCancel }} monthly installments - ${{
                      ((quote.totalCost - quote.totalCost * 0.25) / quote.minDaysToCancel).toFixed(
                        2
                      )
                    }}</span
                  >
                  / per month
                </p>
                <p>
                  Service Fees: <span>$ {{ quote.AgencyFess.toFixed(2) }}</span>
                </p>
                <p>
                  Card transaction fees: <span> $ {{ quote.otherFees.toFixed(2) }}</span>
                </p>
                <p>document</p>
              </div>
              <div class="text-right text-blue-600 mt-32">
                <p>
                  <a href="#" @click="openPDF">Generate Agreement PDF</a>
                </p>
                <p><a href="#" @click="openPDF">Generate Loan Agreement PDF</a></p>
              </div>
            </div>
            <div class="flex justify-between items-center text-gray-500">
              <div>
                <p class="text-lg text-black font-semibold">Pay In-Full</p>
                <p>Card transaction fees: <span>$ 180.55</span></p>
                <p>ACH transaction fees: <span>$ 0.00</span></p>
              </div>
              <!-- <div class="text-blue-600">
                <p><a href="#" @click="openPDF">Request loan terms</a></p>
              </div> -->
            </div>
          </div>

          <div class="bg-white p-6 border border-gray-300 rounded-md shadow">
            <h2 class="text-lg font-bold mb-4">Related Details</h2>

            <!-- Tabs -->
            <div class="flex space-x-4 border-b mb-4">
              <button
                :class="{
                  'text-blue-600 border-b-2 border-blue-600': activeTab === 'customer',
                  'text-gray-500': activeTab !== 'customer'
                }"
                class="py-2 px-4 font-semibold focus:outline-none"
                @click="switchTab('customer')"
              >
                Customer
              </button>
              <button
                :class="{
                  'text-blue-600 border-b-2 border-blue-600': activeTab === 'owner',
                  'text-gray-500': activeTab !== 'owner'
                }"
                class="py-2 px-4 font-semibold focus:outline-none"
                @click="switchTab('owner')"
              >
                Owner
              </button>
            </div>

            <!-- Customer Details -->
            <div v-if="activeTab === 'customer'">
              <div>
                <div class="my-4 flex justify-between">
                  <h3 class="font-sans">Customer Details</h3>
                  <button class="text-blue-600">Edit</button>
                </div>

                <p class="text-gray-500">
                  {{ agreementData[0].firstname }} {{ agreementData[0].lastname }}
                </p>
                <p class="text-gray-500">
                  {{ agreementData[0].Address }},{{ agreementData[0].city }},
                  {{ agreementData[0].state }}, {{ agreementData[0].zipcode }}
                </p>
                <p class="text-gray-500">{{ agreementData[0].email }}</p>
                <p class="text-gray-500">{{ agreementData[0].contact }}</p>
              </div>
            </div>

            <!-- Owner Details -->
            <div v-if="activeTab === 'owner'">
              <div>
                <div class="my-4 flex justify-between">
                  <h3 class="font-sans">Owner Details</h3>
                  <button class="text-blue-600">Edit</button>
                </div>
                <p class="text-gray-500">Narendra G Modi</p>
                <p class="text-gray-500">xidari5898@avashost.com</p>
              </div>
            </div>
          </div>
        </div>

        <!-- tab -->

        <div class="mb-6">
          <h1 class="my-4 font-sans text-2xl ml-4 font-semibold text-gray-800">Transaction</h1>
          <div class="flex space-x-4 border-b mb-4 ml-4">
            <button
              :class="{
                'text-blue-600 bg-blue-100 border-b-2 border-blue-600': activeTab2 === 'Customer2',
                'text-gray-500 hover:text-gray-700 hover:bg-gray-100': activeTab2 !== 'Customer2'
              }"
              class="py-2 px-4 font-semibold focus:outline-none rounded-t-md"
              @click="setActiveTab('Customer2')"
            >
              Customer
            </button>

            <button
              :class="{
                'text-blue-600 bg-blue-100 border-b-2 border-blue-600':
                  activeTab2 === 'LIC Insurance',
                'text-gray-500 hover:text-gray-700 hover:bg-gray-100':
                  activeTab2 !== 'LIC Insurance'
              }"
              class="py-2 px-4 font-semibold focus:outline-none rounded-t-md"
              @click="setActiveTab('LIC Insurance')"
            >
              LIC Insurance
            </button>

            <button
              :class="{
                'text-blue-600 bg-blue-100 border-b-2 border-blue-600':
                  activeTab2 === 'Carrier/Wholesaler',
                'text-gray-500 hover:text-gray-700 hover:bg-gray-100':
                  activeTab2 !== 'Carrier/Wholesaler'
              }"
              class="py-2 px-4 font-semibold focus:outline-none rounded-t-md"
              @click="setActiveTab('Carrier/Wholesaler')"
            >
              Carrier/Wholesaler
            </button>
          </div>
        </div>

        <!-- Customer Tab -->
        <div v-if="activeTab2 === 'Customer2'" class="shadow-md rounded-lg bg-white p-4">
          <div class="overflow-x-auto mt-4">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    TRANSACTION
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    PAYMENT
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    STATUS
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    DUE ON
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    PROCESSED ON
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    PAID ON
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    PAYMENT METHOD
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="quote in (agreementData[0] && agreementData[0].quotes) || []"
                  :key="quote.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ quote.policyNumber }} {{ quote.coverage }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $ {{ quote.totalCost.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Payment Due</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ new Date(quote.effectiveDate).toLocaleDateString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 pl-16 cursor-pointer"
                  >
                    <i class="mdi mdi-link-variant"></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- LIC Insurance Tab -->
        <div v-if="activeTab2 === 'LIC Insurance'" class="shadow-md rounded-lg bg-white p-4">
          <div class="overflow-x-auto mt-4">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    TRANSACTION
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    AMOUNT RECEIVED
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    STATUS
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    SENT ON
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    CLEARED ON
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    ACCOUNT
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr class="text-center text-gray-500">
                  <td colspan="6" class="px-6 py-4 whitespace-nowrap">No Data available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Carrier/Wholesaler Tab -->
        <div v-if="activeTab2 === 'Carrier/Wholesaler'" class="shadow-md rounded-lg bg-white p-4">
          <div class="overflow-x-auto mt-4">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    TRANSACTION
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    AMOUNT RECEIVED
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    STATUS
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    SENT ON
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    CLEARED ON
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    ACCOUNT
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr class="text-center text-gray-500">
                  <td colspan="6" class="px-6 py-4 whitespace-nowrap">No Data available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <h1 class="my-8 font-sans text-2xl ml-4 font-semibold text-gray-800">Policies</h1>
        <div class="overflow-x-auto mt-4 mb-8 bg-white shadow-md rounded-lg p-6">
          <table class="min-w-full divide-y divide-gray-300 rounded-t-md">
            <!-- Table Header -->
            <thead class="bg-gray-100">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Quote / Coverage
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Policy Number
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Gross Premium
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Carrier / Wholesaler
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Term
                </th>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="quote in (agreementData[0] && agreementData[0].quotes) || []"
                :key="quote.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ quote.quoteNumber }} {{ quote.coverage }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ quote.policyNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $ {{ quote.totalCost.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ quote.wholesaler }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ quote.effectiveDate.toLocaleDateString() }} -
                  {{ quote.expirationDate.toLocaleDateString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 class="my-4 text-2xl font-semibold text-gray-800">Communication</h1>
          <div class="text-center text-gray-500">
            <h2>No data available</h2>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.dropdown-menu {
  display: none;
  position: absolute;
  right: 0;
  z-index: 10;
}

.dropdown-menu.show {
  display: block;
}

.dropdown-btn:hover .dropdown-menu {
  display: block;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
