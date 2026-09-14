import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Achievements from "./pages/Achievements.jsx";
import Settings from "./pages/Settings.jsx";
import Layout from "./layouts/Layout.jsx";
import { supabase } from "./lib/supabase.js";
import { defaultProfile, loadProfile } from "./lib/profile.js";

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
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-label-sm text-outline uppercase tracking-widest motion-scale-in">
        Loading
      </div>
    );
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

  const page =
    activeTab === "achievements" ? (
      <Achievements />
    ) : activeTab === "settings" ? (
      <Settings
        user={session.user}
        profile={profile}
        onProfileChange={setProfile}
        onSignOut={handleSignOut}
      />
    ) : (
      <Dashboard profile={profile} />
    );

  return (
    <Layout
      profile={profile}
      onSignOut={handleSignOut}
      activeTab={activeTab}
      onTabChange={(tab) => navigate(tabPaths[tab])}
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
