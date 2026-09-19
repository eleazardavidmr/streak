import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IconArchive, IconCheck, IconX } from "@tabler/icons-react";
import { overlayFade, sheetSpring, springSoft } from "../lib/motion.js";

export default function EditHabitModal({ habit, saving, onClose, onSave, onArchive }) {
  const [title, setTitle] = useState("");
  const [lastHabitId, setLastHabitId] = useState(null);
  const inputRef = useRef(null);

  if (habit && habit.id !== lastHabitId) {
    setLastHabitId(habit.id);
    setTitle(habit.title);
  } else if (!habit && lastHabitId !== null) {
    setLastHabitId(null);
  }

  useEffect(() => {
    if (!habit) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [habit, onClose]);

  const trimmed = title.trim();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!trimmed || saving || !habit) {
      return;
    }

    onSave(habit.id, trimmed);
  };

  return createPortal(
    <AnimatePresence>
      {habit && (
        <motion.div
          variants={overlayFade}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex min-h-[100dvh] w-full items-end justify-center overlay-backdrop p-margin sm:items-center"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.section
            variants={sheetSpring}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={springSoft}
            aria-labelledby="edit-habit-title"
            aria-modal="true"
            role="dialog"
            className="w-full max-w-sm rounded-[1.75rem] border border-white/10 bg-surface-container-high/80 p-space-lg shadow-elevated backdrop-blur-2xl"
          >
            <div className="flex items-start justify-between gap-space-md">
              <h2
                id="edit-habit-title"
                className="font-headline-sm text-headline-sm text-on-surface"
              >
                Edit habit
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full text-outline transition-colors hover:bg-white/10 hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
              >
                <IconX size={20} stroke={2} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-space-lg flex flex-col gap-space-lg"
            >
              <label className="flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
                  Name
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={40}
                  className="w-full h-12 bg-transparent border-b border-white/12 text-body-md text-on-surface outline-none focus:border-primary-container transition-colors"
                />
              </label>

              <button
                type="submit"
                disabled={!trimmed || saving}
                className="h-13 rounded-full bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold flex items-center justify-center gap-space-xs motion-interactive shadow-elevated-primary disabled:opacity-50 disabled:shadow-none"
              >
                <IconCheck size={18} stroke={2} />
                {saving ? "Saving..." : "Save changes"}
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => habit && onArchive(habit.id)}
                className="h-13 rounded-full bg-white/8 text-error font-label-md text-label-md font-semibold flex items-center justify-center gap-space-xs motion-interactive disabled:opacity-50"
              >
                <IconArchive size={18} stroke={1.8} />
                Archive habit
              </button>
            </form>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
