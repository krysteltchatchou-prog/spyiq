import { createAdminClient } from "@/lib/supabase/admin";
import { generateAds, type Ad } from "@/lib/ads-data";

// Pulls the latest winning ads from the ads provider and upserts them into the
// `ads` table. Today this sources from generateAds() (a deterministic stand-in
// for an external ads API); swap fetchFromProvider() for a real API call later.

async function fetchFromProvider(): Promise<Ad[]> {
  // TODO: replace with a real ads-intelligence API call.
  // Re-seed each run with the current date so freshness fields advance.
  const today = new Date().toISOString().slice(0, 10);
  return generateAds(today);
}

export async function syncAds(): Promise<{ synced: number; skipped: boolean }> {
  const ads = await fetchFromProvider();
  const admin = createAdminClient();
  if (!admin) return { synced: 0, skipped: true };

  const rows = ads.map((a) => ({ ...a }));
  const { error } = await admin.from("ads").upsert(rows, { onConflict: "ad_id" });
  if (error) return { synced: 0, skipped: true };
  return { synced: rows.length, skipped: false };
}
