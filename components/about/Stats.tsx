'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Package, Clock, Truck, ShieldCheck } from 'lucide-react';

/**
 * Note: These statistical metrics are professional placeholder values.
 * They will be replaced with real client operational metrics in production.
 */
const STATS = [
  { id: 'products', value: '500+', label: 'Healthcare Products', icon: <Package className="w-5 h-5 text-blue-500" aria-hidden="true" /> },
  { id: 'support', value: '24/7', label: 'Pharmacist Guidance', icon: <Clock className="w-5 h-5 text-emerald-500" aria-hidden="true" /> },
  { id: 'delivery', value: 'Fast', label: 'Express Delivery', icon: <Truck className="w-5 h-5 text-indigo-500" aria-hidden="true" /> },
  { id: 'genuine', value: '100%', label: 'Genuine Products', icon: <ShieldCheck className="w-5 h-5 text-purple-500" aria-hidden="true" /> },
];

export const Stats: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUpProps = {
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' as const },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.5,
      ease: 'easeOut' as const,
    },
  };

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-[#0B1220] transition-colors duration-200" aria-label="Key Performance Indicators">
      <Container>
        <motion.div
          {...fadeUpProps}
          className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-soft grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {STATS.map((stat) => (
            <div key={stat.id} className="text-center space-y-2">
              <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white/10 border border-white/10 mb-1">
                {stat.icon}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-manrope tracking-tight text-white">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium font-inter">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};
