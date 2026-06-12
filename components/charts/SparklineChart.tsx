"use client";
interface Props {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
}

export function SparklineChart({ data, width, height = 28, color = "#a07840", fill = true }: Props) {
  if (!data.length) return null;

  const W = width ?? 100;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = W / (data.length - 1);

  const points = data.map((v, i) => ({
    x: i * step,
    y: height - ((v - min) / range) * (height - 4) - 2,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${W},${height} L0,${height} Z`;

  // When no explicit width, fill container using viewBox + preserveAspectRatio
  const svgProps = width
    ? { width: W, height }
    : { viewBox: `0 0 ${W} ${height}`, width: "100%", height, preserveAspectRatio: "none" };

  return (
    <svg {...svgProps} style={{ overflow: "visible", display: "block" }}>
      {fill && <path d={areaPath} fill={color} fillOpacity={0.12} />}
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={2.5} fill={color} />
    </svg>
  );
}
