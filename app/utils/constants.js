// Application constants

export const CREATOR_CATEGORIES = [
  'Music',
  'Art',
  'Gaming',
  'Writing',
  'Tech',
  'Education',
  'Other',
];

export const NOTIFICATION_TYPES = {
  FOLLOW: 'follow',
  SUPPORT: 'support',
  LIKE: 'like',
  COMMENT: 'comment',
  MESSAGE: 'message',
};

export const NOTIFICATION_TYPE_LABELS = {
  follow: 'Follow',
  support: 'Support',
  like: 'Like',
  comment: 'Comment',
  message: 'Message',
};

export const SOCIAL_PLATFORMS = {
  TWITTER: 'twitter',
  INSTAGRAM: 'instagram',
  YOUTUBE: 'youtube',
  WEBSITE: 'website',
};

export const SOCIAL_PLATFORM_LABELS = {
  twitter: 'Twitter',
  instagram: 'Instagram',
  youtube: 'YouTube',
  website: 'Website',
};

export const SOCIAL_PLATFORM_URLS = {
  twitter: 'https://twitter.com/',
  instagram: 'https://instagram.com/',
  youtube: 'https://youtube.com/',
};

export const PAGINATION = {
  CREATORS_PER_PAGE: 12,
  POSTS_PER_PAGE: 10,
  NOTIFICATIONS_PER_PAGE: 20,
  SUPPORTERS_PER_PAGE: 5,
};

export const PAYMENT_AMOUNTS = [50, 100, 500, 1000];

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const USER_ROLES = {
  USER: 'user',
  CREATOR: 'creator',
  ADMIN: 'admin',
};

export const API_ENDPOINTS = {
  // Auth
  AUTH_SIGNIN: '/api/auth/signin',
  AUTH_SIGNOUT: '/api/auth/signout',
  AUTH_SESSION: '/api/auth/session',

  // Creators
  CREATORS_LIST: '/api/creators',
  CREATOR_PROFILE: '/api/creators/:id',

  // Follow
  FOLLOW: '/api/follow',
  UNFOLLOW: '/api/follow',

  // Posts
  POSTS_LIST: '/api/posts',
  CREATE_POST: '/api/posts',
  GET_POST: '/api/posts/:id',
  UPDATE_POST: '/api/posts/:id',
  DELETE_POST: '/api/posts/:id',

  // Notifications
  NOTIFICATIONS: '/api/notifications',
  MARK_READ: '/api/notifications/:id',

  // Dashboard
  DASHBOARD: '/api/dashboard',

  // Profile
  PROFILE: '/api/profile',
  UPDATE_PROFILE: '/api/profile',

  // Payments
  CREATE_ORDER: '/api/payments/create-order',
  VERIFY_PAYMENT: '/api/payments/verify',
};

export const ROUTES = {
  HOME: '/',
  SIGNUP: '/signup',
  LOGIN: '/login',
  EXPLORE: '/explore',
  DASHBOARD: '/dashboard',
  EDIT_PROFILE: '/edit-profile',
  NOTIFICATIONS: '/notifications',
  CREATOR_PROFILE: '/creator-profile',
  SUPPORT: '/support',
  ABOUT: '/about',
  CONTACT: '/contact',
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
  INVALID_INPUT: 'Invalid input provided',
  SERVER_ERROR: 'An error occurred on the server',
  NETWORK_ERROR: 'Network error. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again',
};

export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully',
  POST_CREATED: 'Post created successfully',
  FOLLOWED: 'You are now following this creator',
  UNFOLLOWED: 'You have unfollowed this creator',
  NOTIFICATION_READ: 'Notification marked as read',
  PAYMENT_SUCCESS: 'Payment successful',
};

export const VALIDATION_RULES = {
  MIN_BIO_LENGTH: 10,
  MAX_BIO_LENGTH: 500,
  MIN_POST_TITLE_LENGTH: 5,
  MAX_POST_TITLE_LENGTH: 200,
  MIN_POST_CONTENT_LENGTH: 10,
  MAX_POST_CONTENT_LENGTH: 5000,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MIN_PASSWORD_LENGTH: 8,
};

export const COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#a855f7',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#06b6d4',
  DARK: '#1f2937',
  LIGHT: '#f3f4f6',
};

export const TOAST_DURATION = 3000;

export const DEBOUNCE_DELAY = 300;

export const API_TIMEOUT = 10000;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const FEATURE_FLAGS = {
  ENABLE_MESSAGING: false,
  ENABLE_LIVESTREAM: false,
  ENABLE_MERCHANDISE: false,
  ENABLE_SUBSCRIPTION_TIERS: false,
};

export const ANALYTICS_EVENTS = {
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  CREATOR_FOLLOW: 'creator_follow',
  POST_CREATED: 'post_created',
  PAYMENT_COMPLETED: 'payment_completed',
  PROFILE_UPDATED: 'profile_updated',
};
