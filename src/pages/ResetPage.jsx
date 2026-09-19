import { useEffect, useState } from "react";
import ResetFlow from "../components/ResetFlow.jsx";
import LoadingView from "../components/ui/LoadingView.jsx";
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
      <LoadingView
        label="Preparing your reset"
        className="flex-1 px-margin pt-nav pb-safe"
      />
    );
  }

  if (error) {
    return (
      <main className="flex-1 flex items-center justify-center px-margin pt-nav pb-safe bg-surface">
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
