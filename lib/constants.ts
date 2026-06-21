export const PLANS = {
  free:    { searches: 5,   stores: 3,   ai: 0,    stores_mo: 1  },
  starter: { searches: 50,  stores: 20,  ai: 100,  stores_mo: 5  },
  pro:     { searches: 999, stores: 100, ai: 500,  stores_mo: 20 },
  agency:  { searches: 999, stores: 999, ai: 9999, stores_mo: 999 },
} as const;

export const NICHES = [
  "Fashion", "Electronics", "Home & Garden", "Beauty", "Sports",
  "Pets", "Kids", "Health & Wellness", "Automotive", "Food & Beverage",
];

export const AD_PLATFORMS = ["Facebook", "TikTok", "Instagram", "YouTube", "Google"] as const;
