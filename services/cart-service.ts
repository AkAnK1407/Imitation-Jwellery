export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Cart {
  items: CartItem[]
  total: number
}

// Backend cart item structure
interface BackendCartItem {
  _id: string
  productId: {
    _id: string
    name: string
    price: number
    thumbnail: string
    images?: string[]
  } | string
  qty: number
}

// Backend cart response
interface BackendCart {
  _id: string
  deviceId: string
  items: BackendCartItem[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8018'

/**
 * Get or generate deviceId for cart tracking
 */
const getDeviceId = (): string => {
  if (typeof window === 'undefined') return ''
  
  let deviceId = localStorage.getItem('deviceId')
  if (!deviceId) {
    deviceId = `device-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem('deviceId', deviceId)
  }
  return deviceId
}

/**
 * Calculate cart total
 */
const calculateTotal = (items: CartItem[]): number => {
  if (!Array.isArray(items)) return 0
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
}

/**
 * Transform backend cart item to frontend format
 */
const transformCartItem = (backendItem: BackendCartItem): CartItem => {
  // Handle populated productId (object) vs string reference
  const product = typeof backendItem.productId === 'object' ? backendItem.productId : null
  
  return {
    id: backendItem._id,
    productId: product?._id || (typeof backendItem.productId === 'string' ? backendItem.productId : ''),
    name: product?.name || 'Product',
    price: product?.price || 0,
    quantity: backendItem.qty || 1,
    image: product?.thumbnail || product?.images?.[0] || '/img/placeholder.webp',
  }
}

/**
 * Fetch user's cart
 */
export const fetchCart = async (): Promise<Cart> => {
  const deviceId = getDeviceId()
  if (!deviceId) {
    return { items: [], total: 0 }
  }

  const url = `${API_BASE_URL}/api/v1/cart/${deviceId}`

  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      // If cart not found (404), return empty cart
      if (response.status === 404) {
        return { items: [], total: 0 }
      }
      throw new Error(`Failed to fetch cart: ${response.status}`)
    }

    const responseData = await response.json()
    
    // Extract cart from response: { success: true, data: { cart: {...} } }
    const backendCart: BackendCart | null = responseData.data?.cart || responseData.data || null
    
    if (!backendCart || !Array.isArray(backendCart.items)) {
      return { items: [], total: 0 }
    }

    const items = backendCart.items.map(transformCartItem)
    
    return {
      items,
      total: calculateTotal(items),
    }
  } catch (error) {
    console.error('Error fetching cart:', error)
    return { items: [], total: 0 }
  }
}

/**
 * Add item to cart
 */
export const addToCart = async (
  productId: string,
  name: string,
  price: number,
  image: string,
  quantity = 1,
): Promise<Cart> => {
  const deviceId = getDeviceId()
  const url = `${API_BASE_URL}/api/v1/cart/items`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      deviceId,
      productId,
      qty: quantity,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to add to cart: ${response.status}`)
  }

  const responseData = await response.json()
  const backendCart: BackendCart = responseData.data?.cart || responseData.data
  
  if (!backendCart || !Array.isArray(backendCart.items)) {
    throw new Error('Invalid cart response')
  }

  const items = backendCart.items.map(transformCartItem)
  
  return {
    items,
    total: calculateTotal(items),
  }
}

/**
 * Remove item from cart
 */
export const removeFromCart = async (cartItemId: string): Promise<Cart> => {
  const deviceId = getDeviceId()
  const url = `${API_BASE_URL}/api/v1/cart/items/${cartItemId}?deviceId=${deviceId}`

  const response = await fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to remove from cart: ${response.status}`)
  }

  const responseData = await response.json()
  const backendCart: BackendCart | null = responseData.data?.cart || responseData.data || null
  
  // If cart is empty after deletion, return empty cart
  if (!backendCart || !Array.isArray(backendCart.items)) {
    return { items: [], total: 0 }
  }

  const items = backendCart.items.map(transformCartItem)
  
  return {
    items,
    total: calculateTotal(items),
  }
}

/**
 * Update cart item quantity
 */
export const updateCartQuantity = async (cartItemId: string, quantity: number): Promise<Cart> => {
  const deviceId = getDeviceId()

  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    return removeFromCart(cartItemId)
  }

  const url = `${API_BASE_URL}/api/v1/cart/items/${cartItemId}`

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      deviceId,
      qty: quantity,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to update cart quantity: ${response.status}`)
  }

  const responseData = await response.json()
  const backendCart: BackendCart = responseData.data?.cart || responseData.data
  
  if (!backendCart || !Array.isArray(backendCart.items)) {
    throw new Error('Invalid cart response')
  }

  const items = backendCart.items.map(transformCartItem)
  
  return {
    items,
    total: calculateTotal(items),
  }
}
