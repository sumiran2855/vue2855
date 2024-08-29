import axios from 'axios'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'

export const fetchOrganisationDetails = async (organisationDetails: any) => {
  try {
    const router = useRouter()
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }

    const decodedToken = jwtDecode(token)
    const userId = decodedToken.sub

    const response = await axios.get(`http://localhost:3000/organisation/getUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.data) {
      Object.assign(organisationDetails, response.data)
    
    } else {
      console.error('No organisation details found for the given userId')
    }
  } catch (error) {
    console.error('Error fetching organisation details:', error)
  }
}


export const fetchUserss = async (user: any) => {
  try {
    const router = useRouter()
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }

    const decodedToken = jwtDecode(token)
    const userId = decodedToken.sub

    const response = await axios.get(`http://localhost:3000/user/getUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const user= response.data
    if (response.data) {
      Object.assign(user, response.data)
    } else {
      console.error('No organisation details found for the given userId')
    }
  } catch (error) {
    console.error('Error fetching organisation details:', error)
  }
}

export const fetchBankDetails = async (BankDetails: any) => {
  try {
    const router = useRouter()
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }

    const decodedToken = jwtDecode(token)
    const userId = decodedToken.sub
    console.log(userId);
    
    const response = await axios.get(`http://localhost:3000/bank/getUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const response2 = await axios.get(`http://localhost:3000/bank/getUser/cb2b7fc7-8aae-49a5-9661-024bcb0aa86d`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const details = response2.data;
    console.log(details.bankAccountHolderName);
    if (response.data) {
      Object.assign(BankDetails, response.data)
    console.log(BankDetails.bankAccountHolderName);
    } else {
      console.error('No organisation details found for the given userId')
    }
  } catch (error) {
    console.error('Error fetching organisation details:', error)
  }
}