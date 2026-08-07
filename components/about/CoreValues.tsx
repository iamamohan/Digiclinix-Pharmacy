'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { ShieldCheck, Award, Heart, Sparkles, Accessibility } from 'lucide-react';

const VALUES = [
  {
    id: 'trust',
    icon: <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />,
    title: 'Clinical Trust',
    description: 'Every prescription and order is thoroughly verified by experienced pharmacists to ensure patient safety.',
  },
  {
    id: 'quality',
    icon: <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />,
    title: 'Uncompromised Quality',
    description: 'We source 100% genuine medications directly from licensed pharmaceutical manufacturers.',
  },
  {
    id: 'care',
    icon: <Heart className="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true" />,
    title: 'Patient Care',
    description: 'Putting patient health, privacy, and personal guidance at the center of all our pharmacy services.',
  },
  {
    id: 'innovation',
    icon: <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />,
    title: 'Digital Innovation',
    description: 'Streamlining prescription uploads, product browsing, and express doorstep delivery.',
  },
  {
    id: 'accessibility',
    icon: <Accessibility className="w-6 h-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />,
    title: 'Universal Access',
    description: 'Ensuring essential health supplies and prescription support are accessible to everyone, everywhere.',
  },
];

export const CoreValues: React.FC = () => {
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
    <section className="py-16 md:py-24 bg-white dark:bg-[#0B1220] transition-colors duration-200" aria-label="Core Values">
      <Container>
        {/* Section Header */}
        <motion.div {...fadeUpProps} className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            What Drives Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-manrope tracking-tight">
            Our Core Values
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            The foundational principles that guide our clinical practices and customer service every single day.
          </p>
        </motion.div>

        {/* 5-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {VALUES.map((item) => (
            <motion.div
              key={item.id}
              {...fadeUpProps}
              className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-manrope mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-inter">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
