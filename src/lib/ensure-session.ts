import { supabase } from "@/integrations/supabase/client";

/**
 * The app has no login screen. Every visitor gets a persistent anonymous
 * account so their tasks, habits and notes are saved to their device/browser.
 */
export async function ensureSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session.user;

  const { data: anon, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return anon.user;
}
