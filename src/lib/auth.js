import { supabase } from "./supabase.js";

export function authenticate({ email, password, isRegister }) {
  return isRegister
    ? supabase.auth.signUp({ email, password })
    : supabase.auth.signInWithPassword({ email, password });
}
