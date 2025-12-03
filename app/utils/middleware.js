// Middleware utilities for API routes

import { getServerSession } from "next-auth";
import { AuthenticationError, AuthorizationError } from "./errorHandler";

/**
 * Check if user is authenticated
 * @returns {Promise<Object>} User session
 * @throws {AuthenticationError} If not authenticated
 */
export const requireAuth = async () => {
  const session = await getServerSession();

  if (!session) {
    throw new AuthenticationError("You must be signed in to perform this action");
  }

  return session;
};

/**
 * Check if user is a creator
 * @param {Object} user - User object
 * @throws {AuthorizationError} If user is not a creator
 */
export const requireCreator = (user) => {
  if (!user.isCreator) {
    throw new AuthorizationError("You must be a creator to perform this action");
  }
};

/**
 * Check if user is admin
 * @param {Object} user - User object
 * @throws {AuthorizationError} If user is not an admin
 */
export const requireAdmin = (user) => {
  if (user.role !== "admin") {
    throw new AuthorizationError("You must be an admin to perform this action");
  }
};

/**
 * Validate request method
 * @param {string} method - Request method
 * @param {Array} allowedMethods - Allowed methods
 * @throws {Error} If method not allowed
 */
export const validateMethod = (method, allowedMethods = []) => {
  if (!allowedMethods.includes(method)) {
    throw new Error(`Method ${method} not allowed. Allowed methods: ${allowedMethods.join(", ")}`);
  }
};

/**
 * Rate limiting middleware
 * @param {string} key - Rate limit key (e.g., user ID)
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} True if request is allowed
 */
const rateLimitStore = new Map();

export const rateLimit = (key, maxRequests = 100, windowMs = 60000) => {
  const now = Date.now();
  const userKey = `ratelimit:${key}`;

  if (!rateLimitStore.has(userKey)) {
    rateLimitStore.set(userKey, []);
  }

  let requests = rateLimitStore.get(userKey);

  // Remove old requests outside the window
  requests = requests.filter((timestamp) => now - timestamp < windowMs);

  if (requests.length >= maxRequests) {
    return false;
  }

  requests.push(now);
  rateLimitStore.set(userKey, requests);

  return true;
};

/**
 * CORS headers middleware
 * @returns {Object} CORS headers
 */
export const getCorsHeaders = () => {
  return {
    "Access-Control-Allow-Origin": process.env.NEXTAUTH_URL || "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
};

/**
 * Validate pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Validated pagination params
 */
export const validatePagination = (page = 1, limit = 10) => {
  const validPage = Math.max(1, parseInt(page) || 1);
  const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));

  return {
    page: validPage,
    limit: validLimit,
    skip: (validPage - 1) * validLimit,
  };
};

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid ObjectId
 */
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Create response object
 * @param {boolean} success - Success status
 * @param {*} data - Response data
 * @param {string} message - Response message
 * @returns {Object} Response object
 */
export const createResponse = (success = true, data = null, message = "") => {
  return {
    success,
    ...(data && { data }),
    ...(message && { message }),
  };
};

/**
 * Create error response
 * @param {string} error - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} details - Additional error details
 * @returns {Object} Error response object
 */
export const createErrorResponse = (error = "An error occurred", statusCode = 500, details = {}) => {
  return {
    success: false,
    error,
    statusCode,
    ...details,
  };
};

/**
 * Log API request
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const logRequest = (req, res) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.url;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  console.log(`[${timestamp}] ${method} ${path} - IP: ${ip}`);
};

/**
 * Check if request is from authenticated user
 * @param {Object} session - User session
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = (session) => {
  return session && session.user && session.user.email;
};

/**
 * Get user from session
 * @param {Object} session - User session
 * @returns {Object} User object
 */
export const getUserFromSession = (session) => {
  return session?.user || null;
};

/**
 * Validate request body
 * @param {Object} body - Request body
 * @param {Array} requiredFields - Required field names
 * @throws {Error} If validation fails
 */
export const validateRequestBody = (body, requiredFields = []) => {
  if (!body) {
    throw new Error("Request body is required");
  }

  const missingFields = requiredFields.filter((field) => !body[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
};

/**
 * Handle async API route
 * @param {Function} handler - Route handler function
 * @returns {Function} Wrapped handler
 */
export const asyncRoute = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error("API Error:", error);

      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";

      res.status(statusCode).json({
        success: false,
        error: message,
      });
    }
  };
};
