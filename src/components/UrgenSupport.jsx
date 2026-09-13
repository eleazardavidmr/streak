import { useState } from "react";
import { IconX } from "@tabler/icons-react";

export default function UrgeSupport() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-space-md">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full bg-transparent text-center font-body-md text-body-md text-outline hover:text-on-surface transition-colors duration-150 py-space-xs select-none"
      >
        I'm feeling an urge right now
      </button>

      {open && (
        <div className="flex flex-col bg-surface-container-low rounded p-space-md gap-space-sm transition-all">
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
