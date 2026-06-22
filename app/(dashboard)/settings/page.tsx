"use client";
import { useState, useEffect } from "react";
import { User, CreditCard, Bell, Key, Shield, Save, Eye, EyeOff, Loader2, ExternalLink, Store, Check, AlertCircle } from "lucide-react";

async function startCheckout(plan: string, setLoading: (v: boolean) => void) {
  setLoading(true);
  try {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const { url, error } = await res.json();
    if (error) { alert(error); setLoading(false); return; }
    window.location.href = url;
  } catch {
    alert("Failed to start checkout. Please try again.");
    setLoading(false);
  }
}

async function openPortal(setLoading: (v: boolean) => void) {
  setLoading(true);
  try {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const { url, error } = await res.json();
    if (error) { alert(error); setLoading(false); return; }
    window.location.href = url;
  } catch {
    alert("Could not open billing portal.");
    setLoading(false);
  }
}

const TABS = ["Profile", "Billing", "Integrations", "Notifications", "API"] as const;
type Tab = typeof TABS[number];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  // Shopify connection state
  const [shopInput, setShopInput] = useState("");
  const [shopify, setShopify] = useState<{ connected: boolean; shop: string | null; configured: boolean } | null>(null);
  const [shopifyNotice, setShopifyNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  // Token-based connect (custom app)
  const [tokenShop, setTokenShop] = useState("");
  const [tokenValue, setTokenValue] = useState("");
  const [tokenConnecting, setTokenConnecting] = useState(false);
  const [showTokenForm, setShowTokenForm] = useState(false);

  useEffect(() => {
    fetch("/api/shopify/status")
      .then((r) => r.json())
      .then(setShopify)
      .catch(() => setShopify({ connected: false, shop: null, configured: false }));

    // Surface the result of an OAuth round-trip (?shopify=connected|error)
    const params = new URLSearchParams(window.location.search);
    const s = params.get("shopify");
    if (s === "connected") { setActiveTab("Integrations"); setShopifyNotice({ kind: "ok", text: "Shopify store connected successfully." }); }
    else if (s === "error") { setActiveTab("Integrations"); setShopifyNotice({ kind: "error", text: `Could not connect Shopify (${params.get("reason") || "unknown error"}).` }); }
  }, []);

  function connectShopify() {
    const shop = shopInput.trim();
    if (!shop) return;
    window.location.href = `/api/shopify/install?shop=${encodeURIComponent(shop)}`;
  }

  async function connectWithToken() {
    if (!tokenShop.trim() || !tokenValue.trim() || tokenConnecting) return;
    setTokenConnecting(true);
    setShopifyNotice(null);
    try {
      const res = await fetch("/api/shopify/connect-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop: tokenShop.trim(), token: tokenValue.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setShopify({ connected: true, shop: data.shop, configured: true });
        setShopifyNotice({ kind: "ok", text: "Shopify store connected with full theme access." });
        setShowTokenForm(false);
        setTokenValue("");
      } else {
        setShopifyNotice({ kind: "error", text: data.error || "Could not connect with that token." });
      }
    } catch {
      setShopifyNotice({ kind: "error", text: "Could not connect. Please try again." });
    } finally {
      setTokenConnecting(false);
    }
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-[780px]">
      <div className="mb-6">
        <h1 className="font-bold mb-1" style={{ fontSize: 24, color: "#23221f", letterSpacing: "-0.4px" }}>Settings</h1>
        <p className="text-sm" style={{ color: "#4d4b44" }}>Manage your account, billing, and preferences.</p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl"
        style={{ background: "#ffffff", border: "1px solid #e4e1d8", width: "fit-content" }}>
        {TABS.map((t) => (
          <button key={t}
            onClick={() => setActiveTab(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: activeTab === t ? "#a07840" : "transparent",
              color:      activeTab === t ? "#fdfbf6" : "#4d4b44",
            }}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === "Profile" && (
        <div className="space-y-5">
          <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
            <div className="flex items-center gap-2 mb-5">
              <User size={15} color="#a07840" />
              <h2 className="font-semibold text-sm" style={{ color: "#23221f" }}>Personal Info</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full Name",     type: "text",     placeholder: "Your name",        defaultValue: "Alex Johnson" },
                { label: "Email Address", type: "email",    placeholder: "you@example.com",  defaultValue: "alex@example.com" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#4d4b44" }}>{field.label}</label>
                  <input
                    type={field.type}
                    defaultValue={field.defaultValue}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm transition-colors"
                    style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#23221f", outline: "none" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = "#e4e1d8")}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
            <div className="flex items-center gap-2 mb-5">
              <Shield size={15} color="#a07840" />
              <h2 className="font-semibold text-sm" style={{ color: "#23221f" }}>Security</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#4d4b44" }}>Current Password</label>
                <input type="password" placeholder="••••••••"
                  className="w-full rounded-xl px-3.5 py-2.5 text-sm"
                  style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#23221f", outline: "none" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "#e4e1d8")} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#4d4b44" }}>New Password</label>
                <input type="password" placeholder="Min. 8 characters"
                  className="w-full rounded-xl px-3.5 py-2.5 text-sm"
                  style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#23221f", outline: "none" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "#e4e1d8")} />
              </div>
            </div>
          </div>

          <button onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: saved ? "#3e8f72" : "#a07840", color: "#23221f" }}>
            <Save size={14} /> {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      )}

      {activeTab === "Billing" && (
        <div className="space-y-5">
          {/* Current plan */}
          <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
            <div className="flex items-center gap-2 mb-5">
              <CreditCard size={15} color="#a07840" />
              <h2 className="font-semibold text-sm" style={{ color: "#23221f" }}>Current Plan</h2>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl mb-4"
              style={{ background: "rgba(160,120,64,0.10)", border: "1px solid rgba(160,120,64,0.25)" }}>
              <div>
                <p className="font-bold" style={{ color: "#23221f" }}>Free Plan</p>
                <p className="text-xs mt-0.5" style={{ color: "#4d4b44" }}>5 searches/day · 3 store analyses · No AI chat</p>
              </div>
              <span className="text-sm font-bold" style={{ color: "#a07840" }}>$0/mo</span>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: "Starter", price: "$29/mo", features: ["50 searches/day", "20 store analyses", "100 AI credits/mo"] },
                { name: "Pro",     price: "$79/mo", features: ["Unlimited searches", "100 stores/mo", "500 AI credits", "Alerts"], popular: true },
                { name: "Agency",  price: "$199/mo", features: ["Everything unlimited", "5 team seats", "API access", "White-label"] },
              ].map((plan) => (
                <div key={plan.name}
                  className="rounded-xl p-4 relative"
                  style={{
                    background: plan.popular ? "rgba(160,120,64,0.08)" : "#f3f1ea",
                    border: `1px solid ${plan.popular ? "#a07840" : "#e4e1d8"}`,
                  }}>
                  {plan.popular && (
                    <div className="absolute -top-2.5 left-4">
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{ background: "#a07840", color: "#fdfbf6" }}>
                        POPULAR
                      </span>
                    </div>
                  )}
                  <p className="font-bold text-sm mb-0.5" style={{ color: "#23221f" }}>{plan.name}</p>
                  <p className="text-lg font-bold mb-3" style={{ color: "#a07840" }}>{plan.price}</p>
                  <ul className="space-y-1 mb-4">
                    {plan.features.map((f) => (
                      <li key={f} className="text-xs" style={{ color: "#4d4b44" }}>✓ {f}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => startCheckout(plan.name.toLowerCase(), setCheckoutLoading)}
                    disabled={checkoutLoading}
                    className="w-full py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    style={{
                      background: plan.popular ? "#a07840" : "#e4e1d8",
                      color:      plan.popular ? "#fdfbf6" : "#4d4b44",
                    }}>
                    {checkoutLoading && <Loader2 size={11} className="animate-spin" />}
                    Upgrade to {plan.name}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5 flex items-center justify-between" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "#23221f" }}>Billing Portal</p>
              <p className="text-xs" style={{ color: "#4d4b44" }}>Manage payment method, invoices, and cancel subscription.</p>
            </div>
            <button
              onClick={() => openPortal(setPortalLoading)}
              disabled={portalLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}>
              {portalLoading ? <Loader2 size={12} className="animate-spin" /> : <ExternalLink size={12} />}
              Open Portal
            </button>
          </div>
        </div>
      )}

      {activeTab === "Integrations" && (
        <div className="space-y-5">
          <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
            <div className="flex items-center gap-2 mb-1">
              <Store size={15} color="#a07840" />
              <h2 className="font-semibold text-sm" style={{ color: "#23221f" }}>Shopify</h2>
            </div>
            <p className="text-xs mb-5" style={{ color: "#4d4b44" }}>
              Connect your Shopify store so the AI Store Builder can push generated products straight into it.
            </p>

            {shopifyNotice && (
              <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-4 text-sm"
                style={{
                  background: shopifyNotice.kind === "ok" ? "rgba(94,184,154,0.10)" : "rgba(212,104,95,0.10)",
                  border: `1px solid ${shopifyNotice.kind === "ok" ? "rgba(94,184,154,0.3)" : "rgba(212,104,95,0.3)"}`,
                  color: shopifyNotice.kind === "ok" ? "#3e8f72" : "#d4685f",
                }}>
                {shopifyNotice.kind === "ok" ? <Check size={14} /> : <AlertCircle size={14} />} {shopifyNotice.text}
              </div>
            )}

            {shopify === null ? (
              <div className="flex items-center gap-2 text-sm" style={{ color: "#5d5b54" }}>
                <Loader2 size={14} className="animate-spin" /> Checking connection…
              </div>
            ) : shopify.connected ? (
              <div className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: "rgba(94,184,154,0.08)", border: "1px solid rgba(94,184,154,0.25)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "rgba(94,184,154,0.15)" }}>
                    <Check size={16} color="#3e8f72" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#23221f" }}>Connected</p>
                    <p className="text-xs" style={{ color: "#4d4b44" }}>{shopify.shop}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShopInput("")}
                  className="text-xs font-semibold hover:text-[#8a6530] transition-colors"
                  style={{ color: "#a07840" }}>
                  Reconnect
                </button>
              </div>
            ) : !shopify.configured ? (
              <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
                style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}>
                <AlertCircle size={14} color="#c08a2a" /> Shopify integration isn&apos;t configured on the server yet (API credentials missing).
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={shopInput}
                    onChange={(e) => setShopInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && connectShopify()}
                    placeholder="your-store.myshopify.com"
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm"
                    style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#23221f", outline: "none" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = "#e4e1d8")}
                  />
                </div>
                <button
                  onClick={connectShopify}
                  disabled={!shopInput.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: shopInput.trim() ? "#a07840" : "#e4e1d8",
                    color:      shopInput.trim() ? "#23221f" : "#5d5b54",
                    cursor:     shopInput.trim() ? "pointer" : "not-allowed",
                  }}>
                  <Store size={14} /> Connect
                </button>
              </div>
            )}

            {/* Token-based connect — needed for full-store (theme) publishing */}
            <div className="mt-5 pt-5" style={{ borderTop: "1px solid #e4e1d8" }}>
              <button
                onClick={() => setShowTokenForm((v) => !v)}
                className="text-xs font-semibold hover:text-[#8a6530] transition-colors"
                style={{ color: "#a07840" }}>
                {showTokenForm ? "▾" : "▸"} Connect with Admin API token (enables full-store publishing)
              </button>
              {showTokenForm && (
                <div className="mt-3 space-y-3">
                  <p className="text-xs" style={{ color: "#4d4b44", lineHeight: 1.6 }}>
                    In your Shopify admin: <strong style={{ color: "#8a6530" }}>Settings → Apps and sales channels → Develop apps → Create an app</strong>.
                    Under <strong style={{ color: "#8a6530" }}>Admin API scopes</strong> tick <code style={{ color: "#23221f" }}>read_products, write_products, read_themes, write_themes</code>, install it, then copy the <strong style={{ color: "#8a6530" }}>Admin API access token</strong> (starts with <code style={{ color: "#23221f" }}>shpat_</code>).
                  </p>
                  <input
                    type="text"
                    value={tokenShop}
                    onChange={(e) => setTokenShop(e.target.value)}
                    placeholder="your-store.myshopify.com"
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm"
                    style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#23221f", outline: "none" }}
                  />
                  <input
                    type="password"
                    value={tokenValue}
                    onChange={(e) => setTokenValue(e.target.value)}
                    placeholder="shpat_… (Admin API access token)"
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm"
                    style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#23221f", outline: "none" }}
                  />
                  <button
                    onClick={connectWithToken}
                    disabled={!tokenShop.trim() || !tokenValue.trim() || tokenConnecting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: tokenShop.trim() && tokenValue.trim() ? "#a07840" : "#e4e1d8",
                      color:      tokenShop.trim() && tokenValue.trim() ? "#23221f" : "#5d5b54",
                      cursor:     tokenShop.trim() && tokenValue.trim() && !tokenConnecting ? "pointer" : "not-allowed",
                    }}>
                    {tokenConnecting ? <Loader2 size={14} className="animate-spin" /> : <Store size={14} />}
                    {tokenConnecting ? "Connecting…" : "Connect with token"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Notifications" && (
        <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
          <div className="flex items-center gap-2 mb-5">
            <Bell size={15} color="#a07840" />
            <h2 className="font-semibold text-sm" style={{ color: "#23221f" }}>Notification Preferences</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Email alerts",                    desc: "Receive alert emails",                  on: true  },
              { label: "Trending product notifications",  desc: "New products spike in your niches",    on: true  },
              { label: "Competitor activity",             desc: "Tracked stores add products or ads",   on: false },
              { label: "Weekly digest",                   desc: "Sunday summary of top opportunities",  on: true  },
              { label: "Niche spike alerts",              desc: "Volume up 50%+ in 48 hours",           on: true  },
              { label: "AI credit warnings",              desc: "When 80% of credits are used",         on: true  },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: "#f3f1ea", border: "1px solid #e4e1d8" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#23221f" }}>{pref.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#5d5b54" }}>{pref.desc}</p>
                </div>
                <div className="w-10 h-5 rounded-full cursor-pointer relative"
                  style={{ background: pref.on ? "#a07840" : "#d4cfc2" }}>
                  <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all"
                    style={{ left: pref.on ? "calc(100% - 18px)" : 2, background: "#23221f" }} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all mt-5"
            style={{ background: saved ? "#3e8f72" : "#a07840", color: "#23221f" }}>
            <Save size={14} /> {saved ? "Saved!" : "Save Preferences"}
          </button>
        </div>
      )}

      {activeTab === "API" && (
        <div className="space-y-5">
          <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
            <div className="flex items-center gap-2 mb-2">
              <Key size={15} color="#a07840" />
              <h2 className="font-semibold text-sm" style={{ color: "#23221f" }}>API Access</h2>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ background: "#e4e1d8", color: "#5d5b54" }}>
                Agency plan only
              </span>
            </div>
            <p className="text-xs mb-5" style={{ color: "#4d4b44" }}>
              Use the SpyIQ API to programmatically access product data, trends, and AI analysis.
            </p>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#4d4b44" }}>API Key</label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  defaultValue="spyiq_sk_••••••••••••••••••••••••••••••••"
                  readOnly
                  className="w-full rounded-xl px-3.5 py-2.5 pr-10 text-sm"
                  style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44", outline: "none" }}
                />
                <button
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#5d5b54" }}>
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl" style={{ background: "#f3f1ea", border: "1px solid #e4e1d8" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "#4d4b44" }}>API limits on Agency plan:</p>
              <ul className="space-y-1">
                {["10,000 product lookups/month", "1,000 store analyses/month", "Unlimited AI credits", "Webhook support"].map((l) => (
                  <li key={l} className="text-xs" style={{ color: "#5d5b54" }}>✓ {l}</li>
                ))}
              </ul>
            </div>
            <button
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold"
              style={{ background: "#e4e1d8", color: "#5d5b54", cursor: "not-allowed" }}>
              Upgrade to Agency to unlock API access
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
