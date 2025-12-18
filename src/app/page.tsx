import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import BestSellers from '@/components/home/BestSellers';
import NewArrivals from '@/components/home/NewArrivals';
import TrustBadges from '@/components/home/TrustBadges';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <BestSellers />
      <NewArrivals />
      <TrustBadges />
    </>
  );
}
