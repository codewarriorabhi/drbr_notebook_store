const express = require('express');
const rateLimit = require('express-rate-limit');
const transporter = require('../services/emailService');
const { 
  generateOTP, 
  storeOTP, 
  verifyOTP, 
  checkRateLimit,
  incrementAttempts 
} = require('../services/otpService');

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

    // Send email
    const mailOptions = {
      from: `"Notebook Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #333; text-align: center;">Verification Code</h2>
          <p style="color: #666; text-align: center;">Your verification code is:</p>
          <div style="background: #fff; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #2dd4bf; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="color: #999; text-align: center; font-size: 12px;">This code expires in 5 minutes.</p>
          <p style="color: #999; text-align: center; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

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

module.exports = router;
