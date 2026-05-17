import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { incidentClient } from '../../api/apolloClient';
import { Activity, AlertTriangle, TrendingUp, Clock, ChevronRight, BarChart3 } from 'lucide-react';
import './Dashboard.css';

const GET_STATS = gql`
  query GetStats {
    incidents { 
      id 
      type 
      status 
      createdAt 
    }
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { loading, data } = useQuery(GET_STATS, { 
    client: incidentClient,
    pollInterval: 5000 // Real-time polling every 5 seconds
  });

  const stats = [
    { label: 'Active Incidents', value: data?.incidents?.filter(i => i.status !== 'Resolved').length || 0, icon: AlertTriangle, color: '#f59e0b' },
    { label: 'Average Speed', value: '42 km/h', icon: TrendingUp, color: '#10b981' },
    { label: 'System Uptime', value: '99.9%', icon: Activity, color: '#3b82f6' },
    { label: 'Traffic Density', value: 'High', icon: BarChart3, color: '#ef4444' },
  ];

  const handleViewFullReport = () => {
    navigate('/incidents');
  };

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div className="title-section">
          <h1>Control Dashboard</h1>
          <p>Real-time operational monitoring of city traffic and incidents.</p>
        </div>
        <div className="last-sync">
          <Clock size={14} />
          <span>Last sync: {new Date().toLocaleTimeString()}</span>
        </div>
      </header>

      <section className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card card">
            <div className="stat-header">
              <span className="stat-label">{stat.label}</span>
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <div className="stat-body">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-trend">+2.4% from last hour</span>
            </div>
          </div>
        ))}
      </section>

      <div className="dashboard-grid">
        <section className="main-content card">
          <div className="section-header">
            <h3><AlertTriangle size={18} /> Live Incident Feed</h3>
            <button className="text-btn" onClick={handleViewFullReport}>
              View full report <ChevronRight size={14} />
            </button>
          </div>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading && !data ? (
                  <tr><td colSpan="4">Fetching real-time data...</td></tr>
                ) : data?.incidents?.length === 0 ? (
                  <tr><td colSpan="4">No active incidents reported.</td></tr>
                ) : data?.incidents?.slice(0, 6).map((incident) => (
                  <tr key={incident.id}>
                    <td><span className={`type-tag ${incident.type.toLowerCase()}`}>{incident.type}</span></td>
                    <td>Main Street Zone A</td>
                    <td>{new Date(parseInt(incident.createdAt)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td><span className={`status-pill ${incident.status.toLowerCase()}`}>{incident.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="side-content">
          <div className="card analytics-summary">
            <h3><TrendingUp size={18} /> Traffic Analytics</h3>
            <div className="metric-item">
              <div className="metric-label">Peak Congestion</div>
              <div className="metric-bar-bg"><div className="metric-bar-fill" style={{ width: '75%' }}></div></div>
            </div>
            <div className="metric-item">
              <div className="metric-label">Vehicle Flow</div>
              <div className="metric-bar-bg"><div className="metric-bar-fill" style={{ width: '45%' }}></div></div>
            </div>
          </div>

          <div className="card quick-actions">
            <h3>Quick Actions</h3>
            <button className="action-btn-outline" onClick={() => window.print()}>Generate PDF Report</button>
            <button className="action-btn-outline" onClick={handleViewFullReport}>Review All Incidents</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
