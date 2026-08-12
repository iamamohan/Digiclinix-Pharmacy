'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SerializedProduct } from '@/types/product';
import { useCart, getAvailableStock } from '@/components/providers/cart-provider';
import { getCustomerStockStatusBadgeInfo } from '@/lib/utils/inventory';
import { calculateDiscountedPrice } from '@/lib/utils/discount';
import { formatCurrency } from '@/lib/utils/format';
import { convertFromINR, CURRENCY_NOTICE } from '@/lib/utils/currency';
import { ProductCard } from '@/components/ui/ProductCard';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Plus,
  Minus,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Info,
  Package,
  BookOpen,
  Star,
  Sparkles,
} from 'lucide-react';

interface MedicineDetailProps {
  product: SerializedProduct;
  relatedProducts: SerializedProduct[];
  userCurrency?: string;
}

export const MedicineDetail: React.FC<MedicineDetailProps> = ({
  product,
  relatedProducts,
  userCurrency = 'INR',
}) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  // Accordion Expand/Collapse States (closed by default)
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isUsesOpen, setIsUsesOpen] = useState(false);
  const [isWarningsOpen, setIsWarningsOpen] = useState(false);

  // Slider Ref for Related Recommendations
  const sliderRef = useRef<HTMLDivElement>(null);

  const availableStock = getAvailableStock(product);
  const stockQuantityNum = product.stockQuantity ?? (product.inStock ? 10 : 0);
  const stockBadge = getCustomerStockStatusBadgeInfo(stockQuantityNum);

  const basePriceNum = typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price);
  const discountPercentNum = typeof product.discount === 'string' ? parseFloat(product.discount) : (product.discount ?? 0);
  const discountCalc = calculateDiscountedPrice(basePriceNum, discountPercentNum);

  // Display-Only Localized Currency
  const localizedDiscounted = convertFromINR(discountCalc.discountedPrice, userCurrency);
  const localizedOriginal = convertFromINR(basePriceNum, userCurrency);

  const handleIncrement = () => {
    if (quantity < availableStock) setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (availableStock <= 0 || product.requiresPrescription) return;
    addItem(product, quantity);
  };

  // Carousel Slider Controls
  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-8 bg-slate-50 dark:bg-[#0B1220] min-h-screen transition-colors duration-200">
      <Container className="space-y-8">

        {/* ── Breadcrumb Navigation ── */}
        <nav
          className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium overflow-x-auto pb-1"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors whitespace-nowrap">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <Link href="/products" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors whitespace-nowrap">
            Medicines
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors whitespace-nowrap"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-bold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Medicines
        </Link>

        {/* ── Product Hero Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

          {/* Left Column: Full Occupancy Large Product Image Card */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft p-3 sm:p-4 flex flex-col items-center justify-center h-full relative overflow-hidden group">
              <div className="relative w-full h-full min-h-[300px] sm:min-h-[340px] rounded-2xl overflow-hidden bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-center p-1">
                {product.imageUrl && !imageError ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    priority
                    onError={() => setImageError(true)}
                    className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Package className="w-16 h-16" />
                    <span className="text-xs font-semibold">Image unavailable</span>
                  </div>
                )}

                {/* Discount Tag */}
                {discountCalc.hasDiscount && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-600 text-white shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {discountCalc.discountPercent}% OFF
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Compact Details & Checkout CTA Card */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft p-5 sm:p-6 flex flex-col justify-between h-full space-y-3.5">
              <div className="space-y-3.5">

                {/* Category, Brand & Stock Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
                    {product.category}
                  </span>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${stockBadge.badgeColorClass}`}>
                    ● {stockBadge.label}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
                    Brand: Digiclinix Pharma
                  </span>

                  {product.requiresPrescription && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      Rx Required
                    </span>
                  )}
                </div>

                {/* Title & Customer Ratings & 2-Line Description */}
                <div className="space-y-1.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-manrope leading-tight">
                    {product.name}
                  </h1>

                  {/* Rating & Verified Badge */}
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                      <Star className="w-4 h-4 fill-amber-400" />
                    </div>
                    <span className="font-extrabold text-slate-900 dark:text-white">4.9</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">124 Verified Reviews</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% Genuine
                    </span>
                  </div>

                  {/* Simple 2-Line Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-normal pt-0.5">
                    {product.description?.trim()
                      ? product.description
                      : 'Certified clinical pharmaceutical formulation manufactured under strict quality standards for safe and effective health care.'}
                  </p>
                </div>

                {/* Prescription Notice */}
                {product.requiresPrescription && (
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
                    <FileText className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <span className="font-bold">Prescription Required — </span>
                      <span>This medication requires pharmacist verification before dispatch.</span>
                    </div>
                  </div>
                )}

                {/* Price & Quantity Selector Banner (Quantity integrated on the Right side) */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    {/* Left: Main Price & Discount Info */}
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-extrabold text-purple-700 dark:text-purple-400 font-manrope">
                          {formatCurrency(discountCalc.discountedPrice)}
                        </span>
                        {discountCalc.hasDiscount && (
                          <span className="text-sm text-slate-400 line-through font-semibold">
                            {formatCurrency(basePriceNum)}
                          </span>
                        )}
                      </div>
                      {discountCalc.hasDiscount && (
                        <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                          Save {discountCalc.discountPercent}% ({formatCurrency(basePriceNum - discountCalc.discountedPrice)} OFF)
                        </span>
                      )}
                    </div>

                    {/* Right: Quantity Selector Controls */}
                    {availableStock > 0 && !product.requiresPrescription ? (
                      <div className="flex items-center gap-2.5 bg-white dark:bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-xs">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Qty:</span>
                        <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-700 p-0.5 border border-slate-200/60 dark:border-slate-600">
                          <button
                            type="button"
                            onClick={handleDecrement}
                            disabled={quantity <= 1}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 disabled:opacity-40 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={handleIncrement}
                            disabled={quantity >= availableStock}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 disabled:opacity-40 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs font-extrabold uppercase text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-800">
                        {stockBadge.label}
                      </span>
                    )}
                  </div>

                  {/* Display-Only Localized Currency */}
                  {localizedDiscounted.isConverted && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span>Approx. {localizedDiscounted.formattedDisplay}</span>
                      {discountCalc.hasDiscount && (
                        <span className="ml-1.5 line-through">{localizedOriginal.formattedDisplay}</span>
                      )}
                      <p className="text-[11px] italic mt-0.5 text-slate-400">{CURRENCY_NOTICE}</p>
                    </div>
                  )}
                </div>

                {/* Quick Trust Highlights Bar */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300 pt-0.5">
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <Package className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span className="truncate">24h Express</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span className="truncate">Pharmacist Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <Info className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span className="truncate">Sealed Packaging</span>
                  </div>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <div className="pt-1.5">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  disabled={availableStock <= 0 || product.requiresPrescription}
                  onClick={handleAddToCart}
                  leftIcon={<ShoppingBag className="w-5 h-5" />}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 shadow-md text-base rounded-2xl"
                >
                  {availableStock <= 0
                    ? 'Out of Stock'
                    : product.requiresPrescription
                    ? 'Prescription Required'
                    : `Add ${quantity > 1 ? `${quantity} Items` : 'to Cart'} — ${formatCurrency(discountCalc.discountedPrice * quantity)}`}
                </Button>
              </div>

            </div>
          </div>
        </div>

        {/* ── Collapsible Accordion Sections for Product Details & Medical Info ── */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">

          {/* Accordion 1: Product Highlights & About Medicine */}
          <div>
            <button
              type="button"
              onClick={() => setIsAboutOpen(!isAboutOpen)}
              className="w-full p-6 sm:p-7 flex items-center justify-between gap-4 text-left hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-manrope">
                    Product Highlights &amp; Description
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Detailed features, formula description, and dosage form
                  </p>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {isAboutOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {isAboutOpen && (
              <div className="px-6 pb-7 sm:px-7 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl border-t border-slate-100 dark:border-slate-800/60 pt-4">
                {product.description?.trim() ? (
                  <p>{product.description}</p>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 italic">
                    Product information will be updated soon.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Accordion 2: Uses & Indications */}
          <div>
            <button
              type="button"
              onClick={() => setIsUsesOpen(!isUsesOpen)}
              className="w-full p-6 sm:p-7 flex items-center justify-between gap-4 text-left hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-manrope">
                    Uses &amp; Indications
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Medical conditions treated and clinical applications
                  </p>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {isUsesOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {isUsesOpen && (
              <div className="px-6 pb-7 sm:px-7 text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl border-t border-slate-100 dark:border-slate-800/60 pt-4">
                {product.uses?.trim() ? (
                  <p className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
                    {product.uses}
                  </p>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 italic">
                    Medical information will be updated soon.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Accordion 3: Warnings & Precautions */}
          <div>
            <button
              type="button"
              onClick={() => setIsWarningsOpen(!isWarningsOpen)}
              className="w-full p-6 sm:p-7 flex items-center justify-between gap-4 text-left hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-manrope">
                    Warnings &amp; Safety Precautions
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Safety advice, contraindications, and potential side effects
                  </p>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {isWarningsOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {isWarningsOpen && (
              <div className="px-6 pb-7 sm:px-7 text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl border-t border-slate-100 dark:border-slate-800/60 pt-4 space-y-4">
                {product.warnings?.trim() ? (
                  <p className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
                    {product.warnings}
                  </p>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 italic">
                    Warnings and precautions will be updated soon.
                  </p>
                )}

                {/* Healthcare Disclaimer inside Medical Info */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3 text-xs">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong className="font-bold text-slate-800 dark:text-white">Medical Disclaimer: </strong>
                    This information is provided for general informational purposes and is not a substitute for professional medical advice. Please consult a qualified healthcare professional before using this medicine.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ── Related Products Carousel / Slider ── */}
        {relatedProducts.length > 0 && (
          <div className="space-y-5 pt-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-manrope">
                  Recommended Medicines
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Explore related healthcare items in {product.category}
                </p>
              </div>

              {/* Slider Left & Right Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => scrollSlider('left')}
                  className="w-9 h-9 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white flex items-center justify-center transition-all shadow-xs"
                  aria-label="Previous recommended products"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollSlider('right')}
                  className="w-9 h-9 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white flex items-center justify-center transition-all shadow-xs"
                  aria-label="Next recommended products"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Track */}
            <div
              ref={sliderRef}
              className="flex items-stretch gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1"
            >
              {relatedProducts.map((relProduct) => (
                <div key={relProduct.id} className="w-[280px] sm:w-[300px] shrink-0">
                  <ProductCard product={relProduct} />
                </div>
              ))}
            </div>
          </div>
        )}

      </Container>
    </div>
  );
};
