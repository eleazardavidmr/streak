import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconArrowRight, IconLock, IconMail } from "@tabler/icons-react";
import { authenticate } from "../lib/auth.js";
import BrandMark from "../components/ui/BrandMark.jsx";
import { fadeScale, slideDown, slideUp, springSoft } from "../lib/motion.js";

export default function AuthPage({ mode, onNavigate }) {
  const isRegister = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    const result = await authenticate({ email, password, isRegister });

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (isRegister && !result.data.session) {
      setNotice("Check your email to confirm your account.");
    }
  };

  return (
    <motion.main
      variants={fadeScale}
      initial="hidden"
      animate="visible"
      transition={springSoft}
      className="min-h-screen bg-surface text-on-surface flex flex-col px-margin pt-safe"
    >
      <motion.header
        variants={slideDown}
        initial="hidden"
        animate="visible"
        transition={springSoft}
        className="flex items-center justify-between h-20"
      >
        <span className="flex items-center gap-space-sm font-headline-sm text-headline-sm uppercase tracking-tight">
          <BrandMark />
          Streak
        </span>
        <span className="text-label-sm text-outline uppercase tracking-widest">
          Kinetic discipline
        </span>
      </motion.header>

      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center py-space-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={isRegister ? "register" : "login"}
            variants={slideUp}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={springSoft}
          >
            <div className="mb-space-xl">
              <p className="text-label-sm text-primary-container uppercase tracking-widest mb-space-md">
                {isRegister ? "Begin your record" : "Welcome back"}
              </p>
              <h1 className="text-display-lg-mobile font-display-lg-mobile tracking-tighter text-primary">
                {isRegister ? "Make it count." : "Keep the streak."}
              </h1>
              <p className="mt-space-md text-body-md text-on-surface-variant max-w-xs">
                {isRegister
                  ? "Create a private space for the discipline you are building."
                  : "Your daily record is waiting for you."}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-space-lg"
            >
              <label className="group flex items-center gap-space-sm border-b border-surface-container-highest focus-within:border-primary-container transition-colors">
                <IconMail size={18} className="text-outline" stroke={1.7} />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  className="w-full h-12 bg-transparent text-body-md text-on-surface outline-none placeholder:text-outline"
                />
              </label>

              <label className="group flex items-center gap-space-sm border-b border-surface-container-highest focus-within:border-primary-container transition-colors">
                <IconLock size={18} className="text-outline" stroke={1.7} />
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  className="w-full h-12 bg-transparent text-body-md text-on-surface outline-none placeholder:text-outline"
                />
              </label>

              {error && <p className="text-body-md text-error">{error}</p>}
              {notice && (
                <p className="text-body-md text-primary-container">{notice}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="h-13 mt-space-sm rounded-full bg-primary-container text-on-primary-fixed text-label-md font-semibold flex items-center justify-center gap-space-xs motion-interactive shadow-elevated-primary disabled:opacity-50 disabled:shadow-none"
              >
                {loading ? "Working..." : isRegister ? "Create account" : "Sign in"}
                <IconArrowRight size={18} stroke={2} />
              </button>
            </form>

            <button
              type="button"
              onClick={() => onNavigate(isRegister ? "/login" : "/register")}
              className="mt-space-xl text-body-md text-outline hover:text-on-surface transition-colors text-left"
            >
              {isRegister ? "Already have an account? " : "New here? "}
              <span className="text-on-surface underline underline-offset-4">
                {isRegister ? "Sign in" : "Create one"}
              </span>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="py-space-lg text-label-sm text-outline uppercase tracking-widest">
        Private by design
      </footer>
    </motion.main>
  );
}
