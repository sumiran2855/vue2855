<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Navbar from '../navbar.vue'

const Add1 = ref({
  firstname: '',
  lastname: '',
  email: '',
  contact: '',
  Address: '',
  city: '',
  state: '',
  Zip: ''
})

const Add2 = ref<
  Array<{
    Buisness: string
    Address: string
    Address2: string
    city: string
    state: string
    Zip: string
  }>
>([
  {
    Buisness: '',
    Address: '',
    Address2: '',
    city: '',
    state: '',
    Zip: ''
  }
])

const isAutocompleteComplete = ref(false)

watch(
  () => Add1.value.email,
  (newValue) => {
    isAutocompleteComplete.value = !!newValue
  }
)

const customerType = ref<string | null>(null)
const showBusinessForm = computed(() => customerType.value === 'commercial')

const addNewBusiness = () => {
  Add2.value.push({
    Buisness: '',
    Address: '',
    Address2: '',
    city: '',
    state: '',
    Zip: ''
  })
}

const removeBusiness = (index: number) => {
  if (Add2.value.length > 1) {
    Add2.value.splice(index, 1)
  }
}

const files = ref<Array<File | null>>([null])
const quotes = ref<
  Array<{
    quoteNumber: string
    policyNumber: string
    carrierCompany: string
    wholesaler: string
    coverage: string
    effectiveDate: Date | null
    expirationDate: Date | null
    minDaysToCancel: number
    minEarnedRate: number
    premium: number
    taxes: number
    otherFees: number
    brokerFee: number
    policyFee: number
    commission:number
    AgencyFess:number

  }>
>([
  {
    quoteNumber: '',
    policyNumber: '',
    carrierCompany: '',
    wholesaler: '',
    coverage: '',
    effectiveDate: null,
    expirationDate: null,
    minDaysToCancel: 0,
    minEarnedRate: 0,
    premium: 0,
    taxes: 0,
    otherFees: 0,
    brokerFee: 0,
    policyFee: 0,
    commission:0,
    AgencyFess:0
  }
])

const addNewFile = () => {
  files.value.push(null)
  quotes.value.push({
    quoteNumber: '',
    policyNumber: '',
    carrierCompany: '',
    wholesaler: '',
    coverage: '',
    effectiveDate: null,
    expirationDate: null,
    minDaysToCancel: 0,
    minEarnedRate: 0,
    premium: 0,
    taxes: 0,
    otherFees: 0,
    brokerFee: 0,
    policyFee: 0,
    commission:0,
    AgencyFess:0
  })
}

const removeFile = (index: number) => {
  if (files.value.length > 1) {
    files.value.splice(index, 1)
    quotes.value.splice(index, 1)
  }
}
</script>

