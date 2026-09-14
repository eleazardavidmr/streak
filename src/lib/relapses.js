import { supabase } from "./supabase.js";
import { getTodayDate } from "./checkins.js";

export async function getRelapses() {
  const { data, error } = await supabase
    .from("relapses")
    .select("relapse_date")
    .order("relapse_date", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(({ relapse_date: relapseDate }) => relapseDate);
}

export async function reportRelapse({
  actionTaken = null,
  timeOfDay = null,
  note = null,
} = {}) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  const { error } = await supabase.from("relapses").insert({
    user_id: userData.user.id,
    relapse_date: getTodayDate(),
    action_taken: actionTaken,
    time_of_day: timeOfDay,
    note,
  });

  if (error) {
    throw error;
  }
}
