const transporter = require('./lib/email');
const { generateOTP, checkRateLimit, storeOTP } = require('./lib/store');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Processing /api/send-otp request');
    
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
    storeOTP(email, otp);
    console.log('OTP generated for:', email);
    
    // Send email
    const mailOptions = {
      from: `"Dr. Br. Notebook Store" <${process.env.EMAIL_USER}>`,
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
    console.log('Email sent successfully to:', email);
    
    return res.json({ 
      message: 'OTP sent successfully',
      remainingAttempts: rateCheck.remaining 
    });
    
  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
};
