/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        crimson: "#ff1a1a",
        ember: "#ff6600",
        gold: "#ffd700",
        charcoal: "#0a0a0f",
        gunmetal: "#111118",
        panel: "#12121a",
        border: "#1e1e2e",
      },
      fontFamily: {
        mono: ["'IBM Plex Mono'", "monospace"],
        display: ["'Orbitron'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        blink: "blink 1s step-end infinite",
        "slide-in": "slideIn 0.4s ease-out",
        "fade-up": "fadeUp 0.5s ease-out",
      },
      keyframes: {
        blink: { "0%, 100%": { opacity: 1 }, "50%": { opacity: 0 } },
        slideIn: { from: { transform: "translateX(-100%)", opacity: 0 }, to: { transform: "translateX(0)", opacity: 1 } },
        fadeUp: { from: { transform: "translateY(20px)", opacity: 0 }, to: { transform: "translateY(0)", opacity: 1 } },
      },
    },
  },
  plugins: [],
};
