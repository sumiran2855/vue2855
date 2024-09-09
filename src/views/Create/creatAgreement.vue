<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Navbar from '../navbar.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { fetchAgreement } from '../../components/agreementService'
import { title } from 'process'

const isAutocompleteComplete = ref(false)
const router = useRouter()
const customerType = ref<string | null>(null)
const showBusinessForm = computed(() => customerType.value === 'commercial')
const radioSelection = ref('No')
const showDelegateForm = computed(() => radioSelection.value === 'Yes')
const files = ref<Array<File | null>>([null])
const currentStep = ref(0)
const agreementData = ref<Agreement[]>([])

const emails = ref([{ title: '' }])
const handleChange = (newValue) => {
  if (typeof newValue === 'string') {
    const existingEmail = emails.value.find((email) => email.title === newValue)
    if (!existingEmail) {
      emails.value.push({ title: newValue })
      isAutocompleteComplete.value = false
    } else {
      isAutocompleteComplete.value = false
    }
    Add1.value.email = newValue
  }
}

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

const Add1 = ref({
  firstname: '',
  lastname: '',
  email: '',
  contact: '',
  selectedCountryCode: '+91',
  selectedCountryCode2: '+91',
  Address: '',
  city: '',
  state: '',
  zipcode: '',
  delegateEmail: '',
  delegateFirstname: '',
  delegateLastname: '',
  delegateContact: ''
})

const Add2 = ref<
  Array<{
    Buisness: string
    Address: string
    Address2?: string
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
    commission: number
    AgencyFess: number
    totalCost: number
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
    commission: 0,
    AgencyFess: 0,
    totalCost: 0
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
    commission: 0,
    AgencyFess: 0,
    totalCost: 0
  })
}

const removeBusiness = (index: number) => {
  if (Add2.value.length > 1) {
    Add2.value.splice(index, 1)
  }
}

const redirectToLogin = () => {
  router.push('/login')
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

watch(
  () => Add1.value.email,
  (newValue) => {
    if (emailRegex.test(newValue)) {
      isAutocompleteComplete.value = !!newValue
    } else {
      isAutocompleteComplete.value = false
    }
  }
)

const contactError = ref('')

watch(
  () => Add1.value.contact,
  (newValue) => {
    if (newValue.length !== 10) {
      contactError.value = 'Contact must be a 10-digit number'
    } else {
      contactError.value = ''
    }
  }
)

const handleEnter = () => {
  if (emailRegex.test(Add1.value.email)) {
    isAutocompleteComplete.value = !!Add1.value.email
  }
}

const validateFile = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file && file.type !== 'application/pdf') {
    alert('Only PDF files are allowed!')
    files.value[index] = null
  }
}

const removeFile = (index: number) => {
  if (files.value.length > 1) {
    files.value.splice(index, 1)
    quotes.value.splice(index, 1)
  }
}

const validateStep1 = () => {
  const baseValid =
    Add1.value.firstname &&
    Add1.value.lastname &&
    Add1.value.email &&
    Add1.value.Address &&
    Add1.value.city &&
    Add1.value.state &&
    Add1.value.zipcode &&
    Add1.value.contact

  const commercialValid =
    customerType.value !== 'commercial' ||
    Add2.value.every(
      (business) =>
        business.Buisness &&
        business.Address &&
        business.Address2 &&
        business.city &&
        business.state &&
        business.Zip
    )

  return baseValid && commercialValid
}

const validateStep2 = () => {
  return files.value.every(
    (file, index) =>
      file &&
      quotes.value[index].quoteNumber &&
      quotes.value[index].policyNumber &&
      quotes.value[index].carrierCompany &&
      quotes.value[index].wholesaler &&
      quotes.value[index].coverage &&
      quotes.value[index].effectiveDate &&
      quotes.value[index].expirationDate &&
      quotes.value[index].minDaysToCancel >= 0 &&
      quotes.value[index].minEarnedRate >= 0 &&
      quotes.value[index].premium >= 0 &&
      quotes.value[index].taxes >= 0 &&
      quotes.value[index].otherFees >= 0 &&
      quotes.value[index].brokerFee >= 0 &&
      quotes.value[index].policyFee >= 0 &&
      quotes.value[index].commission >= 0 &&
      quotes.value[index].AgencyFess >= 0
  )
}

