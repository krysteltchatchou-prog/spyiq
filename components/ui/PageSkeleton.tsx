export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl animate-pulse ${className}`}
      style={{ background: "#15151a", border: "1px solid #2a2a33" }} />
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: "#15151a", border: "1px solid #2a2a33" }}>
      <div className="h-10 border-b" style={{ background: "#1d1d24", borderColor: "#2a2a33" }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3 border-b" style={{ borderColor: "#1d1d24" }}>
          <div className="w-8 h-8 rounded-lg" style={{ background: "#2a2a33" }} />
          <div className="flex-1 h-4 rounded-lg" style={{ background: "#2a2a33" }} />
          <div className="w-20 h-4 rounded-lg" style={{ background: "#2a2a33" }} />
          <div className="w-16 h-4 rounded-lg" style={{ background: "#2a2a33" }} />
        </div>
      ))}
    </div>
  );
}

export function TextSkeleton({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 rounded-lg" style={{ background: "#2a2a33", width: i === lines - 1 ? "60%" : "100%" }} />
      ))}
    </div>
  );
}
