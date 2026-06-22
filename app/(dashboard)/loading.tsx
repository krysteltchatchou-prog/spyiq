export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map((i) => (
          <div key={i} className="h-24 rounded-2xl" style={{ background: "#ffffff" }} />
        ))}
      </div>
      {/* Chart */}
      <div className="h-64 rounded-2xl" style={{ background: "#ffffff" }} />
      {/* 2-col */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-72 rounded-2xl" style={{ background: "#ffffff" }} />
        <div className="h-72 rounded-2xl" style={{ background: "#ffffff" }} />
      </div>
      {/* Full width */}
      <div className="h-48 rounded-2xl" style={{ background: "#ffffff" }} />
    </div>
  );
}
