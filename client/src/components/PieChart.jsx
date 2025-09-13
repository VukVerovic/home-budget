const PALETTE = ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f", "#edc948"];

export default function PieChart({ data = [], size = 180 }) {
  const total = Math.max(
    1,
    data.reduce((s, d) => s + (Number(d.value) || 0), 0)
  );

  let current = 0;
  const segments = data.map((d, i) => {
    const frac = (Number(d.value) || 0) / total;
    const start = current * 100;
    const end = (current + frac) * 100;
    current += frac;
    return {
      label: d.label,
      value: Number(d.value) || 0,
      color: PALETTE[i % PALETTE.length],
      start,
      end,
    };
  });

  const gradient = segments.length
    ? `conic-gradient(${segments
        .map(s => `${s.color} ${s.start}% ${s.end}%`)
        .join(",")})`
    : "#eee";

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: gradient,
          border: "4px solid #fff",
          boxShadow: "0 1px 3px rgba(0,0,0,.15)",
        }}
        aria-label="Pie chart"
        title="Raspodela po kategorijama"
      />
      <div>
        {segments.length === 0 ? (
          <div style={{ color: "#777" }}>Nema podataka.</div>
        ) : (
          segments.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  background: s.color,
                  display: "inline-block",
                  marginRight: 8,
                }}
              />
              <span style={{ marginRight: 6 }}>{s.label}</span>
              <strong>{s.value}</strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
}