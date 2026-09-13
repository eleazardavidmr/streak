const colorClasses = [
  "bg-surface-container-high",
  "bg-secondary-container",
  "bg-secondary",
  "bg-primary-container",
];

export default function ActivityHeatmap({
  distribution = [],
  loggedDays = 0,
  months = ["Jul", "Aug", "Sep", "Oct"],
  weekStartsOn = "monday",
}) {
  const weekdayLabels =
    weekStartsOn === "sunday" ? ["S", "T", "T"] : ["M", "W", "F"];
  return (
    <div className="flex flex-col gap-space-sm">
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase">
          Discipline cadence
        </span>
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          Last 16 weeks
        </span>
      </div>

      <div className="flex justify-between text-outline font-label-sm text-label-sm px-5.5 pt-space-xs">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>

      <div className="flex items-center gap-space-xs overflow-x-auto py-space-xs">
        <div className="flex flex-col justify-between h-21 font-label-sm text-label-sm text-outline-variant pr-space-xs select-none">
          {weekdayLabels.map((label, index) => (
            <span key={`${label}-${index}`}>{label}</span>
          ))}
        </div>

        <div className="grid grid-rows-7 grid-flow-col gap-0.75 select-none">
          {distribution.map((level, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-xs transition-transform duration-100 hover:scale-125 ${colorClasses[level]}`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-space-xs">
        <span className="font-label-sm text-label-sm text-outline">
          {loggedDays} days logged
        </span>
        <div className="flex items-center gap-space-xs">
          <span className="font-label-sm text-label-sm text-outline">Less</span>
          {colorClasses.map((c) => (
            <div key={c} className={`w-2.25 h-2.25 rounded-xs ${c}`} />
          ))}
          <span className="font-label-sm text-label-sm text-outline">More</span>
        </div>
      </div>
    </div>
  );
}
