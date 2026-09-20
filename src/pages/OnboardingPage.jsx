import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconArrowRight, IconFlame, IconSparkles } from "@tabler/icons-react";
import BrandMark from "../components/ui/BrandMark.jsx";
import HabitForm from "../components/HabitForm.jsx";
import LoadingView from "../components/ui/LoadingView.jsx";
import { createHabit, getDefaultHabit } from "../lib/habits.js";
import { completeOnboarding } from "../lib/profile.js";
import { fadeRise, springSoft } from "../lib/motion.js";

export default function OnboardingPage({ user, profile, onProfileChange }) {
  const [step, setStep] = useState("welcome");
  const [defaultHabit, setDefaultHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getDefaultHabit()
      .then((habit) => {
        if (mounted) {
          setDefaultHabit(habit);
        }
      })
      .catch(() => {
        if (mounted) {
          setError("Unable to load your streak.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleAddHabit = async ({ title, iconName, accent }) => {
    setCreating(true);
    setError("");

    try {
      await createHabit({ title, iconName, accent, sortOrder: 0 });
      setStep("done");
    } catch {
      setError(
        "Unable to add that habit. You can add it later from your dashboard.",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleFinish = async () => {
    setFinishing(true);
    setError("");

    try {
      const saved = await completeOnboarding(user, profile);
      onProfileChange(saved);
    } catch {
      setError("Unable to finish setup. Try again.");
      setFinishing(false);
    }
  };

  if (loading) {
    return <LoadingView label="Setting things up" />;
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col px-margin pt-safe pb-safe">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center py-space-xl">
        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <motion.div
              key="welcome"
              variants={fadeRise}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -20 }}
              transition={springSoft}
              className="flex flex-col items-center text-center gap-space-lg"
            >
              <BrandMark className="h-10 w-10" />
              <div>
                <p className="text-label-sm text-primary-container uppercase tracking-widest mb-space-md">
                  Welcome
                </p>
                <h1 className="text-display-lg-mobile font-display-lg-mobile tracking-tighter text-primary">
                  Let's set up your space.
                </h1>
                <p className="mt-space-md text-body-md text-on-surface-variant">
                  Streak helps you build one honest day at a time — privately,
                  without judgment.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep("default")}
                className="w-full h-13 rounded-full bg-primary-container text-on-primary-fixed text-label-md font-semibold flex items-center justify-center gap-space-xs motion-interactive shadow-elevated-primary"
              >
                Continue
                <IconArrowRight size={18} stroke={2} />
              </button>
            </motion.div>
          )}

          {step === "default" && (
            <motion.div
              key="default"
              variants={fadeRise}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -20 }}
              transition={springSoft}
              className="flex flex-col items-center text-center gap-space-lg"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/15 text-primary-container">
                <IconFlame size={28} stroke={1.8} />
              </span>
              <div>
                <p className="text-label-sm text-primary-container uppercase tracking-widest mb-space-md">
                  Your core streak
                </p>
                <h1 className="text-display-lg-mobile font-display-lg-mobile tracking-tighter text-primary">
                  {defaultHabit?.title ?? "Discipline"}
                </h1>
                <p className="mt-space-md text-body-md text-on-surface-variant">
                  Starting today, at day zero. This one's always here, always
                  first — it's permanent and can't be deleted, though you can
                  rename how it's framed anytime.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep("add")}
                className="w-full h-13 rounded-full bg-primary-container text-on-primary-fixed text-label-md font-semibold flex items-center justify-center gap-space-xs motion-interactive shadow-elevated-primary"
              >
                Continue
                <IconArrowRight size={18} stroke={2} />
              </button>
            </motion.div>
          )}

          {step === "add" && (
            <motion.div
              key="add"
              variants={fadeRise}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -20 }}
              transition={springSoft}
              className="flex flex-col gap-space-lg"
            >
              <div>
                <p className="text-label-sm text-primary-container uppercase tracking-widest mb-space-md">
                  Optional
                </p>
                <h1 className="text-display-lg-mobile font-display-lg-mobile tracking-tighter text-primary">
                  Add something else you're building?
                </h1>
                <p className="mt-space-md text-body-md text-on-surface-variant">
                  Stack a second habit if you'd like — or skip for now and add
                  one anytime from your dashboard.
                </p>
              </div>

              <HabitForm
                saving={creating}
                submitLabel="Add habit"
                onSubmit={handleAddHabit}
              />

              <button
                type="button"
                disabled={creating}
                onClick={() => setStep("done")}
                className="w-full h-13 rounded-full bg-white/8 text-on-surface text-label-md font-semibold motion-interactive disabled:opacity-50"
              >
                Skip for now
              </button>

              {error && <p className="text-body-md text-error">{error}</p>}
            </motion.div>
          )}

          {step === "done" && (
            <motion.div
              key="done"
              variants={fadeRise}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -20 }}
              transition={springSoft}
              className="flex flex-col items-center text-center gap-space-lg"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/15 text-primary-container">
                <IconSparkles size={28} stroke={1.8} />
              </span>
              <div>
                <p className="text-label-sm text-primary-container uppercase tracking-widest mb-space-md">
                  You're set
                </p>
                <h1 className="text-display-lg-mobile font-display-lg-mobile tracking-tighter text-primary">
                  Ready when you are.
                </h1>
                <p className="mt-space-md text-body-md text-on-surface-variant">
                  Your streak starts today.
                </p>
              </div>
              <button
                type="button"
                disabled={finishing}
                onClick={handleFinish}
                className="w-full h-13 rounded-full bg-primary-container text-on-primary-fixed text-label-md font-semibold flex items-center justify-center gap-space-xs motion-interactive shadow-elevated-primary disabled:opacity-50"
              >
                {finishing ? "One moment..." : "Go to dashboard"}
                <IconArrowRight size={18} stroke={2} />
              </button>
              {error && <p className="text-body-md text-error">{error}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
