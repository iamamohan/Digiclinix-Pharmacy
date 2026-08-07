'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Phone, ShieldCheck, HeartHandshake } from 'lucide-react';

const WHATSAPP_URL =
  'https://wa.me/919182015238?text=Hello%20Digiclinix%2C%20I%20would%20like%20to%20know%20more%20about%20your%20pharmacy%20services.';

export const AboutHero: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUpProps = {
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.5,
      ease: 'easeOut' as const,
    },
  };

  return (
    <section
      aria-labelledby="about-hero-heading"
      className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden transition-colors duration-200"
    >
      {/* Background glow effects */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Heading & Content */}
          <motion.div {...fadeUpProps} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-5">
              <HeartHandshake className="w-3.5 h-3.5" aria-hidden="true" />
              <span>About Digiclinix Pharmacy</span>
            </span>

            <h1
              id="about-hero-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-manrope"
            >
              Your Trusted Digital <span className="text-blue-400">Healthcare Partner</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Digiclinix Pharmacy is dedicated to providing certified medicines, authentic healthcare products, fast doorstep delivery, and professional clinical support for patients and families.
            </p>

            {/* CTAs matching standard hierarchy */}
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
              <Button
                href="/products"
                variant="primary"
                size="lg"
                leftIcon={<ShoppingBag className="w-4 h-4" aria-hidden="true" />}
              >
                Browse Products
              </Button>

              <Button
                href="/contact"
                variant="outline"
                size="lg"
                className="border-slate-700 text-white hover:bg-slate-800"
              >
                Contact Us
              </Button>

              <Button
                href={WHATSAPP_URL}
                variant="outline"
                size="lg"
                leftIcon={<Phone className="w-4 h-4 text-emerald-400" aria-hidden="true" />}
                target="_blank"
                rel="noopener noreferrer"
                className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40"
              >
                WhatsApp Order
              </Button>
            </div>

            {/* Trust points */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" aria-hidden="true" />
                <span>Certified Pharmacists</span>
              </div>
              <span className="text-slate-700">&bull;</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>100% Genuine Supplies</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Illustration */}
          <motion.div {...fadeUpProps} className="flex items-center justify-center lg:justify-end" aria-hidden="true">
            <div className="relative w-full max-w-md lg:max-w-lg aspect-4/3 rounded-2xl overflow-hidden bg-slate-800/40 border border-slate-800 p-4 shadow-soft">
              <Image
                src="/images/about/about-hero.png"
                alt="Digiclinix healthcare team illustration"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                className="object-contain p-2 drop-shadow-xl"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
