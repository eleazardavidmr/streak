import { useState } from "react";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { defaultProfile } from "../../lib/profile.js";
import BrandMark from "./BrandMark.jsx";

export default function Navbar({
  profile = defaultProfile,
  onSignOut,
  onNavigate,
}) {
  const { displayName, avatarUrl, email } = profile;
  const label = displayName || email;
  const [brokenImage, setBrokenImage] = useState(false);
  const [lastAvatarUrl, setLastAvatarUrl] = useState(avatarUrl);

  if (avatarUrl !== lastAvatarUrl) {
    setLastAvatarUrl(avatarUrl);
    setBrokenImage(false);
  }

  const showAvatar = avatarUrl && !brokenImage;

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface motion-slide-down">
      <div className="h-16 px-margin flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate?.("/")}
          aria-label="Go to dashboard"
          className="flex items-center gap-space-sm font-headline-sm text-headline-sm tracking-tight text-on-surface uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-lg"
        >
          <BrandMark />
          Streak
        </button>
        <div className="flex items-center gap-space-sm">
          <span className="hidden sm:block text-label-sm text-outline max-w-40 truncate">
            {label}
          </span>
          <button
            type="button"
            onClick={() => onNavigate?.("/settings")}
            aria-label="Open settings"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
          >
            {showAvatar ? (
              <img
                src={avatarUrl}
                alt=""
                className="w-full h-full object-cover"
                onError={() => setBrokenImage(true)}
              />
            ) : (
              <IconUser size={18} className="text-on-primary" stroke={2} />
            )}
          </button>
          <button
            type="button"
            onClick={onSignOut}
            aria-label="Sign out"
            className="w-10 h-10 flex items-center justify-center text-outline hover:text-on-surface transition-colors"
          >
            <IconLogout size={18} stroke={1.8} />
          </button>
        </div>
      </div>
    </header>
  );
}
