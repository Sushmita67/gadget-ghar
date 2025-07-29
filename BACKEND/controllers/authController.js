const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { logger, logSecurityEvent } = require('../utils/logger');
const validator = require('validator');
const transporter = require('../middlewares/mailConfig');
const crypto = require('crypto');
const { encrypt, decrypt } = require('../utils/encryption');
const Admin = require('../models/admin');

const EMAIL_SECRET = process.env.EMAIL_SECRET || 'emailsecret';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

function hashEmail(email) {
  return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
}

exports.signup = async (req, res) => {
  console.log("Registration Request:::: ", req.body);
  try {
    const { fullName, email, password, phone } = req.body;
    if (!fullName ||  !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email format.' });
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters, include 1 uppercase, 1 number, 1 special character.' });
    }
    if (!validator.isMobilePhone(phone + '', 'any')) return res.status(400).json({ success: false, message: 'Invalid phone number.' });
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ success: false, message: 'User already exists' });
    let profileImgUrl = '';
    if (req.file) {
      profileImgUrl = '/uploads/' + req.file.filename;
    }
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password,
      phone,
      status: 'pending',
      profileImg: { url: profileImgUrl }
    });
    // Generate email verification token
    const verificationToken = jwt.sign({ userId: user._id }, EMAIL_SECRET, { expiresIn: '1d' });
    // Use HTTP for testing, can be changed to HTTPS for production
    const verifyUrl = `https://localhost:5173/verify-email?token=${verificationToken}`;
    
    console.log("Generated verification URL:", verifyUrl);
    console.log("Sending email to:", email);
    
    // Send verification email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email - Gadget Ghar',
        html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
      });
      console.log("Verification email sent successfully");
    } catch (emailError) {
      console.log("Email sending failed:", emailError);
      // Don't fail the registration, just log the error
    }
    logSecurityEvent(user._id, 'User registered (pending verification)');
    res.status(201).json({ success: true, message: 'Registration successful. Please check your email to verify your account.' });
  } catch (err) {
    logger.error('Signup error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  console.log("Verify Email Request:::: ", req.query);
  try {
    const { token } = req.query;
    if (!token) {
      console.log("No token provided");
      return res.status(400).json({ success: false, message: 'Verification token missing' });
    }
    
    console.log("Token received:", token);
    
    let payload;
    try {
      payload = jwt.verify(token, EMAIL_SECRET);
      console.log("Token verified, payload:", payload);
    } catch (err) {
      console.log("Token verification failed:", err.message);
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
    
    const user = await User.findById(payload.userId);
    console.log("User found:", user ? "Yes" : "No");
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!user.email) {
      logger.error('User missing email field:', user);
      return res.status(500).json({ success: false, message: 'User record is invalid (missing email).' });
    }
    
    console.log("User status:", user.status);
    
    if (user.status === 'verified') {
      return res.status(200).json({ success: true, message: 'Email already verified' });
    }
    
    user.status = 'verified';
    await user.save();
    console.log("User status updated to verified");
    
    logSecurityEvent(user._id, 'Email verified');
    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.log("Email verification error:", error);
    logger.error('Email verification error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +passwordCreated +passwordExpiry +previousPasswords');
    if (!user) {
      logger.error(`Failed login attempt: user not found for email ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (user.status !== 'verified') {
      logger.error(`Failed login attempt: email not verified for user ${email}`);
      return res.status(403).json({ success: false, message: 'Please verify your email before logging in.' });
    }
    if (user.isLocked && user.isLocked()) {
      logSecurityEvent(user._id, 'Account locked due to brute force');
      logger.error(`Account locked for user ${email}`);
      return res.status(429).json({
        success: false,
        message: 'Too many failed login attempts. Please try again after 15 minutes.',
        lockUntil: user.lockUntil,
        loginAttempts: user.loginAttempts
      });
    }
    // Password expiry check
    const now = new Date();
    const expiry = user.passwordExpiry || new Date(user.passwordCreated.getTime() + 90*24*60*60*1000);
    if (now > expiry) {
      logSecurityEvent(user._id, 'Password expired');
      logger.error(`Password expired for user ${email}`);
      return res.status(403).json({ success: false, message: 'Password expired. Please update your password.', passwordExpired: true });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      let updatedUser = user;
      if (user.incLoginAttempts) {
        updatedUser = await user.incLoginAttempts();
      }
      logSecurityEvent(user._id, 'Failed login attempt');
      logger.error(`Failed login attempt: wrong password for user ${email}`);
      await new Promise(r => setTimeout(r, 1500));
      if (updatedUser.isLocked && updatedUser.isLocked()) {
        return res.status(429).json({
          success: false,
          message: 'Too many failed login attempts. Please try again after 15 minutes.',
          lockUntil: updatedUser.lockUntil,
          loginAttempts: updatedUser.loginAttempts
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        loginAttempts: updatedUser.loginAttempts
      });
    }
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30
    });
    logSecurityEvent(user._id, 'User logged in');
    res.json({ 
      success: true, 
      token: token,
      user: { id: user._id, email: decrypt(user.email), role: user.role } 
    });
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie('token');
    logSecurityEvent(req.user?._id, 'User logged out');
    res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const resetToken = jwt.sign({ id: user._id }, EMAIL_SECRET, { expiresIn: '1h' });
    // Use HTTP for testing, can be changed to HTTPS for production
    const resetLink = `https://localhost:5173/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request - Gadget Ghar',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    });
    logSecurityEvent(user._id, 'Password reset requested');
    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    logger.error('Password reset request error:', error);
    res.status(500).json({ success: false, message: 'Error in sending reset email' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ success: false, message: 'Token and new password required' });
    let decoded;
    try {
      decoded = jwt.verify(token, EMAIL_SECRET);
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }
    const user = await User.findById(decoded.id).select('+password +previousPasswords +passwordExpiry');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    for (const prev of user.previousPasswords) {
      if (await bcrypt.compare(newPassword, prev)) {
        return res.status(400).json({ success: false, message: 'You cannot reuse a previous password.' });
      }
    }
    // Store the current hashed password before updating
    const currentHashedPassword = user.password;
    user.password = newPassword;
    user.passwordCreated = new Date();
    user.passwordExpiry = new Date(Date.now() + 90*24*60*60*1000);
    
    // Skip the automatic previousPassword update in the pre-save middleware
    user._skipPreviousPasswordUpdate = true;
    await user.save();
    
    // Manually update the previousPasswords array with the old hashed password
    if (user.previousPasswords.length >= 5) user.previousPasswords.shift();
    user.previousPasswords.push(currentHashedPassword);
    await user.save();
    logSecurityEvent(user._id, 'Password reset');
    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    logger.error('Password reset error:', error);
    res.status(500).json({ success: false, message: 'Error resetting password' });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.status === 'verified') {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }
    const verificationToken = jwt.sign({ userId: user._id }, EMAIL_SECRET, { expiresIn: '1d' });
    // Use HTTP for testing, can be changed to HTTPS for production
    const verifyUrl = `https://localhost:5173/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify your email - Gadget Ghar',
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
    });
    logSecurityEvent(user._id, 'Verification email resent');
    res.status(200).json({ success: true, message: 'Verification email resent' });
  } catch (err) {
    logger.error('Resend verification error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers['authorization']?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, id: user._id, email: decrypt(user.email), role: user.role, fullName: user.fullName, status: user.status, profileImg: user.profileImg });
  } catch (err) {
    logger.error('Me endpoint error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    console.log('Admin login attempt:', { username: req.body.username });
    
    const { username, password } = req.body;
    
    if (!username || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // First try to find admin by username
    let admin = await Admin.findOne({ username: username.toLowerCase() });
    
    // If not found by username, check if it's an email and look in User collection
    if (!admin) {
      console.log('Admin not found by username, checking if it\'s an email...');
      const user = await User.findOne({ 
        email: username.toLowerCase(), 
        role: 'admin' 
      });
      
      if (user) {
        console.log('Found admin user by email, checking password...');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          // Generate JWT token for admin user
          const token = jwt.sign(
            { 
              id: user._id, 
              username: user.email, 
              role: user.role 
            }, 
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
          );

          // Set cookie
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
          });

          logSecurityEvent(user._id, 'Admin login successful (via email)');
          
          console.log('Admin login successful via email:', user.email);
          
          return res.status(200).json({
            success: true,
            message: 'Admin login successful',
            data: {
              id: user._id,
              username: user.email,
              role: user.role,
              token
            }
          });
        }
      }
      
      console.log('No admin found with username/email:', username);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials. Use username: "admin" or email: "admin@gadgetghar.com" with password: "Admin@1234"' 
      });
    }

    console.log('Admin found by username, checking password...');
    console.log('Stored password hash:', admin.password.substring(0, 20) + '...');

    // Check password using bcrypt directly
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      console.log('Invalid password for admin:', username);
      console.log('Attempted password:', password);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials. Use username: "admin" or email: "admin@gadgetghar.com" with password: "Admin@1234"' 
      });
    }

    console.log('Password valid, generating token...');

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        username: admin.username, 
        role: admin.role 
      }, 
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    logSecurityEvent(admin._id, 'Admin login successful');
    
    console.log('Admin login successful:', admin.username);
    
    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        token
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    logger.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

exports.adminSignup = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: username.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ 
        success: false, 
        message: 'Admin already exists' 
      });
    }

    // Create new admin
    const admin = await Admin.create({
      username: username.toLowerCase(),
      password,
      role: 'admin'
    });

    logSecurityEvent(admin._id, 'Admin account created');
    
    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        id: admin._id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    logger.error('Admin signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};
