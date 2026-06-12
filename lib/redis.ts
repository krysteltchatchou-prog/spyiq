import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const RATE_LIMITS = {
  free:    { searches: 5,   stores: 3,   ai: 0    },
  starter: { searches: 50,  stores: 20,  ai: 100  },
  pro:     { searches: 999, stores: 100, ai: 500  },
  agency:  { searches: 999, stores: 999, ai: 9999 },
} as const;

// Sliding-window rate limiters per endpoint type
export const searchRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "1 d"),
  analytics: true,
  prefix: "rl:search",
});

export const aiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 d"),
  analytics: true,
  prefix: "rl:ai",
});

export const storeRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 d"),
  analytics: true,
  prefix: "rl:store",
});

// Cache helpers — TTL in seconds
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const val = await redis.get<T>(key);
    return val ?? null;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: unknown, ttl: number) {
  try {
    await redis.set(key, value, { ex: ttl });
  } catch {}
}
