import { motion } from "framer-motion";
import { IconArrowLeft, IconArrowRight, IconRefresh } from "@tabler/icons-react";
import { getTodayDate } from "../lib/checkins.js";
import { fadeRise, springSoft } from "../lib/motion.js";

function addDays(dateString, amount) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + amount);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ReportSetback({
  streak = 0,
  checkinDates = [],
  onContinue,
  onCancel,
}) {
  const today = getTodayDate();
  const dateSet = new Set(checkinDates);
  const windowDays = 15;
  const maintained = Array.from({ length: windowDays }, (_, index) => {
    const date = addDays(today, -(windowDays - 1 - index));
    const isToday = date === today;
    return { date, filled: !isToday && dateSet.has(date), isToday };
  });
  const filledCount = maintained.filter((day) => day.filled).length;

  return (
    <motion.div
      variants={fadeRise}
      initial="hidden"
      animate="visible"
      transition={springSoft}
      className="flex flex-col w-full"
    >
      <div className="flex items-center justify-between py-space-sm mb-space-md">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-space-xs text-outline hover:text-on-surface transition-colors"
        >
          <IconArrowLeft size={18} stroke={1.8} />
          <span className="font-label-md text-label-md">Cancel</span>
        </button>
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
          Protocol 01
        </span>
      </div>

      <div className="flex flex-col mb-space-xl">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline mb-space-xs">
          Cadence reset
        </span>
        <h2 className="font-display-lg-mobile text-display-lg-mobile tracking-tight text-primary mb-space-sm">
          Let’s reset together.
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Setbacks happen. What matters is what you do next.
        </p>
      </div>

      <div className="w-full h-px bg-outline-variant/30 mb-space-xl" />

      <div className="flex flex-col gap-space-lg mb-space-xl">
        <div className="flex items-start gap-space-md">
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
            <IconRefresh size={18} className="text-primary-container" stroke={1.8} />
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-space-xs">
              Perspective
            </span>
            <p className="font-body-md text-body-md text-on-surface">
              A single moment does not erase your {streak}{" "}
              {streak === 1 ? "day" : "days"} of dedicated progress. Your
              nervous system builds resilience with every conscious reset.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-space-xs pt-space-sm">
          <div className="flex items-center justify-between text-outline mb-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider">
              Consistency record
            </span>
            <span className="font-label-sm text-label-sm font-semibold text-primary-container">
              {filledCount} of {windowDays} days maintained
            </span>
          </div>
          <div className="flex gap-1 w-full">
            {maintained.map((day) => (
              <div
                key={day.date}
                className={`h-1.5 flex-1 rounded-xs ${
                  day.filled
                    ? "bg-primary-container"
                    : "bg-surface-container-highest"
                }`}
              />
            ))}
          </div>
          <span className="font-label-sm text-label-sm text-outline mt-space-xs">
            Today is simply a calibration point.
          </span>
        </div>
      </div>

      <div className="w-full h-px bg-outline-variant/30 mb-space-xl" />

      <div className="flex flex-col gap-space-sm mb-space-xl">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
          Immediate reflection
        </span>
        <p className="font-body-md text-body-md text-on-surface-variant">
          No post-mortem required. Release judgment, take one grounding breath,
          and choose how you wish to resume your cadence.
        </p>
      </div>

      <div className="flex flex-col items-center gap-space-md mt-auto pt-space-md">
        <button
          type="button"
          onClick={onContinue}
          className="w-full h-13 rounded-full bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold flex items-center justify-center gap-space-xs motion-interactive shadow-elevated-primary"
        >
          <span>Choose next action</span>
          <IconArrowRight size={18} stroke={2} />
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-label-md text-label-md text-outline hover:text-on-surface transition-colors py-space-xs"
        >
          Return to dashboard
        </button>
      </div>
    </motion.div>
  );
}
