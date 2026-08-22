import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Trip, ItineraryItem, TripStop } from '../../types/index.ts';
import { useTheme } from '../../context/ThemeContext.tsx';

interface TripMapProps {
  trip: Trip;
  selectedDay?: number;
  focusedItemId?: string | null;
  onItemSelect?: (item: ItineraryItem) => void;
}

export const TripMap: React.FC<TripMapProps> = ({ 
  trip, 
  selectedDay, 
  focusedItemId,
  onItemSelect 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const { theme } = useTheme();

  // Filter items for selected day or entire trip
  const displayItems = selectedDay 
    ? trip.items.filter(i => i.dayNumber === selectedDay)
    : trip.items;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center to first stop or Tokyo
      const defaultLat = trip.stops[0]?.lat || 35.6762;
      const defaultLng = trip.stops[0]?.lng || 139.6503;

      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;

    // Tile Layer based on Dark / Light mode
    // Remove existing tile layers
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileUrl = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    return () => {
      // Cleanup on unmount handled in full teardown
    };
  }, [theme]);

  // Update Markers and Routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const routeLayer = routeLayerRef.current;

    if (!map || !markersLayer || !routeLayer) return;

    markersLayer.clearLayers();
    routeLayer.clearLayers();

    const coordinates: [number, number][] = [];

    // Add City Stops Markers
    trip.stops.forEach((stop, idx) => {
      if (stop.lat && stop.lng) {
        coordinates.push([stop.lat, stop.lng]);

        const cityIcon = L.divIcon({
          className: 'custom-city-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 shadow-xl flex items-center justify-center text-white text-xs font-extrabold">
                ${stop.order || idx + 1}
              </div>
              <div class="absolute -bottom-5 px-2 py-0.5 bg-slate-900/90 text-white rounded text-[10px] font-bold whitespace-nowrap shadow-md pointer-events-none">
                ${stop.cityName}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([stop.lat, stop.lng], { icon: cityIcon });
        marker.bindPopup(`
          <div class="p-2 text-slate-900">
            <h4 class="font-bold text-sm">${stop.cityName}, ${stop.country}</h4>
            <p class="text-xs text-slate-500">${stop.stayName || 'Curated Stop'}</p>
            <p class="text-xs font-semibold text-blue-600 mt-1">${stop.arrivalDate} – ${stop.departureDate}</p>
          </div>
        `);
        markersLayer.addLayer(marker);
      }
    });

    // Add Itinerary Items Markers
    displayItems.forEach((item, idx) => {
      if (item.lat && item.lng) {
        coordinates.push([item.lat, item.lng]);

        const isFocused = focusedItemId === item.id;
        const categoryColor = 
          item.category === 'food' ? '#F97316' :
          item.category === 'culture' ? '#8B5CF6' :
          item.category === 'photography' ? '#06B6D4' :
          item.category === 'nature' ? '#10B981' : '#3B82F6';

        const itemIcon = L.divIcon({
          className: 'custom-activity-marker',
          html: `
            <div class="group relative flex items-center justify-center transition-transform hover:scale-125 cursor-pointer ${isFocused ? 'scale-125 ring-4 ring-cyan-400 rounded-full' : ''}">
              <div class="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900" style="background-color: ${categoryColor}">
                ${idx + 1}
              </div>
              ${isFocused ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>' : ''}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([item.lat, item.lng], { icon: itemIcon });
        marker.on('click', () => {
          if (onItemSelect) onItemSelect(item);
        });

        marker.bindPopup(`
          <div class="p-2 max-w-[220px]">
            ${item.imageUrl ? `<img src="${item.imageUrl}" class="w-full h-24 object-cover rounded-lg mb-2" />` : ''}
            <div class="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500 mb-1">
              <span>Day ${item.dayNumber} • ${item.timeSlot}</span>
              <span class="text-blue-600 font-bold">${item.aiMatchScore}% AI</span>
            </div>
            <h4 class="font-bold text-xs text-slate-900 leading-tight mb-1">${item.title}</h4>
            <p class="text-[11px] text-slate-600 leading-snug line-clamp-2">${item.description}</p>
            <div class="mt-2 pt-1 border-t border-slate-200 flex items-center justify-between text-xs font-bold">
              <span>${trip.currency}${item.cost}</span>
              <span class="text-[10px] text-slate-500">${item.startTime}</span>
            </div>
          </div>
        `);

        markersLayer.addLayer(marker);
      }
    });

    // Draw route lines connecting sequential items
    if (coordinates.length > 1) {
      const polyline = L.polyline(coordinates, {
        color: '#3B82F6',
        weight: 3,
        opacity: 0.8,
        dashArray: '6, 8',
        lineCap: 'round',
        lineJoin: 'round'
      });
      routeLayer.addLayer(polyline);

      // Fit bounds
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [displayItems, trip.stops, focusedItemId, onItemSelect]);

  // Pan to focused item when changed
  useEffect(() => {
    if (!focusedItemId || !mapInstanceRef.current) return;
    const item = trip.items.find(i => i.id === focusedItemId);
    if (item && item.lat && item.lng) {
      mapInstanceRef.current.setView([item.lat, item.lng], 15, { animate: true });
    }
  }, [focusedItemId, trip.items]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Legend Overlay */}
      <div className="absolute top-3 right-3 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md text-xs">
        <div className="font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center justify-between gap-3">
          <span>Map Legend</span>
          <span className="text-[10px] text-blue-500 font-bold">{displayItems.length} Stops</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Food & Dining
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Culture & Sights
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Photography
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Nature & Parks
          </div>
        </div>
      </div>
    </div>
  );
};
