import { Metadata } from 'next';
import { SerializedProduct } from '@/types/product';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://digiclinixpharmacy.vercel.app';

export function getCanonicalProductUrl(slug: string): string {
  return `${SITE_URL}/products/${slug}`;
}

export function generateProductMetadata(product: SerializedProduct | null): Metadata {
  if (!product) {
    return {
      title: 'Medicine Not Found | Digiclinix Pharmacy',
      description: 'The requested medicine or healthcare product could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const title = product.seoTitle?.trim() || `${product.name} | Digiclinix Pharmacy`;
  const description =
    product.seoDescription?.trim() ||
    product.description?.trim() ||
    `${product.name} at Digiclinix Pharmacy. View product information, uses, warnings, price and availability.`;

  const canonicalUrl = getCanonicalProductUrl(product.slug);
  const isCrawlable = product.isActive;

  return {
    title,
    description,
    keywords: product.seoKeywords || undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: isCrawlable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Digiclinix Pharmacy',
      type: 'website',
      images: product.imageUrl
        ? [
            {
              url: product.imageUrl,
              width: 800,
              height: 800,
              alt: product.name,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export function generateProductJsonLd(product: SerializedProduct) {
  const stockQty = product.stockQuantity ?? (product.inStock ? 10 : 0);
  const availability = stockQty > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  const canonicalUrl = getCanonicalProductUrl(product.slug);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} available at Digiclinix Pharmacy.`,
    image: product.imageUrl ? [product.imageUrl] : [],
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability,
      url: canonicalUrl,
    },
  };
}
