import { supabase } from "./supabase.js";

export const MAX_HABITS = 6;

export async function getHabits() {
  const { data, error } = await supabase
    .from("habits")
    .select("id, title, icon_name, accent, sort_order, created_at")
    .is("archived_at", null)
    .eq("is_default", false)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function getDefaultHabit() {
  const { data, error } = await supabase
    .from("habits")
    .select("id, title, icon_name, accent, created_at")
    .eq("is_default", true)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createHabit({ title, iconName, accent, sortOrder }) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  const { data, error } = await supabase
    .from("habits")
    .insert({
      user_id: userData.user.id,
      title,
      icon_name: iconName,
      accent,
      sort_order: sortOrder,
    })
    .select("id, title, icon_name, accent, sort_order, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function renameHabit(habitId, title) {
  const { error } = await supabase
    .from("habits")
    .update({ title })
    .eq("id", habitId);

  if (error) {
    throw error;
  }
}

export async function archiveHabit(habitId) {
  const { error } = await supabase
    .from("habits")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", habitId);

  if (error) {
    throw error;
  }
}

export async function getArchivedHabits() {
  const { data, error } = await supabase
    .from("habits")
    .select("id, title, icon_name, accent, sort_order, archived_at, created_at")
    .not("archived_at", "is", null)
    .order("archived_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function unarchiveHabit(habitId) {
  const { error } = await supabase
    .from("habits")
    .update({ archived_at: null })
    .eq("id", habitId);

  if (error) {
    throw error;
  }
}
