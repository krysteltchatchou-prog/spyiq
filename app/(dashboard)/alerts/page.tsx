"use client";
import { useState } from "react";
import { Bell, Check, X, Settings } from "lucide-react";

interface Alert {
  id: string;
  type: "opportunity" | "warning" | "urgent" | "info";
  icon: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  action?: { label: string; href: string };
}

const MOCK_ALERTS: Alert[] = [
  { id:"al1", type:"opportunity", icon:"🚀", title:"LED Sunset Lamp up 340% this week",       body:"Volume spike detected in Home niche. Only 3 active sellers. Window closing in ~10 days.",                    time:"2 hours ago",  read:false, action:{ label:"View Product", href:"/products/p3" } },
  { id:"al2", type:"urgent",      icon:"🔥", title:"Skincare & Beauty niche spiking",          body:"Search volume up 58% in 48 hours. Multiple viral TikToks identified. High-urgency opportunity.",              time:"4 hours ago",  read:false, action:{ label:"View Trends", href:"/trends" } },
  { id:"al3", type:"warning",     icon:"⚠️", title:"Posture corrector niche saturating",       body:"47 new stores entered in 14 days. Margins compressing. Consider exiting or differentiating your offer.",       time:"1 day ago",    read:false, action:{ label:"Research Now", href:"/keyword-research" } },
  { id:"al4", type:"info",        icon:"👀", title:"GreenLeaf Living launched 12 new products","body":"A store you're tracking added 12 new eco products overnight. Possible new category test.",                     time:"1 day ago",    read:true,  action:{ label:"Spy Store", href:"/store-spy/greenleaflivng.com" } },
  { id:"al5", type:"opportunity", icon:"📈", title:"Pet Accessories trending up 24%",          body:"3rd consecutive week of growth. Auto feeders and GPS trackers showing strongest velocity.",                      time:"2 days ago",   read:true,  action:{ label:"View Products", href:"/products" } },
  { id:"al6", type:"info",        icon:"📣", title:"New TikTok ad spotted from tracked store", body:"Gymshark just launched a new TikTok campaign with 3 new creative hooks. Engagement is 9.1% in first 6 hours.", time:"3 days ago",   read:true,  action:{ label:"View Ad", href:"/ad-spy" } },
];

const TYPE_STYLES = {
  opportunity: { border: "#5eb89a", bg: "rgba(94,184,154,0.08)" },
  warning:     { border: "#d4b572", bg: "rgba(212,181,114,0.08)" },
  urgent:      { border: "#d4685f", bg: "rgba(212,104,95,0.08)"  },
  info:        { border: "#a07840", bg: "rgba(160,120,64,0.08)"  },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [showSettings, setShowSettings] = useState(false);

  const unread = alerts.filter((a) => !a.read).length;

  function markRead(id: string) {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, read: true } : a));
  }

  function dismiss(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  function markAllRead() {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  }

  return (
    <div className="max-w-[820px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-bold" style={{ fontSize: 24, color: "#f5f3ee", letterSpacing: "-0.4px" }}>Alerts</h1>
            {unread > 0 && (
              <span className="rounded-full px-2 py-0.5 text-xs font-bold"
                style={{ background: "#d4685f", color: "#fff" }}>
                {unread}
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: "#8a8a94" }}>Trend spikes, competitor moves, and product opportunities.</p>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{ background: "#15151a", border: "1px solid #2a2a33", color: "#8a8a94" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#5eb89a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#8a8a94"; }}>
              <Check size={12} /> Mark all read
            </button>
          )}
          <button onClick={() => setShowSettings((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: showSettings ? "rgba(160,120,64,0.15)" : "#15151a",
              border: `1px solid ${showSettings ? "#a07840" : "#2a2a33"}`,
              color: showSettings ? "#c49a5a" : "#8a8a94",
            }}>
            <Settings size={12} /> Settings
          </button>
        </div>
      </div>

      {/* Alert settings panel */}
      {showSettings && (
        <div className="rounded-2xl p-6 mb-6" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
          <h2 className="font-semibold mb-4" style={{ color: "#f5f3ee" }}>Alert Preferences</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {[
              { label: "🚀 New Trending Products",  key: "trending",    on: true  },
              { label: "📉 Price Drops",             key: "price_drop",  on: true  },
              { label: "🔥 Niche Volume Spikes",     key: "niche_spike", on: true  },
              { label: "👀 New Competitor Stores",   key: "competitor",  on: false },
              { label: "📣 New Ads from Tracked Stores", key: "new_ad",  on: true  },
              { label: "⚠️ Saturation Warnings",    key: "saturation",  on: true  },
            ].map((pref) => (
              <div key={pref.key} className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "#1d1d24", border: "1px solid #2a2a33" }}>
                <span className="text-sm" style={{ color: "#f5f3ee" }}>{pref.label}</span>
                <div className="w-10 h-5 rounded-full cursor-pointer relative transition-colors"
                  style={{ background: pref.on ? "#a07840" : "#3a3a42" }}>
                  <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all"
                    style={{ left: pref.on ? "calc(100% - 18px)" : 2, background: "#f5f3ee" }} />
                </div>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: "#8a8a94" }}>Alert Frequency</p>
            <div className="flex gap-2">
              {["Real-time", "Daily digest", "Weekly"].map((f) => (
                <button key={f}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: f === "Real-time" ? "#a07840" : "#1d1d24",
                    border: `1px solid ${f === "Real-time" ? "#a07840" : "#2a2a33"}`,
                    color: f === "Real-time" ? "#f5f3ee" : "#8a8a94",
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alert list */}
      {alerts.length === 0 ? (
        <div className="text-center py-20" style={{ color: "#5c5c64" }}>
          <Bell size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold" style={{ color: "#8a8a94" }}>You&apos;re all caught up!</p>
          <p className="text-sm mt-1">No new alerts right now. We&apos;ll notify you when something spikes.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const style = TYPE_STYLES[alert.type];
            return (
              <div key={alert.id}
                className="flex items-start gap-4 p-5 rounded-2xl transition-all cursor-pointer"
                style={{
                  background: alert.read ? "#15151a" : style.bg,
                  border: `1px solid ${alert.read ? "#2a2a33" : style.border}`,
                  borderLeft: `3px solid ${style.border}`,
                  opacity: alert.read ? 0.7 : 1,
                }}
                onClick={() => markRead(alert.id)}>
                <span className="text-2xl flex-shrink-0">{alert.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#f5f3ee" }}>{alert.title}</p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#8a8a94" }}>{alert.body}</p>
                    </div>
                    {!alert.read && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                        style={{ background: style.border }} />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    {alert.action && (
                      <a href={alert.action.href}
                        className="text-xs font-semibold hover:text-[#c49a5a] transition-colors"
                        style={{ color: "#a07840" }}
                        onClick={(e) => e.stopPropagation()}>
                        {alert.action.label} →
                      </a>
                    )}
                    <span className="text-xs" style={{ color: "#5c5c64" }}>{alert.time}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); dismiss(alert.id); }}
                  className="p-1.5 rounded-lg flex-shrink-0 transition-all"
                  style={{ color: "#5c5c64" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#d4685f")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#5c5c64")}>
                  <X size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
