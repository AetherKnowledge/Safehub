"use client";

import { motion } from "framer-motion";
import { ArrowLeft, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ErrorPopup from "../components/Popup/ErrorPopup";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SignOutPage() {
  const router = useRouter();
  const session = useSession();

  if (!session.data) {
    return (
      <ErrorPopup
        message="You are not signed in."
        closeText="Go Back"
        buttonColor="btn-primary"
        redirectTo={"/"}
        notTransparent
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4 py-10 text-base-content">
      <div className="w-full max-w-md">
        <motion.div
          className="rounded-3xl bg-base-100 border border-base-300 shadow-xl px-6 py-8 sm:px-8 sm:py-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-2">
              SafeHub · LCUP
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Ready to sign out?
            </h1>
            <p className="text-sm text-base-content/70 max-w-sm mx-auto">
              You&apos;ll be signed out from your SafeHub session. You can
              always sign back in using your LCUP account to continue where you
              left off.
            </p>
          </div>

          <div className="space-y-3 mt-4">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="btn btn-error w-full flex items-center justify-center gap-2 text-sm"
            >
              <LogOut size={18} />
              <span>Sign out of SafeHub</span>
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-ghost w-full flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <ArrowLeft size={18} />
              <span>Go back</span>
            </button>
          </div>

          <p className="mt-6 text-[11px] text-center text-base-content/60">
            Thank you for using SafeHub to stay connected with LCUP Social
            Welfare Services.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
