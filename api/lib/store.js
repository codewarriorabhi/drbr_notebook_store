// In-memory storage for OTPs and rate limiting
const otpStore = new Map();
const rateLimitStore = new Map();

// Constants
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 3;

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Check rate limiting
function checkRateLimit(email) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  
  const record = rateLimitStore.get(email);
  
  if (record && record.timestamp > windowStart) {
    if (record.count >= MAX_REQUESTS) {
      return { allowed: false, message: 'Too many requests. Try again in 10 minutes.' };
    }
    record.count++;
    rateLimitStore.set(email, record);
    return { allowed: true, remaining: MAX_REQUESTS - record.count };
  }
  
  rateLimitStore.set(email, { count: 1, timestamp: now });
  return { allowed: true, remaining: MAX_REQUESTS - 1 };
}

// Store OTP
function storeOTP(email, otp) {
  const expiresAt = Date.now() + OTP_EXPIRY_MS;
  otpStore.set(email, { otp, expiresAt, attempts: 0 });
}

// Verify OTP
function verifyOTP(email, otp) {
  const record = otpStore.get(email);
  
  if (!record) {
    return { valid: false, message: 'Invalid OTP' };
  }
  
  if (Date.now() > record.expiresAt) {
    return { valid: false, message: 'OTP has expired' };
  }
  
  if (record.attempts >= 3) {
    return { valid: false, message: 'Too many attempts. Please request a new OTP.' };
  }
  
  if (record.otp !== otp) {
    record.attempts++;
    otpStore.set(email, record);
    return { valid: false, message: 'Invalid OTP' };
  }
  
  // Clear OTP after successful verification
  otpStore.delete(email);
  return { valid: true, message: 'OTP verified successfully' };
}

module.exports = {
  generateOTP,
  checkRateLimit,
  storeOTP,
  verifyOTP,
  OTP_EXPIRY_MS,
  RATE_LIMIT_WINDOW_MS,
  MAX_REQUESTS
};
