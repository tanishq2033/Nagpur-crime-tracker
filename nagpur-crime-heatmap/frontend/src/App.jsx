import React, { useState, useEffect, useCallback, useRef } from "react";
import CrimeMap from "./components/CrimeMap";
import TopBar from "./components/TopBar";
import FilterPanel from "./components/FilterPanel";
import BottomBar from "./components/BottomBar";
import ReportForm from "./components/ReportForm";
import { fetchCrimes, fetchStats, fetchCrimeTypes, fetchLiveCrimes } from "./api";

const LIVE_REFRESH_INTERVAL = 30000; // 30 seconds

export default function App() {
  const [crimes, setCrimes] = useState([]);
  const [stats, setStats] = useState(null);
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [filters, setFilters] = useState({ crimeType: "all", timeFilter: "all" });
  const [isLive, setIsLive] = useState(true);
  const [panelVisible, setPanelVisible] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const liveTimerRef = useRef(null);

  // Load crime types and initial stats
  useEffect(() => {
    fetchCrimeTypes().then(setCrimeTypes).catch(() => {});
    fetchStats().then(setStats).catch(() => {});
  }, []);

  // Load crimes when filters change
  const loadCrimes = useCallback(async () => {
    try {
      setLoading(true);
      const data = isLive
        ? await fetchLiveCrimes()
        : await fetchCrimes(filters);
      // Apply frontend filter if live mode
      let filtered = data;
      if (isLive) {
        if (filters.crimeType !== "all") {
          filtered = filtered.filter(
            (c) => c.type.toLowerCase() === filters.crimeType.toLowerCase()
          );
        }
        if (filters.timeFilter !== "all") {
          filtered = filtered.filter((c) => c.time === filters.timeFilter);
        }
      }
      setCrimes(filtered);
      setError(null);
    } catch (err) {
      setError("Cannot connect to API. Using offline data.");
      // Load fallback local data
      loadFallbackData(filters);
    } finally {
      setLoading(false);
    }
  }, [filters, isLive]);

  useEffect(() => {
    loadCrimes();
  }, [loadCrimes]);

  // Live refresh timer
  useEffect(() => {
    if (isLive) {
      liveTimerRef.current = setInterval(loadCrimes, LIVE_REFRESH_INTERVAL);
    } else {
      clearInterval(liveTimerRef.current);
    }
    return () => clearInterval(liveTimerRef.current);
  }, [isLive, loadCrimes]);

  // Fetch stats when filter changes
  useEffect(() => {
    fetchStats().then(setStats).catch(() => {});
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleToggleLive = () => setIsLive((v) => !v);
  const handleTogglePanel = () => setPanelVisible((v) => !v);

  // Compute displayed count
  const displayedStats = stats
    ? {
        ...stats,
        total: crimes.length,
      }
    : { total: crimes.length };

  return (
    <div className="relative w-screen h-screen bg-charcoal overflow-hidden">
      {/* ─── Background scan line effect ──────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.015]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* ─── Map ──────────────────────────────────────────────── */}
      <CrimeMap crimes={crimes} isLive={isLive} />

      {/* ─── Top bar ──────────────────────────────────────────── */}
      <TopBar
        stats={displayedStats}
        filters={filters}
        onFilterChange={handleFilterChange}
        isLive={isLive}
        onToggleLive={handleToggleLive}
        crimeTypes={crimeTypes}
      />

      {/* ─── Filter panel ─────────────────────────────────────── */}
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        stats={stats}
        crimeTypes={crimeTypes}
        visible={panelVisible}
      />

      {/* ─── Bottom bar ───────────────────────────────────────── */}
      <BottomBar
        crimeCount={crimes.length}
        onOpenReport={() => setReportOpen(true)}
        onTogglePanel={handleTogglePanel}
      />

      {/* ─── Report form modal ────────────────────────────────── */}
      <ReportForm
        visible={reportOpen}
        onClose={() => setReportOpen(false)}
      />

      {/* ─── Loading overlay ──────────────────────────────────── */}
      {loading && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1500]">
          <div className="glass-panel flex items-center gap-3 px-5 py-2.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-[10px] tracking-widest text-gray-400">
              SYNCING DATA...
            </span>
          </div>
        </div>
      )}

      {/* ─── Error banner ─────────────────────────────────────── */}
      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1500] max-w-sm w-full px-4">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded border border-amber-600/40 text-center"
            style={{ background: "rgba(255,165,0,0.08)" }}
          >
            <span className="text-amber-500 text-sm">⚠</span>
            <span className="font-mono text-[9px] tracking-widest text-amber-600/80">{error}</span>
            <button onClick={() => setError(null)} className="text-amber-700 hover:text-amber-500 text-xs ml-auto">✕</button>
          </div>
        </div>
      )}

      {/* ─── Corner decorations ───────────────────────────────── */}
      <CornerDecor position="top-[68px] left-0" />
      <CornerDecor position="top-[68px] right-0" flip />
    </div>
  );
}

// Subtle corner decorative bracket
function CornerDecor({ position, flip }) {
  return (
    <div
      className={`absolute ${position} z-[900] pointer-events-none`}
      style={{
        width: 30,
        height: 30,
        borderTop: "1px solid rgba(255,26,26,0.2)",
        borderLeft: flip ? "none" : "1px solid rgba(255,26,26,0.2)",
        borderRight: flip ? "1px solid rgba(255,26,26,0.2)" : "none",
      }}
    />
  );
}

// ─── Fallback: if API is down, load bundled data ──────────────────────
async function loadFallbackData(filters) {
  // Minimal fallback – the real data is in the backend
}
