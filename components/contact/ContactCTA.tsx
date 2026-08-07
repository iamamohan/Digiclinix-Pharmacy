'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { CONTACT_CONFIG } from '@/lib/config/contact';
import { ShoppingBag, Phone } from 'lucide-react';

export const ContactCTA: React.FC = () => {
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
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-950 dark:via-slate-900 dark:to-slate-950 text-white relative overflow-hidden transition-colors duration-200">
      {/* Decorative Blur Orbs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-400/10 blur-3xl" />
      </div>

      <Container className="relative z-10">
        <motion.div {...fadeUpProps} className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-manrope tracking-tight leading-tight text-white">
            Need Healthcare Assistance?
          </h2>

          <p className="text-base sm:text-lg text-blue-100 leading-relaxed font-normal">
            Whether you need urgent medicine delivery, prescription confirmation, or pharmacist support, we are here to help.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href="/products"
              variant="primary"
              size="lg"
              leftIcon={<ShoppingBag className="w-4 h-4" aria-hidden="true" />}
              className="bg-white text-blue-700 hover:bg-blue-50 dark:bg-white dark:text-blue-700 dark:hover:bg-blue-50 border-transparent shadow-lg shadow-blue-900/30 w-full sm:w-auto"
            >
              Browse Products
            </Button>

            <Button
              href={`tel:${CONTACT_CONFIG.phoneRaw}`}
              variant="outline"
              size="lg"
              leftIcon={<Phone className="w-4 h-4" aria-hidden="true" />}
              className="border-white/40 text-white hover:bg-white/10 dark:hover:bg-white/10 w-full sm:w-auto"
            >
              Call Now
            </Button>

            <Button
              href={CONTACT_CONFIG.whatsappUrl}
              variant="outline"
              size="lg"
              leftIcon={<Phone className="w-4 h-4 text-emerald-300" aria-hidden="true" />}
              target="_blank"
              rel="noopener noreferrer"
              className="border-emerald-400/40 text-emerald-200 hover:bg-white/10 dark:hover:bg-white/10 w-full sm:w-auto"
            >
              WhatsApp Support
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
