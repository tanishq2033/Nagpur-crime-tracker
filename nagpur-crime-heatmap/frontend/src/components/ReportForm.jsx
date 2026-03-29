import React, { useState } from "react";

const CRIME_TYPES = ["Theft", "Assault", "Robbery", "Snatching", "Vandalism"];

export default function ReportForm({ visible, onClose }) {
  const [form, setForm] = useState({
    area: "",
    type: "Theft",
    time: "night",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would POST to the backend
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ area: "", type: "Theft", time: "night", description: "" });
      onClose();
    }, 2000);
  };

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 z-[2000] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="glass-panel rounded-lg w-full max-w-md mx-4 panel-slide-right"
        style={{ border: "1px solid rgba(255,26,26,0.3)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-900/25">
          <div>
            <div className="font-mono text-[9px] tracking-[0.3em] text-red-500/70 uppercase">◈ Report Incident</div>
            <div className="font-display text-[13px] tracking-widest text-white mt-0.5">SUBMIT CRIME REPORT</div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-400 transition-colors font-mono text-lg"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-12 text-center">
            <div className="text-4xl mb-4">✅</div>
            <div className="font-display text-[13px] tracking-widest text-green-400 glow-amber">
              REPORT SUBMITTED
            </div>
            <div className="font-mono text-[10px] text-gray-500 tracking-widest mt-2">
              Incident logged to database
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <FormField label="AREA / LOCALITY">
              <input
                type="text"
                required
                placeholder="e.g. Sitabuldi, Sadar..."
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="w-full bg-gray-900/60 border border-gray-700/60 rounded px-3 py-2 font-mono text-[11px] text-gray-300 placeholder-gray-700 focus:outline-none focus:border-red-500/60 transition-colors"
              />
            </FormField>

            <FormField label="CRIME TYPE">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-gray-900/60 border border-gray-700/60 rounded px-3 py-2 font-mono text-[11px] text-gray-300 focus:outline-none focus:border-red-500/60 transition-colors"
              >
                {CRIME_TYPES.map((t) => (
                  <option key={t} value={t} style={{ background: "#111" }}>{t}</option>
                ))}
              </select>
            </FormField>

            <FormField label="TIME OF INCIDENT">
              <div className="grid grid-cols-2 gap-2">
                {["day", "night"].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setForm({ ...form, time: t })}
                    className={`py-2 rounded border font-mono text-[10px] tracking-widest transition-all duration-200 ${
                      form.time === t
                        ? "border-red-500/50 bg-red-500/10 text-red-300"
                        : "border-gray-700/50 text-gray-600 hover:border-gray-500/60"
                    }`}
                  >
                    {t === "day" ? "☀ DAY" : "🌙 NIGHT"}
                  </button>
                ))}
              </div>
            </FormField>

            <FormField label="DESCRIPTION (OPTIONAL)">
              <textarea
                placeholder="Brief description of incident..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full bg-gray-900/60 border border-gray-700/60 rounded px-3 py-2 font-mono text-[11px] text-gray-300 placeholder-gray-700 focus:outline-none focus:border-red-500/60 transition-colors resize-none"
              />
            </FormField>

            <button
              type="submit"
              className="w-full py-3 rounded border border-red-500/50 bg-red-500/10 text-red-300 font-mono text-[11px] tracking-[0.2em] hover:bg-red-500/20 hover:border-red-500/70 transition-all duration-200 mt-2"
            >
              ◈ SUBMIT REPORT
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <div className="font-mono text-[9px] tracking-[0.2em] text-gray-600 uppercase mb-1.5">{label}</div>
      {children}
    </div>
  );
}
