require('dotenv').config();
const express = require('express');
const cors = require('cors');
const transporter = require('./mailer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Debug logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});

// In-memory storage
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

// Send OTP email
async function sendOTP(email, otp) {
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

// POST /send-otp
app.post('/send-otp', async (req, res) => {
  try {
    console.log('Processing /send-otp request');
    
    const { email } = req.body;
    
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      console.log('Invalid email:', email);
      return res.status(400).json({ error: 'Valid email is required' });
    }
    
    // Check rate limit
    const rateCheck = checkRateLimit(email);
    if (!rateCheck.allowed) {
      console.log('Rate limit exceeded for:', email);
      return res.status(429).json({ error: rateCheck.message });
    }
    
    // Generate and store OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;
    
    otpStore.set(email, { otp, expiresAt });
    console.log('OTP generated for:', email);
    
    // Send email
    await sendOTP(email, otp);
    console.log('Email sent successfully to:', email);
    
    return res.json({ 
      message: 'OTP sent successfully',
      remainingAttempts: rateCheck.remaining 
    });
    
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// POST /verify-otp
app.post('/verify-otp', async (req, res) => {
  try {
    console.log('Processing /verify-otp request');
    
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      console.log('Missing email or otp');
      return res.status(400).json({ error: 'Email and OTP are required' });
    }
    
    const record = otpStore.get(email);
    
    if (!record) {
      console.log('OTP not found for:', email);
      return res.status(400).json({ error: 'OTP not found. Please request a new one.' });
    }
    
    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      console.log('OTP expired for:', email);
      return res.status(400).json({ error: 'OTP has expired' });
    }
    
    if (record.otp !== otp) {
      console.log('Invalid OTP for:', email);
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    // Success - delete OTP to prevent reuse
    otpStore.delete(email);
    console.log('OTP verified successfully for:', email);
    
    return res.json({ 
      message: 'OTP verified successfully',
      token: Buffer.from(`${email}:${Date.now()}`).toString('base64')
    });
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Health check
app.get('/health', (req, res) => {
  return res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  return res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
