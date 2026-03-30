class InMemoryDB {
  constructor() {
    this.otpVerifications = new Map();
    this.otpRequests = new Map();
  }

  createOTPVerification(email, otpHash, expiresAt) {
    const id = Date.now().toString();
    this.otpVerifications.set(email, {
      id,
      email,
      otpHash,
      expiresAt,
      verified: false,
      createdAt: new Date(),
      attempts: 0
    });
    return id;
  }

  getOTPVerification(email) {
    return this.otpVerifications.get(email);
  }

  updateOTPVerification(email, updates) {
    const existing = this.otpVerifications.get(email);
    if (existing) {
      this.otpVerifications.set(email, { ...existing, ...updates });
    }
  }

  deleteOTPVerification(email) {
    this.otpVerifications.delete(email);
  }

  getOTPRequest(email) {
    return this.otpRequests.get(email);
  }

  setOTPRequest(email, data) {
    this.otpRequests.set(email, data);
  }

  incrementOTPRequest(email) {
    const existing = this.otpRequests.get(email);
    if (existing) {
      existing.requestCount++;
      this.otpRequests.set(email, existing);
    }
  }
}

module.exports = new InMemoryDB();
