const API_URL = 'http://localhost:3001/api';

export interface SendOTPResponse {
  message: string;
  remainingAttempts?: number;
}

export interface VerifyOTPResponse {
  message: string;
  token: string;
  user: {
    email: string;
  };
}

export const sendOTP = async (email: string): Promise<SendOTPResponse> => {
  const response = await fetch(`${API_URL}/auth/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to send OTP');
  }

  return data;
};

export const verifyOTP = async (email: string, otp: string): Promise<VerifyOTPResponse> => {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to verify OTP');
  }

  return data;
};
