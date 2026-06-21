import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only client using the service-role key. Bypasses RLS — never import
// this into client components. Used for writing scan results (store-spy, sync jobs).
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
