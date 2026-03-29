import React, { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ReactDOMServer from "react-dom/server";
import CrimePopupContent from "./CrimePopupContent";

// Dynamically load leaflet.heat
function loadHeatPlugin() {
  return new Promise((resolve) => {
    if (window.L && window.L.heatLayer) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js";
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

const NAGPUR_CENTER = [21.1458, 79.0882];
const DARK_TILE = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const DARK_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';

// Create a custom dot marker for each crime point (invisible but clickable)
function createCrimeDotMarker(crime) {
  const color =
    crime.type === "Robbery"
      ? "#ff1a1a"
      : crime.type === "Assault"
      ? "#ff6600"
      : crime.type === "Theft"
      ? "#ffd700"
      : crime.type === "Snatching"
      ? "#ff8800"
      : "#cc44ff";

  const html = `
    <div style="
      width: 10px; height: 10px;
      border-radius: 50%;
      background: ${color};
      border: 1.5px solid ${color}cc;
      box-shadow: 0 0 6px ${color}99, 0 0 12px ${color}44;
      cursor: pointer;
      position: relative;
    ">
      ${crime.live ? `<div style="
        position: absolute; inset: -4px;
        border-radius: 50%;
        border: 1px solid ${color}66;
        animation: radarPing 1.5s ease-out infinite;
      "/>` : ""}
    </div>
  `;

  return L.divIcon({
    html,
    className: "",
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
}

export default function CrimeMap({ crimes, isLive }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatLayerRef = useRef(null);
  const markersLayerRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const initMap = async () => {
      await loadHeatPlugin();

      const map = L.map(mapRef.current, {
        center: NAGPUR_CENTER,
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      // Dark tile layer
      L.tileLayer(DARK_TILE, {
        attribution: DARK_ATTRIBUTION,
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      // Custom zoom control (top-right)
      L.control
        .zoom({ position: "topright" })
        .addTo(map);

      // Style zoom buttons via CSS injection
      const style = document.createElement("style");
      style.textContent = `
        .leaflet-control-zoom { border: none !important; }
        .leaflet-control-zoom a {
          background: rgba(10,10,18,0.88) !important;
          border: 1px solid rgba(255,26,26,0.2) !important;
          color: #ff4444 !important;
          font-family: 'Orbitron', monospace !important;
          backdrop-filter: blur(10px);
        }
        .leaflet-control-zoom a:hover {
          background: rgba(255,26,26,0.1) !important;
          color: #ff6666 !important;
        }
        .leaflet-control-attribution {
          background: rgba(10,10,18,0.6) !important;
          color: #333 !important;
          font-size: 8px !important;
          font-family: monospace;
        }
        .leaflet-control-attribution a { color: #444 !important; }
      `;
      document.head.appendChild(style);

      // Attribution bottom-left
      L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);

      // Markers layer group
      markersLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update heatmap and markers when crimes change
  const updateMap = useCallback(async () => {
    const map = mapInstanceRef.current;
    if (!map || !window.L?.heatLayer) return;

    // Remove old heat layer
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    // Clear old markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }

    if (!crimes || crimes.length === 0) return;

    // Build heatmap data: [lat, lng, intensity]
    const heatData = crimes.map((c) => [c.lat, c.lng, c.intensity]);

    // Create heat layer with vivid gradient
    const heatLayer = window.L.heatLayer(heatData, {
      radius: 35,
      blur: 25,
      maxZoom: 18,
      max: 1.0,
      gradient: {
        0.0: "#0040ff",
        0.25: "#00aaff",
        0.45: "#00ffaa",
        0.6: "#ffff00",
        0.75: "#ff8800",
        0.9: "#ff3300",
        1.0: "#ff0000",
      },
      minOpacity: 0.35,
    });

    heatLayer.addTo(map);
    heatLayerRef.current = heatLayer;

    // Add click markers for each crime
    crimes.forEach((crime) => {
      const marker = L.marker([crime.lat, crime.lng], {
        icon: createCrimeDotMarker(crime),
        interactive: true,
      });

      const popupHtml = ReactDOMServer.renderToStaticMarkup(
        <CrimePopupContent crime={crime} />
      );

      marker.bindPopup(popupHtml, {
        className: "crime-popup",
        maxWidth: 260,
        offset: [0, -5],
      });

      markersLayerRef.current.addLayer(marker);
    });
  }, [crimes]);

  useEffect(() => {
    if (mapInstanceRef.current && window.L?.heatLayer) {
      updateMap();
    } else {
      // Wait for map to init
      const timer = setTimeout(updateMap, 800);
      return () => clearTimeout(timer);
    }
  }, [updateMap]);

  return (
    <div
      ref={mapRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
