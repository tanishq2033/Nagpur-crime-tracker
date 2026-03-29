import React, { useState, useEffect } from "react";

const CRIME_TYPE_COLORS = {
  Theft: "#ffd700",
  Assault: "#ff6600",
  Robbery: "#ff1a1a",
  Snatching: "#ff8800",
  Vandalism: "#cc44ff",
};

export default function TopBar({ stats, filters, onFilterChange, isLive, onToggleLive, crimeTypes }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString("en-IN", { hour12: false });
  const dateStr = time.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="absolute top-0 left-0 right-0 z-[1000] flex items-stretch" style={{ height: "64px" }}>
      {/* Left: Logo + Title */}
      <div className="glass-panel flex items-center px-5 gap-3 border-r border-red-900/30" style={{ minWidth: 280 }}>
        {/* Radar icon */}
        <div className="relative w-8 h-8 flex-shrink-0">
          <div className="absolute inset-0 rounded-full border border-red-500/40" />
          <div className="absolute inset-1 rounded-full border border-red-500/25" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 live-dot" />
          </div>
          <div className="radar-ping absolute inset-0 rounded-full border border-red-500/60" />
        </div>
        <div>
          <div className="font-display text-[11px] tracking-[0.25em] text-red-500 glow-red leading-none">
            CRIME INTEL
          </div>
          <div className="font-display text-[15px] font-bold tracking-[0.15em] text-white leading-tight">
            NAGPUR<span className="text-red-500">.</span>
          </div>
        </div>
      </div>

      {/* Center: Stats pills */}
      <div className="glass-panel flex-1 flex items-center justify-center gap-6 px-6">
        <StatBadge
          label="TOTAL INCIDENTS"
          value={stats?.total ?? "—"}
          color="text-red-400"
          glowClass="glow-red"
        />
        <div className="w-px h-8 bg-red-900/40" />
        <StatBadge
          label="HOTSPOT ZONE"
          value={stats?.most_affected_area ?? "—"}
          color="text-amber-400"
          glowClass="glow-amber"
        />
        <div className="w-px h-8 bg-red-900/40" />
        <StatBadge
          label="NIGHT CRIMES"
          value={stats?.by_time?.night ?? "—"}
          color="text-orange-400"
        />
        <div className="w-px h-8 bg-red-900/40" />
        {/* Live toggle */}
        <button
          onClick={onToggleLive}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest transition-all duration-300 border ${
            isLive
              ? "border-red-500/60 bg-red-500/10 text-red-400"
              : "border-gray-700/60 bg-gray-900/40 text-gray-500 hover:border-red-700/40"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${isLive ? "bg-red-500 live-dot" : "bg-gray-600"}`}
          />
          {isLive ? "LIVE TRACKING" : "TRACKING OFF"}
        </button>
      </div>

      {/* Right: Clock + Filters */}
      <div className="glass-panel flex items-center gap-4 px-5 border-l border-red-900/30">
        {/* Time filter */}
        <div className="flex gap-1.5">
          {["all", "day", "night"].map((t) => (
            <button
              key={t}
              onClick={() => onFilterChange({ ...filters, timeFilter: t })}
              className={`px-3 py-1 text-[10px] font-mono tracking-widest rounded border transition-all duration-200 ${
                filters.timeFilter === t
                  ? "bg-red-500/20 border-red-500/60 text-red-300"
                  : "border-gray-700/40 text-gray-500 hover:border-gray-500/60 hover:text-gray-400"
              }`}
            >
              {t === "all" ? "ALL" : t === "day" ? "☀ DAY" : "🌙 NIGHT"}
            </button>
          ))}
        </div>

        {/* Clock */}
        <div className="text-right">
          <div className="font-mono text-[13px] text-red-400 glow-red tracking-widest">{timeStr}</div>
          <div className="font-mono text-[9px] text-gray-600 tracking-widest uppercase">{dateStr}</div>
        </div>
      </div>
    </div>
  );
}

function StatBadge({ label, value, color, glowClass = "" }) {
  return (
    <div className="text-center">
      <div className="font-mono text-[9px] tracking-[0.2em] text-gray-500 uppercase mb-0.5">{label}</div>
      <div className={`font-display text-lg font-bold ${color} ${glowClass} leading-none`}>{value}</div>
    </div>
  );
}
