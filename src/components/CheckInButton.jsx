import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconCheck, IconRosetteDiscountCheck } from "@tabler/icons-react";
import ActionConfirmationModal from "./ActionConfirmationModal.jsx";
import { springBouncy } from "../lib/motion.js";

export default function CheckinButton({
  checkedIn,
  onToggle,
  disabled = false,
  doneIcon: DoneIcon = IconRosetteDiscountCheck,
  pendingIcon: PendingIcon = IconCheck,
  activeClassName = "bg-primary-container text-on-primary-fixed shadow-elevated-primary",
  label = "Mark today as clean",
  undoLabel = "Undo today's check-in",
  description = "Keep your streak moving forward.",
  undoDescription = "Remove today from your clean streak.",
  confirmTitle = "Mark today as clean?",
  undoConfirmTitle = "Undo today's check-in?",
  confirmDescription = "Confirm that you want to record today as a clean day in your streak.",
  undoConfirmDescription = "This will remove today's completed check-in and update your current streak.",
}) {
  const [confirming, setConfirming] = useState(false);
  const CheckinIcon = checkedIn ? DoneIcon : PendingIcon;
  const title = checkedIn ? undoLabel : label;
  const currentDescription = checkedIn ? undoDescription : description;

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={disabled}
        whileTap={{ scale: 0.97 }}
        transition={springBouncy}
        aria-label={checkedIn ? undoLabel : label}
        className={`w-full min-h-16 rounded-[1.1rem] px-space-md py-space-sm font-label-md text-label-md font-semibold flex items-center gap-space-md text-left select-none disabled:opacity-50 disabled:shadow-none ${
          checkedIn
            ? "bg-surface-container-high text-on-surface-variant"
            : activeClassName
        }`}
      >
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black/10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={checkedIn ? "done" : "pending"}
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
              transition={springBouncy}
              className="flex items-center justify-center"
            >
              <CheckinIcon size={19} stroke={checkedIn ? 2 : 2.5} />
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="font-label-md text-label-md">{title}</span>
          <span className="font-label-sm text-label-sm opacity-70">
            {currentDescription}
          </span>
        </span>
      </motion.button>
      <ActionConfirmationModal
        open={confirming}
        title={checkedIn ? undoConfirmTitle : confirmTitle}
        description={checkedIn ? undoConfirmDescription : confirmDescription}
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
