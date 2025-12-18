import { Metadata } from 'next';
import CheckoutView from '@/components/checkout/CheckoutView';

export const metadata: Metadata = {
  title: 'Checkout - Radiance',
  description: 'Complete your purchase securely',
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
