import { supabase } from "./supabase.js";

const LOCAL_SETTINGS_KEY = "streak-app-settings";

export const defaultProfile = {
  displayName: "",
  avatarUrl: "",
  weekStartsOn: "monday",
  reminderEnabled: false,
  showBestStreak: true,
  onboardingCompletedAt: null,
  email: "",
};

function readLocalSettings() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_SETTINGS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function rowToProfile(row, user) {
  return {
    displayName: row?.display_name ?? "",
    avatarUrl: row?.avatar_url ?? "",
    weekStartsOn: row?.week_starts_on === "sunday" ? "sunday" : "monday",
    reminderEnabled: Boolean(row?.reminder_enabled),
    showBestStreak: row?.show_best_streak !== false,
    onboardingCompletedAt: row?.onboarding_completed_at ?? null,
    email: user?.email ?? "",
  };
}

function profileToRow(userId, profile) {
  return {
    id: userId,
    display_name: profile.displayName?.trim() ?? "",
    avatar_url: profile.avatarUrl?.trim() ?? "",
    week_starts_on: profile.weekStartsOn === "sunday" ? "sunday" : "monday",
    reminder_enabled: Boolean(profile.reminderEnabled),
    show_best_streak: profile.showBestStreak !== false,
    onboarding_completed_at: profile.onboardingCompletedAt || null,
    updated_at: new Date().toISOString(),
  };
}

export async function loadProfile(user) {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "display_name, avatar_url, week_starts_on, reminder_enabled, show_best_streak, onboarding_completed_at",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    const profile = rowToProfile(data, user);
    localStorage.removeItem(LOCAL_SETTINGS_KEY);
    return profile;
  }

  const meta = user.user_metadata ?? {};
  const local = readLocalSettings();
  const seeded = {
    displayName: meta.display_name || meta.full_name || "",
    avatarUrl: meta.avatar_url || meta.picture || "",
    weekStartsOn: local.weekStartsOn === "sunday" ? "sunday" : "monday",
    reminderEnabled: Boolean(local.reminderEnabled),
    showBestStreak: local.showBestStreak !== false,
    onboardingCompletedAt: null,
    email: user.email ?? "",
  };

  await saveProfile(user, seeded);
  localStorage.removeItem(LOCAL_SETTINGS_KEY);
  return seeded;
}

export async function saveProfile(user, profile) {
  const { error } = await supabase
    .from("profiles")
    .upsert(profileToRow(user.id, profile), { onConflict: "id" });

  if (error) {
    throw error;
  }

  return {
    ...defaultProfile,
    ...profile,
    email: user.email ?? "",
  };
}

export async function completeOnboarding(user, profile) {
  return saveProfile(user, {
    ...profile,
    onboardingCompletedAt: new Date().toISOString(),
  });
}
