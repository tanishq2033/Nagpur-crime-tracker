# 🔴 Nagpur Crime Heatmap

A full-stack crime analytics dashboard with interactive heatmap visualization for Nagpur, India.
Built with React, FastAPI, Leaflet.js, and Tailwind CSS — featuring a dark cyber aesthetic.

```
┌─────────────────────────────────────────────────────┐
│  CRIME INTEL  NAGPUR.   [STATS]  [FILTERS]  [CLOCK] │
├─────────────┬───────────────────────────────────────┤
│  ◈ FILTERS  │                                       │
│  Category   │         🗺  DARK MAP + HEATMAP        │
│  Time       │      (Red/Orange/Yellow hotspots)     │
│  Area Bar   │                                       │
│             │                                       │
└─────────────┴───────────────────────────────────────┘
│  [INCIDENT COUNT]    [COORDS]    [LAYERS] [+ REPORT] │
└─────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- pip

---

### 1. Clone / navigate to project
```bash
cd nagpur-crime-heatmap
```

---

### 2. Start the Backend (FastAPI)

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate      # macOS / Linux
# OR: venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
# OR: uvicorn main:app --reload --port 8000
```

Backend will be live at: **http://localhost:8000**

API Docs (Swagger): **http://localhost:8000/docs**

---

### 3. Start the Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm start
```

Frontend will open at: **http://localhost:3000**

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/crimes` | All crime data (supports filters) |
| GET | `/crimes?crime_type=Theft` | Filter by crime type |
| GET | `/crimes?time_filter=night` | Filter by time (day/night) |
| GET | `/crimes/stats` | Aggregate statistics |
| GET | `/crimes/types` | List of crime types |
| GET | `/crimes/areas` | List of areas |
| GET | `/crimes/live` | Live data with simulated incidents |

### Sample Response `/crimes`
```json
[
  {
    "id": 1,
    "lat": 21.1458,
    "lng": 79.0882,
    "intensity": 0.9,
    "type": "Robbery",
    "time": "night",
    "area": "Sitabuldi"
  }
]
```

---

## 🏗 Project Structure

```
nagpur-crime-heatmap/
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── CrimeMap.jsx       # Leaflet + heatmap
│   │   │   ├── TopBar.jsx         # Stats + filters header
│   │   │   ├── FilterPanel.jsx    # Left sidebar
│   │   │   ├── BottomBar.jsx      # Bottom controls
│   │   │   ├── CrimePopupContent.jsx  # Click popup
│   │   │   └── ReportForm.jsx     # Crime report modal
│   │   ├── api.js               # API service
│   │   ├── App.jsx              # Root component
│   │   ├── index.js
│   │   └── index.css            # Tailwind + custom styles
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── dataset/
    └── crimes.json              # 115 synthetic crime points
```

---

## ✨ Features

### Core
- 🗺 **Interactive heatmap** — Leaflet + leaflet.heat with red→orange→yellow gradient
- 🌙 **Dark CartoDB tile** — Futuristic dark map base
- 📍 **115 crime data points** across 18 real Nagpur areas
- 🔍 **Click any hotspot** — Popup shows area, type, time, threat level
- 🔄 **Auto-refresh** every 30s in Live Tracking mode

### Filters
- **By crime type**: Theft, Assault, Robbery, Snatching, Vandalism
- **By time**: Day / Night / All
- **Top 8 area breakdown** with animated progress bars

### UI/UX
- ⚡ **Cyber-futuristic dark theme** with IBM Plex Mono + Orbitron fonts
- 📊 **Live stats bar** — total crimes, hotspot zone, night count
- 🔴 **Pulsing live indicator** with radar animation
- 🕐 **Live clock** (IST)
- ➕ **Crime report form** modal
- 📱 **Responsive** layout

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0a0a0f` |
| Panel | `rgba(10,10,18,0.88)` |
| Accent red | `#ff1a1a` |
| Accent amber | `#ff6600` |
| Accent gold | `#ffd700` |
| Font display | Orbitron |
| Font mono | IBM Plex Mono |

---

## 🗺 Nagpur Areas Covered

Sitabuldi · Dharampeth · Sadar · Manish Nagar · Civil Lines ·
Bajaj Nagar · Ramdaspeth · Hingna · Kamptee Road · Nagpur Railway Station ·
Lakadganj · Nandanvan · Wardha Road · Ajni · Itwari · Hinganghat Road ·
Kalamna · Koradi · Butibori · Wadi · Gandhibagh · Sakkardara · Pratap Nagar

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS |
| Map | Leaflet.js 1.9, leaflet.heat |
| Backend | FastAPI, Uvicorn |
| Data | Synthetic JSON (115 points) |
| Fonts | Orbitron, IBM Plex Mono, DM Sans |
| Map tiles | CartoDB Dark Matter |

---

## 💡 Development Tips

- The `proxy` in `package.json` forwards `/crimes` calls to `localhost:8000` in dev
- Set `REACT_APP_API_URL=https://your-api.com` for production
- The `/crimes/live` endpoint adds 5 random simulated incidents each call
- Backend CORS is open (`*`) — restrict in production

---

*Built for portfolio use. Crime data is fully synthetic and for demonstration only.*
