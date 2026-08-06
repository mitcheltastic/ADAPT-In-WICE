'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon issues in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface SpatialMapProps {
  data: Array<{
    id: number;
    provinsi: string;
    kabKota: string;
    p0: number;
    priority: string;
    lat: number;
    long: number;
    ipm: number;
  }>;
}

export const SpatialMap: React.FC<SpatialMapProps> = ({ data }) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    fetch('/geojson/indonesia_provinces.json')
      .then((res) => res.json())
      .then((data) => setGeoJsonData(data))
      .catch((err) => console.error('Failed to load GeoJSON map:', err));
  }, []);

  const getPriorityColor = (p0: number) => {
    if (p0 > 14.0) return '#AD336D'; // High Priority (Deep Magenta/Pink)
    if (p0 >= 8.0) return '#E8A0BF'; // Medium Priority (Soft Pink)
    return '#519E8A'; // Low Priority (Mint Green)
  };

  const geoJsonStyle = (feature: any) => {
    const p0 = feature?.properties?.avg_p0 || 10.0;
    return {
      fillColor: getPriorityColor(p0),
      weight: 1.5,
      opacity: 0.8,
      color: '#FFFFFF',
      dashArray: '2',
      fillOpacity: 0.45,
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature.properties) {
      const { provinsi, avg_p0, priority, region_count } = feature.properties;
      layer.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px;">
          <h3 style="color: #8A2355; font-weight: 800; font-size: 14px; margin-bottom: 4px;">${provinsi}</h3>
          <p style="margin: 2px 0; font-size: 12px; color: #4A5568;"><b>Average Poverty Rate:</b> ${avg_p0}%</p>
          <p style="margin: 2px 0; font-size: 12px; color: #4A5568;"><b>Target Priority:</b> <span style="font-weight: 700; color: ${getPriorityColor(avg_p0)};">${priority}</span></p>
          <p style="margin: 2px 0; font-size: 11px; color: #718096;">Included Regencies: ${region_count}</p>
        </div>
      `);
    }
  };

  return (
    <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-pink-200 shadow-md relative">
      <MapContainer
        center={[-2.5489, 118.0149]}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {data.map((item) => {
          if (!item.lat || !item.long || isNaN(item.lat) || isNaN(item.long)) return null;
          return (
            <CircleMarker
              key={item.id}
              center={[item.lat, item.long]}
              radius={6}
              pathOptions={{
                color: getPriorityColor(item.p0),
                fillColor: getPriorityColor(item.p0),
                fillOpacity: 0.85,
                weight: 1,
              }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                <span className="font-bold text-xs text-pink-700">
                  {item.kabKota} ({item.p0}%)
                </span>
              </Tooltip>
              <Popup>
                <div className="text-xs p-1">
                  <strong className="text-pink-600 font-bold block mb-1">
                    {item.kabKota}, {item.provinsi}
                  </strong>
                  <div>Poverty Rate (P0): <span className="font-semibold">{item.p0}%</span></div>
                  <div>HDI (IPM): <span className="font-semibold">{item.ipm}</span></div>
                  <div>Priority: <span className="font-semibold" style={{ color: getPriorityColor(item.p0) }}>{item.priority}</span></div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Map Legend overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-pink-200 shadow-sm text-xs font-semibold text-gray-700 flex items-center gap-3">
        <span className="font-bold text-pink-600">Poverty Priority:</span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#AD336D]"></span> High (&gt;14%)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#E8A0BF]"></span> Medium (8-14%)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#519E8A]"></span> Low (&lt;8%)
        </span>
      </div>
    </div>
  );
};
