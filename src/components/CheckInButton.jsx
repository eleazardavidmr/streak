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

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={disabled}
        aria-label={checkedIn ? "Undo today's check-in" : "Mark today as clean"}
        className={`w-12 h-12 rounded-xl px-space-sm py-space-md font-label-md text-label-md font-semibold flex flex-col items-center justify-center gap-space-xs motion-interactive active:scale-[0.98] transition-transform duration-150 select-none disabled:opacity-50 ${
          checkedIn
            ? "bg-surface-container-high text-on-surface-variant"
            : "bg-primary-container text-on-primary-fixed"
        }`}
      >
        <CheckinIcon size={18} stroke={checkedIn ? 2 : 2.5} />
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
