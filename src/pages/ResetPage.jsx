import { useEffect, useState } from "react";
import ResetFlow from "../components/ResetFlow.jsx";
import LoadingView from "../components/ui/LoadingView.jsx";
import {
  calculateCurrentStreak,
  getCheckins,
  hasCheckedInToday,
} from "../lib/checkins.js";
import { getDefaultHabit } from "../lib/habits.js";

export default function ResetPage({ onNavigate }) {
  const [habitId, setHabitId] = useState(null);
  const [checkinDates, setCheckinDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getDefaultHabit()
      .then((defaultHabit) =>
        getCheckins(defaultHabit.id).then((dates) => {
          if (mounted) {
            setHabitId(defaultHabit.id);
            setCheckinDates(dates);
          }
        }),
      )
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

  if (loading) {
    return (
      <LoadingView
        label="Preparing your reset"
        className="flex-1 px-margin pt-nav pb-safe"
      />
    );
  }

  if (error || !habitId) {
    return (
      <main className="flex-1 flex items-center justify-center px-margin pt-nav pb-safe bg-surface">
        <p className="text-body-md text-error">{error}</p>
      </main>
    );
  }

  return (
    <ResetFlow
      page
      habitId={habitId}
      streak={calculateCurrentStreak(checkinDates)}
      checkinDates={checkinDates}
      hasCheckedInToday={hasCheckedInToday(checkinDates)}
      onNavigate={onNavigate}
    />
  );
}
