/**
 * Utility functions for API response handling and data transformation
 */

/**
 * Format price in Indian Rupees format
 */
export const formatPrice = (price: number): string => {
  return `Rs. ${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Format price in Indian Rupees (short format for display)
 */
export const formatPriceShort = (amount: number): string => {
  return `Rs. ${amount.toLocaleString('en-IN')}`
}

/**
 * Extract data from standard API response format
 * { success: true, message: "OK", data: {...} }
 */
export const extractApiData = <T>(responseData: any, dataKey?: string): T | null => {
  // If dataKey is provided, try to extract that specific key
  if (dataKey) {
    if (responseData.data?.[dataKey]) {
      return responseData.data[dataKey]
    }
  }
  
  // Otherwise return the data field
  if (responseData.data) {
    return responseData.data
  }
  
  // Fallback to the entire response
  return responseData
}

/**
 * Parse address into backend format
 */
export const parseAddressToBackend = (address: string, cityZip: string) => {
  const addressParts = address.split(',').map(s => s.trim())
  const cityZipParts = cityZip.split(',').map(s => s.trim())
  
  return {
    line1: addressParts[0] || '',
    line2: addressParts[1] || '',
    city: cityZipParts[0] || '',
    state: cityZipParts[1] || '',
    pincode: cityZipParts[2] || cityZipParts[cityZipParts.length - 1] || '',
  }
}

/**
 * Format address from backend to frontend
 */
export const formatAddressFromBackend = (line1: string, line2?: string, city?: string, state?: string, pincode?: string) => {
  const addressLine = [line1, line2].filter(Boolean).join(', ')
  const cityZip = [city, state, pincode].filter(Boolean).join(', ')
  
  return {
    address: addressLine,
    cityZip: cityZip,
  }
}
