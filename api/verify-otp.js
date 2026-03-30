const { verifyOTP } = require('./lib/store');

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
    console.log('Processing /api/verify-otp request');
    
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }
    
    if (!otp.match(/^\d{6}$/)) {
      return res.status(400).json({ error: 'OTP must be 6 digits' });
    }
    
    const result = verifyOTP(email, otp);
    
    if (!result.valid) {
      console.log('OTP verification failed for:', email, result.message);
      return res.status(400).json({ error: result.message });
    }
    
    // Generate simple token
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    
    console.log('OTP verified successfully for:', email);
    return res.json({
      message: 'OTP verified successfully',
      token,
      user: { email }
    });
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ error: 'Failed to verify OTP' });
  }
};
