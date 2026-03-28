import crypto from 'crypto';
import db from '../models/database.js';

const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;
const MAX_OTP_REQUESTS = parseInt(process.env.MAX_OTP_REQUESTS) || 3;
const RATE_LIMIT_WINDOW_MINUTES = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES) || 10;

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

export const checkRateLimit = (email) => {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000);
  
  const existingRequest = db.prepare(
    'SELECT * FROM otp_requests WHERE email = ? AND window_start > ?'
  ).get(email, windowStart.toISOString());

  if (existingRequest) {
    if (existingRequest.request_count >= MAX_OTP_REQUESTS) {
      return { allowed: false, message: 'Too many requests. Please try again later.' };
    }
    
    db.prepare(
      'UPDATE otp_requests SET request_count = request_count + 1 WHERE email = ?'
    ).run(email);
    
    return { allowed: true, remaining: MAX_OTP_REQUESTS - existingRequest.request_count - 1 };
  }

  db.prepare(
    'INSERT OR REPLACE INTO otp_requests (email, request_count, window_start) VALUES (?, 1, CURRENT_TIMESTAMP)'
  ).run(email);

  return { allowed: true, remaining: MAX_OTP_REQUESTS - 1 };
};

export const storeOTP = (email, otp) => {
  const otpHash = hashOTP(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  db.prepare(
    'DELETE FROM otp_verifications WHERE email = ?'
  ).run(email);

  const result = db.prepare(
    'INSERT INTO otp_verifications (email, otp_hash, expires_at) VALUES (?, ?, ?)'
  ).run(email, otpHash, expiresAt.toISOString());

  return result.lastInsertRowid;
};

export const verifyOTP = (email, otp) => {
  const otpHash = hashOTP(otp);
  
  const record = db.prepare(
    'SELECT * FROM otp_verifications WHERE email = ? AND otp_hash = ? AND verified = 0'
  ).get(email, otpHash);

  if (!record) {
    return { valid: false, message: 'Invalid OTP' };
  }

  if (new Date(record.expires_at) < new Date()) {
    return { valid: false, message: 'OTP has expired' };
  }

  if (record.attempts >= 3) {
    return { valid: false, message: 'Too many attempts. Please request a new OTP.' };
  }

  db.prepare(
    'UPDATE otp_verifications SET verified = 1 WHERE id = ?'
  ).run(record.id);

  return { valid: true, message: 'OTP verified successfully' };
};

export const incrementAttempts = (email, otp) => {
  const otpHash = hashOTP(otp);
  db.prepare(
    'UPDATE otp_verifications SET attempts = attempts + 1 WHERE email = ? AND otp_hash = ?'
  ).run(email, otpHash);
};
