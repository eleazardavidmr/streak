import { useState } from "react";
import { IconRefresh } from "@tabler/icons-react";
import ActionConfirmationModal from "./ActionConfirmationModal.jsx";
import ReportSetback from "./ReportSetback.jsx";
import ActionSelection from "./ActionSelection.jsx";
import ActionConfirmation from "./ActionConfirmation.jsx";
import ReflectionForm from "./ReflectionForm.jsx";
import { reportRelapse } from "../lib/relapses.js";
import { undoTodayCheckin } from "../lib/checkins.js";

export default function ResetFlow({
  streak,
  checkinDates,
  hasCheckedInToday,
  onComplete,
  onNavigate,
  page = false,
}) {
  const [step, setStep] = useState("entry");
  const [action, setAction] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  const close = () => {
    setStep("entry");
    setAction(null);
    setError("");
    if (page) {
      onNavigate?.("/");
    }
  };

  const finish = async ({ timeOfDay = null, note = null } = {}) => {
    setSaving(true);
    setError("");

    try {
      if (hasCheckedInToday) {
        await undoTodayCheckin();
      }

      await reportRelapse({
        actionTaken: action?.title ?? null,
        timeOfDay,
        note,
      });

      onComplete?.({ removedToday: hasCheckedInToday });
      close();
    } catch {
      setError("Unable to save this reset. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const flowContent = (
    <div className="max-w-md mx-auto py-space-md motion-panel">
      {step === "entry" && (
        <div className="motion-rise">
          <ReportSetback
            streak={streak}
            checkinDates={checkinDates}
            onContinue={() => setStep("action")}
            onCancel={close}
          />
        </div>
      )}

      {step === "action" && (
        <div className="motion-rise">
          <ActionSelection
            onBack={() => setStep("entry")}
            onSelect={(nextAction) => {
              setAction(nextAction);
              setStep("confirm");
            }}
            onSkip={() => {
              setAction(null);
              setStep("reflect");
            }}
          />
        </div>
      )}

      {step === "confirm" && (
        <div className="motion-rise">
          <ActionConfirmation
            action={action}
            onDone={() => setStep("reflect")}
            onChangeAction={() => setStep("action")}
            onClose={close}
          />
        </div>
      )}

      {step === "reflect" && (
        <div className="motion-rise">
          <ReflectionForm
            saving={saving}
            onBack={() => setStep(action ? "confirm" : "action")}
            onSave={finish}
            onSkip={() => finish()}
          />
        </div>
      )}

      {error && <p className="mt-space-md text-body-md text-error">{error}</p>}
    </div>
  );

  if (page) {
    return (
      <main className="flex-1 flex flex-col relative w-full px-margin pt-nav pb-safe bg-surface motion-page">
        {flowContent}
      </main>
    );
  }

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label="Open reset support"
        className="w-12 h-12 px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold flex flex-col items-center justify-center gap-space-xs motion-interactive active:scale-[0.98] hover:bg-surface-variant focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container transition duration-150 select-none"
      >
        <IconRefresh size={18} stroke={2.25} />
        {/*


        <span className="text-center">Reset together</span>
        */}
      </button>
      <ActionConfirmationModal
        open={confirming}
        title="Start a reset together?"
        description="You will be guided through a calm reset flow to reflect, choose your next action, and return to your cadence."
        confirmLabel="Start reset"
        icon={IconRefresh}
        onClose={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          onNavigate?.("/reset");
        }}
      />
    </div>
  );
}
