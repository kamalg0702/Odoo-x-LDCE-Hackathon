/**
 * Currency utility helpers for GlobeTrotter
 */

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF ',
  INR: '₹'
};

export function formatCurrency(amount, currency = 'USD') {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0';
  const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()] || '$';
  return `${symbol}${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
}

export function getCostLevel(costIndex) {
  if (!costIndex) return { label: 'Moderate', color: 'blue' };
  if (costIndex <= 3) return { label: 'Budget Friendly', color: 'green', dots: '$' };
  if (costIndex <= 6) return { label: 'Moderate', color: 'blue', dots: '$$' };
  if (costIndex <= 8) return { label: 'Upscale', color: 'gold', dots: '$$$' };
  return { label: 'Luxury', color: 'red', dots: '$$$$' };
}
