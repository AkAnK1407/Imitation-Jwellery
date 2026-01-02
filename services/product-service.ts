export interface Product {
  id: string
  title: string
  price: string
  oldPrice?: string
  image: string
  tag?: {
    label: string
    variant: "primary" | "secondary"
  }
}

export interface ProductListResponse {
  data: Product[]
  meta: {
    totalItems: number
    totalPages: number
    currentPage: number
  }
}

export interface ProductFilters {
  sort?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}

// Use environment variable for API base URL, fallback to localhost:8018 for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8018'

// Default pagination limit for calculating total pages
const DEFAULT_PAGE_LIMIT = 10

/**
 * Fetch products from the backend API
 * @param filters - Optional filters for sorting, price range, and pagination
 * @returns Promise with product list response
 */
export const fetchProducts = async (filters: ProductFilters = {}): Promise<ProductListResponse> => {
  // Build query parameters from filters
  const params = new URLSearchParams()
  
  if (filters.sort) {
    params.append('sort', filters.sort)
  }
  if (filters.minPrice !== undefined) {
    params.append('minPrice', String(filters.minPrice))
  }
  if (filters.maxPrice !== undefined) {
    params.append('maxPrice', String(filters.maxPrice))
  }
  if (filters.page) {
    params.append('page', String(filters.page))
  }
  if (filters.limit) {
    params.append('limit', String(filters.limit))
  }

  // Build URL with query string
  const queryString = params.toString()
  const url = `${API_BASE_URL}/api/v1/products${queryString ? `?${queryString}` : ''}`

  // Make the API call
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
  }

  const responseData = await response.json()
  
  // Log the response to debug (only in development)
  if (process.env.NODE_ENV !== 'production') {
    console.log('API Response:', responseData)
  }
  
  // Handle various API response formats
  let products: Product[] = []
  let totalItems = 0
  let totalPages = 1
  let currentPage = filters.page || 1

  // Case 1: Direct array response
  if (Array.isArray(responseData)) {
    products = responseData
    totalItems = responseData.length
  }
  // Case 2: { success: true, data: [...] } or { data: [...] }
  else if (responseData.data && Array.isArray(responseData.data)) {
    products = responseData.data
    totalItems = responseData.meta?.totalItems || responseData.total || responseData.count || products.length
    totalPages = responseData.meta?.totalPages || responseData.totalPages || Math.ceil(totalItems / (filters.limit || DEFAULT_PAGE_LIMIT))
    currentPage = responseData.meta?.currentPage || responseData.currentPage || currentPage
  }
  // Case 3: { products: [...] }
  else if (responseData.products && Array.isArray(responseData.products)) {
    products = responseData.products
    totalItems = responseData.total || responseData.count || responseData.totalItems || products.length
    totalPages = responseData.totalPages || Math.ceil(totalItems / (filters.limit || DEFAULT_PAGE_LIMIT))
    currentPage = responseData.currentPage || responseData.page || currentPage
  }
  // Case 4: { items: [...] }
  else if (responseData.items && Array.isArray(responseData.items)) {
    products = responseData.items
    totalItems = responseData.total || responseData.count || responseData.totalItems || products.length
    totalPages = responseData.totalPages || Math.ceil(totalItems / (filters.limit || DEFAULT_PAGE_LIMIT))
    currentPage = responseData.currentPage || responseData.page || currentPage
  }
  // Case 5: { success: true, data: { products: [...] } } - nested
  else if (responseData.success && responseData.data) {
    if (Array.isArray(responseData.data)) {
      products = responseData.data
    } else if (responseData.data.products && Array.isArray(responseData.data.products)) {
      products = responseData.data.products
    } else if (responseData.data.items && Array.isArray(responseData.data.items)) {
      products = responseData.data.items
    }
    totalItems = responseData.total || responseData.count || products.length
    totalPages = responseData.totalPages || Math.ceil(totalItems / (filters.limit || DEFAULT_PAGE_LIMIT))
  }
  // Fallback: try to extract any array from the response
  else {
    console.warn('Unexpected API response format:', responseData)
    // Try to find any array in the response
    for (const key of Object.keys(responseData)) {
      if (Array.isArray(responseData[key])) {
        products = responseData[key]
        break
      }
    }
  }

  // Ensure products is always an array
  if (!Array.isArray(products)) {
    console.error('Could not extract products array from API response:', responseData)
    products = []
  }

  return {
    data: products,
    meta: {
      totalItems,
      totalPages,
      currentPage,
    },
  }
}
