/**
 * Format a number as currency
 */
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
};

/**
 * Format a date string to readable format
 */
export const formatDate = (dateStr, options = {}) => {
  const defaults = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-US', { ...defaults, ...options });
};

/**
 * Calculate number of days between two dates
 */
export const daysBetween = (start, end) => {
  const ms = new Date(end) - new Date(start);
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

/**
 * Clamp a number between min and max
 */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Get initials from a name
 */
export const getInitials = (name = '') => {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

/**
 * Generate star array for ratings
 */
export const getStars = (rating) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return { full, half, empty };
};

/**
 * Truncate text to a max length
 */
export const truncate = (text = '', maxLen = 120) => {
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
};

/**
 * Budget progress percentage
 */
export const budgetProgress = (spent, total) => {
  if (!total) return 0;
  return clamp(Math.round((spent / total) * 100), 0, 100);
};

/**
 * Trip status colors
 */
export const statusColors = {
  planning:  { bg: 'rgba(108,99,255,0.15)',  color: '#a29bfe', label: '🗓 Planning' },
  upcoming:  { bg: 'rgba(67,233,123,0.12)',  color: '#43e97b', label: '✈️ Upcoming' },
  ongoing:   { bg: 'rgba(248,168,75,0.12)',  color: '#f8a84b', label: '🌍 Ongoing' },
  completed: { bg: 'rgba(100,200,255,0.12)', color: '#74b9ff', label: '✅ Completed' },
  cancelled: { bg: 'rgba(255,101,132,0.12)', color: '#ff6584', label: '❌ Cancelled' },
};
