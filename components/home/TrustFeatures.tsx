'use client';

import React from 'react';
import { ShieldCheck, Truck, Stethoscope, RotateCcw } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { FeatureCard } from '@/components/ui/FeatureCard';

const TRUST_FEATURES = [
  {
    id: 'genuine',
    title: '100% Genuine Healthcare Products',
    description: 'Certified authentic medications and healthcare items sourced directly from licensed pharmaceutical manufacturers.',
    icon: <ShieldCheck className="w-6 h-6" aria-hidden="true" />,
  },
  {
    id: 'delivery',
    title: 'Fast Express Delivery',
    description: 'Rapid doorstep dispatch and real-time tracking for urgent prescription and healthcare needs.',
    icon: <Truck className="w-6 h-6" aria-hidden="true" />,
  },
  {
    id: 'support',
    title: 'Expert Pharmacist Support',
    description: 'Professional guidance and prescription assistance from experienced licensed pharmacists.',
    icon: <Stethoscope className="w-6 h-6" aria-hidden="true" />,
  },
  {
    id: 'returns',
    title: 'Easy Returns',
    description: 'Transparent, hassle-free return policy with quick refund processing for eligible medical products.',
    icon: <RotateCcw className="w-6 h-6" aria-hidden="true" />,
  },
];

export const TrustFeatures: React.FC = () => {
  return (
    <section
      className="py-16 md:py-24 bg-slate-50/60 dark:bg-[#0B1220] border-y border-slate-200/60 dark:border-slate-800/60 transition-colors duration-200"
      aria-label="Trust Credentials & Features"
    >
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Why Choose Digiclinix
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-manrope tracking-tight">
            Trusted Pharmaceutical Excellence
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Combining digital speed with clinical safety to deliver reliable healthcare directly to your home.
          </p>
        </div>

        {/* 4-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {TRUST_FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};
