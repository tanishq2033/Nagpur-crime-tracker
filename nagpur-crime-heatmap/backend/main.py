from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
import os
import random
from typing import Optional, List
from datetime import datetime

app = FastAPI(title="Nagpur Crime Heatmap API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load base dataset
DATASET_PATH = os.path.join(os.path.dirname(__file__), "../dataset/crimes.json")

def load_crimes():
    with open(DATASET_PATH, "r") as f:
        return json.load(f)

CRIMES = load_crimes()

@app.get("/")
def root():
    return {"status": "ok", "message": "Nagpur Crime Heatmap API is running"}

@app.get("/crimes")
def get_crimes(
    crime_type: Optional[str] = Query(None, description="Filter by crime type"),
    time_filter: Optional[str] = Query(None, description="Filter by time: day or night"),
    area: Optional[str] = Query(None, description="Filter by area name"),
):
    crimes = CRIMES.copy()

    if crime_type and crime_type.lower() != "all":
        crimes = [c for c in crimes if c["type"].lower() == crime_type.lower()]

    if time_filter and time_filter.lower() != "all":
        crimes = [c for c in crimes if c["time"].lower() == time_filter.lower()]

    if area:
        crimes = [c for c in crimes if area.lower() in c["area"].lower()]

    return crimes

@app.get("/crimes/stats")
def get_stats():
    crimes = CRIMES.copy()

    # Count per area
    area_counts = {}
    for c in crimes:
        area_counts[c["area"]] = area_counts.get(c["area"], 0) + 1

    most_affected = max(area_counts, key=area_counts.get)

    # Count per type
    type_counts = {}
    for c in crimes:
        type_counts[c["type"]] = type_counts.get(c["type"], 0) + 1

    # Day vs Night
    day_count = sum(1 for c in crimes if c["time"] == "day")
    night_count = sum(1 for c in crimes if c["time"] == "night")

    return {
        "total": len(crimes),
        "most_affected_area": most_affected,
        "most_affected_count": area_counts[most_affected],
        "by_type": type_counts,
        "by_time": {"day": day_count, "night": night_count},
        "area_breakdown": dict(sorted(area_counts.items(), key=lambda x: x[1], reverse=True)),
    }

@app.get("/crimes/types")
def get_crime_types():
    types = list(set(c["type"] for c in CRIMES))
    return sorted(types)

@app.get("/crimes/areas")
def get_areas():
    areas = list(set(c["area"] for c in CRIMES))
    return sorted(areas)

# Simulated live data: adds slight noise to existing points
@app.get("/crimes/live")
def get_live_crimes():
    crimes = CRIMES.copy()
    # Add 5 random "live" incidents
    live_areas = ["Sitabuldi", "Itwari", "Nagpur Railway Station", "Sadar", "Civil Lines"]
    crime_types = ["Theft", "Assault", "Robbery", "Snatching"]
    new_incidents = []
    for i in range(5):
        base = random.choice(crimes)
        new_incidents.append({
            "id": 1000 + i,
            "lat": base["lat"] + random.uniform(-0.005, 0.005),
            "lng": base["lng"] + random.uniform(-0.005, 0.005),
            "intensity": round(random.uniform(0.6, 1.0), 2),
            "type": random.choice(crime_types),
            "time": random.choice(["day", "night"]),
            "area": random.choice(live_areas),
            "live": True,
        })
    return crimes + new_incidents

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
