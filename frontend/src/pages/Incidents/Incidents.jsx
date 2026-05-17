import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { incidentClient } from '../../api/apolloClient';
import { useAuth } from '../../context/AuthContext';
import { Plus, AlertTriangle, CheckCircle, X, MapPin, Type, AlignLeft, RefreshCcw, Trash2 } from 'lucide-react';
import './Incidents.css';

const GET_INCIDENTS = gql`
  query GetIncidents {
    incidents {
      id
      title
      description
      type
      status
      latitude
      longitude
    }
  }
`;

const CREATE_INCIDENT = gql`
  mutation CreateIncident($title: String!, $description: String!, $type: String!, $latitude: Float!, $longitude: Float!) {
    createIncident(title: $title, description: $description, type: $type, latitude: $latitude, longitude: $longitude) {
      id
      title
    }
  }
`;

const UPDATE_INCIDENT_STATUS = gql`
  mutation UpdateIncidentStatus($id: ID!, $status: String!) {
    updateIncidentStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

const DELETE_INCIDENT = gql`
  mutation DeleteIncident($id: ID!) {
    deleteIncident(id: $id)
  }
`;

const Incidents = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newIncident, setNewIncident] = useState({ 
    title: '', 
    type: '', 
    description: '', 
    latitude: 36.8065, 
    longitude: 10.1815 
  });

  const { loading, error, data, refetch } = useQuery(GET_INCIDENTS, { 
    client: incidentClient,
    pollInterval: 5000 
  });
  
  const [createIncident] = useMutation(CREATE_INCIDENT, { 
    client: incidentClient,
    onCompleted: () => {
      setIsFormOpen(false);
      setNewIncident({ title: '', type: '', description: '', latitude: 36.8065, longitude: 10.1815 });
      refetch();
    }
  });

  const [updateStatus] = useMutation(UPDATE_INCIDENT_STATUS, {
    client: incidentClient,
    onCompleted: () => refetch()
  });

  const [deleteIncident] = useMutation(DELETE_INCIDENT, {
    client: incidentClient,
    onCompleted: () => refetch()
  });

  const handleAddIncident = async (e) => {
    e.preventDefault();
    try {
      await createIncident({
        variables: {
          ...newIncident,
          latitude: parseFloat(newIncident.latitude),
          longitude: parseFloat(newIncident.longitude)
        }
      });
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ variables: { id, status: newStatus } });
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const incidents = data?.incidents || [];

  return (
    <div className="incidents-page">
      <header className="page-header">
        <div className="title-section">
          <h1>Traffic Incident Log</h1>
          <p>Real-time incident reporting and status management.</p>
        </div>
        <button className="primary-btn" onClick={() => setIsFormOpen(true)}>
          <Plus size={18} /> Report New Incident
        </button>
      </header>

      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-box card">
            <div className="modal-header">
              <h3><AlertTriangle size={20} /> Report Incident</h3>
              <button className="close-btn" onClick={() => setIsFormOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddIncident}>
              <div className="form-group">
                <label><Type size={14} /> Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Major Accident near Avenue Habib Bourguiba"
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({...newIncident, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Type</label>
                  <select 
                    value={newIncident.type} 
                    onChange={(e) => setNewIncident({...newIncident, type: e.target.value})}
                    required
                  >
                    <option value="">Select type...</option>
                    <option value="ACCIDENT">Accident</option>
                    <option value="EMBOUTEILLAGE">Embouteillage</option>
                    <option value="ROUTE_FERMEE">Route fermée</option>
                    <option value="TRAVAUX">Travaux</option>
                  </select>
                </div>
                <div className="form-group">
                  <label><MapPin size={14} /> Coordinates</label>
                  <div className="coord-inputs">
                    <input type="number" step="0.0001" value={newIncident.latitude} onChange={(e) => setNewIncident({...newIncident, latitude: e.target.value})} />
                    <input type="number" step="0.0001" value={newIncident.longitude} onChange={(e) => setNewIncident({...newIncident, longitude: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label><AlignLeft size={14} /> Description</label>
                <textarea 
                  placeholder="Provide detailed information..."
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                  required
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="secondary-btn" onClick={() => setIsFormOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card table-card">
        {loading && !data ? (
          <div className="loading-state">Syncing incidents...</div>
        ) : (
          <table className="pro-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Classification</th>
                <th>Title</th>
                <th>Location</th>
                <th>Management</th>
              </tr>
            </thead>
            <tbody>
              {incidents.length === 0 ? (
                <tr><td colSpan="5" className="empty-row">No incidents logged.</td></tr>
              ) : incidents.map((incident) => (
                <tr key={incident.id}>
                  <td>
                    <span className={`status-badge ${(incident.status || 'SIGNALE').toLowerCase()}`}>
                      {incident.status === 'RESOLU' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                      {incident.status || 'SIGNALE'}
                    </span>
                  </td>
                  <td className="font-bold">{incident.type}</td>
                  <td>{incident.title}</td>
                  <td>{incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}</td>
                  <td className="management-cell">
                    <div className="status-actions">
                      <select 
                        value={incident.status || 'SIGNALE'} 
                        onChange={(e) => handleStatusChange(incident.id, e.target.value)}
                        className="status-select-mini"
                      >
                        <option value="SIGNALE">SIGNALE</option>
                        <option value="EN_COURS">EN COURS</option>
                        <option value="RESOLU">RESOLU</option>
                      </select>
                      {isAdmin && (
                        <button className="icon-btn delete" onClick={() => deleteIncident({ variables: { id: incident.id } })}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Incidents;
