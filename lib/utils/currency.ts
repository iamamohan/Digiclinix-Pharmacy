export interface CurrencyInfo {
  code: string;
  symbol: string;
  rateFromINR: number; // 1 INR = rateFromINR units of local currency
}

// In-memory 1-hour serverless cache per instance
interface CacheEntry {
  timestamp: number;
  rates: Record<string, number>;
}

let rateCache: CacheEntry | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Default fixed exchange rates from INR
const BASE_RATES: Record<string, number> = {
  INR: 1.0,
  USD: 0.012, // ~ ₹83.3 = $1
  EUR: 0.011, // ~ ₹90.9 = €1
  GBP: 0.0094, // ~ ₹106.3 = £1
  CAD: 0.016, // ~ ₹62.5 = CA$1
  AUD: 0.018, // ~ ₹55.5 = A$1
};

export const CURRENCY_NOTICE =
  'Prices shown in your local currency are approximate conversions. Final order pricing is calculated at checkout.';

export function getExchangeRates(): Record<string, number> {
  const now = Date.now();
  if (rateCache && now - rateCache.timestamp < CACHE_TTL_MS) {
    return rateCache.rates;
  }

  rateCache = {
    timestamp: now,
    rates: BASE_RATES,
  };

  return rateCache.rates;
}

export function convertFromINR(amountINR: number, targetCurrency: string = 'INR'): {
  convertedAmount: number;
  currencyCode: string;
  formattedDisplay: string;
  isConverted: boolean;
} {
  const rates = getExchangeRates();
  const rate = rates[targetCurrency] || 1.0;
  const convertedAmount = amountINR * rate;
  const isConverted = targetCurrency !== 'INR' && rate !== 1.0;

  let formattedDisplay = '';
  try {
    formattedDisplay = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: targetCurrency,
      maximumFractionDigits: 2,
    }).format(convertedAmount);
  } catch {
    formattedDisplay = `${targetCurrency} ${convertedAmount.toFixed(2)}`;
  }

  return {
    convertedAmount: Math.round(convertedAmount * 100) / 100,
    currencyCode: targetCurrency,
    formattedDisplay,
    isConverted,
  };
}

export function mapCountryToCurrency(countryCode?: string | null): string {
  if (!countryCode) return 'INR';

  const code = countryCode.toUpperCase().trim();
  switch (code) {
    case 'US':
      return 'USD';
    case 'GB':
    case 'UK':
      return 'GBP';
    case 'DE':
    case 'FR':
    case 'IT':
    case 'ES':
    case 'NL':
    case 'BE':
    case 'AT':
    case 'IE':
    case 'FI':
    case 'PT':
      return 'EUR';
    case 'CA':
      return 'CAD';
    case 'AU':
      return 'AUD';
    case 'IN':
    default:
      return 'INR';
  }
}
