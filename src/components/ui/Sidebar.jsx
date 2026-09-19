import { motion } from "framer-motion";
import { IconLogout } from "@tabler/icons-react";
import { defaultProfile } from "../../lib/profile.js";
import { navTabs } from "../../lib/navTabs.js";
import { springSnappy } from "../../lib/motion.js";
import BrandMark from "./BrandMark.jsx";
import Avatar from "./Avatar.jsx";
import NotificationBell from "./NotificationBell.jsx";

export default function Sidebar({
  profile = defaultProfile,
  onSignOut,
  onNavigate,
  active,
  onChange,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
}) {
  const { displayName, avatarUrl, email } = profile;
  const label = displayName || email;

  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-white/8 material-chrome px-space-md py-space-lg">
      <div className="flex items-center justify-between px-space-xs">
        <button
          type="button"
          onClick={() => onNavigate?.("/")}
          aria-label="Go to dashboard"
          className="flex items-center gap-space-sm font-headline-sm text-headline-sm tracking-tight text-on-surface uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-lg"
        >
          <BrandMark />
          Streak
        </button>
        <NotificationBell
          notifications={notifications}
          onMarkRead={onMarkNotificationRead}
          onMarkAllRead={onMarkAllNotificationsRead}
        />
      </div>

      <nav className="mt-space-xl flex flex-col gap-space-xs">
        {navTabs.map(({ id, Icon, label: tabLabel }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex items-center gap-space-sm rounded-2xl px-space-md py-space-sm text-left font-label-md text-label-md font-semibold transition-colors duration-200 ${
                isActive
                  ? "text-primary-container"
                  : "text-outline hover:text-on-surface"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active"
                  transition={springSnappy}
                  className="absolute inset-0 rounded-2xl bg-primary-container/12"
                />
              )}
              <Icon
                size={20}
                stroke={isActive ? 2 : 1.6}
                className="relative z-10 shrink-0"
              />
              <span className="relative z-10 truncate">{tabLabel}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-space-xs border-t border-white/8 pt-space-md">
        <button
          type="button"
          onClick={() => onNavigate?.("/settings")}
          className="flex items-center gap-space-sm rounded-2xl px-space-sm py-space-xs text-left transition-colors hover:bg-white/6"
        >
          <Avatar avatarUrl={avatarUrl} size={32} iconSize={16} />
          <span className="min-w-0 flex-1 truncate font-label-sm text-label-sm text-on-surface">
            {label}
          </span>
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="flex items-center gap-space-sm rounded-2xl px-space-sm py-space-xs text-left font-label-sm text-label-sm text-outline transition-colors hover:bg-white/6 hover:text-on-surface"
        >
          <IconLogout size={16} stroke={1.8} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
