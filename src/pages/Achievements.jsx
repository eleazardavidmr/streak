import { useEffect, useState } from "react";
import { IconLock, IconMedal } from "@tabler/icons-react";
import {
  calculateBestStreak,
  calculateCurrentStreak,
  getCheckins,
} from "../lib/checkins.js";

const milestones = [
  {
    id: "first",
    title: "First mark",
    description: "Log your first clean day.",
    unlocked: ({ loggedDays }) => loggedDays >= 1,
  },
  {
    id: "three",
    title: "Three in a row",
    description: "Hold a 3-day streak.",
    unlocked: ({ bestStreak }) => bestStreak >= 3,
  },
  {
    id: "week",
    title: "Full week",
    description: "Reach 7 consecutive days.",
    unlocked: ({ bestStreak }) => bestStreak >= 7,
  },
  {
    id: "fortnight",
    title: "Fortnight",
    description: "Reach 14 consecutive days.",
    unlocked: ({ bestStreak }) => bestStreak >= 14,
  },
  {
    id: "month",
    title: "One month",
    description: "Reach 30 consecutive days.",
    unlocked: ({ bestStreak }) => bestStreak >= 30,
  },
  {
    id: "ten-logs",
    title: "Ten logged days",
    description: "Accumulate 10 days on the record.",
    unlocked: ({ loggedDays }) => loggedDays >= 10,
  },
];

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
      <div className="min-h-screen bg-surface flex items-center justify-center text-label-sm text-outline uppercase tracking-widest">
        Loading
      </div>
    );
  }

  const unlockedCount = stats
    ? milestones.filter((item) => item.unlocked(stats)).length
    : 0;

  return (
    <main className="flex-1 flex flex-col relative w-full px-margin pt-nav pb-nav bg-surface">
      <div className="pt-space-sm pb-space-lg">
        <p className="font-label-sm text-label-sm text-outline tracking-widest uppercase">
          Record
        </p>
        <h2 className="mt-space-xs font-headline-sm text-headline-sm text-on-surface tracking-tight">
          Achievements
        </h2>
      </div>

      {error ? (
        <p className="text-body-md text-error">{error}</p>
      ) : (
        <>
          <div className="flex items-baseline gap-space-sm pb-space-lg">
            <span className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary-container">
              {unlockedCount}
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface-variant font-normal">
              of {milestones.length} unlocked
            </span>
          </div>

          <div className="flex flex-col">
            {milestones.map((item, index) => {
              const unlocked = item.unlocked(stats);
              return (
                <div key={item.id}>
                  <div className="flex items-start gap-space-md py-space-md">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        unlocked
                          ? "bg-primary-container text-on-primary-fixed"
                          : "bg-surface-container-high text-outline"
                      }`}
                    >
                      {unlocked ? (
                        <IconMedal size={18} stroke={1.8} />
                      ) : (
                        <IconLock size={16} stroke={1.8} />
                      )}
                    </div>
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
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-full h-px bg-surface-container-highest opacity-40" />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
