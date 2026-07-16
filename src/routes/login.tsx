import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight,
  ArrowLeft, AlertCircle, CheckCircle2, Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import airesumiLogo from "@/assets/ai-resumi.webp";
import airesumiLogoWhite from "@/assets/airesumi-white.webp";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";


// ── LIQUID GLASS STYLES ──────────────────────────────────────────────────────
const GLASS_STYLES = `
  @property --angle-1 { syntax: "<angle>"; inherits: false; initial-value: -75deg; }
  @property --angle-2 { syntax: "<angle>"; inherits: false; initial-value: -45deg; }

  /* Animated gradient blobs */
  @keyframes blob1 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-20px) scale(1.05); } 66% { transform: translate(-20px,15px) scale(0.97); } }
  @keyframes blob2 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(-25px,20px) scale(1.03); } 66% { transform: translate(20px,-15px) scale(0.98); } }
  @keyframes blob3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(15px,25px) scale(1.04); } }

  /* Glass card */
  .glass-card {
    background: rgba(255,255,255,0.18);
    backdrop-filter: blur(32px) saturate(180%);
    -webkit-backdrop-filter: blur(32px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.35);
    box-shadow:
      0 8px 32px rgba(234,88,12,0.08),
      0 2px 8px rgba(0,0,0,0.06),
      inset 0 1px 0 rgba(255,255,255,0.6),
      inset 0 -1px 0 rgba(0,0,0,0.04);
  }

  /* Glass input */
  .glass-input {
    background: rgba(255,255,255,0.25);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.45);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.6),
      inset 0 -1px 0 rgba(0,0,0,0.04),
      0 2px 8px rgba(0,0,0,0.04);
    transition: all 0.25s ease;
  }
  .glass-input:focus-within {
    background: rgba(255,255,255,0.38);
    border-color: rgba(234,88,12,0.4);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.7),
      0 0 0 3px rgba(234,88,12,0.12),
      0 2px 8px rgba(0,0,0,0.06);
  }

  /* Glass button */
  .glass-btn {
    background: linear-gradient(135deg, rgba(234,88,12,0.92), rgba(194,65,12,0.95));
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.25);
    box-shadow:
      0 4px 16px rgba(234,88,12,0.35),
      inset 0 1px 0 rgba(255,255,255,0.25),
      inset 0 -1px 0 rgba(0,0,0,0.1);
    transition: all 0.2s ease;
  }
  .glass-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow:
      0 8px 24px rgba(234,88,12,0.4),
      inset 0 1px 0 rgba(255,255,255,0.3);
  }
  .glass-btn:active:not(:disabled) { transform: translateY(0); }

  /* Google glass button */
  .glass-btn-outline {
    background: rgba(255,255,255,0.35);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.5);
    box-shadow:
      0 2px 8px rgba(0,0,0,0.06),
      inset 0 1px 0 rgba(255,255,255,0.7);
    transition: all 0.2s ease;
  }
  .glass-btn-outline:hover {
    background: rgba(255,255,255,0.5);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8);
  }

  /* Tab pill */
  .glass-tab-active {
    background: rgba(255,255,255,0.6);
    box-shadow: 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8);
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
    box-shadow: 0 0 0 1000px transparent inset !important;
    -webkit-text-fill-color: #1f2937 !important;
    caret-color: #1f2937;
    transition: background-color 5000s ease-in-out 0s !important;
  }
  html.dark input:-webkit-autofill,
  html.dark input:-webkit-autofill:hover,
  html.dark input:-webkit-autofill:focus,
  html.dark input:-webkit-autofill:active {
    -webkit-text-fill-color: #f3f4f6 !important;
    caret-color: #f3f4f6;
  }

  /* ── DARK MODE ──────────────────────────────────────────────────── */
  html.dark .glass-card {
    background: rgba(20,20,28,0.55);
    border: 1px solid rgba(255,255,255,0.10);
    box-shadow:
      0 8px 32px rgba(0,0,0,0.5),
      0 2px 8px rgba(0,0,0,0.4),
      inset 0 1px 0 rgba(255,255,255,0.08),
      inset 0 -1px 0 rgba(0,0,0,0.4);
  }
  html.dark .glass-input {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.12);
    box-shadow: none;
  }
  html.dark .glass-input:focus-within {
    background: rgba(255,255,255,0.08);
    border-color: rgba(251,146,60,0.5);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.08),
      0 0 0 3px rgba(251,146,60,0.18);
  }
  html.dark .glass-input input {
    color: #f3f4f6 !important;
  }
  html.dark .glass-input input::placeholder {
    color: #9ca3af;
  }
  html.dark .glass-btn-outline {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.14);
    color: #f3f4f6;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08);
  }
  html.dark .glass-btn-outline:hover {
    background: rgba(255,255,255,0.10);
    box-shadow: 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12);
  }
  html.dark .glass-tab-active {
    background: rgba(255,255,255,0.10);
    box-shadow: 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12);
  }
  html.dark input:-webkit-autofill,
  html.dark input:-webkit-autofill:hover,
  html.dark input:-webkit-autofill:focus {
    -webkit-text-fill-color: #f3f4f6 !important;
  }
`;


