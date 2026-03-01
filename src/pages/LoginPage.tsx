import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CartDrawer from "@/components/CartDrawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = (location.state as any)?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isRegister) {
      if (!name.trim()) { setError("Name is required"); return; }
      const ok = await register(name, email, password);
      if (!ok) { setError("Email already registered"); return; }
    } else {
      const ok = await login(email, password);
      if (!ok) { setError("Invalid email or password"); return; }
    }
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <CartDrawer />
      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md glass-surface rounded-2xl p-8">
          <h1 className="text-2xl font-extrabold text-foreground text-center mb-1">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {isRegister ? "Sign up to place your order" : "Login to continue shopping"}
          </p>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm p-3 mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <Input
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Button type="submit" className="w-full gradient-cta font-extrabold text-sm h-11">
              {isRegister ? <><UserPlus className="w-4 h-4 mr-2" /> Register</> : <><LogIn className="w-4 h-4 mr-2" /> Login</>}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-5">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(""); }}
              className="text-primary font-bold hover:underline"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default LoginPage;
