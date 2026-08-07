'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Heart, ShieldCheck, Truck, Stethoscope } from 'lucide-react';

const HIGHLIGHTS = [
  { id: 'patient', icon: <Heart className="w-5 h-5 text-red-500" aria-hidden="true" />, title: 'Patient-First Focus', text: 'Prioritizing safety, transparency, and personal healthcare guidance.' },
  { id: 'genuine', icon: <ShieldCheck className="w-5 h-5 text-blue-500" aria-hidden="true" />, title: '100% Genuine Products', text: 'Sourcing directly from certified pharmaceutical manufacturers.' },
  { id: 'delivery', icon: <Truck className="w-5 h-5 text-emerald-500" aria-hidden="true" />, title: 'Fast Doorstep Delivery', text: 'Prompt dispatch for prescription and healthcare supplies.' },
  { id: 'clinical', icon: <Stethoscope className="w-5 h-5 text-indigo-500" aria-hidden="true" />, title: 'Professional Guidance', text: 'Experienced pharmacists verifying every prescription.' },
];

export const CompanyStory: React.FC = () => {
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
    <section className="py-16 md:py-24 bg-white dark:bg-[#0B1220] transition-colors duration-200" aria-label="Company Story">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Story Content */}
          <motion.div {...fadeUpProps} className="space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
              Our Vision &amp; Story
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-manrope tracking-tight leading-tight">
              Combining Digital Innovation with <span className="text-blue-600 dark:text-blue-400">Clinical Safety</span>
            </h2>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Digiclinix Pharmacy was built with a clear purpose: to bridge the gap between traditional healthcare consultation and modern digital fulfillment. We believe accessing certified medications and essential health supplies should be safe, transparent, and hassle-free.
            </p>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Our clinical workflow combines licensed pharmacist verification with fast dispatch systems, ensuring every prescription is double-checked for accuracy before reaching your home.
            </p>

            {/* 4 Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-manrope">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Illustration */}
          <motion.div {...fadeUpProps} className="flex items-center justify-center lg:justify-end" aria-hidden="true">
            <div className="relative w-full max-w-md lg:max-w-lg aspect-square rounded-2xl overflow-hidden bg-blue-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-soft">
              <Image
                src="/images/about/company-story.png"
                alt="Digiclinix pharmacy vision illustration"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                className="object-contain p-4 drop-shadow-xl"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
