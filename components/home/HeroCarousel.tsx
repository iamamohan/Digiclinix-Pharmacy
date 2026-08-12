'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, ShieldCheck } from 'lucide-react';
import { CONTACT_CONFIG } from '@/lib/config/contact';

interface SlideCta {
  text: string;
  href: string;
  isExternal?: boolean;
}

interface Slide {
  id: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  primaryCta: SlideCta;
  secondaryCta: SlideCta;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 1,
    eyebrow: '100% CERTIFIED ONLINE PHARMACY',
    title: 'Your Trusted Online Pharmacy',
    subtitle: 'Trusted medicines and healthcare essentials, delivered with care.',
    image: '/images/hero/hero-slide-1.png',
    primaryCta: { text: 'Explore Medicines', href: '/products' },
    secondaryCta: { text: 'Shop Now', href: '/products' },
  },
  {
    id: 2,
    eyebrow: 'FAST & CONVENIENT DELIVERY',
    title: 'Shop Medicines, Get Them Delivered',
    subtitle: 'Browse trusted medicines and healthcare essentials, place your order online, and get them delivered conveniently to your doorstep.',
    image: '/images/hero/hero-slide-2.png',
    primaryCta: { text: 'Order Medicines', href: '/products' },
    secondaryCta: { text: 'Track Orders', href: '/account/orders' },
  },
  {
    id: 3,
    eyebrow: 'NEED HELP WITH YOUR ORDER?',
    title: "We're Here to Help",
    subtitle: 'Have questions about medicines, orders, or delivery? Get in touch with our support team through WhatsApp or contact us directly.',
    image: '/images/hero/sky-blue-hero-3-wide.png',
    primaryCta: { text: 'Contact Us', href: '/contact' },
    secondaryCta: {
      text: 'WhatsApp Us',
      href: CONTACT_CONFIG.whatsappUrl,
      isExternal: true,
    },
  },
];

export const HeroCarousel: React.FC = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const touchStartX = useRef<number | null>(null);

  const shouldReduceMotion = useReducedMotion();

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // 6-second smooth auto-play
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, shouldReduceMotion, nextSlide]);

  // Touch gesture handlers for mobile
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (category) params.set('category', category);
    router.push(`/products?${params.toString()}`);
  };

  const currentSlide = HERO_SLIDES[currentIndex];

  return (
    <section
      aria-label="Digiclinix Pharmacy Hero Carousel"
      className="relative w-full overflow-hidden bg-[#D1EFF1] dark:bg-slate-950 min-h-[520px] sm:min-h-[560px] md:min-h-[600px] lg:min-h-[640px] flex items-center justify-center py-12 sm:py-16 transition-colors duration-200 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      tabIndex={0}
    >
      {/* 100% Crisp Visible Background Image Layer for all 3 Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: 'easeInOut' }}
          className="absolute inset-0 z-0 pointer-events-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={currentSlide.image}
            alt={currentSlide.title}
            fill
            priority={currentIndex === 0}
            sizes="100vw"
            className="object-cover object-center w-full h-full opacity-100"
          />
        </motion.div>
      </AnimatePresence>

      {/* Main Hero Content Area (Centered & Protected Zone matching Reference Typography) */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center w-full my-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeOut' }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Category / Eyebrow Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/85 dark:bg-slate-900/80 backdrop-blur-xs text-purple-700 dark:text-purple-300 text-[11px] sm:text-xs font-extrabold tracking-wider border border-purple-200/70 dark:border-purple-800/60 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>{currentSlide.eyebrow}</span>
            </div>

            {/* Hero Title — Dark Slate Charcoal font matching provided reference screenshot */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#213242] dark:text-white font-manrope leading-[1.08] tracking-tight max-w-[850px] mx-auto drop-shadow-xs">
              {currentSlide.title}
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-medium max-w-[680px] mx-auto">
              {currentSlide.subtitle}
            </p>

            {/* Unified Search Input Component */}
            <form onSubmit={handleSearchSubmit} className="w-full max-w-xl mx-auto pt-1 sm:pt-2">
              <div className="flex items-center rounded-full bg-white shadow-xl p-1.5 border border-slate-100/90 transition-all focus-within:ring-2 focus-within:ring-[#213242]">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer pl-4 pr-1 py-2 rounded-l-full hover:text-slate-900 shrink-0"
                  aria-label="Filter by Category"
                >
                  <option value="">All category</option>
                  <option value="Pain Relief">Pain Relief</option>
                  <option value="Antibiotics">Antibiotics</option>
                  <option value="Vitamins & Supplements">Vitamins &amp; Supplements</option>
                  <option value="Digestive Health">Digestive Health</option>
                  <option value="Allergy Relief">Allergy Relief</option>
                  <option value="Diabetes Care">Diabetes Care</option>
                </select>

                <div className="w-[1px] h-6 bg-slate-200 shrink-0" aria-hidden="true" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for something fun..."
                  className="w-full px-4 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none font-medium"
                  aria-label="Search medicines"
                />

                <button
                  type="submit"
                  className="p-2.5 rounded-full text-slate-500 hover:text-[#213242] transition-colors focus:outline-none shrink-0 mr-1"
                  aria-label="Submit Search"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </form>

            {/* Primary & Secondary Action Pill Buttons */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap pt-1">
              <Link
                href={currentSlide.primaryCta.href}
                className="px-7 py-3 rounded-full bg-[#233544] hover:bg-[#182733] text-white text-xs sm:text-sm font-bold shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {currentSlide.primaryCta.text}
              </Link>

              {currentSlide.secondaryCta.isExternal ? (
                <a
                  href={currentSlide.secondaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3 rounded-full bg-white hover:bg-slate-50 text-[#213242] text-xs sm:text-sm font-bold border border-slate-200/90 shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {currentSlide.secondaryCta.text}
                </a>
              ) : (
                <Link
                  href={currentSlide.secondaryCta.href}
                  className="px-7 py-3 rounded-full bg-white hover:bg-slate-50 text-[#213242] text-xs sm:text-sm font-bold border border-slate-200/90 shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {currentSlide.secondaryCta.text}
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Left Navigation Arrow Control (Hidden on mobile, visible on medium+ screens) */}
      <button
        type="button"
        onClick={prevSlide}
        className="hidden md:flex absolute left-3 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/10 hover:bg-black/25 text-slate-800 dark:text-white items-center justify-center transition-all backdrop-blur-xs focus:outline-none"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Right Navigation Arrow Control (Hidden on mobile, visible on medium+ screens) */}
      <button
        type="button"
        onClick={nextSlide}
        className="hidden md:flex absolute right-3 sm:right-6 lg:left-auto lg:right-8 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/10 hover:bg-black/25 text-slate-800 dark:text-white items-center justify-center transition-all backdrop-blur-xs focus:outline-none"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Pagination 3-Dot Indicators (. o .) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrentIndex(index)}
            className={`transition-all rounded-full focus:outline-none ${
              index === currentIndex
                ? 'w-3 h-3 bg-transparent border-2 border-[#213242] dark:border-white scale-110'
                : 'w-2 h-2 bg-[#213242]/50 dark:bg-white/50 hover:bg-[#213242]'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Subtle Bottom Transition to Main Body */}
      <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-12 bg-gradient-to-t from-white/60 to-transparent dark:from-[#0B1220]/60 dark:to-transparent pointer-events-none z-10" />
    </section>
  );
};
