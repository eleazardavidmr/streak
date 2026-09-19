import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { IconPlus, IconX } from "@tabler/icons-react";
import { habitIconOptions } from "../lib/habitIconOptions.js";
import { overlayFade, sheetSpring, springSoft } from "../lib/motion.js";

const accentOptions = [
  { key: "primary", label: "Chartreuse", swatchClass: "bg-primary-container" },
  { key: "secondary", label: "Sage", swatchClass: "bg-secondary-container" },
];

export default function AddHabitModal({ open, saving, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [iconName, setIconName] = useState(habitIconOptions[0].name);
  const [accent, setAccent] = useState("primary");
  const [wasOpen, setWasOpen] = useState(false);
  const inputRef = useRef(null);

  if (open && !wasOpen) {
    setWasOpen(true);
    setTitle("");
    setIconName(habitIconOptions[0].name);
    setAccent("primary");
  } else if (!open && wasOpen) {
    setWasOpen(false);
  }

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
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  const trimmed = title.trim();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!trimmed || saving) {
      return;
    }

    onCreate({ title: trimmed, iconName, accent });
  };

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
                  placeholder="e.g. Morning walk"
                  className="w-full h-12 bg-transparent border-b border-white/12 text-body-md text-on-surface outline-none placeholder:text-outline focus:border-primary-container transition-colors"
                />
              </label>

              <div className="flex flex-col gap-space-sm">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
                  Icon
                </span>
                <div
                  className="grid grid-cols-4 gap-space-sm"
                  role="radiogroup"
                  aria-label="Habit icon"
                >
                  {habitIconOptions.map(({ name, label, Icon }) => {
                    const selected = iconName === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-label={label}
                        onClick={() => setIconName(name)}
                        className={`flex h-11 items-center justify-center rounded-xl motion-interactive transition-colors ${
                          selected
                            ? "bg-primary-container text-on-primary-fixed"
                            : "bg-white/8 text-on-surface-variant"
                        }`}
                      >
                        <Icon size={19} stroke={1.8} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-space-sm">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
                  Accent
                </span>
                <div
                  className="flex gap-space-sm"
                  role="radiogroup"
                  aria-label="Habit accent color"
                >
                  {accentOptions.map(({ key, label, swatchClass }) => {
                    const selected = accent === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setAccent(key)}
                        className={`flex flex-1 items-center gap-space-xs rounded-xl px-space-md py-space-sm motion-interactive transition-colors ${
                          selected ? "bg-white/12" : "bg-white/6"
                        }`}
                      >
                        <span className={`h-4 w-4 rounded-full ${swatchClass}`} />
                        <span className="font-label-sm text-label-sm text-on-surface">
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={!trimmed || saving}
                className="h-13 rounded-full bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold flex items-center justify-center gap-space-xs motion-interactive shadow-elevated-primary disabled:opacity-50 disabled:shadow-none"
              >
                <IconPlus size={18} stroke={2} />
                {saving ? "Adding..." : "Add habit"}
              </button>
            </form>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
