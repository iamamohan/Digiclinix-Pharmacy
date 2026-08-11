import { formatCurrency } from './format';

export interface DiscountCalculationResult {
  originalPrice: number;
  discountPercent: number;
  discountedPrice: number;
  formattedOriginalPrice: string;
  formattedDiscountedPrice: string;
  hasDiscount: boolean;
  savingsAmount: number;
  formattedSavingsAmount: string;
}

/**
 * Calculates display discounted price and formatting parameters safely.
 * Preserves stored DB price without modification.
 * Avoids JS floating-point inaccuracies by rounding calculated amounts to 2 decimal places.
 */
export function calculateDiscountedPrice(
  price: number | string,
  discount: number | string
): DiscountCalculationResult {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  const numDiscount = typeof discount === 'string' ? parseFloat(discount) : discount;

  const validPrice = isNaN(numPrice) || numPrice < 0 ? 0 : numPrice;
  const validDiscount = isNaN(numDiscount) || numDiscount <= 0 ? 0 : Math.min(numDiscount, 100);

  if (validDiscount === 0) {
    const formatted = formatCurrency(validPrice);
    return {
      originalPrice: validPrice,
      discountPercent: 0,
      discountedPrice: validPrice,
      formattedOriginalPrice: formatted,
      formattedDiscountedPrice: formatted,
      hasDiscount: false,
      savingsAmount: 0,
      formattedSavingsAmount: formatCurrency(0),
    };
  }

  // Floating-point safe calculation rounded to 2 decimal places
  const rawDiscounted = validPrice - (validPrice * validDiscount) / 100;
  const discountedPrice = Math.max(0, Math.round(rawDiscounted * 100) / 100);
  const rawSavings = validPrice - discountedPrice;
  const savingsAmount = Math.max(0, Math.round(rawSavings * 100) / 100);

  return {
    originalPrice: validPrice,
    discountPercent: validDiscount,
    discountedPrice,
    formattedOriginalPrice: formatCurrency(validPrice),
    formattedDiscountedPrice: formatCurrency(discountedPrice),
    hasDiscount: true,
    savingsAmount,
    formattedSavingsAmount: formatCurrency(savingsAmount),
  };
}
