import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products, findProductBySlug } from '@/lib/data';
import ProductDetailView from '@/components/product/ProductDetailView';
import RelatedProducts from '@/components/product/RelatedProducts';
import { formatINR } from '@/lib/utils';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = findProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - Radiance`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = findProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductDetailView product={product} />
      <RelatedProducts currentProduct={product} />
    </>
  );
}
