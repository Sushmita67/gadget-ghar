const { sanitizeObject, validateEmail, validatePhone } = require('../utils/sanitize');

// Sanitize all incoming request data
const sanitizeInput = (req, res, next) => {
  try {
    // Sanitize request body
    if (req.body && Object.keys(req.body).length > 0) {
      req.body = sanitizeObject(req.body);
    }
    
    // Sanitize query parameters
    if (req.query && Object.keys(req.query).length > 0) {
      req.query = sanitizeObject(req.query);
    }
    
    // Sanitize URL parameters
    if (req.params && Object.keys(req.params).length > 0) {
      req.params = sanitizeObject(req.params);
    }
    
    next();
  } catch (error) {
    console.error('Sanitization error:', error);
    next();
  }
};

// Validate and sanitize specific fields
const validateAndSanitizeUserInput = (req, res, next) => {
  try {
    const { email, phone, fullName } = req.body;
    
    // Validate email if present
    if (email && !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Validate phone if present
    if (phone && !validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }
    
    // Sanitize all input
    req.body = sanitizeObject(req.body);
    
    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400).json({
      success: false,
      message: 'Invalid input data'
    });
  }
};

module.exports = { sanitizeInput, validateAndSanitizeUserInput }; 