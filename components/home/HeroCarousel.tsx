'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Phone, ShoppingBag, ShieldCheck, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SlideBtn {
  text: string;
  href: string;
  icon?: React.ReactNode;
  isExternal?: boolean;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  primaryBtn: SlideBtn;
  secondaryBtn?: SlideBtn;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    badge: '24/7 Doorstep Delivery',
    title: '24/7 Prescription Delivery',
    subtitle: 'Fast, certified prescription fulfillment and healthcare supplies delivered right to your doorstep.',
    image: '/images/hero/hero-1.png',
    primaryBtn: { text: 'Browse Products', href: '/products', icon: <ShoppingBag className="w-4 h-4" aria-hidden="true" /> },
    secondaryBtn: {
      text: 'WhatsApp Order',
      href: 'https://wa.me/919182015238?text=Hello%20Digiclinix%2C%20I%20would%20like%20to%20order%20medicines.%20Please%20assist%20me.',
      icon: <Phone className="w-4 h-4" aria-hidden="true" />,
      isExternal: true,
    },
  },
  {
    id: 2,
    badge: '100% Authentic Quality',
    title: '100% Genuine Medicines',
    subtitle: 'Guaranteed authentic healthcare products directly sourced from certified pharmaceutical manufacturers.',
    image: '/images/hero/hero-2.png',
    primaryBtn: { text: 'Explore Catalog', href: '/products', icon: <ShieldCheck className="w-4 h-4" aria-hidden="true" /> },
  },
  {
    id: 3,
    badge: 'Clinical Excellence',
    title: 'Diagnostics & Lab Services',
    subtitle: 'Comprehensive clinical diagnostic report fulfillment and healthcare lab testing support.',
    image: '/images/hero/hero-3.png',
    primaryBtn: { text: 'Contact Specialist', href: '/contact', icon: <Stethoscope className="w-4 h-4" aria-hidden="true" /> },
  },
  {
    id: 4,
    badge: 'Expert Medical Guidance',
    title: 'Healthcare Consultation',
    subtitle: 'Connect with experienced licensed pharmacists for professional prescription assistance and health guidance.',
    image: '/images/hero/hero-4.png',
    primaryBtn: {
      text: 'WhatsApp Support',
      href: 'https://wa.me/919182015238?text=Hello%20Digiclinix%2C%20I%20need%20healthcare%20consultation%20support.',
      icon: <Phone className="w-4 h-4" aria-hidden="true" />,
      isExternal: true,
    },
  },
];

export const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Accessibility: Reduced motion check
  const shouldReduceMotion = useReducedMotion();

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Autoplay timer 5s (Disabled if user prefers reduced motion)
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, shouldReduceMotion, nextSlide]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  // Keyboard navigation listener
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <section
      aria-label="Hero Carousel"
      className="relative w-full overflow-hidden bg-[#EBF3FF] dark:bg-slate-950 py-12 md:py-16 transition-colors duration-200"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Decorative ambient background glows using matching soft blue/indigo tones */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#DCE7FE]/60 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4E3FF]/50 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        Slide {currentIndex + 1} of {SLIDES.length}: {currentSlide.title}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bounded Hero Card Container */}
        <div className="relative w-full overflow-hidden rounded-3xl min-h-[500px] md:min-h-[560px] flex items-center px-6 sm:px-12 py-10 shadow-xl border border-[#DCE7FE] dark:border-purple-500/20 bg-white dark:bg-slate-900">
          {/* Background Image Carousel with Framer Motion Fade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
              className="absolute inset-0 z-0"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Light/Dark gradient overlay: solid white behind left text, 100% clear on right image */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 via-45% to-transparent dark:from-slate-950 dark:via-slate-950/85 dark:via-45% dark:to-transparent z-10" />

              <Image
                src={currentSlide.image}
                alt={currentSlide.title}
                fill
                priority={currentIndex === 0}
                fetchPriority={currentIndex === 0 ? 'high' : 'auto'}
                loading={currentIndex === 0 ? 'eager' : 'lazy'}
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-center scale-105"
              />
            </motion.div>
          </AnimatePresence>

          {/* Slide Content Overlay */}
          <div className="relative z-20 max-w-2xl text-slate-900 dark:text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
                className="space-y-6"
              >
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-purple-100/90 dark:bg-slate-950/80 backdrop-blur-md text-purple-700 dark:text-purple-200 text-xs font-bold tracking-wide border border-purple-200 dark:border-purple-500/40 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse shrink-0" aria-hidden="true" />
                  <span>{currentSlide.badge}</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-manrope">
                  {currentSlide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {currentSlide.subtitle}
                </p>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Button
                    href={currentSlide.primaryBtn.href}
                    variant="primary"
                    size="lg"
                    leftIcon={currentSlide.primaryBtn.icon}
                    target={currentSlide.primaryBtn.isExternal ? '_blank' : undefined}
                    rel={currentSlide.primaryBtn.isExternal ? 'noopener noreferrer' : undefined}
                  >
                    {currentSlide.primaryBtn.text}
                  </Button>

                  {currentSlide.secondaryBtn && (
                    <Button
                      href={currentSlide.secondaryBtn.href}
                      variant="outline"
                      size="lg"
                      leftIcon={currentSlide.secondaryBtn.icon}
                      className="border-slate-300 dark:border-white/30 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                      target={currentSlide.secondaryBtn.isExternal ? '_blank' : undefined}
                      rel={currentSlide.secondaryBtn.isExternal ? 'noopener noreferrer' : undefined}
                    >
                      {currentSlide.secondaryBtn.text}
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Controls: Arrows (Hidden on mobile responsive screens to prevent text overlap) */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/90 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" aria-hidden="true" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/90 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" aria-hidden="true" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 ${index === currentIndex
                ? 'w-8 h-2.5 bg-purple-600 dark:bg-purple-500'
                : 'w-2.5 h-2.5 bg-slate-300 dark:bg-white/40 hover:bg-slate-400 dark:hover:bg-white/70'
              }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : 'false'}
          />
        ))}
      </div>
    </section>
  );
};
