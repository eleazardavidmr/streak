import { useState } from "react";
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
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("entry");
  const [action, setAction] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    setOpen(false);
    setStep("entry");
    setAction(null);
    setError("");
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

      close();
      onComplete?.({ removedToday: hasCheckedInToday });
    } catch {
      setError("Unable to save this reset. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full bg-transparent text-center font-body-md text-body-md text-outline motion-interactive hover:text-on-surface transition-colors duration-150 py-space-xs select-none"
      >
        Let’s reset together
      </button>

      {open && (
        <div className="fixed inset-0 z-60 bg-surface overflow-y-auto px-margin pt-safe pb-safe motion-overlay">
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

            {error && (
              <p className="mt-space-md text-body-md text-error">{error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
