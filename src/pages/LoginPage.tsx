import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { OTPInput } from "@/components/OTPInput";

const COOLDOWN_SECONDS = 60;

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, sendOTPCode, verifyOTPCode, isLoading, error, clearError } = useAuth();
  
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setLocalError("Please enter a valid email address");
      return;
    }

    const sent = await sendOTPCode(email);
    if (sent) {
      setStep("otp");
      setCooldown(COOLDOWN_SECONDS);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (otp.length !== 6) {
      setLocalError("Please enter all 6 digits");
      return;
    }

    const verified = await verifyOTPCode(email, otp);
    if (verified) {
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    }
  };

  const handleResendOTP = useCallback(async () => {
    if (cooldown > 0) return;
    
    clearError();
    setLocalError(null);
    
    const sent = await sendOTPCode(email);
    if (sent) {
      setCooldown(COOLDOWN_SECONDS);
    }
  }, [cooldown, email, sendOTPCode, clearError]);

  const handleBack = () => {
    setStep("email");
    setOtp("");
    setLocalError(null);
    clearError();
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Login Successful!</h2>
          <p className="text-muted-foreground">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="glass-surface rounded-2xl p-8 shadow-xl">
          {step === "email" ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
                <p className="text-muted-foreground">Enter your email to receive a verification code</p>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-secondary border-border"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {localError && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {localError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 gradient-cta font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Enter OTP</h2>
                <p className="text-muted-foreground">
                  We sent a 6-digit code to <span className="text-foreground font-medium">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  disabled={isLoading}
                />

                {localError && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
                    {localError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 gradient-cta font-semibold"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={cooldown > 0 || isLoading}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cooldown > 0 ? (
                      `Resend OTP in ${cooldown}s`
                    ) : (
                      "Didn't receive it? Resend OTP"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
