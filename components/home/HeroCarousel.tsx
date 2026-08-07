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

  // Autoplay timer 6s (Disabled if user prefers reduced motion)
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;
    const interval = setInterval(nextSlide, 6000);
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
      className="relative w-full overflow-hidden bg-slate-950 py-16 md:py-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        Slide {currentIndex + 1} of {SLIDES.length}: {currentSlide.title}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bounded Hero Card Container */}
        <div className="relative w-full overflow-hidden rounded-2xl min-h-[500px] md:min-h-[560px] flex items-center px-6 sm:px-12 py-10 shadow-2xl border border-white/10">
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
              {/* Dark gradient overlay fully occupying 100% of the image card for text legibility with zero gap */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-slate-950/25 z-10" />

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
          <div className="relative z-20 max-w-2xl text-white">
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
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-purple-200 text-xs font-bold tracking-wide border border-purple-500/40 shadow-lg shadow-purple-500/10">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shrink-0" aria-hidden="true" />
                  <span>{currentSlide.badge}</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-manrope">
                  {currentSlide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
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
                      className="border-white/30 text-white hover:bg-white/10 dark:hover:bg-white/10"
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

      {/* Navigation Controls: Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-white/20 text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" aria-hidden="true" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/60 hover:bg-slate-900 border border-white/20 text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className={`transition-all rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${index === currentIndex
                ? 'w-8 h-2.5 bg-blue-500'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
              }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : 'false'}
          />
        ))}
      </div>
    </section>
  );
};
