// Circular ring chart showing IQ score 0–100.
// Size prop controls diameter; used in tables (small=32) and detail pages (large=80).
interface Props {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export function IQScoreBadge({ score, size = 40, strokeWidth = 3, showLabel = true }: Props) {
  const r   = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const fill = circ * (score / 100);

  const color =
    score >= 85 ? "#5eb89a" :
    score >= 70 ? "#a07840" :
    score >= 55 ? "#d4b572" : "#d4685f";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2a2a33" strokeWidth={strokeWidth} />
        {/* Progress */}
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      {showLabel && (
        <span
          className="absolute font-bold"
          style={{ fontSize: size < 44 ? 9 : size < 64 ? 12 : 18, color, lineHeight: 1 }}
        >
          {score}
        </span>
      )}
    </div>
  );
}
