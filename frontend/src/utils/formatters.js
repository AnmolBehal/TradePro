/**
 * Format a number as currency
 * @param {number} value - The value to format
 * @param {string} currency - The currency code (default: USD)
 * @param {string} locale - The locale (default: en-US)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
  if (value === null || value === undefined) return '-';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a date
 * @param {string|Date} date - The date to format
 * @param {string} locale - The locale (default: en-US)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'en-US') => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a number with commas
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined) return '-';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Format a percentage
 * @param {number} value - The value to format (e.g., 0.15 for 15%)
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '-';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};