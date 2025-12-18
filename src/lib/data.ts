import { Product, Category } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Golden Elegance Choker Necklace',
    slug: 'golden-elegance-choker-necklace',
    category: 'Necklaces',
    price: 2499,
    discountedPrice: 1799,
    material: 'Gold-plated brass with cubic zirconia',
    description: 'An exquisite choker necklace featuring intricate gold plating and sparkling cubic zirconia stones. Perfect for weddings and special occasions. The delicate craftsmanship ensures a luxurious look while remaining comfortable for all-day wear.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800&q=80',
    ],
    stock: 15,
    tags: ['Bestseller', 'New'],
    variants: [
      { type: 'Color', options: ['Gold', 'Rose Gold'] },
    ],
    createdAt: new Date('2024-12-01'),
  },
  {
    id: '2',
    name: 'Pearl Drop Earrings',
    slug: 'pearl-drop-earrings',
    category: 'Earrings',
    price: 899,
    discountedPrice: 649,
    material: 'Sterling silver with freshwater pearls',
    description: 'Timeless pearl drop earrings that add elegance to any outfit. These earrings feature lustrous freshwater pearls set in sterling silver, creating a classic and sophisticated look.',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
      'https://images.unsplash.com/photo-1596944946731-7e8e2877bde6?w=800&q=80',
    ],
    stock: 28,
    tags: ['Bestseller'],
    createdAt: new Date('2024-11-20'),
  },
  {
    id: '3',
    name: 'Royal Kundan Ring',
    slug: 'royal-kundan-ring',
    category: 'Rings',
    price: 1599,
    discountedPrice: 1199,
    material: 'Brass with kundan stones and meenakari work',
    description: 'A stunning kundan ring featuring traditional Indian craftsmanship. The intricate meenakari work on the reverse side showcases the attention to detail. Perfect for ethnic wear and festive occasions.',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&q=80',
    ],
    stock: 12,
    tags: ['New'],
    variants: [
      { type: 'Size', options: ['6', '7', '8', '9'] },
    ],
    createdAt: new Date('2024-12-10'),
  },
  {
    id: '4',
    name: 'Designer Bangle Set',
    slug: 'designer-bangle-set',
    category: 'Bangles',
    price: 3499,
    discountedPrice: 2799,
    material: 'Gold-plated brass with Austrian crystals',
    description: 'Set of 4 designer bangles adorned with sparkling Austrian crystals. Each bangle is uniquely designed with intricate patterns. These bangles create a stunning statement when worn together.',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80',
    ],
    stock: 8,
    tags: ['Bestseller'],
    variants: [
      { type: 'Size', options: ['2.4', '2.6', '2.8'] },
      { type: 'Color', options: ['Gold', 'Silver'] },
    ],
    createdAt: new Date('2024-11-15'),
  },
  {
    id: '5',
    name: 'Bridal Necklace & Earring Set',
    slug: 'bridal-necklace-earring-set',
    category: 'Sets',
    price: 5999,
    discountedPrice: 4499,
    material: 'Gold-plated with polki stones and pearls',
    description: 'Complete bridal jewelry set featuring a statement necklace and matching earrings. Adorned with traditional polki stones and lustrous pearls. This set is perfect for brides looking for authentic Indian jewelry with a contemporary touch.',
    images: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    ],
    stock: 5,
    tags: ['New', 'Bestseller'],
    variants: [
      { type: 'Color', options: ['Gold', 'Antique Gold'] },
    ],
    createdAt: new Date('2024-12-05'),
  },
  {
    id: '6',
    name: 'Delicate Chain Necklace',
    slug: 'delicate-chain-necklace',
    category: 'Necklaces',
    price: 1299,
    discountedPrice: 899,
    material: 'Gold-plated stainless steel',
    description: 'A minimalist chain necklace perfect for everyday wear. The delicate design makes it versatile enough to layer with other pieces or wear alone for a subtle statement.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    ],
    stock: 35,
    tags: ['New'],
    createdAt: new Date('2024-12-08'),
  },
  {
    id: '7',
    name: 'Chandelier Earrings',
    slug: 'chandelier-earrings',
    category: 'Earrings',
    price: 1799,
    discountedPrice: 1299,
    material: 'Oxidized silver with colorful beads',
    description: 'Statement chandelier earrings featuring bohemian design with colorful beads and oxidized silver. These earrings are perfect for adding a pop of color and personality to any ethnic outfit.',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
      'https://images.unsplash.com/photo-1596944946731-7e8e2877bde6?w=800&q=80',
    ],
    stock: 18,
    tags: ['Bestseller'],
    createdAt: new Date('2024-11-25'),
  },
  {
    id: '8',
    name: 'Diamond-cut Bangles Pair',
    slug: 'diamond-cut-bangles-pair',
    category: 'Bangles',
    price: 1999,
    discountedPrice: 1499,
    material: 'Gold-plated brass with diamond-cut finish',
    description: 'Pair of exquisite bangles with diamond-cut pattern that catches light beautifully. The intricate cutting creates a sparkling effect that mimics real diamonds.',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80',
    ],
    stock: 22,
    tags: ['New'],
    variants: [
      { type: 'Size', options: ['2.4', '2.6', '2.8'] },
    ],
    createdAt: new Date('2024-12-12'),
  },
  {
    id: '9',
    name: 'Solitaire Ring',
    slug: 'solitaire-ring',
    category: 'Rings',
    price: 2299,
    discountedPrice: 1699,
    material: 'Sterling silver with cubic zirconia',
    description: 'Classic solitaire ring featuring a brilliant cubic zirconia stone. The timeless design makes it perfect for engagements or as a fashion statement. The prongs are designed to maximize light reflection.',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&q=80',
    ],
    stock: 14,
    tags: ['Bestseller'],
    variants: [
      { type: 'Size', options: ['5', '6', '7', '8', '9'] },
    ],
    createdAt: new Date('2024-11-28'),
  },
  {
    id: '10',
    name: 'Temple Jewelry Set',
    slug: 'temple-jewelry-set',
    category: 'Sets',
    price: 4999,
    discountedPrice: 3999,
    material: 'Gold-plated brass with temple design',
    description: 'Traditional South Indian temple jewelry set including necklace, earrings, and maang tikka. Features goddess motifs and intricate temple architecture designs. Perfect for classical dance performances and traditional weddings.',
    images: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80',
    ],
    stock: 6,
    tags: ['New'],
    createdAt: new Date('2024-12-03'),
  },
];

export function getBestSellers(): Product[] {
  return products.filter(p => p.tags.includes('Bestseller'));
}

export function getNewArrivals(): Product[] {
  return products
    .filter(p => p.tags.includes('New'))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter(p => p.category === category);
}

export function findProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export const categories: Category[] = ['Necklaces', 'Earrings', 'Rings', 'Bangles', 'Sets'];
