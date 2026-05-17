import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './InteractiveMap.css';

// Fix for default marker icon in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const InteractiveMap = ({ incidents = [], trafficData = [] }) => {
  const center = [36.8065, 10.1815]; // Tunis as default

  return (
    <div className="map-wrapper card">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {incidents.map((incident) => (
          <Marker key={incident.id} position={[incident.lat, incident.lng]}>
            <Popup>
              <strong>{incident.type}</strong><br />
              {incident.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