const handleStepChange = (newStep: number) => {
  if (newStep > currentStep.value) {
    if (currentStep.value === 0 && !validateStep1()) {
      alert('Please fill out all required fields in Step 1.')
      return
    }
    if (currentStep.value === 2 && !validateStep2()) {
      alert('Please complete all required fields in Step 2.')
      return
    }
  }

  currentStep.value = newStep
}

const totalCostsPerQuote = computed(() => {
  return quotes.value.map((quote) => {
    const premium = Number(quote.premium) || 0
    const taxes = Number(quote.taxes) || 0
    const otherFees = Number(quote.otherFees) || 0
    const brokerFee = Number(quote.brokerFee) || 0
    const policyFee = Number(quote.policyFee) || 0
    const commissionRate = Number(quote.minEarnedRate) || 0
    const commission = premium * (commissionRate / 100)
    const AgencyFess = Number(quote.AgencyFess) || 0

    const totalCost = premium + taxes + otherFees + brokerFee + policyFee + commission + AgencyFess

    console.log(`Calculated total cost for quote ${quote.quoteNumber}:`, totalCost)

    return totalCost
  })
})

// const submitData = async () => {
//   try {
//     const token = localStorage.getItem('access_token')
//     if (!token) {
//       redirectToLogin()
//       return
//     }
//     const decodedToken = jwtDecode(token)
//     const userId = decodedToken.sub

//     const quotesWithTotalCost = quotes.value.map((quote) => {
//       const premium = !isNaN(Number(quote.premium)) ? Number(quote.premium) : 0
//       const taxes = !isNaN(Number(quote.taxes)) ? Number(quote.taxes) : 0
//       const otherFees = !isNaN(Number(quote.otherFees)) ? Number(quote.otherFees) : 0
//       const brokerFee = !isNaN(Number(quote.brokerFee)) ? Number(quote.brokerFee) : 0
//       const policyFee = !isNaN(Number(quote.policyFee)) ? Number(quote.policyFee) : 0
//       const commissionRate = !isNaN(Number(quote.minEarnedRate)) ? Number(quote.minEarnedRate) : 0
//       const commission = premium * (commissionRate / 100)
//       const agencyFees = !isNaN(Number(quote.AgencyFess)) ? Number(quote.AgencyFess) : 0

//       const totalCost =
//         premium + taxes + otherFees + brokerFee + policyFee + commission + agencyFees

//       console.log(`Calculated total cost for quote ${quote.quoteNumber}:`, totalCost)

//       return {
//         ...quote,
//         effectiveDate: quote.effectiveDate ? new Date(quote.effectiveDate).toISOString() : null,
//         expirationDate: quote.expirationDate ? new Date(quote.expirationDate).toISOString() : null,
//         totalCost
//       }
//     })

//     const requestPayload = {
//       firstname: Add1.value.firstname,
//       lastname: Add1.value.lastname,
//       email: Add1.value.email,
//       contact: Add1.value.contact,
//       Address: Add1.value.Address,
//       city: Add1.value.city,
//       state: Add1.value.state,
//       zipcode: Add1.value.zipcode,
//       delegateEmail: Add1.value.delegateEmail,
//       delegateFirstname: Add1.value.delegateFirstname,
//       delegateLastname: Add1.value.delegateLastname,
//       delegateContact: Add1.value.delegateContact,
//       customerType: customerType.value,
//       businesses: Add2.value,
//       quotes: quotesWithTotalCost,
//       userId
//     }

//     console.log('Final Request Payload:', JSON.stringify(requestPayload, null, 2))
//     await axios.post('http://localhost:3000/agreement/create', requestPayload)

//     await fetchAgreement(agreementData)

//     alert('Data saved successfully!')
//     router.push('/agreement/id')
//   } catch (error) {
//     console.error('Error saving data:', error)
//     alert('Error saving data. Please check the console for more details.')
//   }
// }


