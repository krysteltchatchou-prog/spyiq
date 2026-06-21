import { createClient } from "@/lib/supabase/server";
import { planRatelimit, RATE_LIMITS, type Plan, type RateKind } from "@/lib/redis";

export type RateLimitResult = {
  success: boolean;
  plan: Plan;
  limit: number;
  remaining: number;
};

// Resolves the caller's plan (signed-in → profiles.plan, else "free") and
// enforces the plan-tiered daily limit for the given kind. Keyed per-user when
// authenticated, otherwise by the supplied fallback id (usually the client IP).
// Fails open: if Redis/Upstash is unreachable, requests are allowed through.
export async function checkRateLimit(kind: RateKind, fallbackId: string): Promise<RateLimitResult> {
  let plan: Plan = "free";
  let identity = fallbackId || "anonymous";

  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id;
    if (userId) {
      identity = userId;
      const { data: profile } = await supabase
        .from("profiles").select("plan").eq("id", userId).maybeSingle();
      if (profile?.plan && profile.plan in RATE_LIMITS) plan = profile.plan as Plan;
    }
  } catch {
    /* auth/profile unavailable — treat as anonymous free tier */
  }

  try {
    const { success, limit, remaining } = await planRatelimit(kind, plan).limit(identity);
    return { success, plan, limit, remaining };
  } catch {
    // Limiter backend down — don't block the product on it.
    return { success: true, plan, limit: RATE_LIMITS[plan][kind], remaining: RATE_LIMITS[plan][kind] };
  }
}
