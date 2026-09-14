import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IconCheck, IconX } from "@tabler/icons-react";

export default function ActionConfirmationModal({
  open,
  title,
  description,
  confirmLabel,
  icon: Icon,
  onClose,
  onConfirm,
}) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex min-h-[100dvh] w-full items-end justify-center bg-black/45 p-margin backdrop-blur-md sm:items-center"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        aria-labelledby="action-confirmation-title"
        aria-describedby="action-confirmation-description"
        aria-modal="true"
        className="motion-panel w-full max-w-sm rounded-[2rem] border border-white/10 bg-surface-container-high/90 p-space-lg shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-space-md">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-container text-on-primary-fixed">
            <Icon size={23} stroke={2} />
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close confirmation"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-outline transition-colors hover:bg-white/10 hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
          >
            <IconX size={20} stroke={2} />
          </button>
        </div>

        <div className="mt-space-lg">
          <h2
            id="action-confirmation-title"
            className="font-headline-sm text-headline-sm text-on-surface"
          >
            {title}
          </h2>
          <p
            id="action-confirmation-description"
            className="mt-space-sm font-body-md text-body-md text-on-surface-variant"
          >
            {description}
          </p>
        </div>

        <div className="mt-space-lg grid grid-cols-2 gap-space-sm">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 rounded-full bg-surface-container-highest px-space-md font-label-md text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-variant focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex min-h-12 items-center justify-center gap-space-xs rounded-full bg-primary-container px-space-md font-label-md text-label-md font-semibold text-on-primary-fixed transition-transform active:scale-[0.98] hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
          >
            <IconCheck size={17} stroke={2.5} />
            <span>{confirmLabel}</span>
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
