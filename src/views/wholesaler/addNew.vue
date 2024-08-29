<script setup lang="ts">
import Navbar from '../navbar.vue'
import { ref, computed } from 'vue'

type ItemType = 'wholesaler' | 'carrier'

interface Item {
  name: string
  type: ItemType
}

const items = ref<Item[]>([
  { name: '13643 St A', type: 'wholesaler' },
  { name: '21st Century Insurance Company', type: 'wholesaler' },
  { name: '5Star CRC', type: 'wholesaler' },
  { name: 'Carrier A', type: 'carrier' }
])

const data = ref({
  selectedItem: ''
})

const isAutocompleteComplete = computed(() => !!data.value.selectedItem)

const getSelectedItem = computed(() => {
  return items.value.find((item) => item.name === data.value.selectedItem)
})

const getSelectedItemName = computed(() => getSelectedItem.value?.name || '')
const getSelectedItemAddress = computed(() => {
  const selected = getSelectedItem.value
  return selected ? `Address for ${selected.name}` : ''
})
const getSelectedItemType = computed(() => {
  const selected = getSelectedItem.value
  return selected ? selected.type.charAt(0).toUpperCase() + selected.type.slice(1) : ''
})
</script>

<template>
  <v-app>
    <Navbar />
    <v-main>
      <v-container class="py-6">
        <v-row class="align-center mb-4">
          <v-col cols="auto">
            <v-btn icon @click="$router.go(-1)">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <h1 class="text-h4 font-weight-bold">Add New</h1>
          </v-col>
        </v-row>
        <v-row class="mb-4">
          <v-col cols="12" sm="12">
            <div class="relative">
              <v-card flat class="pa-4">
                <v-autocomplete
                  v-model="data.selectedItem"
                  clearable
                  label="Create"
                  :items="items.map((item) => item.name)"
                  variant="outlined"
                ></v-autocomplete>
              </v-card>

              <div
                v-if="isAutocompleteComplete"
                class="w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6 cursor-pointer"
              >
                <h1 class="text-xl font-semibold text-gray-800">{{ getSelectedItemName }}</h1>
                <p class="text-gray-600 mt-2">{{ getSelectedItemAddress }}</p>
                <span
                  class="inline-block bg-blue-100 text-blue-800 text-sm font-medium mt-4 px-4 py-2 rounded cursor-pointer hover:bg-blue-200"
                >
                  {{ getSelectedItemType }}
                </span>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
