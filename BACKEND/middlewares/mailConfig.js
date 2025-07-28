const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify SMTP connection and log status
transporter.verify(function(error, success) {
  if (error) {
    console.error('Nodemailer SMTP connection error:', error);
  } else {
    console.log('Nodemailer SMTP server is ready to take messages');
  }
});

module.exports = transporter; 