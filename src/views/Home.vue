<script setup lang="ts">
import { computed, ref } from 'vue'
import DropdownFilter from '../views/basic/dropdownFilter.vue'
import navbar from './navbar.vue'

const activeTab = ref('finance')
const currentPage = ref(1)
const rowsPerPage = ref(5)
const totalPages = computed(() => Math.ceil(tableData.value.length / rowsPerPage.value))
const totalPages2 = computed(() => Math.ceil(InvoiceData.value.length / rowsPerPage.value))

const handleSelect = (option: string) => {
  console.log('Selected:', option)
}

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  const end = start + rowsPerPage.value
  return tableData.value.slice(start, end)
})

const paginatedInvoice = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  const end = start + rowsPerPage.value
  return InvoiceData.value.slice(start, end)
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
const filterOptions = {
  producer: ['Goods', 'Matte'],
  status: ['Active', 'Inactive'],
  payment: ['Credit Card', 'Bank Transfer'],
  createdDate: ['All Dates', 'Last 30 days', 'Last 6 months', 'Last year', 'Custom'],
  purchasedDate: ['Last 30 days', 'Last 6 months', 'Last year']
}

const tableData = ref([
  {
    insured: 'Vardhan Jain',
    provider: 'American Empire Insurance Company',
    effectiveDate: 'Jul 25, 2024',
    grossPremium: '$12,300.00',
    status: 'Active',
    actions: '...'
  },
  {
    insured: 'Ujjwal Vinze',
    provider: 'American Empire Insurance Company',
    effectiveDate: 'Aug 30, 2001',
    grossPremium: '$30,300.00',
    status: 'Active',
    actions: '...'
  },
  {
    insured: 'Ankita Pandey',
    provider: 'American Empire Insurance Company',
    effectiveDate: 'Sep 9, 2002',
    grossPremium: '$90,310.00',
    status: 'Active',
    actions: '...'
  },
  {
    insured: 'Ankita Pandey',
    provider: 'American Empire Insurance Company',
    effectiveDate: 'Sep 9, 2002',
    grossPremium: '$90,310.00',
    status: 'Active',
    actions: '...'
  },
  {
    insured: 'Ankita Pandey',
    provider: 'American Empire Insurance Company',
    effectiveDate: 'Sep 9, 2002',
    grossPremium: '$90,310.00',
    status: 'Active',
    actions: '...'
  },
  {
    insured: 'Ankita Pandey',
    provider: 'American Empire Insurance Company',
    effectiveDate: 'Sep 9, 2002',
    grossPremium: '$90,310.00',
    status: 'Active',
    actions: '...'
  },
  {
    insured: 'Ankita Pandey',
    provider: 'American Empire Insurance Company',
    effectiveDate: 'Sep 9, 2002',
    grossPremium: '$90,310.00',
    status: 'Active',
    actions: '...'
  }
])

