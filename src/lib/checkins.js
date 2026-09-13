import { supabase } from "./supabase.js";

function toDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayDate() {
  return toDateString();
}

function addDays(dateString, amount) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + amount);
  return toDateString(date);
}

function normalizeDates(checkinDates) {
  return new Set(
    checkinDates
      .map((checkin) =>
        typeof checkin === "string" ? checkin : checkin.checkin_date,
      )
      .filter(Boolean),
  );
}

export async function getCheckins() {
  const { data, error } = await supabase
    .from("checkins")
    .select("checkin_date")
    .order("checkin_date", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(({ checkin_date: checkinDate }) => checkinDate);
}

export function hasCheckedInToday(checkinDates) {
  return normalizeDates(checkinDates).has(toDateString());
}

export async function markTodayClean() {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  const { error } = await supabase.from("checkins").insert({
    user_id: userData.user.id,
    checkin_date: toDateString(),
  });

  if (error) {
    throw error;
  }
}

export async function undoTodayCheckin() {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  const { error } = await supabase
    .from("checkins")
    .delete()
    .eq("user_id", userData.user.id)
    .eq("checkin_date", toDateString());

  if (error) {
    throw error;
  }
}

export function calculateCurrentStreak(checkinDates) {
  const dates = normalizeDates(checkinDates);
  let currentDate = toDateString();

  if (!dates.has(currentDate)) {
    currentDate = addDays(currentDate, -1);
  }

  if (!dates.has(currentDate)) {
    return 0;
  }

  let streak = 0;
  while (dates.has(currentDate)) {
    streak += 1;
    currentDate = addDays(currentDate, -1);
  }

  return streak;
}

export function calculateBestStreak(checkinDates) {
  const dates = [...normalizeDates(checkinDates)].sort();
  let bestStreak = 0;
  let currentStreak = 0;
  let previousDate = null;

  for (const date of dates) {
    currentStreak =
      previousDate && date === addDays(previousDate, 1) ? currentStreak + 1 : 1;
    bestStreak = Math.max(bestStreak, currentStreak);
    previousDate = date;
  }

  return bestStreak;
}

export function buildHeatmapDistribution(
  checkinDates,
  weeks = 16,
  weekStartsOn = "monday",
) {
  const dates = normalizeDates(checkinDates);
  const totalDays = weeks * 7;
  const weekStart = weekStartsOn === "sunday" ? 0 : 1;
  let firstDate = addDays(toDateString(), -(totalDays - 1));
  const firstDay = new Date(`${firstDate}T00:00:00`).getDay();
  const shift = (firstDay - weekStart + 7) % 7;
  firstDate = addDays(firstDate, -shift);

  return Array.from({ length: totalDays }, (_, index) =>
    dates.has(addDays(firstDate, index)) ? 3 : 0,
  );
}
