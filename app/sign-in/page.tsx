"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Chrome, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import ErrorPopup from "../components/Popup/ErrorPopup";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SignInPage() {
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = "/user/dashboard";
  const error = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (session.data) {
    return (
      <ErrorPopup
        message="You are already signed in."
        closeText="Go to Dashboard"
        buttonColor="btn-primary"
        redirectTo={callbackUrl}
        notTransparent
      />
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/user/dashboard",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4 py-10 text-base-content">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={handleBack}
          className="btn btn-ghost btn-sm mb-4 -ml-2 flex items-center gap-2"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back</span>
        </button>

        <motion.div
          className="rounded-3xl bg-base-100 border border-base-300 shadow-xl px-6 py-8 sm:px-8 sm:py-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-2">
              SafeHub · LCUP
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Sign in to SafeHub
            </h1>
            <p className="text-sm text-base-content/70">
              Access your counseling dashboard using your LCUP account.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
              Incorrect email or password. Please try again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium text-base-content/80"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-4 z-10 flex items-center text-base-content/60">
                  <Mail size={18} strokeWidth={2} aria-hidden="true" />
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full pl-12 text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                className="text-xs font-medium text-base-content/80"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-4 z-10 flex items-center text-base-content/60">
                  <Lock size={18} strokeWidth={2} aria-hidden="true" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full pl-12 pr-12 text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="btn btn-ghost btn-xs absolute right-2 z-10 min-h-8 h-8 w-8 p-0 text-base-content/60 hover:text-base-content"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Eye size={18} strokeWidth={2} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2 flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              <span>{loading ? "Signing in..." : "Sign in"}</span>
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-base-300" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-base-content/50">
              Or
            </span>
            <div className="h-px flex-1 bg-base-300" />
          </div>

          <button
            type="button"
            onClick={() => signIn("google", { redirectTo: callbackUrl })}
            className="mt-4 btn btn-outline w-full flex items-center justify-center gap-2 text-sm"
          >
            <Chrome size={18} />
            <span>Continue with Google</span>
          </button>

          <p className="mt-6 text-[11px] text-center text-base-content/60">
            By signing in, you agree to use SafeHub only for LCUP counseling and
            student support purposes.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
