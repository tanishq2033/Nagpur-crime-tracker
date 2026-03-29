const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export async function fetchCrimes({ crimeType = "all", timeFilter = "all" } = {}) {
  const params = new URLSearchParams();
  if (crimeType && crimeType !== "all") params.set("crime_type", crimeType);
  if (timeFilter && timeFilter !== "all") params.set("time_filter", timeFilter);

  const url = `${BASE_URL}/crimes${params.toString() ? "?" + params.toString() : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/crimes/stats`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchCrimeTypes() {
  const res = await fetch(`${BASE_URL}/crimes/types`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchLiveCrimes() {
  const res = await fetch(`${BASE_URL}/crimes/live`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
