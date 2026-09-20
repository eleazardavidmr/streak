import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StreakHero from "../components/StreakHero.jsx";
import CheckinButton from "../components/CheckInButton.jsx";
import UrgentSupport from "../components/UrgenSupport.jsx";
import ResetFlow from "../components/ResetFlow.jsx";
import ActivityHeatmap from "../components/ActivityHeatMap.jsx";
import HabitsSection from "../components/HabitsSection.jsx";
import FocusPrinciples from "../components/FocusPrinciples.jsx";
import LoadingView from "../components/ui/LoadingView.jsx";
import {
  buildHeatmapDistribution,
  buildHeatmapMonths,
  calculateBestStreak,
  calculateCurrentStreak,
  getTodayDate,
  getCheckins,
  hasCheckedInToday,
  markTodayClean,
  undoTodayCheckin,
} from "../lib/checkins.js";
import { getDefaultHabit } from "../lib/habits.js";
import { getRelapses } from "../lib/relapses.js";
import { fadeRise, springSoft } from "../lib/motion.js";

export default function Dashboard({ profile, onNavigate, onActivityChange }) {
  const [habitId, setHabitId] = useState(null);
  const [checkinDates, setCheckinDates] = useState([]);
  const [relapseDates, setRelapseDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [checkinCelebration, setCheckinCelebration] = useState(0);

  useEffect(() => {
    let mounted = true;

    getDefaultHabit()
      .then((defaultHabit) =>
        Promise.all([getCheckins(defaultHabit.id), getRelapses()]).then(
          ([dates, relapses]) => {
            if (mounted) {
              setHabitId(defaultHabit.id);
              setCheckinDates(dates);
              setRelapseDates(relapses);
            }
          },
        ),
      )
      .catch(() => {
        if (mounted) {
          setError("Unable to load your streak.");
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

  const handleToggleCheckin = async () => {
    setSaving(true);
    setError("");

    try {
      if (hasCheckedInToday(checkinDates)) {
        await undoTodayCheckin(habitId);
        setCheckinDates((dates) =>
          dates.filter((date) => date !== getTodayDate()),
        );
      } else {
        await markTodayClean(habitId);
        setCheckinDates((dates) => [...dates, getTodayDate()]);
        setCheckinCelebration((value) => value + 1);
      }
      onActivityChange?.();
    } catch {
      setError("Unable to update today's check-in.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetComplete = ({ removedToday }) => {
    const today = getTodayDate();

    if (removedToday) {
      setCheckinDates((dates) => dates.filter((date) => date !== today));
    }

    setRelapseDates((dates) =>
      dates.includes(today) ? dates : [...dates, today],
    );

    onActivityChange?.();
  };

  if (loading) {
    return <LoadingView label="Loading your streak" />;
  }

  if (!habitId) {
    return (
      <main className="flex-1 flex items-center justify-center px-margin pt-nav pb-nav bg-surface">
        <p className="text-body-md text-error">{error}</p>
      </main>
    );
  }

  const checkedIn = hasCheckedInToday(checkinDates);
  const streak = calculateCurrentStreak(checkinDates);
  const bestStreak = calculateBestStreak(checkinDates);
  const distribution = buildHeatmapDistribution(
    checkinDates,
    16,
    profile.weekStartsOn,
    relapseDates,
  );
  const heatmapMonths = buildHeatmapMonths(16, profile.weekStartsOn);

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface flex flex-col min-h-screen antialiased selection:bg-primary-container selection:text-on-primary-container">
      <main className="flex-1 flex flex-col relative w-full px-margin pt-nav pb-nav bg-surface md:mx-auto md:max-w-2xl">
        <motion.div
          variants={fadeRise}
          initial="hidden"
          animate="visible"
          transition={springSoft}
        >
          <StreakHero
            streak={streak}
            bestStreak={bestStreak}
            highlight={checkedIn}
            showBestStreak={profile.showBestStreak}
            celebrationKey={checkinCelebration}
          />
        </motion.div>

        <motion.div
          variants={fadeRise}
          initial="hidden"
          animate="visible"
          transition={{ ...springSoft, delay: 0.06 }}
          className="flex flex-col gap-space-sm rounded-[1.35rem] border border-white/8 bg-surface-container-low/70 backdrop-blur-xl shadow-elevated p-5"
        >
          <CheckinButton
            checkedIn={checkedIn}
            onToggle={handleToggleCheckin}
            disabled={saving}
          />
          <UrgentSupport onNavigate={onNavigate} />
          <ResetFlow
            habitId={habitId}
            streak={streak}
            checkinDates={checkinDates}
            hasCheckedInToday={checkedIn}
            onComplete={handleResetComplete}
            onNavigate={onNavigate}
          />
        </motion.div>

        {error && (
          <p className="mt-space-md text-body-md text-error">{error}</p>
        )}

        <div className="w-full h-px bg-surface-container-highest my-space-xl opacity-60" />

        <motion.div
          variants={fadeRise}
          initial="hidden"
          animate="visible"
          transition={{ ...springSoft, delay: 0.12 }}
        >
          <ActivityHeatmap
            distribution={distribution}
            months={heatmapMonths}
            loggedDays={checkinDates.length}
            weekStartsOn={profile.weekStartsOn}
          />
        </motion.div>

        <div className="w-full h-px bg-surface-container-highest my-space-xl opacity-60" />

        <motion.div
          variants={fadeRise}
          initial="hidden"
          animate="visible"
          transition={{ ...springSoft, delay: 0.18 }}
        >
          <HabitsSection />
        </motion.div>

        <div className="w-full h-px bg-surface-container-highest my-space-xl opacity-60" />

        <motion.div
          variants={fadeRise}
          initial="hidden"
          animate="visible"
          transition={{ ...springSoft, delay: 0.24 }}
        >
          <FocusPrinciples />
        </motion.div>
      </main>
    </div>
  );
}
