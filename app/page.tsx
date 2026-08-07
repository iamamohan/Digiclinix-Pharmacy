import React from 'react';
import { Metadata } from 'next';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { TrustFeatures } from '@/components/home/TrustFeatures';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { PrescriptionBanner } from '@/components/home/PrescriptionBanner';

export const metadata: Metadata = {
  title: 'Digiclinix Pharmacy | Certified Online Medical Care & Prescription Fulfillment',
  description:
    'Fast, certified prescription fulfillment, genuine healthcare products, clinical consultations, and express doorstep delivery by licensed pharmacists.',
  openGraph: {
    title: 'Digiclinix Pharmacy — Certified Online Medical Care',
    description: 'Guaranteed 100% genuine medicines and fast express delivery directly to your doorstep.',
    siteName: 'Digiclinix Pharmacy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digiclinix Pharmacy — Certified Online Medical Care',
    description: 'Certified prescription fulfillment & healthcare supplies.',
  },
};

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Phase 5A: Hero Carousel */}
      <HeroCarousel />

      {/* Phase 5B: Trust Features */}
      <TrustFeatures />

      {/* Phase 5C: Featured Products */}
      <FeaturedProducts />

      {/* Phase 5D: Upload Prescription Banner */}
      <PrescriptionBanner />
    </div>
  );
}
