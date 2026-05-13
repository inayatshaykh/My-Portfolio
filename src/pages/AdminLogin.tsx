import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldAlert } from "lucide-react";
import { login, isAuthenticated } from "@/lib/auth";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) navigate("/admin/dashboard");
  }, [navigate]);

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockedUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        setCountdown(0);
        setError("");
      } else {
        setCountdown(remaining);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setError("");
    setLoading(true);
    await new Promise((res) => setTimeout(res, 600));

    if (login(email, password)) {
      navigate("/admin/dashboard");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_SECONDS * 1000;
        setLockedUntil(until);
        setError(`Too many failed attempts. Try again in ${LOCKOUT_SECONDS}s.`);
      } else {
        setError(`Invalid email or password. ${MAX_ATTEMPTS - newAttempts} attempt${MAX_ATTEMPTS - newAttempts !== 1 ? "s" : ""} remaining.`);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-display font-bold text-gradient-gold">DevCraft</a>
          <p className="text-muted-foreground text-sm font-body mt-1">Admin Panel</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-gold">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-5">
            {isLocked ? <ShieldAlert size={22} className="text-destructive" /> : <Lock size={22} className="text-primary" />}
          </div>

          <h1 className="text-xl font-display font-bold text-foreground mb-1 text-center">
            {isLocked ? "Account Locked" : "Sign In"}
          </h1>
          <p className="text-xs text-muted-foreground font-body text-center mb-6">
            {isLocked ? `Please wait ${countdown} seconds before trying again.` : "Enter your credentials to access the dashboard."}
          </p>

          {/* Lockout progress bar */}
          {isLocked && (
            <div className="mb-5">
              <div className="w-full bg-border rounded-full h-1.5">
                <motion.div
                  className="bg-destructive h-1.5 rounded-full"
                  initial={{ width: "100%" }}
                  animate={{ width: `${(countdown / LOCKOUT_SECONDS) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-body font-medium text-muted-foreground mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  required
                  disabled={isLocked}
                  className="w-full bg-background border border-border rounded-md pl-9 pr-4 py-3 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-body font-medium text-muted-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLocked}
                  className="w-full bg-background border border-border rounded-md pl-9 pr-10 py-3 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLocked}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Attempt indicators */}
            {attempts > 0 && !isLocked && (
              <div className="flex gap-1 justify-center">
                {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${i < attempts ? "bg-destructive" : "bg-border"}`}
                  />
                ))}
              </div>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-destructive text-sm font-body text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full bg-gradient-gold text-primary-foreground py-3 rounded-md font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 shadow-gold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : isLocked ? `Locked (${countdown}s)` : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground font-body mt-6">
          <a href="/" className="hover:text-primary transition-colors">← Back to website</a>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