// ── BACKGROUND BLOBS ─────────────────────────────────────────────────────────
function LiquidBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-amber-50 to-orange-200 dark:from-[#0b0b12] dark:via-[#11111a] dark:to-[#1a1320]" />
      {/* Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-orange-400/40 to-amber-300/30 dark:from-orange-500/20 dark:to-amber-500/10 blur-3xl"
        style={{ animation: "blob1 18s ease-in-out infinite" }} />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-500/30 to-red-400/20 dark:from-orange-600/15 dark:to-red-500/10 blur-3xl"
        style={{ animation: "blob2 22s ease-in-out infinite" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-amber-300/25 to-orange-300/20 dark:from-amber-500/10 dark:to-orange-500/10 blur-2xl"
        style={{ animation: "blob3 15s ease-in-out infinite" }} />
    </div>

  );
}

// ── GLASS INPUT ──────────────────────────────────────────────────────────────
function GlassInput({
  icon, type = "text", placeholder, value, onChange, rightAction
}: {
  icon: React.ReactNode; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; rightAction?: React.ReactNode;
}) {
  return (
    <div className="glass-input rounded-2xl flex items-center gap-3 px-4 py-3.5">
      <span className="text-orange-400 flex-shrink-0">{icon}</span>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 bg-transparent text-[#1f2937] dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-[15px] focus:outline-none"
      />
      {rightAction}

    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────────────────────
function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

  function switchTab(t: typeof tab) {
    setTab(t);
    setMessage(null);
    setPassword("");
    setConfirmPassword("");
  }

  // ── Auth handlers ────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage({ text: error.message, type: "error" });
    else navigate({ to: "/resume" });
    setLoading(false);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match!", type: "error" }); return;
    }
    setLoading(true); setMessage(null);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/resume` },
    });
    if (error) setMessage({ text: error.message, type: "error" });
    else setMessage({ text: "Account created! Check your email to confirm.", type: "success" });
    setLoading(false);
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setMessage({ text: error.message, type: "error" });
    else setMessage({ text: "Reset link sent! Check your inbox.", type: "success" });
    setLoading(false);
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `https://airesumi.com/auth/callback` },
    });
    if (error) setMessage({ text: error.message, type: "error" });
  }

  const submitHandler = tab === "login" ? handleLogin : tab === "signup" ? handleSignup : handleForgot;

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      <style>{GLASS_STYLES}</style>
      <LiquidBackground />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card relative z-10 w-full max-w-[400px] mx-4 rounded-3xl p-8"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-7">
          <div className="flex items-center justify-center mb-4">
            <img src={airesumiLogo} alt="Airesumi" width={140} height={36} className="theme-logo-light h-9 w-auto object-contain" />
            <img src={airesumiLogoWhite} alt="Airesumi" width={140} height={36} className="theme-logo-dark h-9 w-auto object-contain" />
          </div>

          <h1 className="text-[22px] font-bold text-[#111827] dark:text-gray-100 tracking-tight">
            {tab === "login" ? "Welcome back" : tab === "signup" ? "Create account" : "Reset password"}
          </h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
            {tab === "login" ? "Sign in to Airesumi" : tab === "signup" ? "Join Airesumi for free" : "We'll send you a reset link"}
          </p>

        </div>

        {/* Tab switcher */}
        {tab !== "forgot" && (
          <div className="flex gap-2 mb-6 justify-center">
            {(["login", "signup"] as const).map(t => (
              tab === t ? (
                <LiquidMetalButton
                  key={t}
                  onClick={() => switchTab(t)}
                  width={140}
                  height={40}
                  label={t === "login" ? "Sign In" : "Sign Up"}
                />
              ) : (
                <button
                  key={t}
                  type="button"
                  onClick={() => switchTab(t)}
                  className="flex-1 max-w-[140px] h-10 text-[13px] font-semibold rounded-full transition-all cursor-pointer border border-black/10 dark:border-white/10 bg-transparent text-gray-500 dark:text-gray-400 hover:text-[#111827] dark:hover:text-gray-100"
                >
                  {t === "login" ? "Sign In" : "Sign Up"}
                </button>
              )
            ))}
          </div>
        )}


        <form onSubmit={submitHandler} className="space-y-3">
          {/* Google */}
          {tab !== "forgot" && (
            <div className="mb-4">
              <LiquidMetalButton
                onClick={handleGoogle}
                fullWidth
                height={46}
                icon={<img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />}
              >
                Continue with Google
              </LiquidMetalButton>
            </div>
          )}

          {tab !== "forgot" && (
            <div className="flex items-center gap-3 mb-1">
              <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
              <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">or email</span>
              <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
            </div>
          )}


          {/* Email */}
          <GlassInput icon={<Mail size={17} />} type="email" placeholder="Email address"
            value={email} onChange={setEmail} />

          {/* Password */}
          <AnimatePresence>
            {tab !== "forgot" && (
              <motion.div key="password"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                <GlassInput icon={<Lock size={17} />} type={showPass ? "text" : "password"}
                  placeholder="Password" value={password} onChange={setPassword}
                  rightAction={
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer bg-transparent border-none">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  } />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confirm password (signup) */}
          <AnimatePresence>
            {tab === "signup" && (
              <motion.div key="confirm"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                <GlassInput icon={<Lock size={17} />} type={showConfirm ? "text" : "password"}
                  placeholder="Confirm password" value={confirmPassword} onChange={setConfirmPassword}
                  rightAction={
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer bg-transparent border-none">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  } />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forgot password link */}
          {tab === "login" && (
            <div className="text-right">
              <button type="button" onClick={() => switchTab("forgot")}
                className="text-[12px] text-orange-500 hover:text-orange-600 transition-colors cursor-pointer bg-transparent border-none">
                Forgot password?
              </button>
            </div>
          )}

          {/* Error / success message */}
          <AnimatePresence>
            {message && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`flex items-start gap-2.5 rounded-2xl px-4 py-3 text-[13px] ${
                  message.type === "error"
                    ? "bg-red-50/80 dark:bg-red-950/40 text-red-600 dark:text-red-300 border border-red-200/60 dark:border-red-800/50"
                    : "bg-green-50/80 dark:bg-green-950/40 text-green-600 dark:text-green-300 border border-green-200/60 dark:border-green-800/50"
                }`}>
                {message.type === "error"
                  ? <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                  : <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" />}
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>


          {/* Submit */}
          <div className="mt-1">
            <LiquidMetalButton
              type="submit"
              disabled={loading}
              fullWidth
              height={50}
            >
              {loading ? (
                <><Loader2 size={17} className="animate-spin" /> Please wait...</>
              ) : (
                <>
                  {tab === "login" ? "Sign In" : tab === "signup" ? "Create Account" : "Send Reset Link"}
                  <ArrowRight size={16} />
                </>
              )}
            </LiquidMetalButton>
          </div>

          {/* Back to login */}
          {tab === "forgot" && (
            <button type="button" onClick={() => switchTab("login")}
              className="w-full flex items-center justify-center gap-2 text-[13px] text-gray-500 hover:text-orange-500 transition-colors cursor-pointer bg-transparent border-none mt-1">
              <ArrowLeft size={14} /> Back to Sign In
            </button>
          )}
        </form>

        {/* Footer */}
        <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 mt-6 leading-relaxed">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-orange-500 dark:text-orange-400 hover:underline no-underline">Terms</Link>
          {" "}and{" "}
          <Link to="/privacy" className="text-orange-500 dark:text-orange-400 hover:underline no-underline">Privacy Policy</Link>
        </p>

      </motion.div>
    </div>
  );
}

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — airesumi.com" },
      { name: "description", content: "Sign in to your Airesumi account." },
    ],
  }),
  component: LoginPage,
});