const submitData = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      redirectToLogin()
      return
    }
    const decodedToken: any = jwtDecode(token)
    const userId = decodedToken.sub

    const quotesWithTotalCost = quotes.value.map((quote) => {
      const premium = !isNaN(Number(quote.premium)) ? Number(quote.premium) : 0
      const taxes = !isNaN(Number(quote.taxes)) ? Number(quote.taxes) : 0
      const otherFees = !isNaN(Number(quote.otherFees)) ? Number(quote.otherFees) : 0
      const brokerFee = !isNaN(Number(quote.brokerFee)) ? Number(quote.brokerFee) : 0
      const policyFee = !isNaN(Number(quote.policyFee)) ? Number(quote.policyFee) : 0
      const commissionRate = !isNaN(Number(quote.minEarnedRate)) ? Number(quote.minEarnedRate) : 0
      const commission = premium * (commissionRate / 100)
      const agencyFees = !isNaN(Number(quote.AgencyFess)) ? Number(quote.AgencyFess) : 0

      const totalCost =
        premium + taxes + otherFees + brokerFee + policyFee + commission + agencyFees

      return {
        ...quote,
        effectiveDate: quote.effectiveDate ? new Date(quote.effectiveDate).toISOString() : null,
        expirationDate: quote.expirationDate ? new Date(quote.expirationDate).toISOString() : null,
        totalCost
      }
    })

    const requestPayload = {
      firstname: Add1.value.firstname,
      lastname: Add1.value.lastname,
      email: Add1.value.email,
      contact: Add1.value.contact,
      Address: Add1.value.Address,
      city: Add1.value.city,
      state: Add1.value.state,
      zipcode: Add1.value.zipcode,
      delegateEmail: Add1.value.delegateEmail,
      delegateFirstname: Add1.value.delegateFirstname,
      delegateLastname: Add1.value.delegateLastname,
      delegateContact: Add1.value.delegateContact,
      customerType: customerType.value,
      businesses: Add2.value,
      quotes: quotesWithTotalCost,
      userId
    }

    console.log('Final Request Payload:', JSON.stringify(requestPayload, null, 2))
    const response = await axios.post('http://localhost:3000/agreement/create', requestPayload)

    if (response.status === 201) { // Assuming 201 status for successful creation
      const newAgreement = response.data // Assuming the backend returns the created agreement
      console.log('New Agreement:', JSON.stringify(newAgreement, null, 2))

      // Now fetch the latest agreement and display it in the view
      await fetchAgreement(agreementData)
      
      alert('Data saved successfully!')
      router.push(`/agreement/${newAgreement.id}`) // Redirect to the newly created agreement page
    } else {
      throw new Error('Failed to create agreement')
    }
  } catch (error) {
    console.error('Error saving data:', error)
    alert('Error saving data. Please check the console for more details.')
  }
}

</script>

