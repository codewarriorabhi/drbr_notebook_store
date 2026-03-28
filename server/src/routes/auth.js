import express from 'express';
import rateLimit from 'express-rate-limit';
import { sendOTPEmail } from '../services/emailService.js';
import { 
  generateOTP, 
  storeOTP, 
  verifyOTP, 
  checkRateLimit,
  incrementAttempts 
} from '../services/otpService.js';

const router = express.Router();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP' }
});

router.post('/send-otp', apiLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const rateLimitCheck = checkRateLimit(email);
    if (!rateLimitCheck.allowed) {
      return res.status(429).json({ error: rateLimitCheck.message });
    }

    const otp = generateOTP();
    storeOTP(email, otp);

    const emailResult = await sendOTPEmail(email, otp);
    
    if (!emailResult.success) {
      return res.status(500).json({ error: 'Failed to send email' });
    }

    res.json({ 
      message: 'OTP sent successfully',
      remainingAttempts: rateLimitCheck.remaining 
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/verify-otp', apiLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    if (!otp.match(/^\d{6}$/)) {
      return res.status(400).json({ error: 'OTP must be 6 digits' });
    }

    const result = verifyOTP(email, otp);

    if (!result.valid) {
      incrementAttempts(email, otp);
      return res.status(400).json({ error: result.message });
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

    res.json({
      message: 'OTP verified successfully',
      token,
      user: { email }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
