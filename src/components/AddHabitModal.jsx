import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IconX } from "@tabler/icons-react";
import HabitForm from "./HabitForm.jsx";
import { overlayFade, sheetSpring, springSoft } from "../lib/motion.js";

export default function AddHabitModal({ open, saving, onClose, onCreate }) {
  useEffect(() => {
    if (!open) {
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

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
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
            aria-labelledby="add-habit-title"
            aria-modal="true"
            role="dialog"
            className="w-full max-w-sm rounded-[1.75rem] border border-white/10 bg-surface-container-high/80 p-space-lg shadow-elevated backdrop-blur-2xl"
          >
            <div className="flex items-start justify-between gap-space-md">
              <h2
                id="add-habit-title"
                className="font-headline-sm text-headline-sm text-on-surface"
              >
                New habit
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

            <div className="mt-space-lg">
              <HabitForm
                active={open}
                saving={saving}
                submitLabel="Add habit"
                focusDelay={50}
                onSubmit={onCreate}
              />
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
