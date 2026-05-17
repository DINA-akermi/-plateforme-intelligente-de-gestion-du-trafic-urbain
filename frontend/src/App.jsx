import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import TrafficMonitoring from './pages/TrafficMonitoring/TrafficMonitoring';
import Incidents from './pages/Incidents/Incidents';
import Vehicles from './pages/Vehicles/Vehicles';
import Notifications from './pages/Notifications/Notifications';
import './styles/global.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="traffic" element={<TrafficMonitoring />} />
            <Route path="incidents" element={<Incidents />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
