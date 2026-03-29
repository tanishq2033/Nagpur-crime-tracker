import React from "react";

const CRIME_TYPE_META = {
  All: { icon: "◈", color: "#aaa" },
  Theft: { icon: "💰", color: "#ffd700" },
  Assault: { icon: "⚡", color: "#ff6600" },
  Robbery: { icon: "🔴", color: "#ff1a1a" },
  Snatching: { icon: "👜", color: "#ff8800" },
  Vandalism: { icon: "🔧", color: "#cc44ff" },
};

export default function FilterPanel({ filters, onFilterChange, stats, crimeTypes, visible }) {
  const types = ["All", ...(crimeTypes || ["Theft", "Assault", "Robbery", "Snatching", "Vandalism"])];

  const areaBreakdown = stats?.area_breakdown
    ? Object.entries(stats.area_breakdown).slice(0, 8)
    : [];

  const maxCount = areaBreakdown[0]?.[1] || 1;

  if (!visible) return null;

  return (
    <div
      className="absolute left-0 top-16 bottom-0 z-[1000] w-72 flex flex-col"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="glass-panel h-full flex flex-col panel-slide-left overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-red-900/25 flex-shrink-0">
          <div className="font-mono text-[9px] tracking-[0.3em] text-red-500/70 uppercase mb-1">
            ◈ Intelligence Filters
          </div>
          <div className="font-display text-[11px] tracking-wider text-gray-400">
            Refine crime data layers
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Crime Type */}
          <div>
            <div className="font-mono text-[9px] tracking-[0.25em] text-gray-500 uppercase mb-3">
              Crime Category
            </div>
            <div className="space-y-1.5">
              {types.map((t) => {
                const meta = CRIME_TYPE_META[t] || { icon: "◉", color: "#aaa" };
                const active = filters.crimeType === t.toLowerCase() || (t === "All" && filters.crimeType === "all");
                return (
                  <button
                    key={t}
                    onClick={() => onFilterChange({ ...filters, crimeType: t === "All" ? "all" : t })}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-left transition-all duration-200 border ${
                      active
                        ? "border-red-500/40 bg-red-500/10"
                        : "border-transparent hover:border-gray-700/50 hover:bg-white/3"
                    }`}
                  >
                    <span className="text-sm w-5 text-center">{meta.icon}</span>
                    <span
                      className={`font-mono text-[11px] tracking-wider flex-1 ${active ? "text-white" : "text-gray-500"}`}
                    >
                      {t.toUpperCase()}
                    </span>
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    )}
                    {stats?.by_type?.[t] && (
                      <span className="font-mono text-[10px] text-gray-600">
                        {stats.by_type[t]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time of day */}
          <div>
            <div className="font-mono text-[9px] tracking-[0.25em] text-gray-500 uppercase mb-3">
              Time Period
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { val: "all", label: "ALL", icon: "◈" },
                { val: "day", label: "DAY", icon: "☀" },
                { val: "night", label: "NIGHT", icon: "🌙" },
              ].map(({ val, label, icon }) => (
                <button
                  key={val}
                  onClick={() => onFilterChange({ ...filters, timeFilter: val })}
                  className={`flex flex-col items-center py-3 rounded border text-center transition-all duration-200 ${
                    filters.timeFilter === val
                      ? "border-red-500/50 bg-red-500/10 text-red-300"
                      : "border-gray-800/60 text-gray-600 hover:border-gray-600/60 hover:text-gray-400"
                  }`}
                >
                  <span className="text-lg mb-1">{icon}</span>
                  <span className="font-mono text-[9px] tracking-widest">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-red-900/20" />

          {/* Area breakdown */}
          <div>
            <div className="font-mono text-[9px] tracking-[0.25em] text-gray-500 uppercase mb-3">
              Top Affected Areas
            </div>
            <div className="space-y-2">
              {areaBreakdown.map(([area, count], i) => (
                <div key={area} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-gray-400 group-hover:text-gray-200 transition-colors">
                      {area}
                    </span>
                    <span className="font-mono text-[10px] text-red-400/80">{count}</span>
                  </div>
                  <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(count / maxCount) * 100}%`,
                        background: i === 0
                          ? "linear-gradient(90deg, #ff1a1a, #ff6600)"
                          : i < 3
                          ? "linear-gradient(90deg, #ff6600, #ffd700)"
                          : "linear-gradient(90deg, #555, #777)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div>
            <div className="font-mono text-[9px] tracking-[0.25em] text-gray-500 uppercase mb-3">
              Heatmap Intensity
            </div>
            <div className="relative h-3 rounded-full overflow-hidden mb-2"
              style={{ background: "linear-gradient(90deg, #0040ff, #00ffaa, #ffff00, #ff6600, #ff0000)" }}
            />
            <div className="flex justify-between font-mono text-[8px] text-gray-600 tracking-wider">
              <span>LOW</span>
              <span>MODERATE</span>
              <span>HIGH</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-red-900/20 flex-shrink-0">
          <div className="font-mono text-[8px] tracking-widest text-gray-700 text-center">
            NAGPUR POLICE ANALYTICS · v1.0
          </div>
        </div>
      </div>
    </div>
  );
}
