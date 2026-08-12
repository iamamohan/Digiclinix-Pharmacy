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
  bgPosition: string;
  primaryCta: SlideCta;
  secondaryCta: SlideCta;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 1,
    eyebrow: '100% CERTIFIED ONLINE PHARMACY',
    title: 'Your Trusted Online Pharmacy',
    subtitle: 'Trusted healthcare products, conveniently delivered to your door.',
    image: '/images/hero/hero-slide-1-new.png',
    bgPosition: 'center center',
    primaryCta: { text: 'Explore Medicines', href: '/products' },
    secondaryCta: { text: 'Shop Now', href: '/products' },
  },
  {
    id: 2,
    eyebrow: 'FAST & CONVENIENT DELIVERY',
    title: 'Shop Medicines, Get Them Delivered',
    subtitle: 'Browse trusted medicines and healthcare essentials, place your order online, and get them delivered conveniently to your doorstep.',
    image: '/images/hero/hero-slide-2-v3.png',
    bgPosition: '50% 45%',
    primaryCta: { text: 'Order Medicines', href: '/products' },
    secondaryCta: { text: 'Track Orders', href: '/account/orders' },
  },
  {
    id: 3,
    eyebrow: 'NEED HELP WITH YOUR ORDER?',
    title: "We're Here to Help",
    subtitle: 'Have questions about medicines, orders, or delivery? Get in touch with our support team through WhatsApp or contact us directly.',
    image: '/images/hero/hero-slide-3-new.png',
    bgPosition: 'center center',
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
      className="hero-carousel relative w-full overflow-hidden select-none"
      style={{ background: '#c5eaf0' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      tabIndex={0}
    >
      {/* ── Background Image Layer ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentSlide.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeInOut' }}
          className="absolute inset-0 z-0 pointer-events-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={currentSlide.image}
            alt={currentSlide.title}
            fill
            priority
            quality={100}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            className="object-cover w-full h-full"
            style={{ objectPosition: currentSlide.bgPosition }}
          />
          {/* Subtle radial fade in the center to protect text readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 55% 70% at 50% 50%, rgba(197,234,240,0.45) 0%, transparent 80%)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Hero Content ── */}
      <div className="hero-content-wrapper relative z-20 flex flex-col items-center justify-center w-full px-4 sm:px-6">
        <div className="max-w-3xl w-full text-center mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentSlide.id}`}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: 'easeOut' }}
              className="space-y-5 sm:space-y-6"
            >
              {/* ── Eyebrow Badge ── */}
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-purple-700 text-[11px] sm:text-xs font-extrabold tracking-widest border border-purple-200/80 shadow-sm uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>{currentSlide.eyebrow}</span>
              </div>

              {/* ── Main Heading ── */}
              <h1
                className="font-extrabold text-[#1a2d3f] font-manrope leading-[1.07] tracking-tight mx-auto"
                style={{
                  fontSize: 'clamp(2rem, 5.5vw, 4rem)',
                  maxWidth: '820px',
                  textShadow: '0 1px 3px rgba(197,234,240,0.6)',
                }}
              >
                {currentSlide.title}
              </h1>

              {/* ── Subtitle ── */}
              <p
                className="text-slate-700 leading-relaxed font-medium mx-auto"
                style={{
                  fontSize: 'clamp(0.875rem, 1.4vw, 1.125rem)',
                  maxWidth: '640px',
                }}
              >
                {currentSlide.subtitle}
              </p>

              {/* ── Search Bar ── */}
              <form onSubmit={handleSearchSubmit} className="w-full max-w-xl mx-auto">
                <div className="flex items-center rounded-full bg-white shadow-xl border border-white/80 p-1.5 transition-all focus-within:ring-2 focus-within:ring-[#213242]/40 focus-within:shadow-2xl">
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

                  <div className="w-[1px] h-6 bg-slate-200 shrink-0 mx-1" aria-hidden="true" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search medicines..."
                    className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none font-medium"
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

              {/* ── CTA Buttons ── */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                <Link
                  href={currentSlide.primaryCta.href}
                  className="px-7 py-3 rounded-full bg-[#1a2d3f] hover:bg-[#0f1e2a] text-white text-xs sm:text-sm font-bold shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {currentSlide.primaryCta.text}
                </Link>

                {currentSlide.secondaryCta.isExternal ? (
                  <a
                    href={currentSlide.secondaryCta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-7 py-3 rounded-full bg-white hover:bg-slate-50 text-[#1a2d3f] text-xs sm:text-sm font-bold border border-slate-200/80 shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    {currentSlide.secondaryCta.text}
                  </a>
                ) : (
                  <Link
                    href={currentSlide.secondaryCta.href}
                    className="px-7 py-3 rounded-full bg-white hover:bg-slate-50 text-[#1a2d3f] text-xs sm:text-sm font-bold border border-slate-200/80 shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    {currentSlide.secondaryCta.text}
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Left Arrow ── */}
      <button
        type="button"
        onClick={prevSlide}
        className="hidden md:flex absolute left-5 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-slate-800 items-center justify-center transition-all shadow-md backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#213242]"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* ── Right Arrow ── */}
      <button
        type="button"
        onClick={nextSlide}
        className="hidden md:flex absolute right-5 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-slate-800 items-center justify-center transition-all shadow-md backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#213242]"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ── Dot Indicators ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrentIndex(index)}
            className={`transition-all rounded-full focus:outline-none ${
              index === currentIndex
                ? 'w-3 h-3 bg-transparent border-2 border-[#1a2d3f] scale-110 shadow-sm'
                : 'w-2 h-2 bg-[#1a2d3f]/40 hover:bg-[#1a2d3f]/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* ── Bottom Gradient Fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/50 to-transparent pointer-events-none z-10 dark:from-[#0B1220]/50" />
    </section>
  );
};
