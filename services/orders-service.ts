export interface Order {
  id: string
  date: string
  total: string
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled"
  items: number
}

// Backend order structure
interface BackendOrder {
  _id: string
  orderNumber: string
  createdAt: string
  totalAmount: number
  status: string
  items: any[] | number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8018'

import { formatPriceShort } from "@/lib/api-utils"

/**
 * Format date to readable string
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleString('en-US', { month: 'short' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

/**
 * Map backend status to frontend status
 */
const mapStatus = (backendStatus: string): "Processing" | "Shipped" | "Delivered" | "Cancelled" => {
  const statusMap: Record<string, "Processing" | "Shipped" | "Delivered" | "Cancelled"> = {
    'pending': 'Processing',
    'processing': 'Processing',
    'confirmed': 'Processing',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
  }
  return statusMap[backendStatus.toLowerCase()] || 'Processing'
}

/**
 * Transform backend order to frontend format
 */
const transformOrder = (backendOrder: BackendOrder): Order => {
  return {
    id: backendOrder.orderNumber || backendOrder._id,
    date: formatDate(backendOrder.createdAt),
    total: formatPriceShort(backendOrder.totalAmount),
    status: mapStatus(backendOrder.status),
    items: Array.isArray(backendOrder.items) ? backendOrder.items.length : (typeof backendOrder.items === 'number' ? backendOrder.items : 0),
  }
}

/**
 * Fetch user's orders
 */
export const fetchOrders = async (): Promise<Order[]> => {
  const url = `${API_BASE_URL}/api/v1/orders`

  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      // If no orders found (404), return empty array
      if (response.status === 404) {
        return []
      }
      throw new Error(`Failed to fetch orders: ${response.status}`)
    }

    const responseData = await response.json()
    
    // Extract orders from response: { success: true, data: { items: [...], pagination: {...} } }
    let backendOrders: BackendOrder[] = []

    if (responseData.data?.items && Array.isArray(responseData.data.items)) {
      backendOrders = responseData.data.items
    } else if (responseData.data && Array.isArray(responseData.data)) {
      backendOrders = responseData.data
    } else if (responseData.items && Array.isArray(responseData.items)) {
      backendOrders = responseData.items
    } else if (Array.isArray(responseData)) {
      backendOrders = responseData
    }

    return backendOrders.map(transformOrder)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}
