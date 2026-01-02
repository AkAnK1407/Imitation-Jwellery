export interface WishlistItem {
  id: string
  productId: string
  title: string
  price: string
  image: string
}

export interface Wishlist {
  items: WishlistItem[]
}

// Backend wishlist item structure
interface BackendWishlistItem {
  _id: string
  productId: {
    _id: string
    name: string
    price: number
    thumbnail: string
    images?: string[]
  } | string
}

// Backend wishlist response
interface BackendWishlist {
  _id: string
  customerId: string
  items: BackendWishlistItem[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8018'

import { formatPrice } from "@/lib/api-utils"

/**
 * Transform backend wishlist item to frontend format
 */
const transformWishlistItem = (backendItem: BackendWishlistItem): WishlistItem => {
  // Handle populated productId (object) vs string reference
  const product = typeof backendItem.productId === 'object' ? backendItem.productId : null
  
  return {
    id: backendItem._id,
    productId: product?._id || (typeof backendItem.productId === 'string' ? backendItem.productId : ''),
    title: product?.name || 'Product',
    price: formatPrice(product?.price || 0),
    image: product?.thumbnail || product?.images?.[0] || '/img/placeholder.webp',
  }
}

/**
 * Fetch user's wishlist
 */
export const fetchWishlist = async (): Promise<Wishlist> => {
  const url = `${API_BASE_URL}/api/v1/wishlist`

  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      // If wishlist not found (404), return empty wishlist
      if (response.status === 404) {
        return { items: [] }
      }
      throw new Error(`Failed to fetch wishlist: ${response.status}`)
    }

    const responseData = await response.json()
    
    // Extract wishlist from response: { success: true, data: { wishlist: {...} } }
    const backendWishlist: BackendWishlist | null = responseData.data?.wishlist || responseData.data || null
    
    if (!backendWishlist || !Array.isArray(backendWishlist.items)) {
      return { items: [] }
    }

    const items = backendWishlist.items.map(transformWishlistItem)
    
    return { items }
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return { items: [] }
  }
}

/**
 * Add item to wishlist
 */
export const addToWishlist = async (
  productId: string,
  title: string,
  price: string,
  image: string,
): Promise<Wishlist> => {
  const url = `${API_BASE_URL}/api/v1/wishlist/items`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to add to wishlist: ${response.status}`)
  }

  const responseData = await response.json()
  const backendWishlist: BackendWishlist = responseData.data?.wishlist || responseData.data
  
  if (!backendWishlist || !Array.isArray(backendWishlist.items)) {
    throw new Error('Invalid wishlist response')
  }

  const items = backendWishlist.items.map(transformWishlistItem)
  
  return { items }
}

/**
 * Remove item from wishlist
 */
export const removeFromWishlist = async (wishlistItemId: string): Promise<Wishlist> => {
  const url = `${API_BASE_URL}/api/v1/wishlist/items/${wishlistItemId}`

  const response = await fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to remove from wishlist: ${response.status}`)
  }

  const responseData = await response.json()
  const backendWishlist: BackendWishlist | null = responseData.data?.wishlist || responseData.data || null
  
  // If wishlist is empty after deletion, return empty wishlist
  if (!backendWishlist || !Array.isArray(backendWishlist.items)) {
    return { items: [] }
  }

  const items = backendWishlist.items.map(transformWishlistItem)
  
  return { items }
}
