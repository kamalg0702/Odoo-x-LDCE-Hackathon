/**
 * Currency utility helpers for GlobeTrotter (INR Default)
 */

const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF '
};

export function formatCurrency(amount, currency = 'INR') {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()] || '₹';
  
  // Format with Indian Rupee numbering format
  return `${symbol}${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
}

export function getCostLevel(costIndex) {
  if (!costIndex) return { label: 'Moderate', color: 'blue', dots: '₹₹' };
  if (costIndex <= 3) return { label: 'Budget Friendly', color: 'green', dots: '₹' };
  if (costIndex <= 6) return { label: 'Moderate', color: 'blue', dots: '₹₹' };
  if (costIndex <= 8) return { label: 'Upscale', color: 'gold', dots: '₹₹₹' };
  return { label: 'Luxury', color: 'red', dots: '₹₹₹₹' };
}