<template>
  <v-app>
    <Navbar />
    <v-container class="pt-16 pb-6 px-16" max-width="60px">
      <v-stepper
        hide-actions
        alt-labels
        v-model="currentStep"
        :items="['Step 1', 'Step 2', 'Step 3']"
        class="mt-4"
      >
        <template v-slot:item.1>
          <v-card flat class="py-4">
            <v-combobox
              v-model="Add1.email"
              :items="emails.map((email) => email.title)"
              label="Email"
              variant="outlined"
              clearable
              hide-details
              @update:modelValue="handleChange"
              @keydown.enter="handleEnter"
            />
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
                  v-model="Add1.zipcode"
                  :counter="10"
                  label="ZipCode"
                  hide-details
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row dense class="mt-5">
              <v-col cols="12" md="2">
                <v-select
                  v-model="Add1.selectedCountryCode"
                  :items="['+91', '+1', '+44', '+93']"
                  item-value="name"
                  item-text="dial_code"
                  label="Country Code"
                  outlined
                  variant="outlined"
                  required
                ></v-select>
              </v-col>

              <v-col cols="12" md="10">
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
                <h3 class="font-semibold">Would you like to add contact/delegate?</h3>
                <h3 class="my-2">
                  Person That will act on behalf of the customer or business and be listed as the
                  Signee
                </h3>
                <v-radio-group v-model="radioSelection" inline>
                  <v-radio label="Yes" value="Yes"></v-radio>
                  <v-radio label="No" value="No"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <div v-if="showDelegateForm">
              <v-row class="mt-4">
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="Add1.delegateEmail"
                    :counter="10"
                    label="Email"
                    hide-details
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="Add1.delegateFirstname"
                    :counter="10"
                    label="Firstname"
                    hide-details
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="Add1.delegateLastname"
                    :counter="10"
                    label="Lastname"
                    hide-details
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row dense class="mt-5">
                <v-col cols="12" md="2">
                  <v-select
                    v-model="Add1.selectedCountryCode2"
                    :items="['+91', '+1', '+44', '+93']"
                    item-value="name"
                    item-text="dial_code"
                    label="Country Code"
                    outlined
                    variant="outlined"
                    required
                  ></v-select>
                </v-col>

                <v-col cols="12" md="10">
                  <v-text-field
                    v-model="Add1.delegateContact"
                    :counter="10"
                    label="Contact"
                    hide-details
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </div>
          <div class="flex justify-end mt-8">
            <v-btn
              @click="handleStepChange(2)"
              color="primary"
              class="py-2 px-4 rounded-lg shadow-md text-white font-semibold"
            >
              <v-icon>mdi-arrow-right</v-icon>
              <span class="ml-2">Next</span>
            </v-btn>
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
                    accept=".pdf"
                    @change="validateFile($event, index)"
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
                        <v-select
                          v-model="quotes[index].carrierCompany"
                          :items="[
                            { text: 'Carrier A', value: 'Carrier A' },
                            { text: 'Carrier B', value: 'Carrier B' },
                            { text: 'Carrier C', value: 'Carrier C' },
                            { text: 'Carrier D', value: 'Carrier D' }
                          ]"
                          item-value="value"
                          item-title="text"
                          label="Carrier Company"
                          variant="outlined"
                          class="mb-4"
                        ></v-select></v-col
                      ><v-col cols="12" md="6">
                        <v-select
                          v-model="quotes[index].wholesaler"
                          :items="[
                            { text: 'wholesaler A', value: 'wholesaler A' },
                            { text: 'wholesaler B', value: 'wholesaler B' },
                            { text: 'wholesaler C', value: 'wholesaler C' },
                            { text: 'wholesaler D', value: 'wholesaler D' }
                          ]"
                          item-value="value"
                          item-title="text"
                          label="Wholesaler"
                          variant="outlined"
                          class="mb-4"
                        ></v-select></v-col
                    ></v-row>
                    <v-select
                      v-model="quotes[index].coverage"
                      :items="[
                        { text: 'coverage A', value: 'coverage A' },
                        { text: 'coverage B', value: 'coverage B' },
                        { text: 'coverage C', value: 'coverage C' },
                        { text: 'coverage D', value: 'coverage D' }
                      ]"
                      item-value="value"
                      item-title="text"
                      label="Coverage"
                      variant="outlined"
                      class="mb-4"
                    ></v-select>
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

          <div class="flex justify-between mt-8">
            <v-btn
              @click="handleStepChange(currentStep - 1)"
              color="primary"
              class="py-2 px-4 rounded-lg shadow-md text-white font-semibold"
            >
              <v-icon>mdi-arrow-left</v-icon>
              <span class="ml-2">Previous</span>
            </v-btn>
            <v-btn
              @click="handleStepChange(currentStep + 1)"
              color="primary"
              class="py-2 px-4 rounded-lg shadow-md text-white font-semibold"
            >
              <v-icon>mdi-arrow-right</v-icon>
              <span class="ml-2">Next</span>
            </v-btn>
          </div>
        </template>

        <template v-slot:item.3>
          <v-card flat class="p-16 bg-white shadow-lg rounded-xl">
            <!-- <div class="mb-12 border-b border-gray-300 pb-8">
              <div class="shadow-lg p-6 m-6 bg-white rounded-lg">
                <div v-for="(file, index) in files" :key="index" class="mb-8">
                  <h4 class="text-xl font-semibold text-gray-700 mb-4 mt-t">
                    Quote {{ index + 1 }}
                  </h4>
                  <div v-if="files[index]" class="mt-6">
                    <div class="shadow-lg p-6 m-6 bg-gray-300 rounded-lg">
                      <div class="flex justify-between">
                        <p>
                          <strong class="font-medium text-gray-800">Quote Number:</strong>
                          {{ quotes[index].quoteNumber }}
                        </p>
                        <p>
                          <strong class="font-medium text-gray-800">Policy Number:</strong>
                          {{ quotes[index].policyNumber }}
                        </p>
                      </div>
                      <div class="flex justify-between">
                        <p>
                          <strong class="font-medium text-gray-800">Carrier Company:</strong>
                          {{ quotes[index].carrierCompany }}
                        </p>
                        <p>
                          <strong class="font-medium text-gray-800">Coverage:</strong>
                          {{ quotes[index].coverage }}
                        </p>
                      </div>
                      <div class="flex justify-between">
                        <p>
                          <strong class="font-medium text-gray-800">Effective Date:</strong>
                          {{ quotes[index].effectiveDate }}
                        </p>
                        <p>
                          <strong class="font-medium text-gray-800">Expiration Date:</strong>
                          {{ quotes[index].expirationDate }}
                        </p>
                      </div>
                    </div>

                    <div class="flex justify-between">
                      <div>
                        <h4 class="text-xl font-semibold text-gray-700 mb-4 mt-t">
                          Provided by carrier
                        </h4>
                        <div class="shadow-lg p-6 m-6 bg-gray-300 rounded-lg">
                          <div class="flex flex-col">
                            <p>
                              <strong class="font-medium text-gray-800">Min Days to Cancel:</strong>
                              {{ quotes[index].minDaysToCancel }}
                            </p>
                            <p>
                              <strong class="font-medium text-gray-800">Min Earned Rate:</strong>
                              {{ quotes[index].minEarnedRate }}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 class="text-xl font-semibold text-gray-700 mb-4 mt-t">Financeable</h4>
                        <div class="shadow-lg p-6 m-6 bg-gray-300 rounded-lg">
                          <div class="flex flex-col">
                            <p>
                              <strong class="font-medium text-gray-800">Premium:</strong>
                              {{ quotes[index].premium }}
                            </p>
                            <p>
                              <strong class="font-medium text-gray-800">Taxes:</strong>
                              {{ quotes[index].taxes }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 class="text-xl font-semibold text-gray-700 mb-4 mt-t">Non-Financeable</h4>
                      <div class="shadow-lg p-6 m-6 bg-gray-300 rounded-lg">
                        <div class="flex justify-between">
                          <p>
                            <strong class="font-medium text-gray-800">Other Fees:</strong>
                            {{ quotes[index].otherFees }}
                          </p>
                          <p>
                            <strong class="font-medium text-gray-800">Broker Fee:</strong>
                            {{ quotes[index].brokerFee }}
                          </p>
                        </div>
                      </div>
                      <div class="shadow-lg p-6 m-6 bg-gray-300 rounded-lg">
                        <div class="flex justify-between">
                          <p>
                            <strong class="font-medium text-gray-800">Policy Fee:</strong>
                            ${{ quotes[index].policyFee }}
                          </p>
                          <p>
                            <strong class="font-medium text-gray-800">Agency Fees:</strong>
                            $ {{ quotes[index].AgencyFess }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
            <div class="border-gray-300 bg-gray-50">
              <div class="max-w-7xl p-4 bg-white rounded-lg">
                <div v-for="(file, index) in files" :key="index" class="mb-12">
                  <h4 class="text-2xl font-semibold text-gray-800 mb-6">Quote {{ index + 1 }}</h4>

                  <div v-if="files[index]" class="bg-gray-100 p-6 rounded-lg shadow-md">
                    <div class="space-y-6">
                      <!-- General Quote Information -->
                      <div class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <p>
                            <strong class="font-medium text-gray-700">Quote Number:</strong>
                            {{ quotes[index].quoteNumber }}
                          </p>
                          <p>
                            <strong class="font-medium text-gray-700">Policy Number:</strong>
                            {{ quotes[index].policyNumber }}
                          </p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <p>
                            <strong class="font-medium text-gray-700">Carrier Company:</strong>
                            {{ quotes[index].carrierCompany }}
                          </p>
                          <p>
                            <strong class="font-medium text-gray-700">Coverage:</strong>
                            {{ quotes[index].coverage }}
                          </p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <p>
                            <strong class="font-medium text-gray-700">Effective Date:</strong>
                            {{ quotes[index].effectiveDate }}
                          </p>
                          <p>
                            <strong class="font-medium text-gray-700">Expiration Date:</strong>
                            {{ quotes[index].expirationDate }}
                          </p>
                        </div>
                      </div>

                      <!-- Provided by Carrier -->
                      <div>
                        <h4 class="text-xl font-semibold text-gray-800 mb-4">
                          Provided by Carrier
                        </h4>
                        <div class="bg-gray-200 p-6 rounded-lg shadow-md">
                          <div class="space-y-4">
                            <p>
                              <strong class="font-medium text-gray-700">Min Days to Cancel:</strong>
                              {{ quotes[index].minDaysToCancel }}
                            </p>
                            <p>
                              <strong class="font-medium text-gray-700">Min Earned Rate:</strong>
                              % {{ quotes[index].minEarnedRate }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Financeable -->
                      <div class="mt-6">
                        <h4 class="text-xl font-semibold text-gray-800 mb-4">Financeable</h4>
                        <div class="flex gap-6">
                          <div class="bg-gray-200 p-6 rounded-lg shadow-md flex-1">
                            <div class="space-y-4">
                              <p>
                                <strong class="font-medium text-gray-700">Premium:</strong>
                                $ {{ quotes[index].premium }}
                              </p>
                              <p>
                                <strong class="font-medium text-gray-700">Taxes:</strong>
                                $ {{ quotes[index].taxes }}
                              </p>
                            </div>
                          </div>
                          <div class="bg-gray-200 p-6 rounded-lg shadow-md flex-1">
                            <div class="space-y-4">
                              <p>
                                <strong class="font-medium text-gray-700"
                                  >Min Days to Cancel:</strong
                                >
                                {{ quotes[index].minDaysToCancel }}
                              </p>
                              <p>
                                <strong class="font-medium text-gray-700">Min Earned Rate:</strong>
                                % {{ quotes[index].minEarnedRate }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Non-Financeable -->
                      <div class="mt-6">
                        <h4 class="text-xl font-semibold text-gray-800 mb-4">Non-Financeable</h4>
                        <div class="bg-gray-200 p-6 rounded-lg shadow-md">
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <p>
                              <strong class="font-medium text-gray-700">Other Fees:</strong>
                              $ {{ quotes[index].otherFees }}
                            </p>
                            <p>
                              <strong class="font-medium text-gray-700">Broker Fee:</strong>
                              $ {{ quotes[index].brokerFee }}
                            </p>
                          </div>
                        </div>
                        <div class="bg-gray-200 p-6 rounded-lg shadow-md mt-4">
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <p>
                              <strong class="font-medium text-gray-700">Policy Fee:</strong>
                              $ {{ quotes[index].policyFee }}
                            </p>
                            <p>
                              <strong class="font-medium text-gray-700">Agency Fees:</strong>
                              $ {{ quotes[index].AgencyFess }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-12 border-gray-300 pb-8 bg-gray-50">
              <div class="max-w-7xl p-8 bg-white rounded-lg">
                <h3 class="text-3xl font-semibold text-gray-800 mb-6">Total Costs</h3>
                <div
                  v-for="(cost, index) in totalCostsPerQuote"
                  :key="index"
                  class="mb-4 p-6 bg-gray-100 rounded-lg shadow-md"
                >
                  <p class="text-lg font-medium text-gray-800">
                    Total cost for quote {{ index + 1 }}:
                    <span class="font-semibold text-gray-900">
                      $ {{ Number(cost).toFixed(2) }}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div class="flex justify-between">
              <v-btn
                @click="handleStepChange(currentStep - 1)"
                color="primary"
                class="py-2 px-4 rounded-lg shadow-md text-white font-semibold"
              >
                <v-icon>mdi-arrow-left</v-icon>
                <span class="ml-2">Previous</span>
              </v-btn>
              <v-btn
                @click="submitData"
                color="primary"
                class="py-2 px-6 rounded-lg shadow-lg text-white font-semibold flex items-center"
              >
                <v-icon>mdi-check</v-icon>
                <span>Submit</span>
              </v-btn>
            </div>
          </v-card>
        </template>
      </v-stepper>
    </v-container>
  </v-app>
</template>

<style scoped></style>
