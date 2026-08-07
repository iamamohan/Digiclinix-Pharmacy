import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ProductsHero } from '@/components/products/ProductsHero';
import { ProductsCatalog } from '@/components/products/ProductsCatalog';
import { Container } from '@/components/ui/Container';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: 'Medical Products & Healthcare Catalog | Digiclinix Pharmacy',
  description:
    'Search and filter certified prescription medications, wellness products, healthcare supplies, and diagnostic lab fulfillment from Digiclinix Pharmacy.',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Medical Products & Healthcare Catalog | Digiclinix Pharmacy',
    description:
      'Explore certified prescription drugs, healthcare supplies, and wellness items directly fulfilled by licensed pharmacists.',
    siteName: 'Digiclinix Pharmacy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medical Products Catalog | Digiclinix Pharmacy',
    description: 'Explore certified prescription drugs and healthcare supplies.',
  },
};

function CatalogLoadingFallback() {
  return (
    <div className="w-full space-y-6">
      <div className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="w-full">
      {/* Products Hero */}
      <ProductsHero />

      {/* Main Catalog Section with React Suspense Boundary */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-[#0B1220] transition-colors duration-200" aria-label="Products Catalog">
        <Container>
          <Suspense fallback={<CatalogLoadingFallback />}>
            <ProductsCatalog />
          </Suspense>
        </Container>
      </section>
    </div>
  );
}
