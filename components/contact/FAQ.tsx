'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    id: 'delivery',
    question: 'Do you deliver medicines to my location?',
    answer:
      'Yes, Digiclinix Pharmacy offers doorstep delivery for certified prescription medications, wellness products, and healthcare supplies within our designated delivery zones.',
  },
  {
    id: 'prescription',
    question: 'How do I upload my doctor’s prescription?',
    answer:
      'You can upload your prescription directly on our website using the Upload Prescription banner or send a photo of your prescription to our WhatsApp support team at +91 91820 15238.',
  },
  {
    id: 'support',
    question: 'How can I contact healthcare support?',
    answer:
      'You can reach our healthcare support team via Phone at +91 91820 15238, Email at support@digiclinix.com, WhatsApp chat, or by submitting the contact form on this page.',
  },
  {
    id: 'payment',
    question: 'What payment methods are accepted?',
    answer:
      'We accept all major credit/debit cards, net banking, UPI payments, popular mobile wallets, and Cash on Delivery (COD) for eligible orders.',
  },
  {
    id: 'time',
    question: 'How long does delivery usually take?',
    answer:
      'Express local deliveries are typically fulfilled within same-day or 24 hours after prescription verification by our licensed pharmacists.',
  },
];

export const FAQ: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>('delivery');

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

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
    <section className="py-16 md:py-24 bg-slate-50/70 dark:bg-slate-900/60 border-y border-slate-200/60 dark:border-slate-800/60 transition-colors duration-200" aria-label="Frequently Asked Questions">
      <Container>
        {/* Section Header */}
        <motion.div {...fadeUpProps} className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Common Questions</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-manrope tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Quick answers to common questions about our prescription services and delivery.
          </p>
        </motion.div>

        {/* Accordion Container */}
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            const buttonId = `faq-btn-${faq.id}`;
            const panelId = `faq-panel-${faq.id}`;

            return (
              <motion.div
                key={faq.id}
                {...fadeUpProps}
                className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft overflow-hidden transition-all duration-200"
              >
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <span className="text-base font-bold text-slate-900 dark:text-white font-manrope">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={shouldReduceMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={shouldReduceMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
