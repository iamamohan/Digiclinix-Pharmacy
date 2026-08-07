'use client';

import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Sparkles, ArrowRight, AlertCircle, Package } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  // Fetch top 4 latest products to serve as featured collection
  const { products, isLoading, error, refetch } = useProducts({
    pageSize: 4,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-[#0B1220] transition-colors duration-200" aria-label="Featured Products">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Featured Collection</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-manrope tracking-tight">
              Popular Healthcare Products
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-2xl">
              Explore our certified medications, diagnostic supplies, and daily health essentials.
            </p>
          </div>

          {/* View All Products CTA Button */}
          <div className="shrink-0">
            <Button
              href="/products"
              variant="outline"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
              className="border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500"
            >
              View All Products
            </Button>
          </div>
        </div>

        {/* Loading Skeleton State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error Retry State */}
        {!isLoading && error && (
          <EmptyState
            icon={<AlertCircle className="w-12 h-12 text-red-500" aria-hidden="true" />}
            title="Unable to load featured products"
            description={error}
            onRetry={refetch}
          />
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <EmptyState
            icon={<Package className="w-12 h-12 text-slate-400" aria-hidden="true" />}
            title="No products available"
            description="Our pharmacy catalog is currently being updated. Check back shortly for new stock."
            actionText="Browse Products"
            actionHref="/products"
          />
        )}

        {/* Live Products Grid */}
        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Bottom Banner CTA for Mobile */}
        <div className="mt-12 text-center md:hidden">
          <Button
            href="/products"
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
            className="w-full sm:w-auto"
          >
            View All Products Catalog
          </Button>
        </div>
      </Container>
    </section>
  );
};
