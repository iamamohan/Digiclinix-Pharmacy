'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { CONTACT_CONFIG } from '@/lib/config/contact';
import { ShoppingBag, Phone, Headphones } from 'lucide-react';

export const ContactHero: React.FC = () => {
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
      aria-labelledby="contact-hero-heading"
      className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden transition-colors duration-200"
    >
      {/* Background soft glow gradient */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Heading & Information */}
          <motion.div {...fadeUpProps} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-5">
              <Headphones className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Customer Support &amp; Healthcare Enquiries</span>
            </span>

            <h1
              id="contact-hero-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-manrope"
            >
              Get in Touch With <span className="text-blue-400">Digiclinix Pharmacy</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Have questions about prescription orders, medicine availability, or delivery services? Our healthcare support team and licensed pharmacists are here to assist you.
            </p>

            {/* CTAs */}
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
                href={`tel:${CONTACT_CONFIG.phoneRaw}`}
                variant="outline"
                size="lg"
                leftIcon={<Phone className="w-4 h-4" aria-hidden="true" />}
                className="border-slate-700 text-white hover:bg-slate-800"
              >
                Call Now
              </Button>

              <Button
                href={CONTACT_CONFIG.whatsappUrl}
                variant="outline"
                size="lg"
                leftIcon={<Phone className="w-4 h-4 text-emerald-400" aria-hidden="true" />}
                target="_blank"
                rel="noopener noreferrer"
                className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40"
              >
                WhatsApp Support
              </Button>
            </div>
          </motion.div>

          {/* Right Column: Hero Illustration */}
          <motion.div {...fadeUpProps} className="flex items-center justify-center lg:justify-end" aria-hidden="true">
            <div className="relative w-full max-w-md lg:max-w-lg aspect-4/3 rounded-2xl overflow-hidden bg-slate-800/40 border border-slate-800 p-4 shadow-soft">
              <Image
                src="/images/contact/contact-hero.png"
                alt="Digiclinix pharmacy support desk illustration"
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
