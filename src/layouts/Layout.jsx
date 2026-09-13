import Navbar from "../components/ui/Navbar.jsx";
import BottomNav from "../components/ui/BottomNav.jsx";

export default function Layout({
  children,
  profile,
  onSignOut,
  activeTab,
  onTabChange,
}) {
  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <Navbar profile={profile} onSignOut={onSignOut} />
      {children}
      <BottomNav active={activeTab} onChange={onTabChange} />
    </div>
  );
}
