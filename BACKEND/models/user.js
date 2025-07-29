const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { encrypt, decrypt } = require('../utils/encryption');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
    validate: {
      validator: v => /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(v),
      message: 'Password must be at least 8 characters, include 1 uppercase, 1 number, 1 special character.'
    }
  },
  loginAttempts: { type: Number, default: 0 },
  lockUntil:     { type: Date },
  passwordCreated: { type: Date, default: Date.now },
  passwordExpiry:  { type: Date, default: () => new Date(Date.now() + 90*24*60*60*1000) },
  previousPasswords: { type: [String], default: [] },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  status: { type: String, enum: ['pending', 'verified'], default: 'pending' },
  profileImg: {
    url: { type: String },
    publicId: { type: String }
  },
  phone: { type: String },
  securityLogs: [{
    timestamp: { type: Date, default: Date.now },
    event: { type: String, required: true }
  }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  // Only add to previousPasswords if this is not a new user and we're not manually managing previousPasswords
  if (!this.isNew && this.password && !this._skipPreviousPasswordUpdate) {
    if (!this.previousPasswords) this.previousPasswords = [];
    if (this.previousPasswords.length >= 5) this.previousPasswords.shift();
    this.previousPasswords.push(this.password);
  }
  
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordCreated = new Date();
  this.passwordExpiry = new Date(Date.now() + 90*24*60*60*1000);
  next();
});

userSchema.pre('save', function (next) {
  if (this.isModified('fullName')) this.fullName = encrypt(this.fullName);
  if (this.isModified('phone')) this.phone = encrypt(this.phone);
  next();
});

userSchema.post('init', function (doc) {
  if (doc.fullName) doc.fullName = decrypt(doc.fullName);
  if (doc.phone) doc.phone = decrypt(doc.phone);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.methods.incLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    this.loginAttempts = 1;
    this.lockUntil = undefined;
  } else {
    this.loginAttempts += 1;
    if (this.loginAttempts >= 5 && !this.isLocked()) {
      this.lockUntil = Date.now() + 15 * 60 * 1000; // 15 min lock
    }
  }
  return this.save();
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
