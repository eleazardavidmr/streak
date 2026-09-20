import { supabase } from "./supabase.js";
import {
  calculateBestStreak,
  calculateCurrentStreak,
  getCheckins,
  getTodayDate,
  hasCheckedInToday,
} from "./checkins.js";
import { getDefaultHabit } from "./habits.js";
import { milestones } from "./achievements.js";

const REMINDER_HOUR = 18;

function rowToNotification(row) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    read: row.read,
    createdAt: row.created_at,
  };
}

export async function getNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, body, read, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(rowToNotification);
}

export async function markNotificationRead(id) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function markAllNotificationsRead() {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("read", false);

  if (error) {
    throw error;
  }
}

function buildCandidates(checkinDates) {
  const stats = {
    loggedDays: checkinDates.length,
    streak: calculateCurrentStreak(checkinDates),
    bestStreak: calculateBestStreak(checkinDates),
  };

  const candidates = milestones
    .filter((milestone) => milestone.unlocked(stats))
    .map((milestone) => ({
      dedupe_key: `achievement:${milestone.id}`,
      type: "achievement",
      title: "Achievement unlocked",
      body: milestone.title,
    }));

  const isEvening = new Date().getHours() >= REMINDER_HOUR;

  if (isEvening && !hasCheckedInToday(checkinDates)) {
    candidates.push({
      dedupe_key: `reminder:${getTodayDate()}`,
      type: "reminder",
      title: "Don't lose your streak",
      body: "You haven't checked in today yet.",
    });
  }

  return candidates;
}

export async function syncNotifications() {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  const defaultHabit = await getDefaultHabit();
  const checkinDates = await getCheckins(defaultHabit.id);
  const candidates = buildCandidates(checkinDates);

  if (candidates.length > 0) {
    const rows = candidates.map((candidate) => ({
      ...candidate,
      user_id: userData.user.id,
    }));

    const { error } = await supabase
      .from("notifications")
      .upsert(rows, { onConflict: "user_id,dedupe_key", ignoreDuplicates: true });

    if (error) {
      throw error;
    }
  }

  return getNotifications();
}
