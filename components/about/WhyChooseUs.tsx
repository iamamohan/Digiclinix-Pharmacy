'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { ShieldCheck, Truck, Lock, Stethoscope, Tag, FileText } from 'lucide-react';

const BENEFITS = [
  {
    id: 'genuine',
    icon: <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />,
    title: 'Genuine Medicines',
    description: '100% authentic medications sourced directly from licensed pharmaceutical brands.',
  },
  {
    id: 'delivery',
    icon: <Truck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />,
    title: 'Fast Express Delivery',
    description: 'Prompt doorstep dispatch and real-time order tracking for urgent health supplies.',
  },
  {
    id: 'secure',
    icon: <Lock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />,
    title: 'Secure & Confidential',
    description: 'Encrypted order processing and strict privacy protocols for all prescription details.',
  },
  {
    id: 'support',
    icon: <Stethoscope className="w-6 h-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />,
    title: 'Expert Support',
    description: 'Professional guidance and prescription verification from experienced licensed pharmacists.',
  },
  {
    id: 'pricing',
    icon: <Tag className="w-6 h-6 text-teal-600 dark:text-teal-400" aria-hidden="true" />,
    title: 'Transparent Pricing',
    description: 'Fair, competitive healthcare pricing with no hidden costs or surprise fees.',
  },
  {
    id: 'prescription',
    icon: <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />,
    title: 'Easy Rx Upload',
    description: 'Quick digital prescription upload or direct WhatsApp ordering assistance.',
  },
];

export const WhyChooseUs: React.FC = () => {
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
    <section className="py-16 md:py-24 bg-slate-50/70 dark:bg-slate-900/60 border-y border-slate-200/60 dark:border-slate-800/60 transition-colors duration-200" aria-label="Why Choose Us">
      <Container>
        {/* Section Header */}
        <motion.div {...fadeUpProps} className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            The Digiclinix Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-manrope tracking-tight">
            Why Choose Digiclinix
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Delivering quality healthcare, certified medicines, and patient convenience under one roof.
          </p>
        </motion.div>

        {/* 6 Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {BENEFITS.map((item) => (
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
