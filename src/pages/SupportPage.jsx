import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconArrowLeft, IconBolt } from "@tabler/icons-react";
import { fadeRise, springSoft } from "../lib/motion.js";

const TIMER_DURATION = 60;
const TIMER_RADIUS = 78;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;

export default function SupportPage({ onNavigate }) {
  const [secondsLeft, setSecondsLeft] = useState(TIMER_DURATION);

  useEffect(() => {
    const endTime = Date.now() + TIMER_DURATION * 1000;

    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setSecondsLeft(remaining);

      if (remaining === 0) {
        window.clearInterval(timer);
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const progress = secondsLeft / TIMER_DURATION;
  const strokeDashoffset = TIMER_CIRCUMFERENCE * (1 - progress);

  return (
    <main className="flex-1 flex flex-col relative w-full px-margin pt-nav pb-safe bg-surface">
      <div className="max-w-md mx-auto w-full">
        <button
          type="button"
          onClick={() => onNavigate?.("/")}
          className="flex items-center gap-space-xs text-outline transition-colors hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-full"
        >
          <IconArrowLeft size={18} stroke={2} />
          <span className="font-label-md text-label-md">Back to streak</span>
        </button>

        <motion.div
          variants={fadeRise}
          initial="hidden"
          animate="visible"
          transition={springSoft}
          className="mt-space-xl flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container text-on-primary-fixed"
        >
          <IconBolt size={25} stroke={2} />
        </motion.div>

        <motion.div
          variants={fadeRise}
          initial="hidden"
          animate="visible"
          transition={{ ...springSoft, delay: 0.06 }}
          className="mt-space-lg"
        >
          <span className="font-label-sm text-label-sm text-primary-container uppercase tracking-wider">
            Grounding protocol
          </span>
          <h1 className="mt-space-sm font-headline-sm text-headline-sm text-on-surface">
            Stay with this moment.
          </h1>
          <p className="mt-space-sm font-body-md text-body-md text-on-surface-variant">
            Urges peak within 15 minutes and dissipate like a wave. Breathe out
            slowly for 4 seconds, ground your feet against the floor.
          </p>
        </motion.div>

        <motion.div
          variants={fadeRise}
          initial="hidden"
          animate="visible"
          transition={{ ...springSoft, delay: 0.12 }}
          className="mt-space-xl flex flex-col items-center border-t border-surface-container-highest pt-space-xl"
        >
          <div
            className="relative flex h-44 w-44 items-center justify-center"
            role="timer"
            aria-label={`${secondsLeft} seconds remaining`}
          >
            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 180 180"
              aria-hidden="true"
            >
              <circle
                cx="90"
                cy="90"
                r={TIMER_RADIUS}
                fill="none"
                className="stroke-surface-container-highest"
                strokeWidth="5"
              />
              <circle
                cx="90"
                cy="90"
                r={TIMER_RADIUS}
                fill="none"
                className="stroke-primary-container transition-[stroke-dashoffset] duration-1000 ease-linear"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={TIMER_CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className="font-display-lg-mobile text-display-lg-mobile text-on-surface tabular-nums">
                {secondsLeft}
              </span>
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                seconds
              </span>
            </div>
          </div>
          <span className="mt-space-lg font-label-sm text-label-sm text-outline uppercase tracking-wider">
            {secondsLeft > 0 ? "60-second reset engaged" : "Reset complete"}
          </span>
        </motion.div>
      </div>
    </main>
  );
}
