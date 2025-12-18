# Radiance - Premium Imitation Jewellery E-commerce

A production-ready, mobile-first e-commerce frontend for premium imitation jewellery, built with Next.js 16 (App Router), Tailwind CSS v4, and Context API.

## 🚀 Features

- **Modern Tech Stack**: Next.js 16 with App Router, TypeScript, Tailwind CSS v4
- **State Management**: Context API with LocalStorage persistence for shopping cart
- **Mobile-First Design**: Responsive, luxury/minimal aesthetic with soft shadows and gold accents
- **Image-Heavy**: Optimized images via next/image with remote patterns for Unsplash and Cloudinary
- **Conversion-Focused**: Sticky cart buttons, free shipping progress bars, trust badges
- **URL Sync**: Shop filters and sorting synced with URL query parameters
- **Form Validations**: Indian mobile number (^[6-9]\d{9}$) and pincode (^\d{6}$) validations
- **SEO Optimized**: Metadata per page, clean slugs, static generation for product pages
- **Skeleton Loaders**: Smooth transitions with skeleton loading states (no spinners)

## 📦 Stack Overview

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API + LocalStorage
- **Fonts**: Playfair Display (headings), Inter (body)
- **Images**: Remote patterns for images.unsplash.com and res.cloudinary.com

## 🏗️ Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page
│   ├── shop/page.tsx        # Shop listing page
│   ├── products/[slug]/page.tsx  # Product detail pages
│   ├── cart/page.tsx        # Shopping cart
│   └── checkout/page.tsx    # Checkout page
├── components/
│   ├── home/                # Home page components
│   │   ├── Hero.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── BestSellers.tsx
│   │   ├── NewArrivals.tsx
│   │   └── TrustBadges.tsx
│   ├── product/             # Product components
│   │   ├── ProductCard.tsx
│   │   ├── Price.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── VariantSelector.tsx
│   │   ├── QuantitySelector.tsx
│   │   ├── RelatedProducts.tsx
│   │   └── ProductDetailView.tsx
│   ├── filters/             # Filter & sort components
│   │   ├── Filters.tsx
│   │   └── SortControl.tsx
│   ├── shop/
│   │   └── ShopView.tsx     # Shop page with URL sync
│   ├── cart/                # Cart components
│   │   ├── CartView.tsx
│   │   ├── CartItemRow.tsx
│   │   └── CartSummary.tsx
│   ├── checkout/            # Checkout components
│   │   ├── CheckoutView.tsx
│   │   └── CheckoutSummary.tsx
│   └── layout/              # Layout components
│       ├── Navbar.tsx
│       └── Footer.tsx
├── context/
│   └── CartContext.tsx      # Cart state management
└── lib/
    ├── types.ts             # TypeScript interfaces
    ├── data.ts              # Mock product data
    └── utils.ts             # Utility functions

```

## 📄 Pages

1. **Home (/)**: Hero banner, category grid, best sellers, new arrivals, trust badges
2. **Shop (/shop)**: Product listing with category/price filters, sort controls, URL-synced filters
3. **Product Detail (/products/[slug])**: Image gallery with zoom, variants, quantity selector, related products
4. **Cart (/cart)**: Shopping cart with quantity controls, free shipping progress, order summary
5. **Checkout (/checkout)**: Address form with validations, payment method selection (UPI/Card/COD)

## 🎨 Design Features

- **Luxury Typography**: Serif headings (Playfair Display), sans-serif body (Inter)
- **Soft Shadows**: Custom shadow utilities for depth
- **Gold Accents**: Custom gold color palette (#d89e3d primary)
- **Smooth Transitions**: Micro-interactions on hover and click
- **Skeleton Loaders**: Better UX during filter/sort transitions
- **Sticky Elements**: Mobile-friendly sticky add-to-cart and checkout buttons

## 🛒 Shopping Cart

- **Quantity Bounds**: 1-10 items per product variant
- **Per-Variant Lines**: Different variants of same product are separate cart items
- **LocalStorage Persistence**: Cart survives page reloads
- **Free Shipping**: Free shipping on orders ≥₹999, otherwise ₹79 fee
- **Progress Bar**: Visual indicator for free shipping threshold

## 📊 Mock Data

- **10 Products**: Across 5 categories (Necklaces, Earrings, Rings, Bangles, Sets)
- **Product Details**: Price, discountedPrice, material, description, stock, tags, variants
- **Images**: High-quality product images from Unsplash
- **Helper Functions**: getBestSellers, getNewArrivals, getProductsByCategory, findProductBySlug

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

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

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🔍 Key Flows

### Browse & Filter
1. Visit home page to see hero, categories, bestsellers, new arrivals
2. Click any category to navigate to /shop with category filter applied
3. On /shop: adjust filters and sorting; URL updates; skeleton loaders appear during transitions

### Product Detail
1. Click any product to view detail page
2. Image gallery with thumbnails and click-to-zoom modal
3. Select variant (if available) and adjust quantity (1-10)
4. Add to cart - navbar badge updates immediately
5. Cart persists across page reloads (LocalStorage)

### Checkout Flow
1. View cart with quantity controls, remove items
2. Free shipping progress bar shows how much more to add for free shipping
3. Proceed to checkout
4. Fill form with validations:
   - Email: standard email format
   - Mobile: 10-digit Indian mobile (starts with 6-9)
   - Pincode: 6-digit Indian pincode
   - State: dropdown of Indian states
5. Select payment method (UPI/Card/COD - placeholders)
6. Place order (demo - no real payment processing)

## ⚠️ Important Notes

- **No Backend**: This is a frontend-only application
- **Mock Data**: All products are mock data with remote images
- **LocalStorage Cart**: Cart state persists in browser LocalStorage
- **Demo Checkout**: No real payment processing; shows success message
- **Remote Images**: Requires next.config.mjs image patterns for Unsplash/Cloudinary

## 🎯 Acceptance Criteria Met

✅ Builds successfully with `npm run build`  
✅ Runs with `npm run dev`  
✅ Home page with all sections  
✅ Category navigation to /shop with filters  
✅ Shop page with working filters, sorting, and URL sync  
✅ Product detail with image gallery, variants, and add to cart  
✅ Cart with quantity controls and free shipping progress  
✅ Checkout with form validations (email, mobile, pincode)  
✅ Mobile-responsive with sticky buttons  
✅ LocalStorage cart persistence  
✅ Skeleton loaders during transitions  

## 📱 Mobile Optimization

- Sticky add-to-cart bar on product detail page
- Sticky checkout button on cart and checkout pages
- Collapsible filters on shop page
- Touch-friendly buttons and controls
- Optimized images for mobile devices

## 🎨 Customization

### Colors
Edit `src/app/globals.css` to customize the gold color palette and other theme colors.

### Products
Edit `src/lib/data.ts` to add/modify products, categories, or helper functions.

### Shipping
Adjust `SHIPPING_THRESHOLD` and `SHIPPING_FEE` in `src/context/CartContext.tsx`.

## 📝 License

This project is for demonstration purposes.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
