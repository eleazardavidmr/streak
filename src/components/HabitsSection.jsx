import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconPlus, IconSparkles } from "@tabler/icons-react";
import HabitRow from "./HabitRow.jsx";
import AddHabitModal from "./AddHabitModal.jsx";
import EditHabitModal from "./EditHabitModal.jsx";
import {
  MAX_HABITS,
  archiveHabit,
  createHabit,
  getHabits,
  renameHabit,
} from "../lib/habits.js";
import {
  calculateCurrentStreak,
  getCheckins,
  getTodayDate,
  hasCheckedInToday,
  markTodayClean,
  undoTodayCheckin,
} from "../lib/checkins.js";
import { fadeRise } from "../lib/motion.js";

export default function HabitsSection() {
  const [habits, setHabits] = useState([]);
  const [checkinsByHabit, setCheckinsByHabit] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    getHabits()
      .then(async (habitRows) => {
        const checkinLists = await Promise.all(
          habitRows.map((habit) => getCheckins(habit.id)),
        );

        if (!mounted) {
          return;
        }

        setHabits(habitRows);
        setCheckinsByHabit(
          Object.fromEntries(
            habitRows.map((habit, index) => [habit.id, checkinLists[index]]),
          ),
        );
      })
      .catch(() => {
        if (mounted) {
          setError("Unable to load your habits.");
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

  const handleToggle = async (habit) => {
    const dates = checkinsByHabit[habit.id] ?? [];
    const checkedIn = hasCheckedInToday(dates);

    setSavingId(habit.id);
    setError("");

    try {
      if (checkedIn) {
        await undoTodayCheckin(habit.id);
      } else {
        await markTodayClean(habit.id);
      }

      const today = getTodayDate();
      setCheckinsByHabit((previous) => {
        const current = previous[habit.id] ?? [];
        return {
          ...previous,
          [habit.id]: checkedIn
            ? current.filter((date) => date !== today)
            : [...current, today],
        };
      });
    } catch {
      setError("Unable to update that habit.");
    } finally {
      setSavingId(null);
    }
  };

  const handleCreate = async ({ title, iconName, accent }) => {
    setCreating(true);
    setError("");

    try {
      const habit = await createHabit({
        title,
        iconName,
        accent,
        sortOrder: habits.length,
      });
      setHabits((previous) => [...previous, habit]);
      setCheckinsByHabit((previous) => ({ ...previous, [habit.id]: [] }));
      setAdding(false);
    } catch {
      setError("Unable to add that habit.");
    } finally {
      setCreating(false);
    }
  };

  const handleSaveEdit = async (habitId, title) => {
    setEditSaving(true);
    setError("");

    try {
      await renameHabit(habitId, title);
      setHabits((previous) =>
        previous.map((habit) =>
          habit.id === habitId ? { ...habit, title } : habit,
        ),
      );
      setEditingHabit(null);
    } catch {
      setError("Unable to save that change.");
    } finally {
      setEditSaving(false);
    }
  };

  const handleArchive = async (habitId) => {
    setEditSaving(true);
    setError("");

    try {
      await archiveHabit(habitId);
      setHabits((previous) => previous.filter((habit) => habit.id !== habitId));
      setCheckinsByHabit((previous) => {
        const next = { ...previous };
        delete next[habitId];
        return next;
      });
      setEditingHabit(null);
    } catch {
      setError("Unable to archive that habit.");
    } finally {
      setEditSaving(false);
    }
  };

  if (loading) {
    return null;
  }

  const atLimit = habits.length >= MAX_HABITS;

  return (
    <div className="flex flex-col gap-space-sm rounded-[1.35rem] border border-white/8 bg-surface-container-low/70 backdrop-blur-xl shadow-elevated p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-[0.75rem] bg-white/8 text-on-surface-variant">
            <IconSparkles size={18} stroke={1.8} />
          </span>
          <span className="font-label-sm text-label-sm text-outline tracking-widest uppercase">
            Habits
          </span>
        </div>
        <span className="font-label-sm text-label-sm text-outline tabular-nums">
          {habits.length}/{MAX_HABITS}
        </span>
      </div>

      {habits.length === 0 ? (
        <p className="font-body-md text-body-md text-outline py-space-xs">
          Add small daily habits to support your streak.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-white/8">
          <AnimatePresence initial={false}>
            {habits.map((habit) => (
              <motion.div
                key={habit.id}
                layout
                variants={fadeRise}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, height: 0 }}
              >
                <HabitRow
                  habit={habit}
                  streak={calculateCurrentStreak(checkinsByHabit[habit.id] ?? [])}
                  checkedIn={hasCheckedInToday(checkinsByHabit[habit.id] ?? [])}
                  saving={savingId === habit.id}
                  onToggle={handleToggle}
                  onEdit={setEditingHabit}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <button
        type="button"
        onClick={() => setAdding(true)}
        disabled={atLimit}
        className="flex items-center justify-center gap-space-xs py-space-sm font-label-md text-label-md text-outline hover:text-on-surface disabled:opacity-40 transition-colors motion-interactive"
      >
        <IconPlus size={16} stroke={2} />
        {atLimit ? "Habit limit reached" : "Add habit"}
      </button>

      {error && <p className="font-body-md text-body-md text-error">{error}</p>}

      <AddHabitModal
        open={adding}
        saving={creating}
        onClose={() => setAdding(false)}
        onCreate={handleCreate}
      />
      <EditHabitModal
        habit={editingHabit}
        saving={editSaving}
        onClose={() => setEditingHabit(null)}
        onSave={handleSaveEdit}
        onArchive={handleArchive}
      />
    </div>
  );
}
