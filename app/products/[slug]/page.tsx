import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { productService } from '@/services/product.service';
import { generateProductMetadata, generateProductJsonLd } from '@/lib/utils/seo';
import { MedicineDetail } from '@/components/products/MedicineDetail';

interface MedicinePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MedicinePageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);
  return generateProductMetadata(product);
}

export default async function MedicineDetailPage({ params }: MedicinePageProps) {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related active products from the same category
  const categoryResult = await productService.list({
    category: product.category,
    isActive: true,
    pageSize: 5,
  });

  const relatedProducts = categoryResult.products.filter((p) => p.id !== product.id).slice(0, 4);

  const jsonLdData = generateProductJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonHtml(JSON.stringify(jsonLdData)) }}
      />
      <MedicineDetail product={product} relatedProducts={relatedProducts} />
    </>
  );
}

function escapeJsonHtml(str: string): string {
  return str.replace(/</g, '\\u003c');
}
