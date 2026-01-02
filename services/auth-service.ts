export interface LoginCredentials {
  mobile: string
  otp: string
}

export interface Address {
  id: string
  name: string
  address: string
  cityZip: string
  isDefault: boolean
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  addresses: Address[]
}

// Backend customer structure
interface BackendCustomer {
  _id: string
  name: string
  email: string
  phone: string
  mobile?: string
}

// Backend address structure
interface BackendAddress {
  _id: string
  name: string
  line1: string
  line2?: string
  city: string
  state?: string
  pincode: string
  isDefault: boolean
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8018'

import { formatAddressFromBackend, parseAddressToBackend } from "@/lib/api-utils"

/**
 * Transform backend address to frontend format
 */
const transformAddress = (backendAddr: BackendAddress): Address => {
  const { address, cityZip } = formatAddressFromBackend(
    backendAddr.line1,
    backendAddr.line2,
    backendAddr.city,
    backendAddr.state,
    backendAddr.pincode
  )
  
  return {
    id: backendAddr._id,
    name: backendAddr.name,
    address,
    cityZip,
    isDefault: backendAddr.isDefault || false,
  }
}

/**
 * Transform backend customer to frontend user format
 */
const transformCustomer = (backendCustomer: BackendCustomer, addresses: BackendAddress[] = []): User => {
  return {
    id: backendCustomer._id,
    name: backendCustomer.name || '',
    email: backendCustomer.email || '',
    phone: backendCustomer.phone || backendCustomer.mobile || '',
    addresses: Array.isArray(addresses) ? addresses.map(transformAddress) : [],
  }
}

export const loginUser = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  // Mock delay for API simulation
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock successful login - this would need real implementation
  const user = await fetchUserProfile()
  
  return {
    user,
    token: "mock-jwt-token",
  }
}

export const fetchUserProfile = async (): Promise<User> => {
  const url = `${API_BASE_URL}/api/v1/customers/me`

  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status}`)
    }

    const responseData = await response.json()
    
    // Extract customer from response: { success: true, data: { customer: {...} } }
    const backendCustomer: BackendCustomer = responseData.data?.customer || responseData.data || responseData
    
    if (!backendCustomer || !backendCustomer._id) {
      throw new Error('Invalid customer data')
    }

    // Fetch addresses for this customer
    let addresses: BackendAddress[] = []
    try {
      const addressesUrl = `${API_BASE_URL}/api/v1/customers/${backendCustomer._id}/addresses`
      const addressesResponse = await fetch(addressesUrl)
      if (addressesResponse.ok) {
        const addressesData = await addressesResponse.json()
        addresses = addressesData.data?.items || addressesData.data || addressesData.items || []
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }

    return transformCustomer(backendCustomer, addresses)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    // Return default user for now
    return {
      id: "user-1",
      name: "Olivia Grace",
      email: "olivia@gmail.com",
      phone: "+91 1234567890",
      addresses: [],
    }
  }
}

export const updateUserProfile = async (updates: Partial<User>): Promise<User> => {
  const url = `${API_BASE_URL}/api/v1/customers/me`

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: updates.name,
      email: updates.email,
      phone: updates.phone,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to update user profile: ${response.status}`)
  }

  const responseData = await response.json()
  const backendCustomer: BackendCustomer = responseData.data?.customer || responseData.data || responseData
  
  // Fetch updated profile with addresses
  return fetchUserProfile()
}

export const addAddress = async (address: Omit<Address, 'id'>): Promise<User> => {
  // First get current user to get customerId
  const currentUser = await fetchUserProfile()
  const url = `${API_BASE_URL}/api/v1/customers/${currentUser.id}/addresses`

  // Parse address and cityZip back to backend format
  const parsed = parseAddressToBackend(address.address, address.cityZip)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: address.name,
      ...parsed,
      isDefault: address.isDefault,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to add address: ${response.status}`)
  }

  // Fetch updated profile with addresses
  return fetchUserProfile()
}

export const deleteAddress = async (addressId: string): Promise<User> => {
  // First get current user to get customerId
  const currentUser = await fetchUserProfile()
  const url = `${API_BASE_URL}/api/v1/customers/${currentUser.id}/addresses/${addressId}`

  const response = await fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete address: ${response.status}`)
  }

  // Fetch updated profile with addresses
  return fetchUserProfile()
}

export const setDefaultAddress = async (addressId: string): Promise<User> => {
  // First get current user to get customerId
  const currentUser = await fetchUserProfile()
  const url = `${API_BASE_URL}/api/v1/customers/${currentUser.id}/addresses/${addressId}`

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      isDefault: true,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to set default address: ${response.status}`)
  }

  // Fetch updated profile with addresses
  return fetchUserProfile()
}
