import { useEffect, useState } from "react";
import {
  IconBell,
  IconCalendarWeek,
  IconCheck,
  IconTrophy,
  IconUser,
} from "@tabler/icons-react";
import { saveProfile } from "../lib/profile.js";

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

function Toggle({ checked, onChange, label, description, icon: Icon, disabled }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className="w-full flex items-center justify-between gap-space-md py-space-md text-left disabled:opacity-50"
    >
      <div className="flex items-start gap-space-sm min-w-0">
        <Icon size={18} className="text-outline mt-0.5 shrink-0" stroke={1.8} />
        <div className="min-w-0">
          <p className="font-body-md text-body-md text-on-surface">{label}</p>
          <p className="font-label-sm text-label-sm text-outline">{description}</p>
        </div>
      </div>
      <span
        className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${
          checked ? "bg-primary-container" : "bg-surface-container-highest"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-primary transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

export default function Settings({ user, profile, onProfileChange, onSignOut }) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [brokenImage, setBrokenImage] = useState(false);

  useEffect(() => {
    setDisplayName(profile.displayName);
    setAvatarUrl(profile.avatarUrl);
    setBrokenImage(false);
  }, [profile.displayName, profile.avatarUrl]);

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
      <div className="pt-space-sm pb-space-lg">
        <p className="font-label-sm text-label-sm text-outline tracking-widest uppercase">
          Preferences
        </p>
        <h2 className="mt-space-xs font-headline-sm text-headline-sm text-on-surface tracking-tight">
          Settings
        </h2>
      </div>

      <section className="flex flex-col">
        <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase">
          Profile
        </span>

        <form onSubmit={handleSaveProfile} className="flex flex-col gap-space-lg pt-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-16 h-16 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center shrink-0">
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
              className="w-full h-12 bg-transparent border-b border-surface-container-highest text-body-md text-on-surface outline-none placeholder:text-outline focus:border-primary-container transition-colors"
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
              className="w-full h-12 bg-transparent border-b border-surface-container-highest text-body-md text-on-surface outline-none placeholder:text-outline focus:border-primary-container transition-colors"
            />
          </label>

          {error && <p className="text-body-md text-error">{error}</p>}
          {notice && (
            <p className="text-body-md text-primary-container">{notice}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="h-13 rounded-full bg-primary-container text-on-primary-fixed text-label-md font-semibold flex items-center justify-center gap-space-xs active:scale-[0.98] disabled:opacity-50 transition-transform"
          >
            <IconCheck size={18} stroke={2} />
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </section>

      <div className="w-full h-px bg-surface-container-highest my-space-xl opacity-60" />

      <section className="flex flex-col">
        <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase">
          General
        </span>

        <div className="flex flex-col divide-y divide-surface-container-highest/40 pt-space-sm">
          <button
            type="button"
            disabled={saving}
            onClick={() =>
              persistSettings({
                weekStartsOn:
                  profile.weekStartsOn === "monday" ? "sunday" : "monday",
              })
            }
            className="w-full flex items-center justify-between gap-space-md py-space-md text-left disabled:opacity-50"
          >
            <div className="flex items-start gap-space-sm min-w-0">
              <IconCalendarWeek
                size={18}
                className="text-outline mt-0.5 shrink-0"
                stroke={1.8}
              />
              <div>
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
      </section>

      <div className="w-full h-px bg-surface-container-highest my-space-xl opacity-60" />

      <section className="flex flex-col gap-space-md">
        <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase">
          Account
        </span>
        <p className="text-body-md text-on-surface-variant">{profile.email}</p>
        <button
          type="button"
          onClick={onSignOut}
          className="h-13 rounded-full bg-surface-container-high text-on-surface text-label-md font-semibold active:scale-[0.98] transition-transform"
        >
          Sign out
        </button>
      </section>
    </main>
  );
}
