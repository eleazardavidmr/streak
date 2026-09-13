import { useEffect, useState } from "react";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { defaultProfile } from "../../lib/profile.js";
import BrandMark from "./BrandMark.jsx";

export default function Navbar({ profile = defaultProfile, onSignOut }) {
  const { displayName, avatarUrl, email } = profile;
  const label = displayName || email;
  const [brokenImage, setBrokenImage] = useState(false);
  const showAvatar = avatarUrl && !brokenImage;

  useEffect(() => {
    setBrokenImage(false);
  }, [avatarUrl]);

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface">
      <div className="h-16 px-margin flex items-center justify-between">
        <h1 className="flex items-center gap-space-sm font-headline-sm text-headline-sm tracking-tight text-on-surface uppercase">
          <BrandMark />
          Streak
        </h1>
        <div className="flex items-center gap-space-sm">
          <span className="hidden sm:block text-label-sm text-outline max-w-40 truncate">
            {label}
          </span>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
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
          </div>
          <button
            type="button"
            onClick={onSignOut}
            aria-label="Cerrar sesión"
            className="w-10 h-10 flex items-center justify-center text-outline hover:text-on-surface transition-colors"
          >
            <IconLogout size={18} stroke={1.8} />
          </button>
        </div>
      </div>
    </header>
  );
}
