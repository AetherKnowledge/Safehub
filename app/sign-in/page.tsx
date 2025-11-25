"use client";

import { motion } from "framer-motion";
import { Chrome, Lock, LogIn, Mail } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import ErrorPopup from "../components/Popup/ErrorPopup";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SignInPage() {
  const session = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = "/user/dashboard";
  const error = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (session.data) {
    return (
      <ErrorPopup
        message="You are already signed in."
        retry
        redirectTo="/"
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4 py-10 text-base-content">
      <div className="w-full max-w-md">
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
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-base-content/50">
                  <Mail size={16} className="text-base-content/60" />
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full pl-9 text-sm"
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
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-base-content/50">
                  <Lock size={16} className="text-base-content/60" />
                </span>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full pl-9 text-sm"
                  placeholder="••••••••"
                />
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
