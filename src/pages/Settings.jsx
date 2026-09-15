import { useState } from "react";
import { motion } from "framer-motion";
import {
  IconBell,
  IconCalendarWeek,
  IconCheck,
  IconFlag2,
  IconTrophy,
  IconUser,
} from "@tabler/icons-react";
import { saveProfile } from "../lib/profile.js";
import { fadeRise, springBouncy, springSoft } from "../lib/motion.js";

function isValidHttpUrl(value) {
  if (!value.trim()) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function Toggle({
  checked,
  onChange,
  label,
  description,
  icon: Icon,
  disabled,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className="w-full flex items-center justify-between gap-space-md px-space-md py-space-md text-left motion-interactive disabled:opacity-50"
    >
      <div className="flex items-start gap-space-sm min-w-0">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.5rem] bg-primary-container/15 text-primary-container">
          <Icon size={16} stroke={1.8} />
        </span>
        <div className="min-w-0 pt-0.5">
          <p className="font-body-md text-body-md text-on-surface">{label}</p>
          <p className="font-label-sm text-label-sm text-outline">
            {description}
          </p>
        </div>
      </div>
      <span
        aria-hidden="true"
        className={`relative w-11 h-6.5 rounded-full shrink-0 transition-colors duration-200 ${
          checked ? "bg-primary-container" : "bg-white/12"
        }`}
      >
        <motion.span
          animate={{ x: checked ? 18 : 2 }}
          transition={springBouncy}
          className="absolute top-0.5 left-0 w-5.5 h-5.5 rounded-full bg-white shadow-elevated"
        />
      </span>
    </button>
  );
}

