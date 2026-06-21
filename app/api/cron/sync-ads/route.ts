import { NextResponse } from "next/server";
import { syncAds } from "@/lib/syncAds";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Triggered by Vercel Cron every 6 hours (see vercel.json).
// Vercel sends `Authorization: Bearer ${CRON_SECRET}` when CRON_SECRET is set.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await syncAds();
  return NextResponse.json({ ok: true, ...result, ran_at: new Date().toISOString() });
}
