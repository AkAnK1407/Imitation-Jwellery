import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=1920&q=80"
          alt="Luxury jewellery"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 text-balance">
          Elegance Redefined
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-2xl mx-auto">
          Discover our exquisite collection of handcrafted imitation jewellery. 
          Timeless designs that capture the essence of luxury.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="px-8 py-3 bg-gold-600 hover:bg-gold-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Shop Collection
          </Link>
          <Link
            href="/shop?category=Sets"
            className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg transition-colors border border-white/30"
          >
            View Sets
          </Link>
        </div>
      </div>
    </section>
  );
}
