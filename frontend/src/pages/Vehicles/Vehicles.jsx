import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { vehicleClient } from '../../api/apolloClient';
import { useAuth } from '../../context/AuthContext';
import { Car, Search, Filter, Plus, Trash2, MoreHorizontal, Download, X, Tag, Settings } from 'lucide-react';
import './Vehicles.css';

const GET_VEHICLES = gql`
  query GetVehicles {
    getVehicles {
      id plateNumber model type status
    }
  }
`;

const CREATE_VEHICLE = gql`
  mutation CreateVehicle($plateNumber: String!, $model: String, $type: String, $status: String) {
    createVehicle(plateNumber: $plateNumber, model: $model, type: $type, status: $status) {
      id
      plateNumber
    }
  }
`;

const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($id: ID!) {
    deleteVehicle(id: $id)
  }
`;

const Vehicles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ plateNumber: '', model: '', type: 'Private', status: 'Parked' });
  
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const isOperator = user?.role === 'OPERATOR';
  const canAdd = isAdmin || isOperator;
  
  const { loading, data, refetch } = useQuery(GET_VEHICLES, { 
    client: vehicleClient,
    pollInterval: 5000 
  });

  const [createVehicle] = useMutation(CREATE_VEHICLE, { 
    client: vehicleClient,
    onCompleted: () => {
      setIsFormOpen(false);
      setNewVehicle({ plateNumber: '', model: '', type: 'Private', status: 'Parked' });
      refetch();
    }
  });

  const [deleteVehicle] = useMutation(DELETE_VEHICLE, { 
    client: vehicleClient,
    onCompleted: () => refetch()
  });

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await createVehicle({ variables: newVehicle });
    } catch (err) {
      console.error(err);
      alert('Failed to register vehicle: ' + err.message);
    }
  };

  const vehicles = data?.getVehicles || [];
  const filteredVehicles = vehicles.filter(v => 
    v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.model && v.model.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="vehicles-page">
      <header className="page-header">
        <div className="title-section">
          <h1>Vehicle Fleet Management</h1>
          <p>Comprehensive tracking and status monitoring of authorized vehicles.</p>
        </div>
        <div className="header-actions">
          {canAdd && (
            <button className="primary-btn" onClick={() => setIsFormOpen(true)}>
              <Plus size={16} /> New Vehicle
            </button>
          )}
          <button className="secondary-btn">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </header>

      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-box card">
            <div className="modal-header">
              <h3><Car size={20} /> Register New Vehicle</h3>
              <button className="close-btn" onClick={() => setIsFormOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddVehicle}>
              <div className="form-group">
                <label><Tag size={14} /> License Plate</label>
                <input 
                  type="text" 
                  placeholder="e.g. 123 TUNIS 4567"
                  value={newVehicle.plateNumber}
                  onChange={(e) => setNewVehicle({...newVehicle, plateNumber: e.target.value})}
                  required
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Model</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Toyota Corolla"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select 
                    value={newVehicle.type} 
                    onChange={(e) => setNewVehicle({...newVehicle, type: e.target.value})}
                  >
                    <option value="Private">Private</option>
                    <option value="Taxi">Taxi</option>
                    <option value="Police">Police</option>
                    <option value="Ambulance">Ambulance</option>
                    <option value="Public Transport">Public Transport</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label><Settings size={14} /> Initial Status</label>
                <select 
                  value={newVehicle.status} 
                  onChange={(e) => setNewVehicle({...newVehicle, status: e.target.value})}
                >
                  <option value="Parked">Parked</option>
                  <option value="Moving">Moving</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="secondary-btn" onClick={() => setIsFormOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn">Register Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-controls card">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by license plate, model or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn">
          <Filter size={16} /> Filters
        </button>
      </div>

      <div className="card table-card">
        {loading && !data ? (
          <div className="loading-state">Loading fleet data...</div>
        ) : (
          <table className="pro-table">
            <thead>
              <tr>
                <th>License Plate</th>
                <th>Vehicle Model</th>
                <th>Classification</th>
                <th>Current Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length === 0 ? (
                <tr><td colSpan="5" className="empty-row">No records found matching your search.</td></tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td className="plate-cell"><Car size={16} /> {vehicle.plateNumber}</td>
                    <td>{vehicle.model || 'N/A'}</td>
                    <td><span className="type-label">{vehicle.type}</span></td>
                    <td><span className={`status-dot ${vehicle.status.toLowerCase()}`}></span> {vehicle.status}</td>
                    <td className="actions-cell">
                      {isAdmin && (
                        <button className="icon-btn delete" onClick={() => deleteVehicle({ variables: { id: vehicle.id } })}>
                          <Trash2 size={16} />
                        </button>
                      )}
                      <button className="icon-btn"><MoreHorizontal size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Vehicles;
