import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconFlag2, IconRosetteDiscountCheck, IconRun } from "@tabler/icons-react";
import CheckinButton from "./CheckInButton.jsx";
import ActivityHeatmap from "./ActivityHeatMap.jsx";
import {
  buildHeatmapDistribution,
  buildHeatmapMonths,
  calculateBestStreak,
  calculateCurrentStreak,
  getCheckins,
  getTodayDate,
  hasCheckedInToday,
  markTodayClean,
  undoTodayCheckin,
} from "../lib/checkins.js";
import { fadeRise, springBouncy } from "../lib/motion.js";

const HABIT = "running";

function daysUntil(dateString) {
  const today = new Date(`${getTodayDate()}T00:00:00`);
  const target = new Date(`${dateString}T00:00:00`);
  return Math.round((target - today) / 86400000);
}

function goalCopy(diff, label) {
  const name = label?.trim() || "your goal";

  if (diff > 1) {
    return `${diff} days to ${name}`;
  }
  if (diff === 1) {
    return `Tomorrow: ${name}`;
  }
  if (diff === 0) {
    return `Today: ${name}`;
  }
  return `${name} day has passed — set a new one in Settings`;
}

export default function RunningStreak({ profile }) {
  const [checkinDates, setCheckinDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getCheckins(HABIT)
      .then((dates) => {
        if (mounted) {
          setCheckinDates(dates);
        }
      })
      .catch(() => {
        if (mounted) {
          setError("Unable to load your runs.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleToggle = async () => {
    setSaving(true);
    setError("");

    try {
      if (hasCheckedInToday(checkinDates)) {
        await undoTodayCheckin(HABIT);
        setCheckinDates((dates) =>
          dates.filter((date) => date !== getTodayDate()),
        );
      } else {
        await markTodayClean(HABIT);
        setCheckinDates((dates) => [...dates, getTodayDate()]);
      }
    } catch {
      setError("Unable to update today's run.");
    } finally {
      setSaving(false);
    }
  };

  const checkedIn = hasCheckedInToday(checkinDates);
  const streak = calculateCurrentStreak(checkinDates);
  const bestStreak = calculateBestStreak(checkinDates);
  const distribution = buildHeatmapDistribution(
    checkinDates,
    16,
    profile.weekStartsOn,
  );
  const heatmapMonths = buildHeatmapMonths(16, profile.weekStartsOn);
  const goalDiff = profile.runningGoalDate
    ? daysUntil(profile.runningGoalDate)
    : null;

  return (
    <div className="flex flex-col gap-space-md rounded-[1.35rem] border border-white/8 bg-surface-container-low/70 backdrop-blur-xl shadow-elevated p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-[0.75rem] bg-secondary-container/50 text-secondary">
            <IconRun size={18} stroke={1.9} />
          </span>
          <span className="font-label-sm text-label-sm text-outline tracking-widest uppercase">
            Running
          </span>
        </div>
        {bestStreak > 0 && (
          <span className="font-label-sm text-label-sm text-outline tabular-nums">
            Best <span className="text-on-surface font-medium">{bestStreak}d</span>
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-space-sm">
        <span className="streak-number-window">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={streak}
              initial={loading ? false : { opacity: 0, y: 18, rotateX: -60 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -18, rotateX: 60 }}
              transition={springBouncy}
              className={`inline-block font-display-lg-mobile text-display-lg-mobile leading-none tracking-tighter tabular-nums ${
                checkedIn ? "text-secondary" : "text-on-surface"
              }`}
            >
              {loading ? "–" : streak}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="font-body-md text-body-md text-on-surface-variant">
          {streak === 1 ? "day running" : "days running"}
        </span>
      </div>

      {goalDiff !== null && (
        <motion.div
          variants={fadeRise}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-space-xs rounded-full bg-secondary-container/30 px-space-md py-space-sm text-secondary"
        >
          <IconFlag2 size={16} stroke={2} className="shrink-0" />
          <span className="font-label-sm text-label-sm">
            {goalCopy(goalDiff, profile.runningGoalLabel)}
          </span>
        </motion.div>
      )}

      <CheckinButton
        checkedIn={checkedIn}
        onToggle={handleToggle}
        disabled={saving || loading}
        doneIcon={IconRosetteDiscountCheck}
        pendingIcon={IconRun}
        activeClassName="bg-secondary-container text-on-secondary-container shadow-elevated"
        label="Log today's run"
        undoLabel="Undo today's run"
        description="Even a short jog keeps the streak alive."
        undoDescription="Remove today from your running streak."
        confirmTitle="Log today's run?"
        undoConfirmTitle="Undo today's run?"
        confirmDescription="Confirm that you want to record today as a running day in your streak."
        undoConfirmDescription="This will remove today's run and update your current streak."
      />

      {error && <p className="text-body-md text-error">{error}</p>}

      <ActivityHeatmap
        distribution={distribution}
        months={heatmapMonths}
        loggedDays={checkinDates.length}
        weekStartsOn={profile.weekStartsOn}
        title="Running cadence"
        doneClassName="bg-secondary-container"
        doneLabel="Ran"
        showSetbackTier={false}
      />
    </div>
  );
}
