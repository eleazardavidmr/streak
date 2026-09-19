import { motion } from "framer-motion";
import { IconCheck } from "@tabler/icons-react";
import { HabitIcon } from "../lib/habitIcons.jsx";
import { springBouncy } from "../lib/motion.js";

export default function HabitRow({
  habit,
  streak,
  checkedIn,
  saving,
  onToggle,
  onEdit,
}) {
  const isSecondary = habit.accent === "secondary";
  const accentBg = isSecondary ? "bg-secondary-container" : "bg-primary-container";
  const accentText = isSecondary
    ? "text-on-secondary-container"
    : "text-on-primary-fixed";
  const streakColor = isSecondary ? "text-secondary" : "text-primary-container";

  return (
    <div className="flex items-center justify-between gap-space-md py-space-sm">
      <button
        type="button"
        onClick={() => onEdit(habit)}
        aria-label={`Edit ${habit.title}`}
        className="flex min-w-0 flex-1 items-center gap-space-md text-left motion-interactive"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/8 text-on-surface-variant">
          <HabitIcon name={habit.icon_name} size={17} stroke={1.8} />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="font-body-md text-body-md text-on-surface truncate">
            {habit.title}
          </span>
          <span className="font-label-sm text-label-sm text-outline">
            {streak > 0 ? (
              <>
                <span className={`font-medium ${streakColor}`}>{streak}</span>{" "}
                day streak
              </>
            ) : (
              "No streak yet"
            )}
          </span>
        </span>
      </button>
      <motion.button
        type="button"
        onClick={() => onToggle(habit)}
        disabled={saving}
        whileTap={{ scale: 0.9 }}
        transition={springBouncy}
        aria-label={
          checkedIn
            ? `Undo ${habit.title} for today`
            : `Mark ${habit.title} done today`
        }
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors disabled:opacity-50 ${
          checkedIn
            ? `${accentBg} ${accentText} border-transparent`
            : "border-white/20 text-transparent"
        }`}
      >
        <IconCheck size={15} stroke={2.5} />
      </motion.button>
    </div>
  );
}
