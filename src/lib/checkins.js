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

export async function getCheckins(habit = "abstinence") {
  const { data, error } = await supabase
    .from("checkins")
    .select("checkin_date")
    .eq("habit", habit)
    .order("checkin_date", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(({ checkin_date: checkinDate }) => checkinDate);
}

export function hasCheckedInToday(checkinDates) {
  return normalizeDates(checkinDates).has(toDateString());
}

export async function markTodayClean(habit = "abstinence") {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  const { error } = await supabase.from("checkins").insert({
    user_id: userData.user.id,
    habit,
    checkin_date: toDateString(),
  });

  if (error) {
    throw error;
  }
}

export async function undoTodayCheckin(habit = "abstinence") {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  const { error } = await supabase
    .from("checkins")
    .delete()
    .eq("user_id", userData.user.id)
    .eq("habit", habit)
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

function getHeatmapRange(weeks, weekStartsOn) {
  const totalDays = weeks * 7;
  const weekStart = weekStartsOn === "sunday" ? 0 : 1;
  const lastDate = toDateString();
  const lastDay = new Date(`${lastDate}T00:00:00`).getDay();
  const shift = (lastDay - weekStart + 7) % 7;
  const endDate = addDays(lastDate, 6 - shift);
  const firstDate = addDays(endDate, -(totalDays - 1));

  return { firstDate, totalDays };
}

export function buildHeatmapDistribution(
  checkinDates,
  weeks = 16,
  weekStartsOn = "monday",
  relapseDates = [],
) {
  const dates = normalizeDates(checkinDates);
  const relapses = normalizeDates(relapseDates);
  const { firstDate, totalDays } = getHeatmapRange(weeks, weekStartsOn);

  return Array.from({ length: totalDays }, (_, index) => {
    const date = addDays(firstDate, index);

    if (dates.has(date)) {
      return 3;
    }

    if (relapses.has(date)) {
      return 1;
    }

    return 0;
  });
}

export function buildHeatmapMonths(weeks = 16, weekStartsOn = "monday") {
  const { firstDate, totalDays } = getHeatmapRange(weeks, weekStartsOn);
  const months = [];
  let lastMonth = null;

  for (let index = 0; index < totalDays; index += 1) {
    const date = addDays(firstDate, index);
    const month = date.slice(0, 7);

    if (month !== lastMonth) {
      lastMonth = month;
      months.push(
        new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
          month: "short",
        }),
      );
    }
  }

  return months;
}
