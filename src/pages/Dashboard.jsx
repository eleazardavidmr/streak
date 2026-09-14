import { useEffect, useState } from "react";
import StreakHero from "../components/StreakHero.jsx";
import CheckinButton from "../components/CheckInButton.jsx";
import UrgentSupport from "../components/UrgenSupport.jsx";
import ResetFlow from "../components/ResetFlow.jsx";
import ActivityHeatmap from "../components/ActivityHeatMap.jsx";
import FocusPrinciples from "../components/FocusPrinciples.jsx";
import {
  buildHeatmapDistribution,
  calculateBestStreak,
  calculateCurrentStreak,
  getTodayDate,
  getCheckins,
  hasCheckedInToday,
  markTodayClean,
  undoTodayCheckin,
} from "../lib/checkins.js";
import { getRelapses } from "../lib/relapses.js";

export default function Dashboard({ profile }) {
  const [checkinDates, setCheckinDates] = useState([]);
  const [relapseDates, setRelapseDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    Promise.all([getCheckins(), getRelapses()])
      .then(([dates, relapses]) => {
        if (mounted) {
          setCheckinDates(dates);
          setRelapseDates(relapses);
        }
      })
      .catch(() => {
        if (mounted) {
          setError("Unable to load your check-ins.");
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
        await undoTodayCheckin();
        setCheckinDates((dates) =>
          dates.filter((date) => date !== getTodayDate()),
        );
      } else {
        await markTodayClean();
        setCheckinDates((dates) => [...dates, getTodayDate()]);
      }
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
  };

  const checkedIn = hasCheckedInToday(checkinDates);
  const streak = calculateCurrentStreak(checkinDates);
  const bestStreak = calculateBestStreak(checkinDates);
  const distribution = buildHeatmapDistribution(
    checkinDates,
    16,
    profile.weekStartsOn,
    relapseDates,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-label-sm text-outline uppercase tracking-widest">
        Loading
      </div>
    );
  }

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface flex flex-col min-h-screen antialiased selection:bg-primary-container selection:text-on-primary-container motion-page">
      <main className="flex-1 flex flex-col relative w-full px-margin pt-nav pb-nav bg-surface">
        <div className="motion-rise">
          <StreakHero
            streak={streak}
            bestStreak={bestStreak}
            highlight={checkedIn}
            showBestStreak={profile.showBestStreak}
          />
        </div>

        <div className="flex flex-col gap-space-md pt-space-sm motion-stagger">
          <CheckinButton
            checkedIn={checkedIn}
            onToggle={handleToggleCheckin}
            disabled={saving}
          />
          <UrgentSupport />
          <ResetFlow
            streak={streak}
            checkinDates={checkinDates}
            hasCheckedInToday={checkedIn}
            onComplete={handleResetComplete}
          />
        </div>

        {error && (
          <p className="mt-space-md text-body-md text-error">{error}</p>
        )}

        <div className="w-full h-px bg-surface-container-highest my-space-xl opacity-60" />

        <div className="motion-rise" style={{ animationDelay: "180ms" }}>
          <ActivityHeatmap
            distribution={distribution}
            loggedDays={checkinDates.length}
            weekStartsOn={profile.weekStartsOn}
          />
        </div>

        <div className="w-full h-px bg-surface-container-highest my-space-xl opacity-60" />

        <div className="motion-rise" style={{ animationDelay: "260ms" }}>
          <FocusPrinciples />
        </div>
      </main>
    </div>
  );
}
