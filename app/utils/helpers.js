// Utility helper functions for the application

/**
 * Format currency for display
 * @param {number} amount - Amount in rupees
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format time for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Calculate time ago from date
 * @param {Date} date - Date to calculate from
 * @returns {string} Time ago string
 */
export const getTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatDate(date);
};

/**
 * Generate random color
 * @returns {string} Hex color code
 */
export const getRandomColor = () => {
  const colors = [
    '#3b82f6', // blue
    '#a855f7', // purple
    '#ec4899', // pink
    '#f59e0b', // amber
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#8b5cf6', // violet
    '#ef4444', // red
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Check if user is creator
 * @param {Object} user - User object
 * @returns {boolean} True if user is creator
 */
export const isCreator = (user) => {
  return user && user.isCreator === true;
};

/**
 * Get creator badge text
 * @param {string} category - Creator category
 * @returns {string} Badge text
 */
export const getCreatorBadge = (category) => {
  const badges = {
    Music: '🎵',
    Art: '🎨',
    Gaming: '🎮',
    Writing: '✍️',
    Tech: '💻',
    Education: '📚',
    Other: '⭐',
  };
  return badges[category] || '⭐';
};

/**
 * Format large numbers
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

/**
 * Get notification message
 * @param {Object} notification - Notification object
 * @returns {string} Formatted message
 */
export const getNotificationMessage = (notification) => {
  const senderName = notification.sender?.name || 'Someone';
  
  switch (notification.type) {
    case 'follow':
      return `${senderName} started following you`;
    case 'support':
      return `${senderName} supported you`;
    case 'like':
      return `${senderName} liked your post`;
    case 'comment':
      return `${senderName} commented on your post`;
    default:
      return notification.message || 'New notification';
  }
};

/**
 * Get notification icon type
 * @param {string} type - Notification type
 * @returns {string} Icon name
 */
export const getNotificationIcon = (type) => {
  const icons = {
    follow: 'Users',
    support: 'DollarSign',
    like: 'Heart',
    comment: 'MessageCircle',
    message: 'Mail',
  };
  return icons[type] || 'Bell';
};

/**
 * Validate form data
 * @param {Object} data - Form data to validate
 * @param {Array} requiredFields - Required field names
 * @returns {Object} Validation result
 */
export const validateFormData = (data, requiredFields = []) => {
  const errors = {};
  
  requiredFields.forEach((field) => {
    if (!data[field] || data[field].trim() === '') {
      errors[field] = `${field} is required`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Safe JSON parse
 * @param {string} jsonString - JSON string to parse
 * @param {*} defaultValue - Default value if parse fails
 * @returns {*} Parsed object or default value
 */
export const safeJsonParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