export default function Settings({
  user,
  profile,
  onProfileChange,
  onSignOut,
}) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [runningGoalDate, setRunningGoalDate] = useState(
    profile.runningGoalDate,
  );
  const [runningGoalLabel, setRunningGoalLabel] = useState(
    profile.runningGoalLabel,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [brokenImage, setBrokenImage] = useState(false);
  const [lastProfile, setLastProfile] = useState(profile);

  if (
    profile.displayName !== lastProfile.displayName ||
    profile.avatarUrl !== lastProfile.avatarUrl ||
    profile.runningGoalDate !== lastProfile.runningGoalDate ||
    profile.runningGoalLabel !== lastProfile.runningGoalLabel
  ) {
    setLastProfile(profile);
    setDisplayName(profile.displayName);
    setAvatarUrl(profile.avatarUrl);
    setRunningGoalDate(profile.runningGoalDate);
    setRunningGoalLabel(profile.runningGoalLabel);
    setBrokenImage(false);
  }

  const persist = async (nextProfile) => {
    setError("");
    setSaving(true);

    try {
      const saved = await saveProfile(user, nextProfile);
      onProfileChange(saved);
      return saved;
    } catch {
      setError("Unable to save your changes.");
      throw new Error("save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setNotice("");

    const nextName = displayName.trim();
    const nextAvatar = avatarUrl.trim();

    if (!isValidHttpUrl(nextAvatar)) {
      setError("Enter a valid image URL, starting with http or https.");
      return;
    }

    try {
      await persist({
        ...profile,
        displayName: nextName,
        avatarUrl: nextAvatar,
      });
      setNotice("Profile saved.");
    } catch {
      // Error is already surfaced.
    }
  };

  const handleSaveGoal = async (event) => {
    event.preventDefault();
    setNotice("");

    try {
      await persist({
        ...profile,
        runningGoalDate: runningGoalDate || "",
        runningGoalLabel: runningGoalLabel.trim(),
      });
      setNotice("Running goal saved.");
    } catch {
      // Error is already surfaced.
    }
  };

  const handleClearGoal = async () => {
    setNotice("");
    setRunningGoalDate("");
    setRunningGoalLabel("");

    try {
      await persist({ ...profile, runningGoalDate: "", runningGoalLabel: "" });
    } catch {
      // Error is already surfaced.
    }
  };

  const persistSettings = async (patch) => {
    setNotice("");
    const previous = profile;
    onProfileChange({ ...profile, ...patch });

    try {
      await persist({ ...profile, ...patch });
    } catch {
      onProfileChange(previous);
    }
  };

  const previewUrl = avatarUrl.trim();
  const showPreview = previewUrl && isValidHttpUrl(previewUrl) && !brokenImage;

  return (
    <main className="flex-1 flex flex-col relative w-full px-margin pt-nav pb-nav bg-surface">
      <motion.div
        variants={fadeRise}
        initial="hidden"
        animate="visible"
        transition={springSoft}
        className="pt-space-sm pb-space-lg"
      >
        <p className="font-label-sm text-label-sm text-outline tracking-widest uppercase">
          Preferences
        </p>
        <h2 className="mt-space-xs font-headline-sm text-headline-sm text-on-surface tracking-tight">
          Settings
        </h2>
      </motion.div>

      <motion.section
        variants={fadeRise}
        initial="hidden"
        animate="visible"
        transition={{ ...springSoft, delay: 0.06 }}
        className="flex flex-col gap-space-sm"
      >
        <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase px-space-xs">
          Profile
        </span>

        <form
          onSubmit={handleSaveProfile}
          className="flex flex-col gap-space-lg rounded-[1.35rem] border border-white/8 bg-surface-container-low/70 backdrop-blur-xl p-space-md shadow-elevated"
        >
          <div className="flex items-center gap-space-md">
            <div className="w-16 h-16 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center shrink-0 ring-1 ring-white/10">
              {showPreview ? (
                <img
                  src={previewUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={() => setBrokenImage(true)}
                  onLoad={() => setBrokenImage(false)}
                />
              ) : (
                <IconUser size={28} className="text-outline" stroke={1.6} />
              )}
            </div>
            <p className="text-body-md text-on-surface-variant">
              Add a photo with an image URL. It will show in the header.
            </p>
          </div>

          <label className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">
              Display name
            </span>
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              maxLength={40}
              placeholder="Your name"
              className="w-full h-12 bg-transparent border-b border-white/12 text-body-md text-on-surface outline-none placeholder:text-outline focus:border-primary-container transition-colors"
            />
          </label>

          <label className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">
              Photo URL
            </span>
            <input
              type="url"
              value={avatarUrl}
              onChange={(event) => {
                setAvatarUrl(event.target.value);
                setBrokenImage(false);
              }}
              placeholder="https://..."
              className="w-full h-12 bg-transparent border-b border-white/12 text-body-md text-on-surface outline-none placeholder:text-outline focus:border-primary-container transition-colors"
            />
          </label>

          {error && <p className="text-body-md text-error">{error}</p>}
          {notice && (
            <p className="text-body-md text-primary-container">{notice}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="h-13 rounded-full bg-primary-container text-on-primary-fixed text-label-md font-semibold flex items-center justify-center gap-space-xs motion-interactive shadow-elevated-primary disabled:opacity-50 disabled:shadow-none"
          >
            <IconCheck size={18} stroke={2} />
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </motion.section>

      <motion.section
        variants={fadeRise}
        initial="hidden"
        animate="visible"
        transition={{ ...springSoft, delay: 0.12 }}
        className="flex flex-col gap-space-sm pt-space-xl"
      >
        <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase px-space-xs">
          General
        </span>

        <div className="flex flex-col divide-y divide-white/8 rounded-[1.35rem] border border-white/8 bg-surface-container-low/70 backdrop-blur-xl px-space-md shadow-elevated">
          <button
            type="button"
            disabled={saving}
            onClick={() =>
              persistSettings({
                weekStartsOn:
                  profile.weekStartsOn === "monday" ? "sunday" : "monday",
              })
            }
            className="w-full flex items-center justify-between gap-space-md py-space-md text-left motion-interactive disabled:opacity-50"
          >
            <div className="flex items-start gap-space-sm min-w-0">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.5rem] bg-primary-container/15 text-primary-container">
                <IconCalendarWeek size={16} stroke={1.8} />
              </span>
              <div className="pt-0.5">
                <p className="font-body-md text-body-md text-on-surface">
                  Week starts on
                </p>
                <p className="font-label-sm text-label-sm text-outline">
                  Used for the activity calendar
                </p>
              </div>
            </div>
            <span className="text-label-md text-primary-container uppercase tracking-wider shrink-0">
              {profile.weekStartsOn === "monday" ? "Mon" : "Sun"}
            </span>
          </button>

          <Toggle
            checked={profile.showBestStreak}
            disabled={saving}
            onChange={(checked) => persistSettings({ showBestStreak: checked })}
            icon={IconTrophy}
            label="Show best streak"
            description="Display your record on the home screen"
          />

          <Toggle
            checked={profile.reminderEnabled}
            disabled={saving}
            onChange={(checked) =>
              persistSettings({ reminderEnabled: checked })
            }
            icon={IconBell}
            label="Daily reminder"
            description="Keep a personal cue to check in each day"
          />
        </div>
      </motion.section>

      <motion.section
        variants={fadeRise}
        initial="hidden"
        animate="visible"
        transition={{ ...springSoft, delay: 0.18 }}
        className="flex flex-col gap-space-sm pt-space-xl"
      >
        <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase px-space-xs">
          Running goal
        </span>

        <form
          onSubmit={handleSaveGoal}
          className="flex flex-col gap-space-lg rounded-[1.35rem] border border-white/8 bg-surface-container-low/70 backdrop-blur-xl p-space-md shadow-elevated"
        >
          <div className="flex items-center gap-space-sm">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.5rem] bg-secondary-container/40 text-secondary">
              <IconFlag2 size={16} stroke={1.8} />
            </span>
            <p className="text-body-md text-on-surface-variant">
              Set a target date to see a countdown on your running card.
            </p>
          </div>

          <label className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">
              Goal date
            </span>
            <input
              type="date"
              value={runningGoalDate ?? ""}
              onChange={(event) => setRunningGoalDate(event.target.value)}
              className="w-full h-12 bg-transparent border-b border-white/12 text-body-md text-on-surface outline-none focus:border-primary-container transition-colors"
            />
          </label>

          <label className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">
              Goal name
            </span>
            <input
              type="text"
              value={runningGoalLabel}
              onChange={(event) => setRunningGoalLabel(event.target.value)}
              maxLength={60}
              placeholder="First 5K"
              className="w-full h-12 bg-transparent border-b border-white/12 text-body-md text-on-surface outline-none placeholder:text-outline focus:border-primary-container transition-colors"
            />
          </label>

          <div className="grid grid-cols-2 gap-space-sm">
            <button
              type="button"
              onClick={handleClearGoal}
              disabled={saving || !profile.runningGoalDate}
              className="h-13 rounded-full bg-white/8 text-on-surface text-label-md font-semibold motion-interactive disabled:opacity-40"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-13 rounded-full bg-secondary-container text-on-secondary-container text-label-md font-semibold flex items-center justify-center gap-space-xs motion-interactive shadow-elevated disabled:opacity-50"
            >
              <IconCheck size={18} stroke={2} />
              Save goal
            </button>
          </div>
        </form>
      </motion.section>

      <motion.section
        variants={fadeRise}
        initial="hidden"
        animate="visible"
        transition={{ ...springSoft, delay: 0.24 }}
        className="flex flex-col gap-space-sm pt-space-xl"
      >
        <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase px-space-xs">
          Account
        </span>
        <div className="flex flex-col gap-space-md rounded-[1.35rem] border border-white/8 bg-surface-container-low/70 backdrop-blur-xl p-space-md shadow-elevated">
          <p className="text-body-md text-on-surface-variant">{profile.email}</p>
          <button
            type="button"
            onClick={onSignOut}
            className="h-13 rounded-full bg-white/8 text-on-surface text-label-md font-semibold motion-interactive"
          >
            Sign out
          </button>
        </div>
      </motion.section>
    </main>
  );
}
