import { Metadata } from 'next';
import CartView from '@/components/cart/CartView';

export const metadata: Metadata = {
  title: 'Shopping Cart - Radiance',
  description: 'Review your selected items and proceed to checkout',
};

export default function CartPage() {
  return <CartView />;
}
