import React from "react";

const CRIME_COLORS = {
  Theft: "#ffd700",
  Assault: "#ff6600",
  Robbery: "#ff1a1a",
  Snatching: "#ff8800",
  Vandalism: "#cc44ff",
};

const CRIME_ICONS = {
  Theft: "💰",
  Assault: "⚡",
  Robbery: "🔴",
  Snatching: "👜",
  Vandalism: "🔧",
};

export default function CrimePopupContent({ crime }) {
  const color = CRIME_COLORS[crime.type] || "#ff4444";
  const icon = CRIME_ICONS[crime.type] || "⚠";
  const intensityPct = Math.round(crime.intensity * 100);

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace", minWidth: 220 }}>
      {/* Header stripe */}
      <div
        style={{
          background: `linear-gradient(135deg, ${color}22, transparent)`,
          borderBottom: `1px solid ${color}33`,
          padding: "10px 14px 8px",
        }}
      >
        <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "#666", marginBottom: 4 }}>
          INCIDENT REPORT
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color, letterSpacing: "0.05em" }}>
            {crime.type.toUpperCase()}
          </span>
          {crime.live && (
            <span
              style={{
                fontSize: 8,
                padding: "2px 6px",
                background: "#ff1a1a22",
                border: "1px solid #ff1a1a55",
                color: "#ff4444",
                borderRadius: 2,
                letterSpacing: "0.15em",
                marginLeft: "auto",
              }}
            >
              LIVE
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "10px 14px 12px" }}>
        <DataRow label="ZONE" value={crime.area} />
        <DataRow label="PERIOD" value={crime.time === "night" ? "🌙 Night" : "☀ Day"} />
        <DataRow label="COORDS" value={`${crime.lat.toFixed(4)}°N, ${crime.lng.toFixed(4)}°E`} dimmed />

        {/* Intensity bar */}
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 8,
              letterSpacing: "0.2em",
              color: "#555",
              marginBottom: 4,
            }}
          >
            <span>THREAT LEVEL</span>
            <span style={{ color }}>{intensityPct}%</span>
          </div>
          <div style={{ height: 3, background: "#1a1a2e", borderRadius: 2 }}>
            <div
              style={{
                height: "100%",
                width: `${intensityPct}%`,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${color}88, ${color})`,
                boxShadow: `0 0 6px ${color}66`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DataRow({ label, value, dimmed }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
      <span style={{ fontSize: 8, letterSpacing: "0.2em", color: "#444", flexShrink: 0 }}>{label}</span>
      <span
        style={{
          fontSize: 10,
          color: dimmed ? "#555" : "#ccc",
          letterSpacing: "0.05em",
          textAlign: "right",
          marginLeft: 8,
        }}
      >
        {value}
      </span>
    </div>
  );
}
