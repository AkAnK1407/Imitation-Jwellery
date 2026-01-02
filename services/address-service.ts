import { addAddress as addAddressToAuth, deleteAddress as deleteAddressFromAuth, setDefaultAddress as setDefaultAddressInAuth, fetchUserProfile, type Address, type User } from "./auth-service"
import { parseAddressToBackend } from "@/lib/api-utils"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8018'

export const addAddress = async (addressData: Omit<Address, "id">): Promise<User> => {
  return addAddressToAuth(addressData)
}

export const updateAddress = async (addressId: string, addressData: Partial<Address>): Promise<User> => {
  // Get current user to get customerId
  const currentUser = await fetchUserProfile()
  const url = `${API_BASE_URL}/api/v1/customers/${currentUser.id}/addresses/${addressId}`

  // Parse address fields if they exist
  const body: any = {}
  
  if (addressData.name) {
    body.name = addressData.name
  }
  
  if (addressData.address && addressData.cityZip) {
    const parsed = parseAddressToBackend(addressData.address, addressData.cityZip)
    Object.assign(body, parsed)
  } else if (addressData.address) {
    const addressParts = addressData.address.split(',').map(s => s.trim())
    body.line1 = addressParts[0] || ''
    body.line2 = addressParts[1] || ''
  } else if (addressData.cityZip) {
    const cityZipParts = addressData.cityZip.split(',').map(s => s.trim())
    body.city = cityZipParts[0] || ''
    body.state = cityZipParts[1] || ''
    body.pincode = cityZipParts[2] || cityZipParts[cityZipParts.length - 1] || ''
  }
  
  if (addressData.isDefault !== undefined) {
    body.isDefault = addressData.isDefault
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Failed to update address: ${response.status}`)
  }

  // Fetch updated profile with addresses
  return fetchUserProfile()
}

export const deleteAddress = async (addressId: string): Promise<User> => {
  return deleteAddressFromAuth(addressId)
}

export const setDefaultAddress = async (addressId: string): Promise<User> => {
  return setDefaultAddressInAuth(addressId)
}
