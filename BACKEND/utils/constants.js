const requiredEnvVars = [
  'JWT_SECRET',
  'MONGO_URI', 
  'AES_SECRET_KEY',
  'COOKIE_SECRET',
  'SESSION_SECRET',
  'EMAIL_USER',
  'EMAIL_PASS',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_SECRET'
];

function validateEnvironment() {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Security constants
const SECURITY_CONSTANTS = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_EXPIRY_DAYS: 90,
  ACCOUNT_LOCKOUT_ATTEMPTS: 5,
  ACCOUNT_LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_MAX_AGE: 24 * 60 * 60 * 1000, // 1 day
  JWT_EXPIRY: '1d',
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100,
  AUTH_RATE_LIMIT_MAX: 5,
  FILE_SIZE_LIMIT: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
};

module.exports = { 
  validateEnvironment, 
  requiredEnvVars, 
  SECURITY_CONSTANTS 
};
