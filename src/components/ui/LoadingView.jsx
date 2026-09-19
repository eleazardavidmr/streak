import { motion } from "framer-motion";
import { fadeScale, springSoft } from "../../lib/motion.js";
import BrandMark from "./BrandMark.jsx";

export default function LoadingView({
  label = "Getting things ready",
  className = "min-h-screen",
}) {
  return (
    <motion.div
      variants={fadeScale}
      initial="hidden"
      animate="visible"
      transition={springSoft}
      className={`flex flex-col items-center justify-center gap-space-lg bg-surface ${className}`}
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <motion.span
          aria-hidden="true"
          animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-primary-container"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary-container/15"
        >
          <BrandMark className="h-6 w-6" />
        </motion.div>
      </div>
      <span className="font-label-md text-label-md text-on-surface-variant tracking-wide">
        {label}
      </span>
    </motion.div>
  );
}
