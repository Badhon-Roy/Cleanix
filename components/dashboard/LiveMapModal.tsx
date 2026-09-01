"use client";

import React, { useEffect, useRef } from "react";
import { X, Navigation, Phone, Clock, Truck, ShieldCheck } from "lucide-react";
import L from "leaflet";

interface LiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingNumber?: string;
  driverName?: string;
  driverPhone?: string;
  routeLocation?: string;
}

export default function LiveMapModal({
  isOpen,
  onClose,
  bookingNumber = "CLN-2026-8891",
  driverName = "Rahat Karim (Team Captain)",
  driverPhone = "+880 1711-223344",
  routeLocation = "Banani ➔ Gulshan-2",
}: LiveMapModalProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Load Leaflet CSS dynamically if not already present
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Coordinates in Dhaka (Banani -> Gulshan-2)
    const hubCoords: [number, number] = [23.7937, 90.4066];
    const vanCoords: [number, number] = [23.7915, 90.4118];
    const houseCoords: [number, number] = [23.7948, 90.4152];

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [23.793, 90.411],
      zoom: 15,
      zoomControl: true,
    });
    mapInstanceRef.current = map;

    // Add OpenStreetMap Tile Layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Custom HTML Marker Icons
    const hubIcon = L.divIcon({
      className: "custom-leaflet-hub-icon",
      html: `
        <div style="display:flex; flex-direction:column; align-items:center;">
          <div style="background:#0f172a; color:#fff; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px; white-space:nowrap; border:1px solid #334155; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            Cleaner Hub (Banani)
          </div>
          <div style="width:12px; height:12px; background:#0f172a; border:2px solid #fff; border-radius:50%; margin-top:2px;"></div>
        </div>
      `,
      iconSize: [120, 40],
      iconAnchor: [60, 40],
    });

    const vanIcon = L.divIcon({
      className: "custom-leaflet-van-icon",
      html: `
        <div style="display:flex; flex-direction:column; align-items:center;">
          <div style="background:#007eff; color:#fff; font-size:11px; font-weight:800; padding:4px 8px; border-radius:999px; white-space:nowrap; box-shadow: 0 4px 6px rgba(0,126,255,0.4); display:flex; align-items:center; gap:4px;">
            🚚 Van #Dhaka-881
          </div>
          <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:6px solid #007eff;"></div>
        </div>
      `,
      iconSize: [130, 44],
      iconAnchor: [65, 44],
    });

    const houseIcon = L.divIcon({
      className: "custom-leaflet-house-icon",
      html: `
        <div style="display:flex; flex-direction:column; align-items:center;">
          <div style="background:#059669; color:#fff; font-size:10px; font-weight:bold; padding:3px 6px; border-radius:4px; white-space:nowrap; box-shadow:0 2px 4px rgba(0,0,0,0.2);">
            Your House (Gulshan-2)
          </div>
          <div style="color:#059669; font-size:20px; line-height:1; margin-top:-2px;">📍</div>
        </div>
      `,
      iconSize: [140, 44],
      iconAnchor: [70, 44],
    });

    // Add Markers to Map
    L.marker(hubCoords, { icon: hubIcon }).addTo(map).bindPopup("<b>Cleaner Hub (Banani)</b><br/>Dispatch Origin");
    const vanMarker = L.marker(vanCoords, { icon: vanIcon }).addTo(map).bindPopup("<b>Van #Dhaka-881</b><br/>Cleaner Team Delta (En Route)");
    L.marker(houseCoords, { icon: houseIcon }).addTo(map).bindPopup("<b>Destination</b><br/>House 42, Road 11, Gulshan-2");

    // Draw Route Polyline
    const routeLine = L.polyline([hubCoords, vanCoords, houseCoords], {
      color: "#007eff",
      weight: 5,
      opacity: 0.8,
      dashArray: "10, 8",
    }).addTo(map);

    // Fit Map Bounds to include all points
    map.fitBounds(routeLine.getBounds(), { padding: [60, 60] });
    setTimeout(() => map.invalidateSize(), 200);

    // Animate Van slightly along route
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % 20;
      const lat = vanCoords[0] + (step * 0.00008);
      const lng = vanCoords[1] + (step * 0.0001);
      vanMarker.setLatLng([lat, lng]);
    }, 1500);

    return () => {
      clearInterval(interval);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl lg:max-w-5xl bg-white border border-slate-200 rounded-3xl overflow-hidden text-slate-900 flex flex-col max-h-[92vh] shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#007eff] border border-blue-200 flex items-center justify-center flex-shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight">Live GPS Dispatch Tracking</h3>
              <p className="text-xs text-slate-500 font-medium leading-normal">
                Booking Ref #{bookingNumber} • Route: {routeLocation}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Interactive Leaflet OpenStreetMap View */}
        <div className="relative h-[280px] sm:h-[320px] w-full bg-slate-100 border-b border-slate-200 flex-shrink-0">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          <div className="absolute top-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-extrabold text-slate-800 shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>LIVE SATELLITE GPS ACTIVE</span>
          </div>
        </div>

        {/* Info & Captain Contact */}
        <div className="p-5 sm:p-6 pb-6 sm:pb-7 bg-white space-y-4 flex-shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200">
              <span className="text-slate-500 font-medium block text-xs leading-normal">Distance Remaining:</span>
              <strong className="text-slate-900 text-sm sm:text-base font-extrabold mt-0.5 block leading-tight">2.4 km</strong>
            </div>

            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200">
              <span className="text-slate-500 font-medium block text-xs leading-normal">Estimated Arrival (ETA):</span>
              <strong className="text-[#007eff] text-sm sm:text-base font-extrabold flex items-center gap-1 mt-0.5 leading-tight">
                <Clock className="w-4 h-4 flex-shrink-0" /> 10 Minutes
              </strong>
            </div>

            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200">
              <span className="text-slate-500 font-medium block text-xs leading-normal">Current Speed:</span>
              <strong className="text-slate-900 text-sm sm:text-base font-extrabold mt-0.5 block leading-tight">
                28 km/h (Moderate Traffic)
              </strong>
            </div>
          </div>

          <div className="flex items-center justify-between bg-blue-50/80 px-4 sm:px-6 py-4 rounded-2xl border border-blue-200 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#007eff] text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                RK
              </div>
              <div className="py-0.5">
                <p className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">{driverName}</p>
                <p className="text-slate-600 text-xs font-semibold mt-1 leading-normal">Cleaner Captain • Verified ID #902</p>
              </div>
            </div>

            <a
              href={`tel:${driverPhone}`}
              className="bg-[#007eff] hover:bg-[#0066ee] text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm border border-blue-400 cursor-pointer flex-shrink-0"
            >
              <Phone className="w-4 h-4" /> Call Driver
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
