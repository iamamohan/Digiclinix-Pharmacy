import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Container } from '../ui/Container';
import { Phone, Mail, ShieldCheck, Truck, Stethoscope, RotateCcw } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm" role="contentinfo" aria-label="Global Footer">
      {/* Top Banner / 4 Trust Badges */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-8">
        <Container className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
          {/* Badge 1 */}
          <div className="flex items-center justify-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 text-left">
            <div className="w-12 h-12 rounded-xl bg-purple-950/70 border border-purple-800/50 text-purple-400 shrink-0 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 shrink-0" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-white text-sm leading-snug">100% Genuine Healthcare Products</h4>
              <p className="text-xs text-slate-400 mt-0.5">Directly sourced & certified</p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="flex items-center justify-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 text-left">
            <div className="w-12 h-12 rounded-xl bg-purple-950/70 border border-purple-800/50 text-purple-400 shrink-0 flex items-center justify-center">
              <Truck className="w-6 h-6 shrink-0" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-white text-sm leading-snug">Fast Express Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Quick doorstep dispatch</p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="flex items-center justify-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 text-left">
            <div className="w-12 h-12 rounded-xl bg-purple-950/70 border border-purple-800/50 text-purple-400 shrink-0 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 shrink-0" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-white text-sm leading-snug">Expert Pharmacist Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Licensed clinical guidance</p>
            </div>
          </div>

          {/* Badge 4 */}
          <div className="flex items-center justify-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 text-left">
            <div className="w-12 h-12 rounded-xl bg-purple-950/70 border border-purple-800/50 text-purple-400 shrink-0 flex items-center justify-center">
              <RotateCcw className="w-6 h-6 shrink-0" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-white text-sm leading-snug">Easy Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free return policy</p>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Footer Links */}
      <div className="py-12 md:py-16">
        <Container className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Contact */}
          <div className="space-y-4">
            <Logo showSubtitle={true} />
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Digiclinix Pharmacy delivers high-quality pharmaceutical care, prescription fulfillment, and wellness products with modern digital convenience.
            </p>
            <div className="pt-2 space-y-2.5 text-xs">
              <a
                href="https://wa.me/919182015238"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-sm"
                aria-label="Contact Digiclinix Pharmacy on WhatsApp"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp: +91 91820 15238</span>
              </a>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>support@digiclinix.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide">Quick Navigation</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 rounded-xs">Home Page</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 rounded-xs">Browse Medicines</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 rounded-xs">About Digiclinix</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 rounded-xs">Contact Healthcare Team</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Concise Healthcare Categories */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide">Product Categories</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/products?category=pain-relief" className="hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 rounded-xs">Pain Relief</Link>
              </li>
              <li>
                <Link href="/products?category=vitamins" className="hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 rounded-xs">Vitamins</Link>
              </li>
              <li>
                <Link href="/products?category=personal-care" className="hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 rounded-xs">Personal Care</Link>
              </li>
              <li>
                <Link href="/products?category=healthcare-essentials" className="hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 rounded-xs">Healthcare Essentials</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Hours & Emergency Support */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide">Operating Hours</h3>
            <div className="space-y-2 text-xs text-slate-400">
              <p><strong className="text-slate-200">Mon – Fri:</strong> 8:00 AM – 10:00 PM</p>
              <p><strong className="text-slate-200">Saturday:</strong> 9:00 AM – 8:00 PM</p>
              <p><strong className="text-slate-200">Sunday:</strong> 10:00 AM – 6:00 PM</p>
              <div className="mt-4 p-3 rounded-lg bg-purple-950/40 border border-purple-900/60 text-purple-300 text-xs">
                <span className="font-bold text-white block mb-0.5">Emergency Support 24/7</span>
                Reach out on WhatsApp or call for urgent prescription inquiries.
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Medical Disclaimer & Copyright */}
      <div className="border-t border-slate-900 py-6 bg-slate-950">
        <Container className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center md:text-left">
          <div>
            <p>© {new Date().getFullYear()} Digiclinix Pharmacy. All rights reserved.</p>
            <p className="mt-1 text-[11px] text-slate-600 max-w-2xl">
              Medical Disclaimer: Information on this site is provided for informational purposes and is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-3">
            <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-purple-900/40 text-slate-400 hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400" aria-label="Facebook Page">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-purple-900/40 text-slate-400 hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400" aria-label="Instagram Page">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-purple-900/40 text-slate-400 hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400" aria-label="LinkedIn Page">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-purple-900/40 text-slate-400 hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400" aria-label="Twitter Page">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
};
