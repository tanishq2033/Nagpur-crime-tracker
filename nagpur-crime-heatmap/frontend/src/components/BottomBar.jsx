import React from "react";

export default function BottomBar({ crimeCount, onOpenReport, onTogglePanel }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] flex items-center justify-between px-6 py-3">
      {/* Left info */}
      <div className="glass-panel flex items-center gap-4 px-4 py-2 rounded">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 live-dot" />
          <span className="font-mono text-[10px] tracking-widest text-gray-500">
            SHOWING{" "}
            <span className="text-red-400 font-bold">{crimeCount}</span>{" "}
            INCIDENTS
          </span>
        </div>
        <div className="w-px h-4 bg-red-900/40" />
        <span className="font-mono text-[10px] tracking-widest text-gray-600">
          NAGPUR · 21.1458°N · 79.0882°E
        </span>
      </div>

      {/* Center: map tip */}
      <div className="font-mono text-[9px] tracking-widest text-gray-700 text-center">
        CLICK HOTSPOT TO INSPECT · SCROLL TO ZOOM
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePanel}
          className="glass-panel flex items-center gap-2 px-3 py-2 rounded border border-gray-700/40 hover:border-red-700/40 transition-all duration-200"
        >
          <span className="font-mono text-[10px] tracking-widest text-gray-500 hover:text-gray-300">⊞ LAYERS</span>
        </button>
        <button
          onClick={onOpenReport}
          className="flex items-center gap-2 px-4 py-2 rounded border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 transition-all duration-200"
        >
          <span className="text-red-400 text-sm">+</span>
          <span className="font-mono text-[10px] tracking-widest text-red-400">REPORT CRIME</span>
        </button>
      </div>
    </div>
  );
}
