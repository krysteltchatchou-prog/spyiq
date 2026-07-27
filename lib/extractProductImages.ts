// Best-effort product-image extractor for the AI Store Builder.
// Given a pasted product URL, pulls the real product photos so the generated
// store carries images (preview + Shopify publish), not just AI copy.
//
// Reliability by source:
//   • Shopify product links  → very reliable (uses the public {url}.json feed)
//   • Other stores (Amazon/AliExpress/etc.) → best-effort via og:image + JSON-LD;
//     some sites block bots, so this may return nothing. It never throws.

const UA = "Mozilla/5.0 (compatible; SpyIQBot/1.0)";
const FETCH_TIMEOUT_MS = 7000;

function isUrl(s: string): boolean {
  return /^https?:\/\//i.test((s || "").trim());
}

function normalize(u: string): string {
  return u.startsWith("//") ? "https:" + u : u;
}

async function fetchWithTimeout(url: string): Promise<Response | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { headers: { "User-Agent": UA }, cache: "no-store", signal: ctrl.signal });
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

// Shopify exposes per-product JSON at {product-url}.json — the cleanest source.
async function fromShopify(url: string): Promise<string[]> {
  const clean = url.split("?")[0].replace(/\/+$/, "");
  if (!/\/products\//i.test(clean)) return [];
  const res = await fetchWithTimeout(`${clean}.json`);
  if (!res || !res.ok) return [];
  try {
    const json = await res.json();
    const imgs = json?.product?.images;
    if (Array.isArray(imgs)) {
      return imgs.map((i: { src?: string }) => i?.src).filter((s): s is string => !!s);
    }
  } catch {
    /* not JSON */
  }
  return [];
}

// Generic fallback: og:image / twitter:image meta tags + JSON-LD "image" fields.
async function fromHtml(url: string): Promise<string[]> {
  const res = await fetchWithTimeout(url);
  if (!res || !res.ok) return [];
  let html = "";
  try {
    html = await res.text();
  } catch {
    return [];
  }
  const out: string[] = [];

  const metaRe = /<meta[^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image)["'][^>]+content=["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = metaRe.exec(html))) out.push(m[1]);

  const ldRe = /"image"\s*:\s*(\[[^\]]*\]|"[^"]+")/gi;
  while ((m = ldRe.exec(html))) {
    const urls = m[1].match(/https?:\/\/[^"'\\\s]+\.(?:jpe?g|png|webp|gif)[^"'\\\s]*/gi);
    if (urls) out.push(...urls);
  }
  return out;
}

export async function extractProductImages(input: string, max = 6): Promise<string[]> {
  if (!isUrl(input)) return [];
  const url = input.trim();

  let imgs = await fromShopify(url);
  if (imgs.length === 0) imgs = await fromHtml(url);

  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of imgs.map(normalize)) {
    if (isUrl(raw) && !seen.has(raw)) {
      seen.add(raw);
      result.push(raw);
      if (result.length >= max) break;
    }
  }
  return result;
}
