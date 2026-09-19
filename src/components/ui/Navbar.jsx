import { motion } from "framer-motion";
import { IconLogout } from "@tabler/icons-react";
import { defaultProfile } from "../../lib/profile.js";
import { slideDown, springSnappy } from "../../lib/motion.js";
import BrandMark from "./BrandMark.jsx";
import NotificationBell from "./NotificationBell.jsx";
import Avatar from "./Avatar.jsx";

export default function Navbar({
  profile = defaultProfile,
  onSignOut,
  onNavigate,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
}) {
  const { displayName, avatarUrl, email } = profile;
  const label = displayName || email;

  return (
    <motion.header
      variants={slideDown}
      initial="hidden"
      animate="visible"
      transition={springSnappy}
      className="fixed top-0 w-full z-50 pt-safe material-chrome border-b border-white/8 md:hidden"
    >
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
          <NotificationBell
            notifications={notifications}
            onMarkRead={onMarkNotificationRead}
            onMarkAllRead={onMarkAllNotificationsRead}
          />
          <button
            type="button"
            onClick={() => onNavigate?.("/settings")}
            aria-label="Open settings"
            className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
          >
            <Avatar avatarUrl={avatarUrl} />
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
    </motion.header>
  );
}
