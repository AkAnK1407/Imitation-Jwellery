# API Integration Documentation

## Overview
This document describes the complete frontend-to-backend API integration for the Imitation Jewellery e-commerce application.

## Backend API Configuration

### API Base URL
The application connects to the backend API at:
- Default: `http://localhost:8018`
- Configured via: `NEXT_PUBLIC_API_URL` environment variable

### Setting Up
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the API URL if different from default:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8018
   ```

## API Response Format

All backend endpoints return responses in this format:
```json
{
  "success": true,
  "message": "OK",
  "data": {
    // Response data here
  }
}
```

For list endpoints:
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50
    }
  }
}
```

## Implemented Endpoints

### Products
- **GET** `/api/v1/products` - List products with filtering
  - Query params: `sort`, `minPrice`, `maxPrice`, `page`, `limit`
  - Response: `data.items` array of products
  
- **GET** `/api/v1/products/:productId` - Get single product
  - Response: `data.product` object

### Cart
- **GET** `/api/v1/cart/:deviceId` - Get user cart
  - Uses localStorage deviceId for tracking
  - Response: `data.cart` object with items array
  
- **POST** `/api/v1/cart/items` - Add item to cart
  - Body: `{ deviceId, productId, qty }`
  - Response: Updated cart
  
- **PUT** `/api/v1/cart/items/:itemId` - Update cart item
  - Body: `{ deviceId, qty }`
  - Response: Updated cart
  
- **DELETE** `/api/v1/cart/items/:itemId?deviceId=xxx` - Remove cart item
  - Query param: `deviceId`
  - Response: Updated cart

### Wishlist
- **GET** `/api/v1/wishlist` - Get wishlist
  - Response: `data.wishlist` object with items array
  
- **POST** `/api/v1/wishlist/items` - Add to wishlist
  - Body: `{ productId }`
  - Response: Updated wishlist
  
- **DELETE** `/api/v1/wishlist/items/:wishlistItemId` - Remove from wishlist
  - Response: Updated wishlist

### Orders
- **GET** `/api/v1/orders` - List orders
  - Response: `data.items` array of orders

### Customer Profile
- **GET** `/api/v1/customers/me` - Get current customer
  - Response: `data.customer` object
  
- **PUT** `/api/v1/customers/me` - Update customer profile
  - Body: `{ name, email, phone }`
  - Response: Updated customer

### Addresses
- **GET** `/api/v1/customers/:customerId/addresses` - List addresses
  - Response: `data.items` array of addresses
  
- **POST** `/api/v1/customers/:customerId/addresses` - Create address
  - Body: `{ name, line1, line2, city, state, pincode, isDefault }`
  - Response: Created address
  
- **PUT** `/api/v1/customers/:customerId/addresses/:addressId` - Update address
  - Body: Address fields to update
  - Response: Updated address
  
- **DELETE** `/api/v1/customers/:customerId/addresses/:addressId` - Delete address
  - Response: Success message

## Data Transformation

### Backend to Frontend Mapping

#### Products
- `_id` → `id`
- `name` → `title`
- `price` (number) → `price` (formatted string "Rs. X,XXX.00")
- `mrp` → `oldPrice` (if mrp > price)
- `thumbnail` → `image`
- `isNewArrival`/`isBestSeller` → `tag`

#### Cart Items
- `_id` → `id`
- `productId._id` → `productId`
- `productId.name` → `name`
- `productId.price` → `price`
- `qty` → `quantity`
- `productId.thumbnail` → `image`

#### Wishlist Items
- `_id` → `id`
- `productId._id` → `productId`
- `productId.name` → `title`
- `productId.price` → `price` (formatted)
- `productId.thumbnail` → `image`

#### Orders
- `_id` or `orderNumber` → `id`
- `createdAt` → `date` (formatted: "12 Aug 2024")
- `totalAmount` → `total` (formatted: "Rs. 3,499")
- `status` → `status` (mapped to frontend statuses)

#### Addresses
- `_id` → `id`
- `line1, line2` → `address` (comma-separated)
- `city, state, pincode` → `cityZip` (comma-separated)

