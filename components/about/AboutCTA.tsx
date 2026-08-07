'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Phone, ArrowRight } from 'lucide-react';

const WHATSAPP_URL =
  'https://wa.me/919182015238?text=Hello%20Digiclinix%2C%20I%20would%20like%20to%20order%20medicines%20or%20ask%20about%20your%20services.';

export const AboutCTA: React.FC = () => {
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
            Your Health Comes First
          </h2>

          <p className="text-base sm:text-lg text-blue-100 leading-relaxed font-normal">
            Whether you need certified prescription fulfillment, diagnostic support, or personal pharmacist guidance, Digiclinix is here for you.
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
              href="/contact"
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
              className="border-white/40 text-white hover:bg-white/10 dark:hover:bg-white/10 w-full sm:w-auto"
            >
              Contact Us
            </Button>

            <Button
              href={WHATSAPP_URL}
              variant="outline"
              size="lg"
              leftIcon={<Phone className="w-4 h-4 text-emerald-300" aria-hidden="true" />}
              target="_blank"
              rel="noopener noreferrer"
              className="border-emerald-400/40 text-emerald-200 hover:bg-white/10 dark:hover:bg-white/10 w-full sm:w-auto"
            >
              WhatsApp Order
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
