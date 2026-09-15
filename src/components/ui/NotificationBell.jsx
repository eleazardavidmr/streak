import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { IconBell, IconBellOff, IconCheck, IconFlame, IconTrophy } from "@tabler/icons-react";

const SWIPE_DISMISS_THRESHOLD = -72;

function formatRelativeTime(isoDate) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) {
    return "now";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d`;
}

function NotificationCard({ notification, index, onMarkRead }) {
  const x = useMotionValue(0);
  const revealOpacity = useTransform(x, [SWIPE_DISMISS_THRESHOLD, -12, 0], [1, 0, 0]);
  const Icon = notification.type === "achievement" ? IconTrophy : IconFlame;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 420, damping: 34, delay: index * 0.05 }}
      className="relative"
    >
      <motion.div
        aria-hidden="true"
        style={{ opacity: revealOpacity }}
        className="absolute inset-0 flex items-center justify-end rounded-[1.35rem] bg-primary-container px-space-lg"
      >
        <IconCheck size={20} stroke={2.4} className="text-on-primary-fixed" />
      </motion.div>

      <motion.div
        style={{ x }}
        drag={notification.read ? false : "x"}
        dragDirectionLock
        dragConstraints={{ left: -110, right: 0 }}
        dragElastic={{ left: 0.35, right: 0 }}
        onDragEnd={(_event, info) => {
          if (info.offset.x < SWIPE_DISMISS_THRESHOLD || info.velocity.x < -500) {
            onMarkRead?.(notification.id);
          }
        }}
        onClick={() => !notification.read && onMarkRead?.(notification.id)}
        whileTap={{ scale: 0.985 }}
        className="relative z-10 flex items-start gap-space-sm rounded-[1.35rem] border border-white/10 bg-surface-container-high/75 px-space-md py-space-md backdrop-blur-2xl shadow-[0_18px_44px_rgba(0,0,0,0.4)] cursor-pointer touch-pan-y"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.85rem] bg-primary-container/15 text-primary-container">
          <Icon size={19} stroke={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-space-sm">
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-outline truncate">
              {notification.title}
            </p>
            <span className="flex shrink-0 items-center gap-space-xs">
              {!notification.read && (
                <span className="h-1.5 w-1.5 rounded-full bg-primary-container" />
              )}
              <span className="font-label-sm text-label-sm text-outline">
                {formatRelativeTime(notification.createdAt)}
              </span>
            </span>
          </div>
          <p className="mt-0.5 font-body-md text-body-md text-on-surface line-clamp-2">
            {notification.body}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function NotificationBell({
  notifications = [],
  onMarkRead,
  onMarkAllRead,
}) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        className="relative w-10 h-10 flex items-center justify-center text-outline hover:text-on-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-full"
      >
        <IconBell size={18} stroke={1.8} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-container" />
        )}
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="notifications-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-[100] overlay-backdrop"
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setOpen(false);
                }
              }}
            >
              <motion.section
                key="notifications-panel"
                initial={{ opacity: 0, y: -28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
                aria-label="Notifications"
                aria-modal="true"
                role="dialog"
                className="mx-auto flex h-[100dvh] w-full max-w-sm flex-col pt-nav px-margin pb-space-xl"
              >
                <div className="flex items-start justify-between gap-space-md pb-space-lg">
                  <h2 className="font-display-lg-mobile text-display-lg-mobile text-on-surface tracking-tight">
                    Notifications
                  </h2>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-1 shrink-0 font-label-md text-label-md font-semibold text-primary-container transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-full"
                  >
                    Done
                  </button>
                </div>

                {unreadCount > 0 && (
                  <div className="flex justify-end pb-space-md -mt-space-sm">
                    <button
                      type="button"
                      onClick={onMarkAllRead}
                      className="font-label-sm text-label-sm text-outline hover:text-on-surface transition-colors"
                    >
                      Mark all as read
                    </button>
                  </div>
                )}

                {notifications.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-space-sm text-center opacity-80">
                    <IconBellOff size={28} stroke={1.5} className="text-outline" />
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      You&apos;re all caught up.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col gap-space-sm overflow-y-auto">
                    <AnimatePresence initial={false}>
                      {notifications.map((notification, index) => (
                        <NotificationCard
                          key={notification.id}
                          notification={notification}
                          index={index}
                          onMarkRead={onMarkRead}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
