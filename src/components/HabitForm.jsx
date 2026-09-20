import { useEffect, useRef, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { habitIconOptions } from "../lib/habitIconOptions.js";

const accentOptions = [
  { key: "primary", label: "Chartreuse", swatchClass: "bg-primary-container" },
  { key: "secondary", label: "Sage", swatchClass: "bg-secondary-container" },
];

export default function HabitForm({
  active = true,
  saving = false,
  submitLabel = "Add habit",
  submitIcon: SubmitIcon = IconPlus,
  autoFocus = true,
  focusDelay = 0,
  onSubmit,
}) {
  const [title, setTitle] = useState("");
  const [iconName, setIconName] = useState(habitIconOptions[0].name);
  const [accent, setAccent] = useState("primary");
  const [wasActive, setWasActive] = useState(active);
  const inputRef = useRef(null);

  if (active && !wasActive) {
    setWasActive(true);
    setTitle("");
    setIconName(habitIconOptions[0].name);
    setAccent("primary");
  } else if (!active && wasActive) {
    setWasActive(false);
  }

  useEffect(() => {
    if (!active || !autoFocus) {
      return undefined;
    }

    const focusTimer = window.setTimeout(
      () => inputRef.current?.focus(),
      focusDelay,
    );

    return () => window.clearTimeout(focusTimer);
  }, [active, autoFocus, focusDelay]);

  const trimmed = title.trim();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!trimmed || saving) {
      return;
    }

    onSubmit({ title: trimmed, iconName, accent });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-space-lg">
      <label className="flex flex-col gap-space-xs">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
          Name
        </span>
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={40}
          placeholder="e.g. Morning walk"
          className="w-full h-12 bg-transparent border-b border-white/12 text-body-md text-on-surface outline-none placeholder:text-outline focus:border-primary-container transition-colors"
        />
      </label>

      <div className="flex flex-col gap-space-sm">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
          Icon
        </span>
        <div
          className="grid grid-cols-4 gap-space-sm"
          role="radiogroup"
          aria-label="Habit icon"
        >
          {habitIconOptions.map(({ name, label, Icon }) => {
            const selected = iconName === name;
            return (
              <button
                key={name}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={label}
                onClick={() => setIconName(name)}
                className={`flex h-11 items-center justify-center rounded-xl motion-interactive transition-colors ${
                  selected
                    ? "bg-primary-container text-on-primary-fixed"
                    : "bg-white/8 text-on-surface-variant"
                }`}
              >
                <Icon size={19} stroke={1.8} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-space-sm">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
          Accent
        </span>
        <div
          className="flex gap-space-sm"
          role="radiogroup"
          aria-label="Habit accent color"
        >
          {accentOptions.map(({ key, label, swatchClass }) => {
            const selected = accent === key;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setAccent(key)}
                className={`flex flex-1 items-center gap-space-xs rounded-xl px-space-md py-space-sm motion-interactive transition-colors ${
                  selected ? "bg-white/12" : "bg-white/6"
                }`}
              >
                <span className={`h-4 w-4 rounded-full ${swatchClass}`} />
                <span className="font-label-sm text-label-sm text-on-surface">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={!trimmed || saving}
        className="h-13 rounded-full bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold flex items-center justify-center gap-space-xs motion-interactive shadow-elevated-primary disabled:opacity-50 disabled:shadow-none"
      >
        <SubmitIcon size={18} stroke={2} />
        {saving ? "Adding..." : submitLabel}
      </button>
    </form>
  );
}
