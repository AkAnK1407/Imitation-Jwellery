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
  const url = `/api/v1/products${queryString ? `?${queryString}` : ''}`

  // Make the API call
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
  }

  const responseData = await response.json()
  
  // Handle different API response formats
  // API might return: { data: [...], meta: {...} } or just [...]
  if (Array.isArray(responseData)) {
    return {
      data: responseData,
      meta: {
        totalItems: responseData.length,
        totalPages: 1,
        currentPage: 1,
      },
    }
  }
  
  // If API returns wrapped structure
  return {
    data: responseData.data || responseData.products || [],
    meta: responseData.meta || {
      totalItems: (responseData.data || responseData.products || []).length,
      totalPages: responseData.totalPages || 1,
      currentPage: responseData.currentPage || filters.page || 1,
    },
  }
}
