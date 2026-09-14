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
  onNavigate,
  page = false,
}) {
  const [step, setStep] = useState("entry");
  const [action, setAction] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
        onClick={() => onNavigate?.("/reset")}
        className="w-full bg-transparent text-center font-body-md text-body-md text-outline motion-interactive hover:text-on-surface focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-container transition-colors duration-150 py-space-xs select-none"
      >
        Let’s reset together
      </button>
    </div>
  );
}
