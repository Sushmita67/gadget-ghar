const validator = require('validator');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const url = require('url');

// Set up DOMPurify for server-side
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Sanitize a string (HTML, XSS, etc.)
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  let clean = DOMPurify.sanitize(str);
  clean = validator.escape(clean);
  return clean;
}

// Sanitize all string fields in an object
function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  const sanitized = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeString(obj[key]);
    } else if (typeof obj[key] === 'object') {
      sanitized[key] = sanitizeObject(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
}

// SSRF Prevention - Validate and sanitize URLs
function validateAndSanitizeUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return null;
  }
  
  // Check if URL is valid
  if (!validator.isURL(inputUrl)) {
    return null;
  }
  
  // Parse URL to check for private IP addresses
  const parsedUrl = url.parse(inputUrl);
  const hostname = parsedUrl.hostname;
  
  // Block private IP ranges
  const privateIPRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^0\./,
    /^169\.254\./,
    /^::1$/,
    /^fc00:/,
    /^fe80:/
  ];
  
  for (const range of privateIPRanges) {
    if (range.test(hostname)) {
      return null; // Block private IP access
    }
  }
  
  // Only allow specific protocols
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return null;
  }
  
  return inputUrl;
}

// Validate email addresses
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return validator.isEmail(email.toLowerCase());
}

// Validate phone numbers
function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  return validator.isMobilePhone(phone, 'any');
}

// Validate password strength
function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return false;
  }
  
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return passwordRegex.test(password);
}

module.exports = { 
  sanitizeString, 
  sanitizeObject, 
  validateAndSanitizeUrl,
  validateEmail,
  validatePhone,
  validatePassword
}; 