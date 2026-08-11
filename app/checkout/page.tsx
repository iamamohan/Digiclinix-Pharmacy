'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useCart, getAvailableStock } from '@/components/providers/cart-provider';
import { useToast } from '@/components/providers/toast-provider';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/format';
import { calculateDiscountedPrice } from '@/lib/utils/discount';
import { ShieldCheck, Truck, ArrowLeft, ShoppingBag, AlertCircle, FileText } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const toast = useToast();
  const { data: session, status } = useSession();
  const { items, clearCart } = useCart();

  // Client-side Idempotency Key (Generated once per checkout page session)
  const [idempotencyKey, setIdempotencyKey] = useState('');
  useEffect(() => {
    setIdempotencyKey(`chk-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  }, []);

  // Shipping Form State
  const [shippingName, setShippingName] = useState(session?.user?.name || '');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingPostalCode, setShippingPostalCode] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculate Client Preview Financials (Server will recalculate authoritatively)
  const orderSummaryItems = items.map((item) => {
    const basePrice = typeof item.product.price === 'string' ? parseFloat(item.product.price) : Number(item.product.price);
    const discPercent = typeof item.product.discount === 'string' ? parseFloat(item.product.discount) : (item.product.discount ?? 0);
    const calc = calculateDiscountedPrice(basePrice, discPercent);

    const itemSubtotal = basePrice * item.quantity;
    const itemDiscount = calc.savingsAmount * item.quantity;
    const itemTotal = calc.discountedPrice * item.quantity;
    const availableStock = getAvailableStock(item.product);

    return {
      product: item.product,
      quantity: item.quantity,
      unitPrice: calc.discountedPrice,
      originalPrice: basePrice,
      discountPercent: calc.discountPercent,
      hasDiscount: calc.hasDiscount,
      itemSubtotal,
      itemDiscount,
      itemTotal,
      availableStock,
      isPrescription: item.product.requiresPrescription,
    };
  });

  const calcSubtotal = orderSummaryItems.reduce((sum, i) => sum + i.itemSubtotal, 0);
  const calcDiscountTotal = orderSummaryItems.reduce((sum, i) => sum + i.itemDiscount, 0);
  const calcFinalTotal = orderSummaryItems.reduce((sum, i) => sum + i.itemTotal, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form Validations
    if (!shippingName.trim() || !shippingPhone.trim() || !shippingAddress.trim() || !shippingCity.trim() || !shippingState.trim() || !shippingPostalCode.trim()) {
      setErrorMessage('Please fill in all required delivery address fields.');
      return;
    }

    // Prescription Safety Pre-Check
    const rxItem = orderSummaryItems.find((i) => i.isPrescription);
    if (rxItem) {
      setErrorMessage(`Prescription medication ("${rxItem.product.name}") requires pharmacist prescription verification, which will be supported in a future phase.`);
      return;
    }

    // Stock Pre-Check
    const outOfStockItem = orderSummaryItems.find((i) => i.availableStock < i.quantity);
    if (outOfStockItem) {
      setErrorMessage(`Some items are no longer available in requested quantity. "${outOfStockItem.product.name}" has only ${outOfStockItem.availableStock} unit(s) available.`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Server-Authoritative Payload (Sends ONLY productId and quantity)
      const payload = {
        idempotencyKey: idempotencyKey || undefined,
        shippingName: shippingName.trim(),
        shippingPhone: shippingPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        shippingCity: shippingCity.trim(),
        shippingState: shippingState.trim(),
        shippingPostalCode: shippingPostalCode.trim(),
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        toast.success('Order placed successfully!');
        clearCart();
        router.push(`/orders/${data.data.id}`);
      } else {
        throw new Error(data.error?.message || 'Failed to place order. Please try again.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred placing your order.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 bg-slate-50 dark:bg-[#0B1220] transition-colors duration-200 min-h-screen">
      <Container>
        {/* Navigation Link */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customer & Delivery Address Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Truck className="w-5 h-5 text-purple-600" aria-hidden="true" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white font-manrope">
                  Delivery & Shipping Details
                </h2>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-600 dark:text-red-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="shipping-name" className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="shipping-name"
                    type="text"
                    required
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="shipping-phone" className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="shipping-phone"
                    type="tel"
                    required
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Street Address */}
                <div>
                  <label htmlFor="shipping-address" className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Street Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="shipping-address"
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="e.g. 123 Healthcare Ave, Suite 400"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* City, State, Postal Code (3 Cols) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="shipping-city" className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="shipping-city"
                      type="text"
                      required
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      placeholder="e.g. Springfield"
                      className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="shipping-state" className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="shipping-state"
                      type="text"
                      required
                      value={shippingState}
                      onChange={(e) => setShippingState(e.target.value)}
                      placeholder="e.g. IL"
                      className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="shipping-postal" className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="shipping-postal"
                      type="text"
                      required
                      value={shippingPostalCode}
                      onChange={(e) => setShippingPostalCode(e.target.value)}
                      placeholder="e.g. 62701"
                      className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order Action (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-manrope border-b border-slate-100 dark:border-slate-800 pb-3">
                Order Summary ({items.length} items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                {orderSummaryItems.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-xs py-1">
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {item.product.name}
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        Qty: {item.quantity} x {formatCurrency(item.unitPrice)}
                        {item.hasDiscount && (
                          <span className="ml-1 text-purple-600 dark:text-purple-400 font-semibold">
                            ({item.discountPercent}% OFF)
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="font-extrabold text-slate-900 dark:text-white font-manrope shrink-0">
                      {formatCurrency(item.itemTotal)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Totals Breakdown */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(calcSubtotal)}</span>
                </div>
                {calcDiscountTotal > 0 && (
                  <div className="flex justify-between text-purple-600 dark:text-purple-400 font-semibold">
                    <span>Discount Savings</span>
                    <span>-{formatCurrency(calcDiscountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800 font-manrope">
                  <span>Order Total</span>
                  <span>{formatCurrency(calcFinalTotal)}</span>
                </div>
              </div>

              {/* Security & Payment Notice */}
              <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-800/50 text-[11px] text-purple-900 dark:text-purple-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-purple-600 dark:text-purple-400 mt-0.5" aria-hidden="true" />
                <span>
                  Order verification and stock reserve will occur immediately upon submission. Payment handling will follow in a future step.
                </span>
              </div>

              {/* Place Order CTA Button */}
              <Button
                type="submit"
                form="checkout-form"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 shadow-md"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order Now'}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
