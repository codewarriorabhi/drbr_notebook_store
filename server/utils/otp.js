/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Check if OTP is expired
 * @param {number} expiresAt - Timestamp when OTP expires
 * @returns {boolean}
 */
function isOTPExpired(expiresAt) {
  return Date.now() > expiresAt;
}

module.exports = {
  generateOTP,
  isOTPExpired
};