const InvoiceData = ref([
  {
    Customer: 'Vardhan Jain',
    Amount: '$12,300.00',
    Status: 'Paid',
    Memo: 'Test Memo',
    Due: 'Aug 30, 2001',
    Created: 'Agency'
  },
  {
    Customer: 'Vardhan Jain',
    Amount: '$12,300.00',
    Status: 'Paid',
    Memo: 'Test Memo',
    Due: 'Aug 30, 2001',
    Created: 'Agency'
  },
  {
    Customer: 'Vardhan Jain',
    Amount: '$12,300.00',
    Status: 'Paid',
    Memo: 'Test Memo',
    Due: 'Aug 30, 2001',
    Created: 'Agency'
  },
  {
    Customer: 'Vardhan Jain',
    Amount: '$12,300.00',
    Status: 'Paid',
    Memo: 'Test Memo',
    Due: 'Aug 30, 2001',
    Created: 'Agency'
  },
  {
    Customer: 'Vardhan Jain',
    Amount: '$12,300.00',
    Status: 'Paid',
    Memo: 'Test Memo',
    Due: 'Aug 30, 2001',
    Created: 'Agency'
  }
])
</script>
<template>
  <navbar />
  <v-container></v-container>
  <div class="p-16 bg-gray-100">
    <div class="flex gap-5 mb-5">
      <div class="bg-white rounded-lg shadow-md p-5 flex flex-col items-center text-center flex-1">
        <div class="w-10 h-10 mb-2">
          <img
            src="https://www.svgrepo.com/show/31480/notification-bell.svg"
            alt="Bell Icon"
            class="w-full h-full"
          />
        </div>
        <div>
          <p class="mb-1">Items need action</p>
          <p>0 Agreements</p>
        </div>
        <div class="mt-2 flex gap-2">
          <button class="bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600">Overdue</button>
          <button class="bg-yellow-500 text-white rounded px-3 py-1 hover:bg-yellow-600">
            Transfer Funds
          </button>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-5 flex flex-col items-center text-center flex-1">
        <div class="w-10 h-10 mb-2">
          <img
            src="https://www.pngfind.com/pngs/m/0-6127_png-file-quotes-icon-png-free-transparent-png.png"
            alt="Quotes Icon"
            class="w-full h-full"
          />
        </div>
        <div>
          <p class="mb-1">Incomplete Quotes</p>
          <p>0</p>
        </div>
        <button class="bg-yellow-500 text-white rounded px-3 py-1 hover:bg-yellow-600">
          Missing Policy Number
        </button>
      </div>
      <div class="bg-white rounded-lg shadow-md p-5 flex flex-col items-center text-center flex-1">
        <div class="w-10 h-10 mb-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/70/70535.png"
            alt="Premium Icon"
            class="w-full h-full"
          />
        </div>
        <div>
          <p class="mb-1">Unsold Premium</p>
          <p>$0.00</p>
        </div>
        <button class="bg-teal-500 text-white rounded px-3 py-1 hover:bg-teal-600">
          Payment Due
        </button>
      </div>
      <div class="bg-white rounded-lg shadow-md p-5 flex flex-col items-center text-center flex-1">
        <div class="w-10 h-10 mb-2">
          <img
            src="https://cdn-icons-png.freepik.com/256/389/389801.png"
            alt="Sold Icon"
            class="w-full h-full"
          />
        </div>
        <div>
          <p class="mb-1">Total premium sold</p>
          <p>$0.00</p>
        </div>
        <button class="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600">
          View Report
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-5">
      <div class="flex gap-5 mb-4">
        <button
          @click="activeTab = 'finance'"
          :class="[
            'py-2 px-4 font-semibold',
            activeTab === 'finance'
              ? 'border-b-2 border-teal-500 text-teal-500'
              : 'text-gray-600 hover:border-b-2 hover:border-gray-300'
          ]"
        >
          Finance Agreements
        </button>
        <button
          @click="activeTab = 'invoices'"
          :class="[
            'py-2 px-4 font-semibold',
            activeTab === 'invoices'
              ? 'border-b-2 border-teal-500 text-teal-500'
              : 'text-gray-600 hover:border-b-2 hover:border-gray-300'
          ]"
        >
          Invoices
        </button>
        <button
          @click="activeTab = 'subscriptions'"
          :class="[
            'py-2 px-4 font-semibold',
            activeTab === 'subscriptions'
              ? 'border-b-2 border-teal-500 text-teal-500'
              : 'text-gray-600 hover:border-b-2 hover:border-gray-300'
          ]"
        >
          Subscriptions
        </button>
      </div>

      <div v-if="activeTab === 'finance'" class="mb-5">
        <div class="flex flex-wrap gap-2 mb-4">
          <h3 class="text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300 focus:outline-none">
            Filter
          </h3>
          <DropdownFilter
            label="Producer"
            :options="filterOptions.producer"
            @select="handleSelect"
          />
          <DropdownFilter
            label="Agreement Status"
            :options="filterOptions.status"
            @select="handleSelect"
          />
          <DropdownFilter
            label="Payment Option"
            :options="filterOptions.payment"
            @select="handleSelect"
          />
          <DropdownFilter
            label="Created Date"
            :options="filterOptions.createdDate"
            @select="handleSelect"
          />
          <DropdownFilter
            label="Purchased Date"
            :options="filterOptions.purchasedDate"
            @select="handleSelect"
          />
        </div>
      </div>

      <div v-if="activeTab === 'finance'">
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
              <tr class="bg-black text-white">
                <th class="p-2 border-b border-gray-200 text-left">INSURED</th>
                <th class="p-2 border-b border-gray-200 text-left">PROVIDER</th>
                <th class="p-2 border-b border-gray-200 text-left">EFFECTIVE DATE</th>
                <th class="p-2 border-b border-gray-200 text-left">GROSS PREMIUM</th>
                <th class="p-2 border-b border-gray-200 text-left">STATUS</th>
                <th class="p-2 border-b border-gray-200"></th>
                <th class="p-2 border-b border-gray-200"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in paginatedData" :key="index">
                <td class="p-2 border-b border-gray-200">{{ row.insured }}</td>
                <td class="p-2 border-b border-gray-200">{{ row.provider }}</td>
                <td class="p-2 border-b border-gray-200">{{ row.effectiveDate }}</td>
                <td class="p-2 border-b border-gray-200">{{ row.grossPremium }}</td>
                <td class="p-2 border-b border-gray-200">
                  <span class="bg-green-500 text-white py-1 px-3 rounded">{{ row.status }}</span>
                </td>
                <td>
                  <span class="mdi mdi-chevron-down cursor-pointer"></span>
                </td>
                <td class="p-2 border-b border-gray-200">
                  <button class="text-gray-500 hover:text-gray-700">...</button>
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
              aria-label="Previous page"
              :disabled="currentPage === 1"
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

      <div v-if="activeTab === 'invoices'" class="mb-5">
        <div class="flex flex-wrap gap-2 mb-4">
          <h3 class="text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300 focus:outline-none">
            Filter
          </h3>
          <DropdownFilter
            label="Status"
            :options="['Pending', 'processing', 'Paid', 'Overdue']"
            @select="handleSelect"
          />
        </div>
      </div>

      <div v-if="activeTab === 'invoices'">
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
              <tr class="bg-black text-white">
                <th class="p-2 border-b border-gray-200 text-left">CUSTOMER</th>
                <th class="p-2 border-b border-gray-200 text-left">AMOUNT</th>
                <th class="p-2 border-b border-gray-200 text-left">STATUS</th>
                <th class="p-2 border-b border-gray-200 text-left">DUE</th>
                <th class="p-2 border-b border-gray-200 text-left">MEMO</th>
                <th class="p-2 border-b border-gray-200 text-left">CREATED BY</th>
                <th class="p-2 border-b border-gray-200"></th>
                <th class="p-2 border-b border-gray-200"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in paginatedInvoice" :key="index">
                <td class="p-2 border-b border-gray-200">{{ row.Customer }}</td>
                <td class="p-2 border-b border-gray-200">{{ row.Amount }}</td>
                <td class="p-2 border-b border-gray-200">
                  <span class="bg-blue-300 text-black py-1 px-3 rounded"> {{ row.Status }}</span>
                </td>
                <td class="p-2 border-b border-gray-200">{{ row.Due }}</td>
                <td class="p-2 border-b border-gray-200">{{ row.Memo }}</td>
                <td class="p-2 border-b border-gray-200">
                  <span class="bg-green-500 text-white py-1 px-3 rounded"> {{ row.Created }}</span>
                </td>
                <td class="p-2 border-b border-gray-200">
                  <button class="bg-gray-200 text-black py-1 px-3 rounded">
                    <span class="mdi mdi-link-variant"></span>
                  </button>
                </td>
                <td class="p-2 border-b border-gray-200">
                  <button class="bg-gray-200 text-black py-1 px-3 rounded">
                    <span class="mdi mdi-pencil"></span>
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
              Math.min(currentPage * rowsPerPage, InvoiceData.length)
            }}
            of {{ InvoiceData.length }}</span
          >
          <div class="flex items-center gap-1">
            <button
              @click="goToPreviousPage"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
              aria-label="Previous page"
              :disabled="currentPage === 1"
            >
              &lt;
            </button>
            <button
              @click="goToNextPage"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
              aria-label="Next page"
              :disabled="currentPage === totalPages2"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'subscriptions'" class="mb-5">
        <div class="flex flex-wrap gap-2 mb-4">
          <h3 class="text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300 focus:outline-none">
            Filter
          </h3>
          <DropdownFilter
            label="Status"
            :options="['Active', 'processing', 'Canceled', 'Completed', 'Overdue']"
            @select="handleSelect"
          />
        </div>
      </div>

      <div v-if="activeTab === 'subscriptions'">
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
              <tr class="bg-black text-white">
                <th class="p-2 border-b border-gray-200 text-left">CUSTOMER</th>
                <th class="p-2 border-b border-gray-200 text-left">STATUS</th>
                <th class="p-2 border-b border-gray-200 text-left">TOTAL AMOUNT</th>
                <th class="p-2 border-b border-gray-200 text-left">PAYMENT MADE</th>
                <th class="p-2 border-b border-gray-200 text-left">NEXT DUE</th>
                <th class="p-2 border-b border-gray-200"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in InvoiceData" :key="index">
                <td class="p-2 border-b border-gray-200">{{ row.Customer }}</td>
                <td class="p-2 border-b border-gray-200">
                  <span class="bg-blue-300 text-black py-1 px-3 rounded"> {{ row.Status }}</span>
                </td>
                <td class="p-2 border-b border-gray-200">{{ row.Amount }}</td>
                <td class="p-2 border-b border-gray-200">{{ row.Memo }}</td>
                <td class="p-2 border-b border-gray-200">{{ row.Due }}</td>
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
              Math.min(currentPage * rowsPerPage, InvoiceData.length)
            }}
            of {{ InvoiceData.length }}</span
          >
          <div class="flex items-center gap-1">
            <button
              @click="goToPreviousPage"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
              aria-label="Previous page"
              :disabled="currentPage === 1"
            >
              &lt;
            </button>
            <button
              @click="goToNextPage"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
              :disabled="currentPage === totalPages2"
              aria-label="Next page"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
