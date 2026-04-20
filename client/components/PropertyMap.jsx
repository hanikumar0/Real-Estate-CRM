"use client";
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet + Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper component to recenter map when properties change
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);
  return null;
}

export default function PropertyMap({ properties = [], initialCenter = [28.6139, 77.2090], onMarkerClick }) {
  const center = properties.length > 0 && properties[0].coordinates 
    ? [properties[0].coordinates.lat, properties[0].coordinates.lng] 
    : initialCenter;

  return (
    <div className="w-full h-full rounded-[40px] overflow-hidden border border-slate-100 shadow-2xl bg-slate-50">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {properties.map((property) => (
          property.coordinates && (
            <Marker 
              key={property._id} 
              position={[property.coordinates.lat, property.coordinates.lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => onMarkerClick?.(property),
              }}
            >
              <Popup className="property-popup">
                <div className="p-2 space-y-2">
                  {property.images && property.images[0] && (
                    <img src={property.images[0].url} alt={property.title} className="w-full h-24 object-cover rounded-xl" />
                  )}
                  <div className="font-black text-slate-900 text-sm tracking-tight">{property.title}</div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                    <span className="text-[10px] font-black text-primary uppercase">${property.price.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-slate-400 capitalize">{property.type.toLowerCase()}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}
        
        <RecenterMap position={center} />
      </MapContainer>
    </div>
  );
}
