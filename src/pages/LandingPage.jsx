import { motion } from "framer-motion";
import { IconArrowRight } from "@tabler/icons-react";
import BrandMark from "../components/ui/BrandMark.jsx";
import { fadeScale, slideDown, slideUp, springSoft } from "../lib/motion.js";

export default function LandingPage({ onNavigate }) {
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
          Private by design
        </span>
      </motion.header>

      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center py-space-xl">
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          transition={springSoft}
        >
          <p className="text-label-sm text-primary-container uppercase tracking-widest mb-space-md">
            One honest day at a time
          </p>
          <h1 className="text-display-lg-mobile font-display-lg-mobile tracking-tighter text-primary">
            Build the streak that matters.
          </h1>
          <p className="mt-space-md text-body-md text-on-surface-variant max-w-xs">
            A calm, private space to track daily discipline — no judgment,
            no noise, just your own record.
          </p>

          <div className="mt-space-xl flex flex-col gap-space-md">
            <button
              type="button"
              onClick={() => onNavigate("/register")}
              className="h-13 rounded-full bg-primary-container text-on-primary-fixed text-label-md font-semibold flex items-center justify-center gap-space-xs motion-interactive shadow-elevated-primary"
            >
              Sign up
              <IconArrowRight size={18} stroke={2} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/login")}
              className="h-13 rounded-full bg-white/8 text-on-surface text-label-md font-semibold motion-interactive"
            >
              Log in
            </button>
          </div>
        </motion.div>
      </div>

      <footer className="py-space-lg text-label-sm text-outline uppercase tracking-widest">
        Private by design
      </footer>
    </motion.main>
  );
}
