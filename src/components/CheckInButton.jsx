import { useState } from "react";
import { IconCheck, IconRosetteDiscountCheck } from "@tabler/icons-react";
import ActionConfirmationModal from "./ActionConfirmationModal.jsx";

export default function CheckinButton({
  checkedIn,
  onToggle,
  disabled = false,
}) {
  const [confirming, setConfirming] = useState(false);
  const CheckinIcon = checkedIn ? IconRosetteDiscountCheck : IconCheck;
  const title = checkedIn ? "Undo today's check-in" : "Mark today as clean";
  const description = checkedIn
    ? "Remove today from your clean streak."
    : "Keep your streak moving forward.";

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={disabled}
        aria-label={checkedIn ? "Undo today's check-in" : "Mark today as clean"}
        className={`w-full min-h-16 rounded-xl px-space-md py-space-sm font-label-md text-label-md font-semibold flex items-center gap-space-md text-left motion-interactive active:scale-[0.99] transition-transform duration-150 select-none disabled:opacity-50 ${
          checkedIn
            ? "bg-surface-container-high text-on-surface-variant"
            : "bg-primary-container text-on-primary-fixed"
        }`}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/10">
          <CheckinIcon size={19} stroke={checkedIn ? 2 : 2.5} />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="font-label-md text-label-md">{title}</span>
          <span className="font-label-sm text-label-sm opacity-70">
            {description}
          </span>
        </span>
      </button>
      <ActionConfirmationModal
        open={confirming}
        title={checkedIn ? "Undo today's check-in?" : "Mark today as clean?"}
        description={
          checkedIn
            ? "This will remove today's completed check-in and update your current streak."
            : "Confirm that you want to record today as a clean day in your streak."
        }
        confirmLabel={checkedIn ? "Undo" : "Confirm"}
        icon={CheckinIcon}
        onClose={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          onToggle();
        }}
      />
    </>
  );
}
