import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/ui/Navbar.jsx";
import BottomNav from "../components/ui/BottomNav.jsx";
import Sidebar from "../components/ui/Sidebar.jsx";
import { fadeRise, slideInRight, springSoft } from "../lib/motion.js";

export default function Layout({
  children,
  profile,
  onSignOut,
  onNavigate,
  activeTab,
  pageKey,
  pageVariant = "tab",
  onTabChange,
  showBottomNav = true,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
}) {
  const variants = pageVariant === "push" ? slideInRight : fadeRise;

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <Navbar
        profile={profile}
        onSignOut={onSignOut}
        onNavigate={onNavigate}
        notifications={notifications}
        onMarkNotificationRead={onMarkNotificationRead}
        onMarkAllNotificationsRead={onMarkAllNotificationsRead}
      />
      {showBottomNav && (
        <Sidebar
          profile={profile}
          onSignOut={onSignOut}
          onNavigate={onNavigate}
          active={activeTab}
          onChange={onTabChange}
          notifications={notifications}
          onMarkNotificationRead={onMarkNotificationRead}
          onMarkAllNotificationsRead={onMarkAllNotificationsRead}
        />
      )}
      <div className={showBottomNav ? "md:pl-64" : undefined}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pageKey ?? activeTab}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit={pageVariant === "push" ? "exit" : "hidden"}
            transition={springSoft}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
      {showBottomNav && <BottomNav active={activeTab} onChange={onTabChange} />}
    </div>
  );
}
