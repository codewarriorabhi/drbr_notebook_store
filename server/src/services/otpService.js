const crypto = require('crypto');
const db = require('../models/database');

const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;
const MAX_OTP_REQUESTS = parseInt(process.env.MAX_OTP_REQUESTS) || 3;
const RATE_LIMIT_WINDOW_MINUTES = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES) || 10;

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

const checkRateLimit = (email) => {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000);
  
  const existingRequest = db.getOTPRequest(email);

  if (existingRequest && new Date(existingRequest.windowStart) > windowStart) {
    if (existingRequest.requestCount >= MAX_OTP_REQUESTS) {
      return { allowed: false, message: 'Too many requests. Please try again later.' };
    }
    
    db.incrementOTPRequest(email);
    
    return { allowed: true, remaining: MAX_OTP_REQUESTS - existingRequest.requestCount - 1 };
  }

  db.setOTPRequest(email, { requestCount: 1, windowStart: new Date() });

  return { allowed: true, remaining: MAX_OTP_REQUESTS - 1 };
};

const storeOTP = (email, otp) => {
  const otpHash = hashOTP(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  db.deleteOTPVerification(email);

  const id = db.createOTPVerification(email, otpHash, expiresAt);

  return id;
};

const verifyOTP = (email, otp) => {
  const otpHash = hashOTP(otp);
  
  const record = db.getOTPVerification(email);

  if (!record || record.otpHash !== otpHash || record.verified) {
    return { valid: false, message: 'Invalid OTP' };
  }

  if (new Date(record.expiresAt) < new Date()) {
    return { valid: false, message: 'OTP has expired' };
  }

  if (record.attempts >= 3) {
    return { valid: false, message: 'Too many attempts. Please request a new OTP.' };
  }

  db.updateOTPVerification(email, { verified: true });

  return { valid: true, message: 'OTP verified successfully' };
};

const incrementAttempts = (email, otp) => {
  const record = db.getOTPVerification(email);
  if (record) {
    db.updateOTPVerification(email, { attempts: record.attempts + 1 });
  }
};

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  checkRateLimit,
  incrementAttempts
};
