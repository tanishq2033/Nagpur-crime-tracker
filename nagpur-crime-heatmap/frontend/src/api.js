const BASE_URL = "https://nagpur-crime-tracker.onrender.com";

export async function fetchCrimes(crimeType = "all", timeFilter = "all") {
  const params = new URLSearchParams();

  if (crimeType !== "all") {
    params.append("crime_type", crimeType);
  }

  if (timeFilter !== "all") {
    params.append("time_filter", timeFilter);
  }

  const url = `${BASE_URL}/crimes?${params.toString()}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("API connection failed");
  }

  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/crimes/stats`);

  if (!res.ok) {
    throw new Error("Stats API failed");
  }

  return res.json();
}