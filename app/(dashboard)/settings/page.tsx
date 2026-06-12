"use client";
import { useState } from "react";
import { User, CreditCard, Bell, Key, Shield, Save, Eye, EyeOff, Loader2, ExternalLink } from "lucide-react";

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

const TABS = ["Profile", "Billing", "Notifications", "API"] as const;
type Tab = typeof TABS[number];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-[780px]">
      <div className="mb-6">
        <h1 className="font-bold mb-1" style={{ fontSize: 24, color: "#f5f3ee", letterSpacing: "-0.4px" }}>Settings</h1>
        <p className="text-sm" style={{ color: "#8a8a94" }}>Manage your account, billing, and preferences.</p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl"
        style={{ background: "#15151a", border: "1px solid #2a2a33", width: "fit-content" }}>
        {TABS.map((t) => (
          <button key={t}
            onClick={() => setActiveTab(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: activeTab === t ? "#a07840" : "transparent",
              color:      activeTab === t ? "#f5f3ee" : "#8a8a94",
            }}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === "Profile" && (
        <div className="space-y-5">
          <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <div className="flex items-center gap-2 mb-5">
              <User size={15} color="#a07840" />
              <h2 className="font-semibold text-sm" style={{ color: "#f5f3ee" }}>Personal Info</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full Name",     type: "text",     placeholder: "Your name",        defaultValue: "Alex Johnson" },
                { label: "Email Address", type: "email",    placeholder: "you@example.com",  defaultValue: "alex@example.com" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#8a8a94" }}>{field.label}</label>
                  <input
                    type={field.type}
                    defaultValue={field.defaultValue}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm transition-colors"
                    style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#f5f3ee", outline: "none" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = "#2a2a33")}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <div className="flex items-center gap-2 mb-5">
              <Shield size={15} color="#a07840" />
              <h2 className="font-semibold text-sm" style={{ color: "#f5f3ee" }}>Security</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8a8a94" }}>Current Password</label>
                <input type="password" placeholder="••••••••"
                  className="w-full rounded-xl px-3.5 py-2.5 text-sm"
                  style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#f5f3ee", outline: "none" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "#2a2a33")} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#8a8a94" }}>New Password</label>
                <input type="password" placeholder="Min. 8 characters"
                  className="w-full rounded-xl px-3.5 py-2.5 text-sm"
                  style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#f5f3ee", outline: "none" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#a07840")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "#2a2a33")} />
              </div>
            </div>
          </div>

          <button onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: saved ? "#5eb89a" : "#a07840", color: "#f5f3ee" }}>
            <Save size={14} /> {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      )}

      {activeTab === "Billing" && (
        <div className="space-y-5">
          {/* Current plan */}
          <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <div className="flex items-center gap-2 mb-5">
              <CreditCard size={15} color="#a07840" />
              <h2 className="font-semibold text-sm" style={{ color: "#f5f3ee" }}>Current Plan</h2>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl mb-4"
              style={{ background: "rgba(160,120,64,0.10)", border: "1px solid rgba(160,120,64,0.25)" }}>
              <div>
                <p className="font-bold" style={{ color: "#f5f3ee" }}>Free Plan</p>
                <p className="text-xs mt-0.5" style={{ color: "#8a8a94" }}>5 searches/day · 3 store analyses · No AI chat</p>
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
                    background: plan.popular ? "rgba(160,120,64,0.08)" : "#1d1d24",
                    border: `1px solid ${plan.popular ? "#a07840" : "#2a2a33"}`,
                  }}>
                  {plan.popular && (
                    <div className="absolute -top-2.5 left-4">
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{ background: "#a07840", color: "#f5f3ee" }}>
                        POPULAR
                      </span>
                    </div>
                  )}
                  <p className="font-bold text-sm mb-0.5" style={{ color: "#f5f3ee" }}>{plan.name}</p>
                  <p className="text-lg font-bold mb-3" style={{ color: "#a07840" }}>{plan.price}</p>
                  <ul className="space-y-1 mb-4">
                    {plan.features.map((f) => (
                      <li key={f} className="text-xs" style={{ color: "#8a8a94" }}>✓ {f}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => startCheckout(plan.name.toLowerCase(), setCheckoutLoading)}
                    disabled={checkoutLoading}
                    className="w-full py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    style={{
                      background: plan.popular ? "#a07840" : "#2a2a33",
                      color:      plan.popular ? "#f5f3ee" : "#8a8a94",
                    }}>
                    {checkoutLoading && <Loader2 size={11} className="animate-spin" />}
                    Upgrade to {plan.name}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5 flex items-center justify-between" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "#f5f3ee" }}>Billing Portal</p>
              <p className="text-xs" style={{ color: "#8a8a94" }}>Manage payment method, invoices, and cancel subscription.</p>
            </div>
            <button
              onClick={() => openPortal(setPortalLoading)}
              disabled={portalLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94" }}>
              {portalLoading ? <Loader2 size={12} className="animate-spin" /> : <ExternalLink size={12} />}
              Open Portal
            </button>
          </div>
        </div>
      )}

      {activeTab === "Notifications" && (
        <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
          <div className="flex items-center gap-2 mb-5">
            <Bell size={15} color="#a07840" />
            <h2 className="font-semibold text-sm" style={{ color: "#f5f3ee" }}>Notification Preferences</h2>
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
                style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#f5f3ee" }}>{pref.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#5c5c64" }}>{pref.desc}</p>
                </div>
                <div className="w-10 h-5 rounded-full cursor-pointer relative"
                  style={{ background: pref.on ? "#a07840" : "#3a3a42" }}>
                  <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all"
                    style={{ left: pref.on ? "calc(100% - 18px)" : 2, background: "#f5f3ee" }} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all mt-5"
            style={{ background: saved ? "#5eb89a" : "#a07840", color: "#f5f3ee" }}>
            <Save size={14} /> {saved ? "Saved!" : "Save Preferences"}
          </button>
        </div>
      )}

      {activeTab === "API" && (
        <div className="space-y-5">
          <div className="rounded-2xl p-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
            <div className="flex items-center gap-2 mb-2">
              <Key size={15} color="#a07840" />
              <h2 className="font-semibold text-sm" style={{ color: "#f5f3ee" }}>API Access</h2>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ background: "#2a2a33", color: "#5c5c64" }}>
                Agency plan only
              </span>
            </div>
            <p className="text-xs mb-5" style={{ color: "#8a8a94" }}>
              Use the SpyIQ API to programmatically access product data, trends, and AI analysis.
            </p>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#8a8a94" }}>API Key</label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  defaultValue="spyiq_sk_••••••••••••••••••••••••••••••••"
                  readOnly
                  className="w-full rounded-xl px-3.5 py-2.5 pr-10 text-sm"
                  style={{ background: "#1d1d24", border: "1px solid #2a2a33", color: "#8a8a94", outline: "none" }}
                />
                <button
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#5c5c64" }}>
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl" style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "#8a8a94" }}>API limits on Agency plan:</p>
              <ul className="space-y-1">
                {["10,000 product lookups/month", "1,000 store analyses/month", "Unlimited AI credits", "Webhook support"].map((l) => (
                  <li key={l} className="text-xs" style={{ color: "#5c5c64" }}>✓ {l}</li>
                ))}
              </ul>
            </div>
            <button
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold"
              style={{ background: "#2a2a33", color: "#5c5c64", cursor: "not-allowed" }}>
              Upgrade to Agency to unlock API access
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
