import { useCallback, useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Achievements from "./pages/Achievements.jsx";
import Settings from "./pages/Settings.jsx";
import ResetPage from "./pages/ResetPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";
import Layout from "./layouts/Layout.jsx";
import LoadingView from "./components/ui/LoadingView.jsx";
import { supabase } from "./lib/supabase.js";
import { defaultProfile, loadProfile } from "./lib/profile.js";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  syncNotifications,
} from "./lib/notifications.js";

const tabPaths = {
  dashboard: "/",
  achievements: "/achievements",
  settings: "/settings",
};

function pathToTab(pathname) {
  if (pathname.startsWith("/achievements")) {
    return "achievements";
  }
  if (pathname.startsWith("/settings")) {
    return "settings";
  }
  return "dashboard";
}

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [location, setLocation] = useState(window.location.pathname);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (mounted) {
        setSession(currentSession);
        if (!currentSession) {
          setLoading(false);
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if (!currentSession) {
        setProfile(defaultProfile);
        setProfileError("");
        setNotifications([]);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshNotifications = useCallback(() => {
    return syncNotifications()
      .then(setNotifications)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!session?.user) {
      return undefined;
    }

    let mounted = true;

    syncNotifications()
      .then((list) => {
        if (mounted) {
          setNotifications(list);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [session?.user?.id]);

  const handleMarkNotificationRead = (id) => {
    setNotifications((list) =>
      list.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
    markNotificationRead(id).catch(() => {
      getNotifications().then(setNotifications).catch(() => {});
    });
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((list) => list.map((item) => ({ ...item, read: true })));
    markAllNotificationsRead().catch(() => {
      getNotifications().then(setNotifications).catch(() => {});
    });
  };

  useEffect(() => {
    if (!session?.user) {
      return undefined;
    }

    let mounted = true;
    setLoading(true);
    setProfileError("");

    loadProfile(session.user)
      .then((nextProfile) => {
        if (mounted) {
          setProfile(nextProfile);
        }
      })
      .catch(() => {
        if (mounted) {
          setProfileError("Unable to load your profile.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [session?.user?.id]);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setLocation(path);
  };

  useEffect(() => {
    const handlePopState = () => setLocation(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return <LoadingView />;
  }

  if (!session) {
    return (
      <AuthPage
        mode={location === "/register" ? "register" : "login"}
        onNavigate={navigate}
      />
    );
  }

  const activeTab = pathToTab(location);
  const isResetPage = location.startsWith("/reset");
  const isSupportPage = location.startsWith("/support");

  const page = isResetPage ? (
    <ResetPage onNavigate={navigate} />
  ) : isSupportPage ? (
    <SupportPage onNavigate={navigate} />
  ) : activeTab === "achievements" ? (
    <Achievements />
  ) : activeTab === "settings" ? (
    <Settings
      user={session.user}
      profile={profile}
      onProfileChange={setProfile}
      onSignOut={handleSignOut}
    />
  ) : (
    <Dashboard
      profile={profile}
      onNavigate={navigate}
      onActivityChange={refreshNotifications}
    />
  );

  return (
    <Layout
      profile={profile}
      onSignOut={handleSignOut}
      onNavigate={navigate}
      activeTab={activeTab}
      pageKey={location}
      pageVariant={isResetPage || isSupportPage ? "push" : "tab"}
      notifications={notifications}
      onMarkNotificationRead={handleMarkNotificationRead}
      onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
      onTabChange={(tab) => navigate(tabPaths[tab])}
      showBottomNav={!isResetPage && !isSupportPage}
    >
      {profileError ? (
        <main className="px-margin pt-nav text-body-md text-error">
          {profileError}
        </main>
      ) : (
        page
      )}
    </Layout>
  );
}

export default App;
