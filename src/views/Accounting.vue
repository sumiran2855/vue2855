<script setup lang="ts">
import { computed, ref } from 'vue'
import DropdownFilter from '../views/basic/dropdownFilter.vue'
import navbar from '../views/navbar.vue'
const activeTab = ref('Pending Approval')

const handleSelect = (option: string) => {
  console.log('Selected:', option)
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
    insured: 'Vardhan Jain',
    provider: 'American Empire Insurance Company',
    effectiveDate: 'Jul 25, 2024',
    grossPremium: '$12,300.00',
    status: 'Active',
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
</script>

<template>
  <v-app>
    <navbar />
    <v-main>
      <v-container></v-container>
      <v-row class="align-center mb-4 pl-14">
        <v-col cols="auto">
          <v-btn icon @click="$router.go(-1)">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <h1 class="text-h4 font-weight-bold">Accounting</h1>
        </v-col>
      </v-row>
      <div class="p-16 bg-gray-100">
        <div class="bg-white rounded-lg shadow-md p-5">
          <div class="flex gap-5 mb-4">
            <button
              @click="activeTab = 'Pending Approval'"
              :class="[
                'py-2 px-4 font-semibold',
                activeTab === 'Pending Approval'
                  ? 'border-b-2 border-teal-500 text-teal-500'
                  : 'text-gray-600 hover:border-b-2 hover:border-gray-300'
              ]"
            >
              Pending Approval
            </button>
            <button
              @click="activeTab = 'Balance'"
              :class="[
                'py-2 px-4 font-semibold',
                activeTab === 'Balance'
                  ? 'border-b-2 border-teal-500 text-teal-500'
                  : 'text-gray-600 hover:border-b-2 hover:border-gray-300'
              ]"
            >
              Balance
            </button>
            <button
              @click="activeTab = 'Payables'"
              :class="[
                'py-2 px-4 font-semibold',
                activeTab === 'Payables'
                  ? 'border-b-2 border-teal-500 text-teal-500'
                  : 'text-gray-600 hover:border-b-2 hover:border-gray-300'
              ]"
            >
              Payables
            </button>
            <button
              @click="activeTab = 'Receivables'"
              :class="[
                'py-2 px-4 font-semibold',
                activeTab === 'Receivables'
                  ? 'border-b-2 border-teal-500 text-teal-500'
                  : 'text-gray-600 hover:border-b-2 hover:border-gray-300'
              ]"
            >
              Receivables
            </button>
            <button
              @click="activeTab = 'Incoming Payment'"
              :class="[
                'py-2 px-4 font-semibold',
                activeTab === 'Incoming Payment'
                  ? 'border-b-2 border-teal-500 text-teal-500'
                  : 'text-gray-600 hover:border-b-2 hover:border-gray-300'
              ]"
            >
              Incoming Payment
            </button>
            <button
              @click="activeTab = 'Payment Disputes'"
              :class="[
                'py-2 px-4 font-semibold',
                activeTab === 'Payment Disputes'
                  ? 'border-b-2 border-teal-500 text-teal-500'
                  : 'text-gray-600 hover:border-b-2 hover:border-gray-300'
              ]"
            >
              Payment Disputes
            </button>
          </div>

          <div v-if="activeTab === 'Pending Approval'">
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
                      <span class="bg-green-500 text-white py-1 px-3 rounded">
                        {{ row.status }}</span
                      >
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

          <div v-if="activeTab === 'Balance'" class="mb-5">
            <div class="flex flex-wrap gap-2 mb-4">
              <h3 class="text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300 focus:outline-none">
                Filter
              </h3>
              <DropdownFilter
                label="Organisation"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Producer"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Agreement Status"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Payment Option"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Created Date"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Purchased Date"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
            </div>
          </div>

          <div v-if="activeTab === 'Balance'">
            <div class="overflow-x-auto text-center py-4">
              <h1 class="text-2xl">There are no balance to approve</h1>
              <h3>Any balance that are pending</h3>
              <h3>approval will appear here.</h3>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-b-lg">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-700">Rows per page:</span>
                <select
                  class="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
              <span class="text-sm text-gray-700">1-3 of 3</span>
              <div class="flex items-center gap-1">
                <button
                  class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
                  aria-label="Previous page"
                >
                  &lt;
                </button>
                <button
                  class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
                  aria-label="Next page"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'Payables'" class="mb-5">
            <div class="flex flex-wrap gap-2 mb-4">
              <h3 class="text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300 focus:outline-none">
                Filter
              </h3>
              <DropdownFilter
                label="Organisation"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Producer"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Agreement Status"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Payment Option"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Created Date"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Purchased Date"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
            </div>
          </div>

          <div v-if="activeTab === 'Payables'">
            <div class="overflow-x-auto text-center py-4">
              <h1 class="text-2xl">There are no balance to approve</h1>
              <h3>Any balance that are pending</h3>
              <h3>approval will appear here.</h3>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-b-lg">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-700">Rows per page:</span>
                <select
                  class="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
              <span class="text-sm text-gray-700">1-3 of 3</span>
              <div class="flex items-center gap-1">
                <button
                  class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
                  aria-label="Previous page"
                >
                  &lt;
                </button>
                <button
                  class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
                  aria-label="Next page"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'Receivables'" class="mb-5">
            <div class="flex flex-wrap gap-2 mb-4">
              <h3 class="text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300 focus:outline-none">
                Filter
              </h3>
              <DropdownFilter
                label="Organisation"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Producer"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Agreement Status"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Payment Option"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Created Date"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Purchased Date"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
            </div>
          </div>

          <div v-if="activeTab === 'Receivables'">
            <div class="overflow-x-auto text-center py-4">
              <h1 class="text-2xl">There are no balance to approve</h1>
              <h3>Any balance that are pending</h3>
              <h3>approval will appear here.</h3>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-b-lg">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-700">Rows per page:</span>
                <select
                  class="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
              <span class="text-sm text-gray-700">1-3 of 3</span>
              <div class="flex items-center gap-1">
                <button
                  class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
                  aria-label="Previous page"
                >
                  &lt;
                </button>
                <button
                  class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
                  aria-label="Next page"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'Incoming Payment'" class="mb-5">
            <div class="flex flex-wrap gap-2 mb-4">
              <h3 class="text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300 focus:outline-none">
                Filter
              </h3>
              <DropdownFilter
                label="Organisation"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Producer"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Agreement Status"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Payment Option"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Created Date"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Purchased Date"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
            </div>
          </div>

          <div v-if="activeTab === 'Incoming Payment'">
            <div class="overflow-x-auto text-center py-4">
              <h1 class="text-2xl">There are no balance to approve</h1>
              <h3>Any balance that are pending</h3>
              <h3>approval will appear here.</h3>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-b-lg">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-700">Rows per page:</span>
                <select
                  class="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
              <span class="text-sm text-gray-700">1-3 of 3</span>
              <div class="flex items-center gap-1">
                <button
                  class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
                  aria-label="Previous page"
                >
                  &lt;
                </button>
                <button
                  class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
                  aria-label="Next page"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'Payment Disputes'" class="mb-5">
            <div class="flex flex-wrap gap-2 mb-4">
              <h3 class="text-gray-700 rounded-md px-4 py-2 hover:bg-gray-300 focus:outline-none">
                Filter
              </h3>
              <DropdownFilter
                label="Organisation"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Producer"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Agreement Status"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Payment Option"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Created Date"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
              <DropdownFilter
                label="Purchased Date"
                :options="['Pending', 'processing', 'Paid', 'Overdue']"
                @select="handleSelect"
              />
            </div>
          </div>

          <div v-if="activeTab === 'Payment Disputes'">
            <div class="overflow-x-auto text-center py-4">
              <h1 class="text-2xl">There are no balance to approve</h1>
              <h3>Any balance that are pending</h3>
              <h3>approval will appear here.</h3>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-b-lg">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-700">Rows per page:</span>
                <select
                  class="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
              <span class="text-sm text-gray-700">1-3 of 3</span>
              <div class="flex items-center gap-1">
                <button
                  class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
                  aria-label="Previous page"
                >
                  &lt;
                </button>
                <button
                  class="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors duration-150 ease-in-out"
                  aria-label="Next page"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>
