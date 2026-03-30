const API_URL = 'http://localhost:3001';

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

async function safeJsonParse(response: Response) {
  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response:', text.substring(0, 200));
    throw new Error('Server returned non-JSON response');
  }
  
  try {
    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (parseError) {
    const text = await response.text();
    console.error('JSON parse error. Raw response:', text.substring(0, 200));
    throw new Error('Invalid JSON response from server');
  }
}

export const sendOTP = async (email: string): Promise<SendOTPResponse> => {
  console.log('Sending OTP request for:', email);
  
  const response = await fetch(`${API_URL}/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email }),
  });

  const data = await safeJsonParse(response);

  if (!response.ok) {
    throw new Error(data.error || `Failed to send OTP (${response.status})`);
  }

  return data;
};

export const verifyOTP = async (email: string, otp: string): Promise<VerifyOTPResponse> => {
  console.log('Verifying OTP for:', email);
  
  const response = await fetch(`${API_URL}/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email, otp }),
  });

  const data = await safeJsonParse(response);

  if (!response.ok) {
    throw new Error(data.error || `Failed to verify OTP (${response.status})`);
  }

  return {
    ...data,
    user: { email }
  };
};
