'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { CONTACT_CONFIG } from '@/lib/config/contact';
import { Phone, Mail, MapPin, MessageSquare, Clock } from 'lucide-react';

const CONTACT_CARDS = [
  {
    id: 'phone',
    icon: <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />,
    title: 'Phone Support',
    value: CONTACT_CONFIG.phone,
    description: 'Speak directly with our pharmacy customer care team.',
    href: `tel:${CONTACT_CONFIG.phoneRaw}`,
    actionLabel: 'Call Phone Number',
  },
  {
    id: 'email',
    icon: <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />,
    title: 'Email Us',
    value: CONTACT_CONFIG.email,
    description: 'Send us your medical or service enquiries anytime.',
    href: `mailto:${CONTACT_CONFIG.email}`,
    actionLabel: 'Send Email',
  },
  {
    id: 'whatsapp',
    icon: <MessageSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />,
    title: 'WhatsApp Assistant',
    value: CONTACT_CONFIG.whatsapp,
    description: 'Quick prescription assistance and direct chat support.',
    href: CONTACT_CONFIG.whatsappUrl,
    isExternal: true,
    actionLabel: 'Open WhatsApp Chat',
  },
  {
    id: 'address',
    icon: <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />,
    title: 'Pharmacy Store Address',
    value: CONTACT_CONFIG.address,
    description: 'Main Diagnostics & Prescription Fulfillment Hub.',
    href: CONTACT_CONFIG.googleMapsUrl,
    isExternal: true,
    actionLabel: 'View on Map',
  },
  {
    id: 'hours',
    icon: <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />,
    title: 'Operating Hours',
    value: CONTACT_CONFIG.businessHours,
    description: '24/7 digital prescription upload and online support.',
    actionLabel: null,
  },
];

export const ContactInfo: React.FC = () => {
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
    <section className="py-16 md:py-24 bg-white dark:bg-[#0B1220] transition-colors duration-200" aria-label="Contact Information">
      <Container>
        {/* Section Header */}
        <motion.div {...fadeUpProps} className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Communication Channels
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-manrope tracking-tight">
            How to Reach Us
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Choose your preferred communication method to connect with our healthcare specialists.
          </p>
        </motion.div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {CONTACT_CARDS.map((card) => (
            <motion.div
              key={card.id}
              {...fadeUpProps}
              className="p-6 rounded-2xl bg-slate-50/70 dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-manrope mb-1">
                  {card.title}
                </h3>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 font-inter break-words mb-2">
                  {card.value}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-inter">
                  {card.description}
                </p>
              </div>

              {card.href && (
                <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800/80">
                  <a
                    href={card.href}
                    target={card.isExternal ? '_blank' : undefined}
                    rel={card.isExternal ? 'noopener noreferrer' : undefined}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{card.actionLabel}</span>
                    <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