<template>
  <v-app>
    <Navbar />
    <v-container class="pt-16 pb-6 px-16" max-width="60px">
      <v-stepper :items="['Step 1', 'Step 2', 'Step 3']" class="mt-4">
        <template v-slot:item.1>
          <v-card flat class="pa-4">
            <v-autocomplete
              v-model="Add1.email"
              clearable
              chips
              label="Create"
              :items="['sumiran.b@cisinlabs.com']"
              variant="outlined"
            ></v-autocomplete>
          </v-card>

          <div v-if="isAutocompleteComplete">
            <h3>Fill Personal details</h3>
            <v-row class="mt-4">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="Add1.firstname"
                  :counter="10"
                  label="First name"
                  hide-details
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="Add1.lastname"
                  :counter="10"
                  label="Last name"
                  hide-details
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="Add1.Address"
                  :counter="10"
                  label="Address"
                  hide-details
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="Add1.city"
                  :counter="10"
                  label="City"
                  hide-details
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="Add1.state"
                  :counter="10"
                  label="State"
                  hide-details
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="Add1.Zip"
                  :counter="10"
                  label="ZipCode"
                  hide-details
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="Add1.contact"
                  :counter="10"
                  label="Contact"
                  hide-details
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-radio-group v-model="customerType" inline>
                <v-col cols="12" md="6">
                  <v-radio label="Personal Customer" value="personal"></v-radio>
                </v-col>
                <v-col cols="12" md="6">
                  <v-radio label="Commercial Customer" value="commercial"></v-radio>
                </v-col>
              </v-radio-group>
            </v-row>

            
            <div v-if="showBusinessForm" v-for="(business, index) in Add2" :key="index">
              <h3 class="my-4 font-semibold">Business Form {{ index + 1 }}</h3>
              <div>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="business.Buisness"
                      :counter="10"
                      label="Business Name"
                      hide-details
                      required
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="business.Address"
                      :counter="10"
                      label="Lane Address"
                      hide-details
                      required
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="business.Address2"
                      :counter="10"
                      label="Lane Address2"
                      hide-details
                      required
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="business.city"
                      :counter="10"
                      label="City"
                      hide-details
                      required
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="business.state"
                      :counter="10"
                      label="State"
                      hide-details
                      required
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="business.Zip"
                      :counter="10"
                      label="Zipcode"
                      hide-details
                      required
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="mt-4">
                  <v-col class="d-flex justify-between align-center">
                    <v-btn @click="addNewBusiness" color="primary" class="mr-2">
                      <v-icon>mdi-plus</v-icon>
                      Add New
                    </v-btn>
                    <v-btn @click="removeBusiness(index)" color="red">
                      <v-icon>mdi-delete</v-icon>
                      Remove
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </div>

            <v-row>
              <v-col cols="12" md="6">
                <h3 class="font-semibold">Would you like to add document/ Agreement</h3>
                <h3 class="my-2">
                  Person That will act on behalf of the customer or business and be listed as the
                  Signee
                </h3>
                <v-radio-group inline>
                  <v-radio label="Yes" value="Yes"></v-radio>
                  <v-radio label="No" value="No"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </div>
        </template>

        <template v-slot:item.2>
          <div>
            <v-row>
              <v-col v-for="(file, index) in files" :key="index" cols="12">
                <v-card class="pa-4 mb-4" outlined>
                  <v-file-input
                    v-model="files[index]"
                    label="File input"
                    class="mb-4"
                  ></v-file-input>

                  <div v-if="files[index]">
                    <h3 class="my-4 font-semibold">Quote {{ index + 1 }}</h3>

                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="quotes[index].quoteNumber"
                          label="Quote Number"
                          variant="outlined"
                        ></v-text-field></v-col
                      ><v-col cols="12" md="6">
                        <v-text-field
                          v-model="quotes[index].policyNumber"
                          label="Policy Number"
                          variant="outlined"
                        ></v-text-field></v-col
                    ></v-row>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="quotes[index].carrierCompany"
                          label="Carrier Company"
                          variant="outlined"
                          class="mb-4"
                        ></v-text-field></v-col
                      ><v-col cols="12" md="6">
                        <v-text-field
                          v-model="quotes[index].wholesaler"
                          label="Wholesaler"
                          variant="outlined"
                          class="mb-4"
                        ></v-text-field></v-col
                    ></v-row>
                    <v-text-field
                      v-model="quotes[index].coverage"
                      label="Coverage"
                      variant="outlined"
                      class="mb-4"
                    ></v-text-field>
                    <v-row
                      ><v-col cols="12" md="6">
                        <v-text-field
                          v-model="quotes[index].effectiveDate"
                          label="Effective Date"
                          type="date"
                          variant="outlined"
                          class="mb-4"
                        ></v-text-field></v-col
                      ><v-col cols="12" md="6">
                        <v-text-field
                          v-model="quotes[index].expirationDate"
                          label="Expiration Date"
                          type="date"
                          variant="outlined"
                          class="mb-4"
                        ></v-text-field></v-col
                    ></v-row>
                    <h3 class="my-5 font-semibold">Provided by carrier</h3>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="quotes[index].minDaysToCancel"
                          label="Minimum Days to Cancel"
                          prefix="$"
                          variant="outlined"
                          class="mb-4"
                        ></v-text-field
                      ></v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="quotes[index].minEarnedRate"
                          label="Minimum Earned Rate"
                          prefix="%"
                          variant="outlined"
                          class="mb-4"
                        ></v-text-field></v-col
                    ></v-row>
                    <h3 class="my-5 font-semibold">Financeable</h3>
                    <v-row
                      ><v-col cols="12" md="6">
                        <v-text-field
                          v-model="quotes[index].premium"
                          label="Premium"
                          prefix="$"
                          variant="outlined"
                          class="mb-4"
                        ></v-text-field></v-col
                      ><v-col cols="12" md="6">
                        <v-text-field
                          v-model="quotes[index].taxes"
                          label="Taxes"
                          prefix="$"
                          variant="outlined"
                          class="mb-4"
                        ></v-text-field></v-col
                    ></v-row>
                    <h3 class="my-5 font-semibold">Non Financeable</h3>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="quotes[index].otherFees"
                          label="Other Fees"
                          prefix="$"
                          variant="outlined"
                          class="mb-4"
                        ></v-text-field
                      ></v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="quotes[index].brokerFee"
                          label="Broker Fee"
                          prefix="$"
                          variant="outlined"
                          class="mb-4"
                        ></v-text-field
                      ></v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="quotes[index].policyFee"
                          label="Policy Fee"
                          prefix="$"
                          variant="outlined"
                          class="mb-4"
                        ></v-text-field></v-col
                    ></v-row>

                    <h3 class="my-5 font-semibold">Payment distribution</h3>
                    <v-row
                      ><v-col cols="12" md="6">
                        <v-text-field
                          v-model="quotes[index].commission"
                          label="commission"
                          prefix="%"
                          variant="outlined"
                          class="mb-4"
                        ></v-text-field></v-col
                      ><v-col cols="12" md="6">
                        <v-text-field
                          v-model="quotes[index].AgencyFess"
                          label="AgencyFess"
                          prefix="$"
                          variant="outlined"
                          class="mb-4"
                        ></v-text-field></v-col
                    ></v-row>
                  </div>

                  <v-row class="mt-4">
                    <v-col class="d-flex justify-between align-center">
                      <v-btn @click="addNewFile" color="primary" class="mr-2">
                        <v-icon>mdi-plus</v-icon>
                        Add New
                      </v-btn>
                      <v-btn @click="() => removeFile(index)" color="red">
                        <v-icon>mdi-delete</v-icon>
                        Remove
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </template>

        <template v-slot:item.3>
          <v-card title="Step Three" flat class="pa-4"> </v-card>
        </template>
      </v-stepper>
    </v-container>
  </v-app>
</template>

<style scoped></style>


