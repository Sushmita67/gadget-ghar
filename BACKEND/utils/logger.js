const winston = require('winston');
const path = require('path');
const transporter = require('../middlewares/mailConfig');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join('logs', 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join('logs', 'combined.log') }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

function logSecurityEvent(userId, event) {
  logger.info({ userId, event, timestamp: new Date() });
}

function sendSecurityAlert(event, details) {
  const alertEmail = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `Security Alert: ${event}`,
    html: `
      <h2>Security Alert</h2>
      <p><strong>Event:</strong> ${event}</p>
      <p><strong>Details:</strong> ${JSON.stringify(details, null, 2)}</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    `
  };
  
  transporter.sendMail(alertEmail).catch(err => {
    console.error('Failed to send security alert:', err);
  });
}

// Log suspicious activities
function logSuspiciousActivity(activity, details) {
  logger.warn({ 
    type: 'suspicious_activity', 
    activity, 
    details, 
    timestamp: new Date() 
  });
  
  // Send alert for critical suspicious activities
  if (activity.includes('brute_force') || activity.includes('injection') || activity.includes('xss')) {
    sendSecurityAlert(activity, details);
  }
}

// Log authentication events
function logAuthEvent(userId, event, success, details = {}) {
  logger.info({
    type: 'auth_event',
    userId,
    event,
    success,
    details,
    timestamp: new Date()
  });
  
  if (!success && event === 'login_failed') {
    logSuspiciousActivity('failed_login_attempt', { userId, ...details });
  }
}

module.exports = { 
  logger, 
  logSecurityEvent, 
  sendSecurityAlert,
  logSuspiciousActivity,
  logAuthEvent
}; 