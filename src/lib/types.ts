export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  price: number;
  discountedPrice?: number;
  material: string;
  description: string;
  images: string[];
  stock: number;
  tags: ('New' | 'Bestseller')[];
  variants?: ProductVariant[];
  createdAt: Date;
}

export interface ProductVariant {
  type: 'Color' | 'Size';
  options: string[];
}

export type Category = 'Necklaces' | 'Earrings' | 'Rings' | 'Bangles' | 'Sets';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: {
    Color?: string;
    Size?: string;
  };
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'UPI' | 'Card' | 'COD';
}
