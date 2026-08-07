'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { MapPin, Clock, Phone, Mail, Navigation, ExternalLink } from 'lucide-react';

const GOOGLE_MAPS_SEARCH_URL =
  'https://www.google.com/maps/search/?api=1&query=Digiclinix+Pharmacy';

export const Location: React.FC = () => {
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
    <section className="py-16 md:py-24 bg-white dark:bg-[#0B1220] transition-colors duration-200" aria-label="Pharmacy Location & Hours">
      <Container>
        {/* Section Header */}
        <motion.div {...fadeUpProps} className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Visit Our Store
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-manrope tracking-tight">
            Location &amp; Business Hours
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Find our pharmacy store location, contact details, and daily operating schedule.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
          {/* Left Column: Contact & Hours Info Card */}
          <motion.div
            {...fadeUpProps}
            className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-soft flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                  <MapPin className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Store Address
                  </h3>
                  <p className="text-base font-semibold text-slate-900 dark:text-white font-manrope">
                    Digiclinix Pharmacy &amp; Diagnostics Center
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Official Pharmacy Partner Location, Main Healthcare Hub, Hyderabad, Telangana - 500001
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Clock className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Operating Hours
                  </h3>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white font-manrope">
                    Monday &ndash; Saturday: 8:00 AM &ndash; 10:00 PM
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white font-manrope mt-0.5">
                    Sunday: 9:00 AM &ndash; 8:00 PM
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                    24/7 Digital Prescription Upload &amp; WhatsApp Support Available
                  </p>
                </div>
              </div>

              {/* Direct Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/60">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                  <div className="truncate">
                    <span className="text-xs text-slate-400 block">Phone Support</span>
                    <a href="tel:+919182015238" className="text-xs font-semibold text-slate-900 dark:text-white hover:text-blue-600 truncate block">
                      +91 91820 15238
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-slate-800/60">
                  <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
                  <div className="truncate">
                    <span className="text-xs text-slate-400 block">Email Us</span>
                    <a href="mailto:support@digiclinix.com" className="text-xs font-semibold text-slate-900 dark:text-white hover:text-blue-600 truncate block">
                      support@digiclinix.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Directions Button */}
            <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-slate-800/60">
              <Button
                href={GOOGLE_MAPS_SEARCH_URL}
                variant="primary"
                size="md"
                leftIcon={<Navigation className="w-4 h-4" aria-hidden="true" />}
                rightIcon={<ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
                aria-label="Get Directions to Digiclinix Pharmacy on Google Maps"
              >
                Get Directions
              </Button>
            </div>
          </motion.div>

          {/* Right Column: Map Container */}
          <motion.div
            {...fadeUpProps}
            className="relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 min-h-[340px] flex flex-col items-center justify-center p-6 text-center shadow-soft"
          >
            {/* Note: Google Maps iframe embed template.
                When client shares official Google Maps embed URL, replace iframe src below. */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-indigo-900/20 pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30">
                <MapPin className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-manrope">
                Interactive Map View
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Click below to open store location in Google Maps for real-time navigation.
              </p>
              <Button
                href={GOOGLE_MAPS_SEARCH_URL}
                variant="outline"
                size="sm"
                leftIcon={<Navigation className="w-3.5 h-3.5" aria-hidden="true" />}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Google Maps
              </Button>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
