export type Plan = "free" | "starter" | "pro" | "agency";

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  plan: Plan;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  ai_credits_used: number;
  ai_credits_limit: number;
  created_at: string;
}
