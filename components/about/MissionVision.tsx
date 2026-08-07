'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Target, Compass } from 'lucide-react';

export const MissionVision: React.FC = () => {
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
    <section className="py-16 md:py-24 bg-slate-50/70 dark:bg-slate-900/60 border-y border-slate-200/60 dark:border-slate-800/60 transition-colors duration-200" aria-label="Mission & Vision">
      <Container>
        {/* Section Header */}
        <motion.div {...fadeUpProps} className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Our Purpose
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-manrope tracking-tight">
            Mission &amp; Vision
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Guided by clinical standards and dedicated to patient care excellence.
          </p>
        </motion.div>

        {/* 2 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <motion.div
            {...fadeUpProps}
            className="p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <Target className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-manrope mb-3">
                Our Mission
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-inter">
                To deliver authentic, certified pharmaceutical care and health products with speed, safety, and professional pharmacist oversight, making quality healthcare easily accessible to every patient.
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            {...fadeUpProps}
            className="p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-manrope mb-3">
                Our Vision
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-inter">
                To become the premier trusted digital pharmacy platform, recognized for clinical excellence, transparent service, patient-first care, and reliable healthcare product fulfillment.
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
