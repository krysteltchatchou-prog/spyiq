// Shopify app detection — fingerprints matched against a store's homepage HTML.
// Each fingerprint lists substrings (script srcs, asset domains, global vars,
// DOM markers) that, when present in the page source, indicate the app is installed.

export interface AppFingerprint {
  name: string;
  category:
    | "Reviews" | "Upsell" | "Email" | "Analytics" | "Fulfilment"
    | "Loyalty" | "Trust" | "Conversion" | "Support" | "Marketing"
    | "Subscriptions" | "Search" | "Page Builder";
  emoji: string;
  signatures: string[];
}

export const APP_FINGERPRINTS: AppFingerprint[] = [
  // ── Reviews ──
  { name: "Judge.me", category: "Reviews", emoji: "⭐", signatures: ["judge.me", "judgeme", "jdgm-"] },
  { name: "Loox", category: "Reviews", emoji: "📸", signatures: ["loox.io", "looxReviews", "loox-"] },
  { name: "Yotpo", category: "Reviews", emoji: "⭐", signatures: ["yotpo.com", "yotpo", "staticw2.yotpo"] },
  { name: "Stamped.io", category: "Reviews", emoji: "⭐", signatures: ["stamped.io", "stamped-"] },
  { name: "Okendo", category: "Reviews", emoji: "⭐", signatures: ["okendo.io", "okendo"] },
  { name: "Fera", category: "Reviews", emoji: "⭐", signatures: ["fera.ai", "fera-"] },
  { name: "Ali Reviews", category: "Reviews", emoji: "⭐", signatures: ["alireviews", "ali-reviews"] },
  { name: "Rivyo", category: "Reviews", emoji: "⭐", signatures: ["rivyo", "thimatic"] },

  // ── Upsell / Cross-sell ──
  { name: "ReConvert", category: "Upsell", emoji: "🔁", signatures: ["reconvert", "reconvert.io"] },
  { name: "Zipify OCU", category: "Upsell", emoji: "🛒", signatures: ["zipify", "ocu.zipify"] },
  { name: "Bold Upsell", category: "Upsell", emoji: "🛒", signatures: ["bold-upsell", "boldapps", "shappify"] },
  { name: "Honeycomb Upsell", category: "Upsell", emoji: "🍯", signatures: ["conversionbear", "honeycomb"] },
  { name: "CartHook", category: "Upsell", emoji: "🪝", signatures: ["carthook"] },
  { name: "Frequently Bought Together", category: "Upsell", emoji: "🛒", signatures: ["fbtbundle", "frequently-bought"] },
  { name: "Rebuy", category: "Upsell", emoji: "🔁", signatures: ["rebuyengine", "rebuy.com"] },

  // ── Email / SMS ──
  { name: "Klaviyo", category: "Email", emoji: "✉️", signatures: ["klaviyo", "static.klaviyo", "klaviyo.js"] },
  { name: "Omnisend", category: "Email", emoji: "✉️", signatures: ["omnisend", "omnisrc"] },
  { name: "Mailchimp", category: "Email", emoji: "✉️", signatures: ["mailchimp", "chimpstatic", "mc.us"] },
  { name: "Privy", category: "Email", emoji: "✉️", signatures: ["privy.com", "privy-"] },
  { name: "Postscript", category: "Email", emoji: "💬", signatures: ["postscript.io", "postscript"] },
  { name: "Attentive", category: "Email", emoji: "💬", signatures: ["attentivemobile", "attentive.com"] },
  { name: "SMSBump", category: "Email", emoji: "💬", signatures: ["smsbump"] },

  // ── Analytics / Tracking ──
  { name: "Google Analytics", category: "Analytics", emoji: "📊", signatures: ["googletagmanager.com/gtag", "google-analytics.com", "gtag("] },
  { name: "Google Tag Manager", category: "Analytics", emoji: "📊", signatures: ["googletagmanager.com/gtm"] },
  { name: "Meta Pixel", category: "Analytics", emoji: "📘", signatures: ["connect.facebook.net", "fbq(", "facebook-pixel"] },
  { name: "TikTok Pixel", category: "Analytics", emoji: "🎵", signatures: ["analytics.tiktok.com", "ttq.", "tiktok-pixel"] },
  { name: "Pinterest Tag", category: "Analytics", emoji: "📌", signatures: ["pintrk", "pinimg.com/ct"] },
  { name: "Snapchat Pixel", category: "Analytics", emoji: "👻", signatures: ["sc-static.net", "snaptr("] },
  { name: "Hotjar", category: "Analytics", emoji: "🔥", signatures: ["hotjar.com", "hjid"] },
  { name: "Lucky Orange", category: "Analytics", emoji: "🍊", signatures: ["luckyorange"] },
  { name: "Triple Whale", category: "Analytics", emoji: "🐳", signatures: ["triplewhale", "triple-whale"] },
  { name: "Microsoft Clarity", category: "Analytics", emoji: "📊", signatures: ["clarity.ms"] },

  // ── Fulfilment ──
  { name: "DSers", category: "Fulfilment", emoji: "📦", signatures: ["dsers"] },
  { name: "Oberlo", category: "Fulfilment", emoji: "📦", signatures: ["oberlo"] },
  { name: "CJ Dropshipping", category: "Fulfilment", emoji: "📦", signatures: ["cjdropshipping", "cjapp"] },
  { name: "Zendrop", category: "Fulfilment", emoji: "📦", signatures: ["zendrop"] },
  { name: "AfterShip", category: "Fulfilment", emoji: "🚚", signatures: ["aftership", "aftership.com"] },
  { name: "Track123", category: "Fulfilment", emoji: "🚚", signatures: ["track123"] },
  { name: "Parcel Panel", category: "Fulfilment", emoji: "🚚", signatures: ["parcelpanel"] },

  // ── Loyalty ──
  { name: "Smile.io", category: "Loyalty", emoji: "😊", signatures: ["smile.io", "smileio"] },
  { name: "LoyaltyLion", category: "Loyalty", emoji: "🦁", signatures: ["loyaltylion"] },
  { name: "Growave", category: "Loyalty", emoji: "🌊", signatures: ["growave", "ssw.io"] },
  { name: "Rivo", category: "Loyalty", emoji: "🎁", signatures: ["rivo.io", "rivo-"] },

  // ── Trust / Social proof ──
  { name: "TrustBadge / Trustpilot", category: "Trust", emoji: "🛡️", signatures: ["trustpilot.com", "trustbox"] },
  { name: "Fomo", category: "Trust", emoji: "🔔", signatures: ["fomo.com", "notify.fomo"] },
  { name: "Sales Pop / Vitals", category: "Trust", emoji: "🔔", signatures: ["vitals.co", "vitals-", "salespop"] },
  { name: "Nudgify", category: "Trust", emoji: "🔔", signatures: ["nudgify"] },
  { name: "ProveSource", category: "Trust", emoji: "🔔", signatures: ["provesrc", "provesource"] },

  // ── Conversion / CRO ──
  { name: "Privy Popups", category: "Conversion", emoji: "🎯", signatures: ["privy-popup"] },
  { name: "Wheelio", category: "Conversion", emoji: "🎡", signatures: ["wheelio"] },
  { name: "Optimonk", category: "Conversion", emoji: "🎯", signatures: ["optimonk"] },
  { name: "Justuno", category: "Conversion", emoji: "🎯", signatures: ["justuno"] },

  // ── Support ──
  { name: "Gorgias", category: "Support", emoji: "💬", signatures: ["gorgias", "gorgias.chat"] },
  { name: "Tidio", category: "Support", emoji: "💬", signatures: ["tidio", "tidiochat"] },
  { name: "Zendesk", category: "Support", emoji: "💬", signatures: ["zendesk", "zdassets"] },
  { name: "Intercom", category: "Support", emoji: "💬", signatures: ["intercom", "intercomcdn"] },
  { name: "Re:amaze", category: "Support", emoji: "💬", signatures: ["reamaze"] },

  // ── Subscriptions ──
  { name: "Recharge", category: "Subscriptions", emoji: "🔄", signatures: ["rechargecdn", "rechargepayments"] },
  { name: "Bold Subscriptions", category: "Subscriptions", emoji: "🔄", signatures: ["bold-subscriptions"] },

  // ── Search ──
  { name: "Searchanise", category: "Search", emoji: "🔍", signatures: ["searchanise"] },
  { name: "Boost Commerce", category: "Search", emoji: "🔍", signatures: ["boostcommerce", "bc-sf-filter"] },
  { name: "Algolia", category: "Search", emoji: "🔍", signatures: ["algolia", "algolianet"] },

  // ── Page builders ──
  { name: "PageFly", category: "Page Builder", emoji: "🧱", signatures: ["pagefly"] },
  { name: "GemPages", category: "Page Builder", emoji: "🧱", signatures: ["gempages", "gem-"] },
  { name: "Shogun", category: "Page Builder", emoji: "🧱", signatures: ["getshogun", "shogun"] },
];

export interface DetectedApp {
  name: string;
  category: AppFingerprint["category"];
  emoji: string;
}

/** Scan raw HTML (lowercased internally) and return the apps detected. */
export function detectApps(html: string): DetectedApp[] {
  const haystack = html.toLowerCase();
  const found: DetectedApp[] = [];
  for (const fp of APP_FINGERPRINTS) {
    if (fp.signatures.some((sig) => haystack.includes(sig.toLowerCase()))) {
      found.push({ name: fp.name, category: fp.category, emoji: fp.emoji });
    }
  }
  return found;
}
