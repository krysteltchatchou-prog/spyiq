"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, RefreshCw, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { AiEstimateBadge } from "@/components/ui/AiEstimateBadge";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "Find me a winning product under $30",
  "What's trending in beauty right now?",
  "Is LED sunset lamp worth dropshipping?",
  "Best ad hooks for pet products",
  "Compare fitness vs beauty niche",
  "Write a product description for face serum",
];

const WELCOME = `Hey! I'm SpyIQ AI — your ecommerce intelligence co-pilot. 🎯

I can help you:
- **Find winning products** with strong margin potential
- **Analyze niches** for demand, competition, and timing
- **Write ad hooks** and product copy that converts
- **Compare competitors** and spot their strategies
- **Score any product** on demand, competition, margin, and viral potential

What would you like to explore today?`;

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
          style={{ background: "#a07840", animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 text-sm"
          style={{ background: "rgba(160,120,64,0.15)", border: "1px solid rgba(160,120,64,0.25)" }}>
          🤖
        </div>
      )}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed`}
        style={{
          background: isUser ? "#a07840" : "#f3f1ea",
          color: isUser ? "#23221f" : "#23221f",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          border: isUser ? "none" : "1px solid #e4e1d8",
        }}>
        {/* Simple markdown: bold, bullets */}
        <div dangerouslySetInnerHTML={{
          __html: msg.content
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/\*\*(.*?)\*\*/g, "<strong style='color:#23221f'>$1</strong>")
            .replace(/^- (.+)$/gm, "<li style='margin-left:12px;list-style-type:disc'>$1</li>")
            .replace(/\n/g, "<br/>")
        }} />
      </div>
    </div>
  );
}

export default function AIAnalyzerPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  async function send(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    setStreamingText("");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("API error");
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              accumulated += parsed.text;
              setStreamingText(accumulated);
            } catch {}
          }
        }
      }

      setMessages([...newMessages, { role: "assistant", content: accumulated }]);
      setStreamingText("");
    } catch (err: unknown) {
      const msg = err instanceof Error && err.message.includes("429")
        ? "Rate limit reached. Upgrade your plan for more AI credits."
        : "Sorry, I ran into an error. Please try again.";
      setMessages([...newMessages, { role: "assistant", content: msg }]);
      toast.error(msg);
      setStreamingText("");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-86px)]">
      {/* Chat panel */}
      <div className="flex-1 flex flex-col rounded-2xl overflow-hidden"
        style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>

        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid #e4e1d8" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "rgba(160,120,64,0.15)", border: "1px solid rgba(160,120,64,0.25)" }}>
              🤖
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#23221f" }}>SpyIQ AI</p>
              <p className="text-xs" style={{ color: "#3e8f72" }}>● Online · claude-sonnet-4-6</p>
            </div>
          </div>
          <button
            onClick={() => setMessages([{ role: "assistant", content: WELCOME }])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#23221f"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#4d4b44"; }}>
            <RefreshCw size={11} /> New chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5">
          <AiEstimateBadge variant="banner" className="mb-4" />
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {loading && (
            <>
              {streamingText ? (
                <MessageBubble msg={{ role: "assistant", content: streamingText + "▋" }} />
              ) : (
                <div className="flex justify-start mb-4">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 text-sm"
                    style={{ background: "rgba(160,120,64,0.15)", border: "1px solid rgba(160,120,64,0.25)" }}>
                    🤖
                  </div>
                  <div className="rounded-2xl" style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", borderRadius: "18px 18px 18px 4px" }}>
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompt chips */}
        {messages.length <= 2 && (
          <div className="px-5 pb-3 flex gap-2 flex-wrap flex-shrink-0">
            {QUICK_PROMPTS.map((p) => (
              <button key={p}
                onClick={() => send(p)}
                disabled={loading}
                className="px-3 py-1.5 rounded-full text-xs transition-all"
                style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a07840"; e.currentTarget.style.color = "#8a6530"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e4e1d8"; e.currentTarget.style.color = "#4d4b44"; }}>
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="px-5 pb-5 flex-shrink-0">
          <div className="flex items-end gap-2 rounded-2xl p-3"
            style={{ background: "#f3f1ea", border: "1px solid #e4e1d8" }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about any product, niche, or strategy…"
              rows={1}
              className="flex-1 resize-none text-sm outline-none bg-transparent"
              style={{ color: "#23221f", maxHeight: 120, overflowY: "auto" }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                background: input.trim() && !loading ? "#a07840" : "#e4e1d8",
                color:      input.trim() && !loading ? "#23221f" : "#5d5b54",
              }}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>
          <p className="text-center text-[10px] mt-2" style={{ color: "#d4cfc2" }}>
            SpyIQ AI · Powered by Claude Sonnet 4.6 · Press Enter to send
          </p>
        </div>
      </div>

      {/* Context panel */}
      <div className="w-[280px] flex-shrink-0 hidden lg:flex flex-col gap-4">

        {/* Related products */}
        <div className="rounded-2xl p-4" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#5d5b54" }}>
            Related Products
          </p>
          <div className="space-y-2">
            {[
              { emoji: "🧴", name: "Hydro-Boost Serum",  score: 94 },
              { emoji: "💡", name: "LED Sunset Lamp",     score: 88 },
              { emoji: "🦮", name: "Auto Pet Feeder Pro", score: 91 },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all"
                style={{ background: "#f3f1ea", border: "1px solid transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#e4e1d8")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}>
                <span>{p.emoji}</span>
                <span className="text-xs flex-1 truncate" style={{ color: "#23221f" }}>{p.name}</span>
                <span className="text-xs font-bold" style={{ color: "#3e8f72" }}>{p.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested next steps */}
        <div className="rounded-2xl p-4" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#5d5b54" }}>
            Suggested Next Steps
          </p>
          <div className="space-y-2">
            {[
              "Spy on top beauty stores",
              "Research skincare keywords",
              "Find winning ad hooks",
              "Compare niche profitability",
            ].map((s) => (
              <button key={s}
                onClick={() => send(s)}
                disabled={loading}
                className="w-full text-left px-3 py-2 rounded-xl text-xs transition-all"
                style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a07840"; e.currentTarget.style.color = "#8a6530"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e4e1d8"; e.currentTarget.style.color = "#4d4b44"; }}>
                → {s}
              </button>
            ))}
          </div>
        </div>

        {/* AI credits */}
        <div className="rounded-2xl p-4" style={{ background: "#ffffff", border: "1px solid #e4e1d8" }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold" style={{ color: "#4d4b44" }}>AI Credits</p>
            <p className="text-xs font-bold" style={{ color: "#23221f" }}>38 / 50</p>
          </div>
          <div className="w-full rounded-full h-1.5" style={{ background: "#e4e1d8" }}>
            <div className="rounded-full h-1.5" style={{ width: "76%", background: "#c08a2a" }} />
          </div>
          <p className="text-[10px] mt-1.5" style={{ color: "#5d5b54" }}>
            12 credits remaining this month
          </p>
        </div>

        {/* Save chat */}
        <button
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "#f3f1ea", border: "1px solid #e4e1d8", color: "#4d4b44" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a07840"; e.currentTarget.style.color = "#8a6530"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e4e1d8"; e.currentTarget.style.color = "#4d4b44"; }}>
          <Bookmark size={14} /> Save This Chat
        </button>
      </div>
    </div>
  );
}
