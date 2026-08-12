import React from 'react';
import { SerializedProduct } from '@/types/product';
import { ProductCard } from '@/components/ui/ProductCard';

export interface ProductGridProps {
  products: SerializedProduct[];
  onEdit?: (product: SerializedProduct) => void;
  onDelete?: (product: SerializedProduct) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
