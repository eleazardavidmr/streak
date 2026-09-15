import { motion } from "framer-motion";

const cellClasses = {
  0: "bg-surface-container-high",
  1: "bg-surface-container-highest",
};

export default function ActivityHeatmap({
  distribution = [],
  loggedDays = 0,
  months = [],
  weekStartsOn = "monday",
  title = "Discipline cadence",
  doneClassName = "bg-primary-container",
  doneLabel = "Clean",
  showSetbackTier = true,
}) {
  const weekdayLabels =
    weekStartsOn === "sunday" ? ["S", "T", "T"] : ["M", "W", "F"];

  const legend = [
    { label: "Empty", className: cellClasses[0] },
    ...(showSetbackTier
      ? [{ label: "Setback", className: cellClasses[1] }]
      : []),
    { label: doneLabel, className: doneClassName },
  ];

  return (
    <div className="flex flex-col gap-space-sm">
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase">
          {title}
        </span>
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          Last 16 weeks
        </span>
      </div>

      <div className="flex justify-between text-outline font-label-sm text-label-sm px-5.5 pt-space-xs">
        {months.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>

      <div className="flex items-center gap-space-xs overflow-x-auto py-space-xs">
        <div className="flex flex-col justify-between h-21 font-label-sm text-label-sm text-outline-variant pr-space-xs select-none">
          {weekdayLabels.map((label, index) => (
            <span key={`${label}-${index}`}>{label}</span>
          ))}
        </div>

        <div className="grid grid-rows-7 grid-flow-col gap-0.75 select-none">
          {distribution.map((level, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                delay: (index % 7) * 0.015 + Math.floor(index / 7) * 0.006,
              }}
              whileHover={{ scale: 1.25 }}
              className={`w-2.5 h-2.5 rounded-xs ${
                level === 3
                  ? doneClassName
                  : (cellClasses[level] ?? cellClasses[0])
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-space-xs gap-space-sm">
        <span className="font-label-sm text-label-sm text-outline">
          {loggedDays} days logged
        </span>
        <div className="flex items-center gap-space-sm">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-space-xs">
              <div className={`w-2.25 h-2.25 rounded-xs ${item.className}`} />
              <span className="font-label-sm text-label-sm text-outline">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
