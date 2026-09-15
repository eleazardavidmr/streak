import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconLock, IconMedal } from "@tabler/icons-react";
import {
  calculateBestStreak,
  calculateCurrentStreak,
  getCheckins,
} from "../lib/checkins.js";
import { milestones } from "../lib/achievements.js";
import {
  fadeRise,
  fadeScale,
  springSoft,
  staggerParent,
  staggerTransition,
} from "../lib/motion.js";

export default function Achievements() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getCheckins()
      .then((dates) => {
        if (!mounted) {
          return;
        }

        setStats({
          loggedDays: dates.length,
          streak: calculateCurrentStreak(dates),
          bestStreak: calculateBestStreak(dates),
        });
      })
      .catch(() => {
        if (mounted) {
          setError("Unable to load achievements.");
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!stats && !error) {
    return (
      <motion.div
        variants={fadeScale}
        initial="hidden"
        animate="visible"
        transition={springSoft}
        className="min-h-screen bg-surface flex items-center justify-center text-label-sm text-outline uppercase tracking-widest"
      >
        Loading
      </motion.div>
    );
  }

  const unlockedCount = stats
    ? milestones.filter((item) => item.unlocked(stats)).length
    : 0;

  return (
    <main className="flex-1 flex flex-col relative w-full px-margin pt-nav pb-nav bg-surface">
      <motion.div
        variants={fadeRise}
        initial="hidden"
        animate="visible"
        transition={springSoft}
        className="pt-space-sm pb-space-lg"
      >
        <p className="font-label-sm text-label-sm text-outline tracking-widest uppercase">
          Record
        </p>
        <h2 className="mt-space-xs font-headline-sm text-headline-sm text-on-surface tracking-tight">
          Achievements
        </h2>
      </motion.div>

      {error ? (
        <p className="text-body-md text-error">{error}</p>
      ) : (
        <>
          <div className="flex items-baseline gap-space-sm pb-space-lg">
            <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter tabular-nums text-primary-container">
              {unlockedCount}
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface-variant font-normal">
              of {milestones.length} unlocked
            </span>
          </div>

          <motion.div
            variants={staggerParent}
            initial="hidden"
            animate="visible"
            transition={staggerTransition(0.06)}
            className="flex flex-col divide-y divide-white/8 rounded-[1.35rem] border border-white/8 bg-surface-container-low/70 backdrop-blur-xl px-space-md"
          >
            {milestones.map((item) => {
              const unlocked = item.unlocked(stats);
              return (
                <motion.div
                  key={item.id}
                  variants={fadeRise}
                  transition={springSoft}
                  className="flex items-start gap-space-md py-space-md"
                >
                  <motion.div
                    animate={
                      unlocked
                        ? { scale: [0.7, 1.08, 1] }
                        : { scale: 1 }
                    }
                    transition={springSoft}
                    className={`w-10 h-10 rounded-[0.85rem] flex items-center justify-center shrink-0 ${
                      unlocked
                        ? "bg-primary-container text-on-primary-fixed shadow-elevated-primary"
                        : "bg-white/6 text-outline"
                    }`}
                  >
                    {unlocked ? (
                      <IconMedal size={18} stroke={1.8} />
                    ) : (
                      <IconLock size={16} stroke={1.8} />
                    )}
                  </motion.div>
                  <div>
                    <p
                      className={`font-body-md text-body-md ${
                        unlocked ? "text-on-surface" : "text-on-surface-variant"
                      }`}
                    >
                      {item.title}
                    </p>
                    <p className="font-label-sm text-label-sm text-outline">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </>
      )}
    </main>
  );
}
