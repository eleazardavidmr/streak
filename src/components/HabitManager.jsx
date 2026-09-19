import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconArchiveOff, IconPlus } from "@tabler/icons-react";
import { HabitIcon } from "../lib/habitIcons.jsx";
import AddHabitModal from "./AddHabitModal.jsx";
import EditHabitModal from "./EditHabitModal.jsx";
import {
  MAX_HABITS,
  archiveHabit,
  createHabit,
  getArchivedHabits,
  getHabits,
  renameHabit,
  unarchiveHabit,
} from "../lib/habits.js";
import { fadeRise } from "../lib/motion.js";

export default function HabitManager() {
  const [habits, setHabits] = useState([]);
  const [archivedHabits, setArchivedHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [restoringId, setRestoringId] = useState(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([getHabits(), getArchivedHabits()])
      .then(([active, archived]) => {
        if (mounted) {
          setHabits(active);
          setArchivedHabits(archived);
        }
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
      const habit = habits.find((item) => item.id === habitId);
      setHabits((previous) => previous.filter((item) => item.id !== habitId));
      if (habit) {
        setArchivedHabits((previous) => [
          { ...habit, archived_at: new Date().toISOString() },
          ...previous,
        ]);
      }
      setEditingHabit(null);
    } catch {
      setError("Unable to archive that habit.");
    } finally {
      setEditSaving(false);
    }
  };

  const handleRestore = async (habitId) => {
    setRestoringId(habitId);
    setError("");

    try {
      await unarchiveHabit(habitId);
      const habit = archivedHabits.find((item) => item.id === habitId);
      setArchivedHabits((previous) =>
        previous.filter((item) => item.id !== habitId),
      );
      if (habit) {
        setHabits((previous) => [...previous, habit]);
      }
    } catch {
      setError("Unable to restore that habit.");
    } finally {
      setRestoringId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[1.35rem] border border-white/8 bg-surface-container-low/70 backdrop-blur-xl shadow-elevated p-space-md">
        <p className="font-label-sm text-label-sm text-outline uppercase tracking-widest">
          Loading
        </p>
      </div>
    );
  }

  const atLimit = habits.length >= MAX_HABITS;

  return (
    <div className="flex flex-col gap-space-md rounded-[1.35rem] border border-white/8 bg-surface-container-low/70 backdrop-blur-xl shadow-elevated p-space-md">
      {habits.length === 0 ? (
        <p className="font-body-md text-body-md text-outline py-space-xs">
          No active habits yet.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-white/8">
          <AnimatePresence initial={false}>
            {habits.map((habit) => (
              <motion.button
                key={habit.id}
                layout
                variants={fadeRise}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, height: 0 }}
                type="button"
                onClick={() => setEditingHabit(habit)}
                className="flex w-full items-center gap-space-md py-space-sm text-left motion-interactive"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/8 text-on-surface-variant">
                  <HabitIcon name={habit.icon_name} size={17} stroke={1.8} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-body-md text-body-md text-on-surface truncate">
                    {habit.title}
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">
                    Tap to edit or archive
                  </span>
                </span>
              </motion.button>
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

      {archivedHabits.length > 0 && (
        <div className="flex flex-col gap-space-sm border-t border-white/8 pt-space-md">
          <span className="font-label-sm text-label-sm text-outline tracking-widest uppercase">
            Archived
          </span>
          <div className="flex flex-col divide-y divide-white/8">
            {archivedHabits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center gap-space-md py-space-sm"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-outline">
                  <HabitIcon name={habit.icon_name} size={17} stroke={1.8} />
                </span>
                <span className="flex-1 min-w-0 font-body-md text-body-md text-outline truncate">
                  {habit.title}
                </span>
                <button
                  type="button"
                  onClick={() => handleRestore(habit.id)}
                  disabled={restoringId === habit.id || atLimit}
                  aria-label={`Restore ${habit.title}`}
                  className="flex items-center gap-space-xs rounded-full bg-white/8 px-space-md py-space-xs font-label-sm text-label-sm text-on-surface motion-interactive disabled:opacity-40"
                >
                  <IconArchiveOff size={14} stroke={2} />
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
