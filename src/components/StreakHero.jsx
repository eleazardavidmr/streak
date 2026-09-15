import { IconHistory } from "@tabler/icons-react";

function formatToday() {
  return new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

export default function StreakHero({
  streak,
  bestStreak,
  highlight = false,
  showBestStreak = true,
  celebrationKey = 0,
}) {
  return (
    <div className="flex flex-col motion-rise">
      <div className="pt-space-sm pb-space-xs">
        <span className="font-label-sm text-label-sm text-outline tracking-widest uppercase">
          Today · {formatToday()}
        </span>
      </div>

      <div className="flex flex-col pt-space-md pb-space-lg">
        <div className="flex items-baseline gap-space-sm">
          <span className="streak-number-window" aria-live="polite">
            <span
              key={celebrationKey}
              className={`font-display-lg-mobile text-display-lg-mobile leading-none tracking-tighter ${
                highlight ? "text-primary-container" : "text-primary"
              } ${celebrationKey > 0 ? "motion-checkin-odometer" : ""}`}
            >
              {streak}
            </span>
          </span>
          <span className="font-headline-sm text-headline-sm text-on-surface-variant font-normal tracking-tight">
            days clean
          </span>
        </div>

        {showBestStreak && (
          <div className="flex items-center gap-space-xs pt-space-xs">
            <IconHistory size={14} className="text-outline" stroke={2} />
            <span className="font-body-md text-body-md text-outline">
              Best record:{" "}
              <span className="text-on-surface font-medium">
                {bestStreak} days
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
