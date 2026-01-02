export interface ProductDetail {
  id: string
  title: string
  price: string
  oldPrice?: string
  description: string
  image: string
  images: string[]
  vendor: string
  type: string
  sku: string
  availability: "Available" | "Out of Stock"
  tag?: {
    label: string
    variant: "primary" | "secondary"
  }
}

// Backend API product structure (from MongoDB)
interface BackendProductDetail {
  _id: string
  sku: string
  name: string
  slug: string
  description: string
  images: string[]
  thumbnail: string
  categoryId: string[]
  price: number
  mrp: number
  currency: string
  stockQty: number
  isActive: boolean
  isNewArrival: boolean
  isBestSeller: boolean
  tags?: string[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8018'

import { formatPrice } from "@/lib/api-utils"

/**
 * Transform backend product to frontend product detail format
 */
const transformProductDetail = (backendProduct: BackendProductDetail): ProductDetail => {
  const product: ProductDetail = {
    id: backendProduct._id,
    title: backendProduct.name,
    price: formatPrice(backendProduct.price),
    description: backendProduct.description || '',
    image: backendProduct.thumbnail || (backendProduct.images?.[0]) || '/img/placeholder.webp',
    images: Array.isArray(backendProduct.images) && backendProduct.images.length > 0 
      ? backendProduct.images 
      : [backendProduct.thumbnail || '/img/placeholder.webp'],
    vendor: 'Privora',
    type: 'Jewelry',
    sku: backendProduct.sku || '',
    availability: backendProduct.stockQty > 0 ? 'Available' : 'Out of Stock',
  }

  // Add old price if MRP is higher than price
  if (backendProduct.mrp && backendProduct.mrp > backendProduct.price) {
    product.oldPrice = formatPrice(backendProduct.mrp)
  }

  // Add tag based on product flags
  if (backendProduct.isNewArrival) {
    product.tag = { label: 'New Arrival', variant: 'primary' }
  } else if (backendProduct.isBestSeller) {
    product.tag = { label: 'Best Seller', variant: 'secondary' }
  }

  return product
}

export const fetchProductDetail = async (productId: string): Promise<ProductDetail> => {
  const url = `${API_BASE_URL}/api/v1/products/${productId}`

  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product details: ${response.status} ${response.statusText}`)
  }

  const responseData = await response.json()
  
  // Handle the exact API response format:
  // { success: true, message: "OK", data: { product: {...} } }
  
  let backendProduct: BackendProductDetail | null = null

  // Extract product from nested structure
  if (responseData.data?.product) {
    backendProduct = responseData.data.product
  } else if (responseData.data && responseData.data._id) {
    // Fallback: product directly in data
    backendProduct = responseData.data
  } else if (responseData.product) {
    // Fallback: product at top level
    backendProduct = responseData.product
  } else if (responseData._id) {
    // Fallback: product data at top level
    backendProduct = responseData
  }

  if (!backendProduct) {
    throw new Error('Product not found in API response')
  }

  return transformProductDetail(backendProduct)
}
