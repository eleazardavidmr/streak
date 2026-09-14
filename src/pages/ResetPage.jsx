import { useEffect, useState } from "react";
import ResetFlow from "../components/ResetFlow.jsx";
import {
  calculateCurrentStreak,
  getCheckins,
  hasCheckedInToday,
} from "../lib/checkins.js";

export default function ResetPage({ onNavigate }) {
  const [checkinDates, setCheckinDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getCheckins()
      .then((dates) => {
        if (mounted) {
          setCheckinDates(dates);
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

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center px-margin pt-nav pb-safe bg-surface motion-scale-in">
        <span className="text-label-sm text-outline uppercase tracking-widest">
          Loading
        </span>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 flex items-center justify-center px-margin pt-nav pb-safe bg-surface motion-page">
        <p className="text-body-md text-error">{error}</p>
      </main>
    );
  }

  return (
    <ResetFlow
      page
      streak={calculateCurrentStreak(checkinDates)}
      checkinDates={checkinDates}
      hasCheckedInToday={hasCheckedInToday(checkinDates)}
      onNavigate={onNavigate}
    />
  );
}
