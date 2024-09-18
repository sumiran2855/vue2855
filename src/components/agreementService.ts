import axios from 'axios'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { ref } from 'vue'

const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const router = useRouter()

const redirectToLogin = () => {
  router.push('/login')
}

export const fetchAgreement = async (agreementData: any) => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      redirectToLogin()
      return
    }

    const decodedToken: any = jwtDecode(token)
    const userId = decodedToken.sub

    if (!userId) {
      throw new Error('User ID not found in token')
    }

    const response = await axios.get(`http://localhost:3000/agreement/user/${userId}`)

    if (response.status === 200) {
      const data = response.data

      if (!Array.isArray(data)) {
        throw new Error('Unexpected data format: response.data is not an array')
      }

      const agreements = data.map((agreement: any) => ({
        ...agreement,
        quotes: Array.isArray(agreement.quotes)
          ? agreement.quotes.map((quote: any) => ({
              ...quote,
              effectiveDate: quote.effectiveDate ? new Date(quote.effectiveDate) : null,
              expirationDate: quote.expirationDate ? new Date(quote.expirationDate) : null
            }))
          : []
      }))

      agreementData.value = agreements.slice(0, 1)

      console.log('Fetched Agreement Data:', JSON.stringify(agreementData.value, null, 2))
    } else {
      throw new Error(`Error: Received status code ${response.status}`)
    }
  } catch (error) {
    console.error('Error fetching agreement data:', error)
    errorMessage.value = `Failed to load agreement data. `
  } finally {
    isLoading.value = false
  }
}


export const fetchEmail = async (agreementData: { value: any }, emails: { value: Array<{ title: string }> }) => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      redirectToLogin()
      return
    }

    const decodedToken: any = jwtDecode(token)
    const userId = decodedToken.sub

    if (!userId) {
      throw new Error('User ID not found in token')
    }

    const response = await axios.get(`http://localhost:3000/agreement/user/${userId}`)

    if (response.status === 200) {
      const data = response.data

      if (!Array.isArray(data)) {
        throw new Error('Unexpected data format: response.data is not an array')
      }

      const agreements = data.map((agreement: any) => ({
        ...agreement,
        quotes: Array.isArray(agreement.quotes)
          ? agreement.quotes.map((quote: any) => ({
              ...quote,
              effectiveDate: quote.effectiveDate ? new Date(quote.effectiveDate) : null,
              expirationDate: quote.expirationDate ? new Date(quote.expirationDate) : null
            }))
          : []
      }))

      agreementData.value = agreements.slice(0, 1)

      // Extract emails from agreements and update the 'emails' ref passed from the component
      const extractedEmails = agreements.map((agreement: any) => ({
        title: agreement.email || 'No email provided'
      }))
      emails.value = extractedEmails

      console.log('Fetched Agreement Data:', JSON.stringify(agreementData.value, null, 2))
      console.log('Extracted Emails:', JSON.stringify(emails.value, null, 2))
    } else {
      throw new Error(`Error: Received status code ${response.status}`)
    }
  } catch (error) {
    console.error('Error fetching agreement data:', error)
    errorMessage.value = 'Failed to load agreement data.'
  } finally {
    isLoading.value = false
  }
}