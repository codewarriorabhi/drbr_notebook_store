import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { sendOTP, verifyOTP } from "@/services/authService";

export interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sendOTPCode: (email: string) => Promise<boolean>;
  verifyOTPCode: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "drb_session";
const TOKEN_KEY = "drb_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  const sendOTPCode = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await sendOTP(email);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOTPCode = useCallback(async (email: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await verifyOTP(email, otp);
      setUser(response.user);
      localStorage.setItem(TOKEN_KEY, response.token);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        sendOTPCode,
        verifyOTPCode,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
