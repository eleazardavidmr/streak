import { motion } from "framer-motion";
import { IconChevronLeft, IconLock } from "@tabler/icons-react";
import { useState } from "react";
import { fadeRise, springSnappy, springSoft } from "../lib/motion.js";

const timesOfDay = ["Morning", "Afternoon", "Evening", "Night"];

export default function ReflectionForm({
  saving = false,
  onBack,
  onSave,
  onSkip,
}) {
  const [timeOfDay, setTimeOfDay] = useState("Afternoon");
  const [note, setNote] = useState("");

  return (
    <motion.div
      variants={fadeRise}
      initial="hidden"
      animate="visible"
      transition={springSoft}
      className="flex flex-col w-full gap-space-lg"
    >
      <div className="flex items-center justify-between py-space-xs">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex items-center justify-center w-10 h-10 -ml-2 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <IconChevronLeft size={24} stroke={1.6} />
        </button>
        <button
          type="button"
          onClick={onSkip}
          disabled={saving}
          className="font-label-md text-label-md tracking-wider uppercase text-on-surface hover:text-primary-container px-space-sm py-space-sm transition-colors disabled:opacity-50"
        >
          Skip
        </button>
      </div>

      <div className="flex flex-col gap-space-xs">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-container font-semibold">
          Step 4 of 4
        </span>
        <h2 className="font-display-lg-mobile text-display-lg-mobile text-primary tracking-tight">
          Want to note what happened?
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant pt-space-xs">
          Completely optional. Patterns help you safeguard future streaks.
        </p>
      </div>

      <div className="flex flex-col gap-space-sm">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
          Time of day
        </span>
        <div
          className="grid grid-cols-4 gap-space-sm"
          role="radiogroup"
          aria-label="Time of day"
        >
          {timesOfDay.map((time) => {
            const selected = timeOfDay === time;
            return (
              <button
                key={time}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setTimeOfDay(time)}
                className={`relative py-space-sm rounded-full font-label-md text-label-md text-center transition-colors ${
                  selected
                    ? "text-on-primary-fixed font-semibold"
                    : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="time-of-day-highlight"
                    transition={springSnappy}
                    className="absolute inset-0 rounded-full bg-primary-container"
                  />
                )}
                <span className="relative">{time}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-space-sm">
        <div className="flex justify-between items-center">
          <label
            htmlFor="reflection-notes"
            className="font-label-sm text-label-sm uppercase tracking-widest text-outline"
          >
            Observations
          </label>
          <span className="font-label-sm text-label-sm text-outline">
            {note.length} / 280
          </span>
        </div>
        <div className="bg-surface-container-low rounded p-space-md transition-colors focus-within:bg-surface-container">
          <textarea
            id="reflection-notes"
            maxLength={280}
            rows={5}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="What triggered this? (optional)... e.g. stress, fatigue, loneliness, boredom"
            className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline outline-none resize-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-space-sm text-on-surface-variant">
        <IconLock
          size={18}
          className="text-primary-container shrink-0"
          stroke={1.8}
        />
        <p className="font-label-md text-label-md">
          This note stays private to your account.
        </p>
      </div>

      <div className="flex flex-col gap-space-md pt-space-sm">
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave({ timeOfDay, note: note.trim() || null })}
          className="w-full h-13 rounded-full bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold flex items-center justify-center motion-interactive shadow-elevated-primary disabled:opacity-50 disabled:shadow-none"
        >
          {saving ? "Saving..." : "Save & complete reset"}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={onSkip}
          className="w-full h-13 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md font-semibold flex items-center justify-center motion-interactive hover:bg-surface-container-highest hover:text-on-surface disabled:opacity-50"
        >
          Skip and finish
        </button>
      </div>
    </motion.div>
  );
}
