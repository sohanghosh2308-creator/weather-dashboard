import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LiveBackgroundMap.css';

export default function LiveBackgroundMap({
  lat = 51.5085,
  lon = -0.1257,
  cityName = 'London',
  temp = 15,
  condition = 'Clouds',
  themeClass = 'theme-clouds',
  isInteractive = false,
  onMapClick
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create Leaflet map instance centered on initial coords
    const map = L.map(mapContainerRef.current, {
      center: [lat, lon],
      zoom: 10,
      zoomControl: isInteractive,
      attributionControl: false,
      scrollWheelZoom: isInteractive,
      doubleClickZoom: isInteractive,
      dragging: isInteractive,
      boxZoom: isInteractive
    });

    // Dark cartographic tiles from CartoDB Dark Matter (Fast, free, reliable, dark geospatial aesthetic)
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
      {
        subdomains: 'abcd',
        maxZoom: 19
      }
    ).addTo(map);

    // Click handler on map to inspect weather anywhere
    map.on('click', (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update interactivity settings dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (isInteractive) {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      if (!map.zoomControl) {
        L.control.zoom({ position: 'bottomright' }).addTo(map);
      }
    } else {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      if (map.zoomControl) {
        map.zoomControl.remove();
      }
    }
  }, [isInteractive]);

  // Update position with smooth flyTo animation whenever coordinates change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || lat === undefined || lon === undefined) return;

    // Smooth geospatial flight animation
    map.flyTo([lat, lon], 10, {
      duration: 1.8,
      easeLinearity: 0.25
    });

    // Create or update glowing beacon marker at target coordinates
    const markerHtml = `
      <div class="geospatial-marker ${themeClass}">
        <div class="marker-pulse-ring ring-1"></div>
        <div class="marker-pulse-ring ring-2"></div>
        <div class="marker-core-dot"></div>
        <div class="marker-info-tooltip">
          <span class="tooltip-city">${cityName || 'Target'}</span>
          <span class="tooltip-temp">${Math.round(temp)}°C • ${condition}</span>
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      className: 'custom-leaflet-marker-wrapper',
      html: markerHtml,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lon]);
      markerRef.current.setIcon(customIcon);
    } else {
      markerRef.current = L.marker([lat, lon], { icon: customIcon }).addTo(map);
    }
  }, [lat, lon, cityName, temp, condition, themeClass]);

  return (
    <div className={`live-background-map-wrapper ${isInteractive ? 'interactive-mode' : 'ambient-mode'}`}>
      <div ref={mapContainerRef} className="leaflet-map-canvas" />
      {/* Dynamic atmospheric color tint overlay */}
      <div className={`map-atmospheric-overlay ${themeClass}`} />
      {/* Cartographic grid and scanline overlay */}
      <div className="map-scanlines-layer" />
    </div>
  );
}
