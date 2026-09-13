import { IconCheck, IconRosetteDiscountCheck } from "@tabler/icons-react";

export default function CheckinButton({
  checkedIn,
  onToggle,
  disabled = false,
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`w-full h-13 rounded-full font-label-md text-label-md font-semibold flex items-center justify-center gap-space-xs active:scale-[0.98] transition-transform duration-150 select-none disabled:opacity-50 ${
        checkedIn
          ? "bg-surface-container-high text-on-surface-variant"
          : "bg-primary-container text-on-primary-fixed"
      }`}
    >
      {checkedIn ? (
        <IconRosetteDiscountCheck size={18} stroke={2} />
      ) : (
        <IconCheck size={18} stroke={2.5} />
      )}
      <span>{checkedIn ? "Completed for today" : "Mark today as clean"}</span>
    </button>
  );
}
