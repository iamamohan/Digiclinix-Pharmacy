import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { PackageCheck, ShieldCheck } from 'lucide-react';

export const ProductsHero: React.FC = () => {
  return (
    <section
      aria-labelledby="products-hero-heading"
      className="py-12 md:py-16 bg-slate-900 text-white relative overflow-hidden transition-colors duration-200"
    >
      {/* Background soft glow gradient */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column: Heading & Information */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <PackageCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Certified Catalog</span>
            </div>

            <h1
              id="products-hero-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-manrope"
            >
              Medical Products &amp; Healthcare Essentials
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Browse certified medicines, wellness products, healthcare supplies, and prescription medications directly fulfilled by licensed pharmacists.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" aria-hidden="true" />
                <span>100% Genuine Supplies</span>
              </div>
              <span className="hidden sm:inline text-slate-600">&bull;</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>Verified Quality</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Illustration */}
          <div className="flex items-center justify-center lg:justify-end" aria-hidden="true">
            <div className="relative w-full max-w-sm lg:max-w-md aspect-4/3 rounded-2xl overflow-hidden bg-slate-800/40 border border-slate-800 p-4 shadow-soft">
              <Image
                src="/images/products/products-hero.png"
                alt="Healthcare products illustration"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                className="object-contain p-2 drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
