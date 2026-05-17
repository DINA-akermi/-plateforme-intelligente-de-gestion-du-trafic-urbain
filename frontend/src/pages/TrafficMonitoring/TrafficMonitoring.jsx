import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { trafficClient } from '../../api/apolloClient';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Activity, Zap, Navigation, Info } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './TrafficMonitoring.css';

const GET_TRAFFIC = gql`
  query GetTraffic {
    getTrafficLevels {
      id
      level
      speed
      timestamp
    }
  }
`;

const TrafficMonitoring = () => {
  const { loading, data } = useQuery(GET_TRAFFIC, {
    client: trafficClient,
    pollInterval: 5000
  });

  const trafficData = data?.getTrafficLevels || [];

  // Locations fictives pour la démo sur la carte
  const zones = [
    { name: 'Downtown Core', coords: [36.8065, 10.1815], color: '#ef4444' },
    { name: 'Industrial Zone', coords: [36.8188, 10.1659], color: '#f59e0b' },
    { name: 'Airport Road', coords: [36.8477, 10.2177], color: '#10b981' },
    { name: 'Suburban West', coords: [36.8001, 10.1234], color: '#3b82f6' },
  ];

  return (
    <motion.div 
      className="traffic-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="page-header">
        <h1>Traffic Intelligence</h1>
        <p>Live analysis of velocity and flow across the metropolitan area.</p>
      </header>

      <div className="traffic-layout">
        <div className="map-section card glass">
          <MapContainer center={[36.8065, 10.1815]} zoom={12} style={{ height: '500px', borderRadius: '15px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {zones.map((zone, idx) => (
              <CircleMarker 
                key={idx} 
                center={zone.coords} 
                radius={20} 
                pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.3 }}
              >
                <Popup>
                  <strong>{zone.name}</strong><br/>
                  Status: Active Monitoring
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <aside className="traffic-sidebar">
          <div className="live-indicators card glass">
            <h3><Zap size={18} /> Live Metrics</h3>
            <div className="metric-row">
              <span className="label">Average Flow</span>
              <span className="value success">Stable</span>
            </div>
            <div className="metric-row">
              <span className="label">Active Sensors</span>
              <span className="value">124</span>
            </div>
            <div className="metric-row">
              <span className="label">Congestion Index</span>
              <span className="value warning">12%</span>
            </div>
          </div>

          <div className="recent-logs card glass">
            <h3><Activity size={18} /> Activity Log</h3>
            <div className="log-list">
              {loading ? (
                <p className="muted">Fetching logs...</p>
              ) : trafficData.slice(0, 4).map((log) => (
                <div key={log.id} className="log-item">
                  <Navigation size={14} />
                  <div className="log-text">
                    <span className="log-msg">Level {log.level} detected</span>
                    <span className="log-time">{log.speed} km/h • {new Date(parseInt(log.timestamp)).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default TrafficMonitoring;
