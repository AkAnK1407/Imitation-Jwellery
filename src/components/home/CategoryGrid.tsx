import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/lib/data';

const categoryImages: Record<string, string> = {
  Necklaces: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
  Earrings: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
  Rings: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
  Bangles: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
  Sets: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80',
};

export default function CategoryGrid() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
          Shop by Category
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our curated collections designed for every occasion
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/shop?category=${encodeURIComponent(category)}`}
            className="group relative aspect-square overflow-hidden rounded-2xl shadow-soft hover:shadow-soft-lg transition-shadow"
          >
            <Image
              src={categoryImages[category]}
              alt={category}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-end justify-center p-4">
              <h3 className="text-white font-serif font-semibold text-lg md:text-xl">
                {category}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
