'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { CONTACT_CONFIG } from '@/lib/config/contact';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

export const ContactMap: React.FC = () => {
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
    <section className="py-16 md:py-24 bg-white dark:bg-[#0B1220] transition-colors duration-200" aria-label="Map & Directions">
      <Container>
        {/* Section Header */}
        <motion.div {...fadeUpProps} className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Location Map
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-manrope tracking-tight">
            Find Our Pharmacy Store
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Main pharmacy and diagnostics fulfillment store location.
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          {...fadeUpProps}
          className="relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 min-h-[380px] flex flex-col items-center justify-center p-8 text-center shadow-soft"
        >
          {/* Note: Google Maps placeholder container.
              // TODO: Replace with Client Google Maps Embed Iframe URL when provided. */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-indigo-900/20 pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
              <MapPin className="w-8 h-8" aria-hidden="true" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-manrope">
              Digiclinix Pharmacy Center
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {CONTACT_CONFIG.address}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                href={CONTACT_CONFIG.googleMapsUrl}
                variant="primary"
                size="md"
                leftIcon={<Navigation className="w-4 h-4" aria-hidden="true" />}
                rightIcon={<ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get directions on Google Maps — opens in new tab"
              >
                Get Directions
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
