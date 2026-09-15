import { IconBolt } from "@tabler/icons-react";
import { useState } from "react";
import ActionConfirmationModal from "./ActionConfirmationModal.jsx";

export default function UrgeSupport({ onNavigate }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex w-full flex-col gap-space-md">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="flex min-h-16 w-full items-center gap-space-md rounded-xl bg-surface-container-high px-space-md py-space-sm text-left text-on-surface font-label-md text-label-md font-semibold motion-interactive active:scale-[0.99] hover:bg-surface-variant focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container transition duration-150 select-none"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-highest">
          <IconBolt size={20} stroke={2} />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="font-label-md text-label-md">Urge support</span>
          <span className="font-label-sm text-label-sm text-outline">
            Slow down and ground yourself now.
          </span>
        </span>
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
          onNavigate?.("/support");
        }}
      />
    </div>
  );
}