## DeviceId Management

The cart uses a `deviceId` stored in localStorage for tracking anonymous carts:
- Generated on first cart operation
- Format: `device-{timestamp}-{random}`
- Persists across sessions
- Stored in: `localStorage.getItem('deviceId')`

## React Query Integration

All services use React Query for:
- Caching
- Automatic refetching
- Optimistic updates
- Error handling

### Cache Keys
- `['cart']` - Cart data
- `['cart-count']` - Cart item count
- `['wishlist']` - Wishlist data
- `['wishlist-count']` - Wishlist item count
- `['orders']` - Orders list
- `['user-profile']` - User profile
- `['products']` - Products list

### Invalidation
All mutations automatically invalidate relevant queries:
- Cart mutations → invalidate `['cart']` and `['cart-count']`
- Wishlist mutations → invalidate `['wishlist']` and `['wishlist-count']`
- Profile updates → invalidate `['user-profile']`

## Utility Functions

Located in `lib/api-utils.ts`:

### `formatPrice(price: number): string`
Formats a number as Indian Rupees with decimals.
Example: `1464` → `"Rs. 1,464.00"`

### `formatPriceShort(amount: number): string`
Formats a number as Indian Rupees without decimals.
Example: `3499` → `"Rs. 3,499"`

### `parseAddressToBackend(address: string, cityZip: string)`
Parses frontend address format to backend format.
Returns: `{ line1, line2, city, state, pincode }`

### `formatAddressFromBackend(...)`
Formats backend address fields to frontend format.
Returns: `{ address, cityZip }`

## Error Handling

All services implement:
1. **Try-catch blocks** around API calls
2. **Fallback values** on errors (empty arrays/objects)
3. **Console logging** for debugging
4. **HTTP status checks** with appropriate error messages

Example:
```typescript
try {
  const response = await fetch(url)
  if (!response.ok) {
    if (response.status === 404) {
      return { items: [] } // Graceful fallback
    }
    throw new Error(`Failed: ${response.status}`)
  }
  // Process response
} catch (error) {
  console.error('Error:', error)
  return { items: [] } // Fallback
}
```

## Testing the Integration

### Prerequisites
1. Backend API running at `http://localhost:8018`
2. Database seeded with products

### Manual Testing Checklist
- [ ] Product list loads and displays correctly
- [ ] Product details page shows full information
- [ ] Add to cart updates cart badge
- [ ] Cart page shows items and calculates total
- [ ] Quantity increase/decrease works
- [ ] Remove from cart works
- [ ] Add to wishlist updates badge
- [ ] Remove from wishlist works
- [ ] Profile edit saves correctly
- [ ] Address add/edit/delete works
- [ ] Orders list loads from API

### Development Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Common Issues

### Issue: "0 Products" shown
**Cause**: API not running or incorrect URL
**Solution**: 
1. Verify backend is running: `curl http://localhost:8018/api/v1/products`
2. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Restart Next.js dev server after changing env vars

### Issue: Cart not persisting
**Cause**: localStorage not accessible or deviceId not generated
**Solution**: Check browser console for errors, verify localStorage is enabled

### Issue: CORS errors
**Cause**: Backend not configured to accept frontend origin
**Solution**: Configure backend CORS to allow `http://localhost:3000`

## API Service Files

All service files are located in `/services/`:
- `product-service.ts` - Product listing
- `product-details-service.ts` - Single product details
- `cart-service.ts` - Cart operations
- `wishlist-service.ts` - Wishlist operations
- `orders-service.ts` - Orders listing
- `auth-service.ts` - Customer profile and addresses
- `address-service.ts` - Address CRUD operations

## React Query Hooks

All hooks are located in `/hooks/`:
- `use-products.ts` - Products query
- `use-product-detail.ts` - Product details query
- `use-cart.ts` - Cart query and mutations
- `use-wishlist.ts` - Wishlist query and mutations
- `use-orders.ts` - Orders query
- `use-auth.ts` - User profile query and mutations
- `use-address.ts` - Address mutations
