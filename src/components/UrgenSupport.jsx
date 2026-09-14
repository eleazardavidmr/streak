import { useState } from "react";
import { IconBolt, IconX } from "@tabler/icons-react";
import ActionConfirmationModal from "./ActionConfirmationModal.jsx";

export default function UrgeSupport() {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="col-span-3 flex flex-col gap-space-md sm:col-span-1">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-expanded={open}
        className="w-12 h-12 px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold flex flex-col items-center justify-center gap-space-xs motion-interactive active:scale-[0.98] hover:bg-surface-variant focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container transition duration-150 select-none"
      >
        <IconBolt size={20} stroke={2} />
        {/* 


        <span className="text-center">Urge support</span>
        */}
      </button>

      <ActionConfirmationModal
        open={confirming}
        title="Need support right now?"
        description="Open a short grounding protocol to slow the urge, reconnect with your body, and get through the next 60 seconds."
        confirmLabel="Open support"
        icon={IconBolt}
        onClose={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          setOpen(true);
        }}
      />

      {open && (
        <div className="flex flex-col bg-surface-container-low rounded-xl p-space-md gap-space-sm transition-all motion-panel">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-primary-container uppercase tracking-wider">
              Grounding protocol
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-outline hover:text-on-surface"
            >
              <IconX size={18} stroke={2} />
            </button>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant">
            Urges peak within 15 minutes and dissipate like a wave. Breathe out
            slowly for 4 seconds, ground your feet against the floor.
          </p>

          <div className="flex items-center gap-space-sm pt-space-xs">
            <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              60-second reset engaged
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
