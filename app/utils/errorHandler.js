// Error handling utilities

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.name = 'ApiError';
  }
}

/**
 * Validation Error class
 */
export class ValidationError extends ApiError {
  constructor(message, errors = {}) {
    super(message, 400, errors);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Authentication Error class
 */
export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization Error class
 */
export class AuthorizationError extends ApiError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not Found Error class
 */
export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict Error class
 */
export class ConflictError extends ApiError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

/**
 * Handle API errors and return proper response
 * @param {Error} error - Error object
 * @returns {Object} Error response object
 */
export const handleApiError = (error) => {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return {
      success: false,
      error: error.message,
      statusCode: error.statusCode,
      ...(error.data && { data: error.data }),
      ...(error.errors && { errors: error.errors }),
    };
  }

  if (error instanceof ValidationError) {
    return {
      success: false,
      error: error.message,
      statusCode: 400,
      errors: error.errors,
    };
  }

  if (error instanceof SyntaxError) {
    return {
      success: false,
      error: 'Invalid request format',
      statusCode: 400,
    };
  }

  // Default error response
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    statusCode: 500,
  };
};

/**
 * Validate required fields
 * @param {Object} data - Data object
 * @param {Array} requiredFields - Required field names
 * @throws {ValidationError} If validation fails
 */
export const validateRequired = (data, requiredFields) => {
  const errors = {};

  requiredFields.forEach((field) => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors[field] = `${field} is required`;
    }
  });

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Validation failed', errors);
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @throws {ValidationError} If validation fails
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format', { email: 'Invalid email address' });
  }
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @throws {ValidationError} If validation fails
 */
export const validateUrl = (url) => {
  try {
    new URL(url);
  } catch {
    throw new ValidationError('Invalid URL format', { url: 'Invalid URL' });
  }
};

/**
 * Validate string length
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Field name for error message
 * @throws {ValidationError} If validation fails
 */
export const validateStringLength = (value, minLength, maxLength, fieldName = 'Field') => {
  if (value.length < minLength || value.length > maxLength) {
    throw new ValidationError(
      `${fieldName} must be between ${minLength} and ${maxLength} characters`,
      { [fieldName]: `Must be between ${minLength} and ${maxLength} characters` }
    );
  }
};

/**
 * Validate number range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Field name for error message
 * @throws {ValidationError} If validation fails
 */
export const validateNumberRange = (value, min, max, fieldName = 'Field') => {
  if (value < min || value > max) {
    throw new ValidationError(
      `${fieldName} must be between ${min} and ${max}`,
      { [fieldName]: `Must be between ${min} and ${max}` }
    );
  }
};

/**
 * Validate enum value
 * @param {string} value - Value to validate
 * @param {Array} allowedValues - Allowed values
 * @param {string} fieldName - Field name for error message
 * @throws {ValidationError} If validation fails
 */
export const validateEnum = (value, allowedValues, fieldName = 'Field') => {
  if (!allowedValues.includes(value)) {
    throw new ValidationError(
      `${fieldName} must be one of: ${allowedValues.join(', ')}`,
      { [fieldName]: `Invalid ${fieldName}` }
    );
};

/**
 * Safe async operation wrapper
 * @param {Function} fn - Async function to execute
 * @returns {Promise} Promise that resolves with [error, data]
 */
export const asyncHandler = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Async handler error:', error);
      throw error;
    }
  };
};

/**
 * Retry async operation
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delayMs - Delay between retries in milliseconds
 * @returns {Promise} Promise that resolves with the result
 */
export const retryAsync = async (fn, maxRetries = 3, delayMs = 1000) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
};

/**
 * Format error message for user display
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const formatErrorMessage = (error) => {
  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof AuthenticationError) {
    return 'Please sign in to continue';
  }

  if (error instanceof AuthorizationError) {
    return 'You do not have permission to perform this action';
  }

  if (error instanceof NotFoundError) {
    return 'The requested resource was not found';
  }

  if (error instanceof ConflictError) {
    return 'This resource already exists';
  }

  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Log error with context
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 */
export const logError = (error, context = {}) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...context,
  };

  console.error('Error Log:', JSON.stringify(errorLog, null, 2));

  // In production, you might want to send this to an error tracking service
  // e.g., Sentry, LogRocket, etc.
};

export default {
  ApiError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  handleApiError,
  validateRequired,
  validateEmail,
  validateUrl,
  validateStringLength,
  validateNumberRange,
  validateEnum,
  asyncHandler,
  retryAsync,
  formatErrorMessage,
  logError,
};
